import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { createHash, randomBytes } from "crypto";
import { ConfigService } from "@nestjs/config";
import { MailService } from "../mail/mail.service";
import { UsersService } from "../users/users.service";
import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from "./dto";

const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.usersService.findByEmail(email);

    if (existing) {
      throw new ConflictException("Email is already registered");
    }

    const user = await this.usersService.create({
      name: dto.name,
      email,
      passwordHash: await bcrypt.hash(dto.password, 12),
      phoneNumber: dto.phoneNumber,
      role: dto.role && dto.role !== UserRole.ADMIN ? dto.role : UserRole.RENTER
    });

    return this.issueSession(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email.toLowerCase());

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return this.issueSession(user);
  }

  async me(userId: string) {
    return { data: await this.usersService.findPublicById(userId), meta: {}, error: null };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = dto.email.toLowerCase();
    const user = await this.usersService.findByEmail(email);
    let resetToken: string | undefined;

    if (user) {
      resetToken = randomBytes(RESET_TOKEN_BYTES).toString("hex");
      await this.usersService.updatePasswordReset(user.id, this.hashResetToken(resetToken), new Date(Date.now() + RESET_TOKEN_TTL_MS));
      await this.mailService.sendPasswordReset({
        email,
        resetUrl: this.passwordResetUrl(resetToken)
      });
    }

    return {
      data: null,
      meta: {
        ...(process.env.NODE_ENV === "production" || !resetToken ? {} : { resetToken })
      },
      error: null
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const resetTokenHash = this.hashResetToken(dto.token);
    const user = await this.usersService.findByResetTokenHash(resetTokenHash);

    if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException("Password reset token is invalid or expired");
    }

    await this.usersService.updatePassword(user.id, await bcrypt.hash(dto.password, 12));

    return { data: null, meta: {}, error: null };
  }

  private issueSession(user: { id: string; email: string; name: string; role: UserRole }) {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return {
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      meta: {},
      error: null
    };
  }

  private hashResetToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  private passwordResetUrl(token: string) {
    const frontendOrigin = this.configService.getOrThrow<string>("FRONTEND_URL").split(",")[0].trim();
    const url = new URL("/reset-password", frontendOrigin);
    url.searchParams.set("token", token);
    return url.toString();
  }
}
