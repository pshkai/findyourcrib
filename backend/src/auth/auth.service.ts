import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { LoginDto, RegisterDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
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
}
