import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "../prisma.service";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phoneNumber: true,
  role: true,
  createdAt: true
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  updatePasswordReset(id: string, resetTokenHash: string, resetTokenExpiresAt: Date): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { resetTokenHash, resetTokenExpiresAt }
    });
  }

  findByResetTokenHash(resetTokenHash: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { resetTokenHash } });
  }

  updatePassword(id: string, passwordHash: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        passwordHash,
        resetTokenExpiresAt: null,
        resetTokenHash: null
      }
    });
  }

  async findPublicById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
