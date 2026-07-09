import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  function createService() {
    const usersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByResetTokenHash: jest.fn(),
      findPublicById: jest.fn(),
      updatePassword: jest.fn(),
      updatePasswordReset: jest.fn()
    };
    const jwtService = {
      sign: jest.fn().mockReturnValue("signed-token")
    };

    return {
      jwtService,
      service: new AuthService(usersService as never, jwtService as never),
      usersService
    };
  }

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("normalizes email before duplicate checks and user creation", async () => {
    const { jwtService, service, usersService } = createService();
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed-password" as never);
    usersService.findByEmail.mockResolvedValue(null);
    usersService.create.mockResolvedValue({
      id: "user-1",
      email: "renter@example.com",
      name: "Renter",
      role: UserRole.RENTER
    });

    const result = await service.register({
      name: "Renter",
      email: "RENTER@EXAMPLE.COM",
      password: "password123",
      role: UserRole.RENTER
    });

    expect(usersService.findByEmail).toHaveBeenCalledWith("renter@example.com");
    expect(usersService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "renter@example.com",
        passwordHash: "hashed-password",
        role: UserRole.RENTER
      })
    );
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: "user-1",
      email: "renter@example.com",
      role: UserRole.RENTER
    });
    expect(result.data.accessToken).toBe("signed-token");
  });

  it("does not allow public registration as admin", async () => {
    const { service, usersService } = createService();
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed-password" as never);
    usersService.findByEmail.mockResolvedValue(null);
    usersService.create.mockResolvedValue({
      id: "user-1",
      email: "adminish@example.com",
      name: "Adminish",
      role: UserRole.RENTER
    });

    await service.register({
      name: "Adminish",
      email: "adminish@example.com",
      password: "password123",
      role: UserRole.ADMIN
    });

    expect(usersService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        role: UserRole.RENTER
      })
    );
  });

  it("rejects duplicate registration using normalized email", async () => {
    const { service, usersService } = createService();
    usersService.findByEmail.mockResolvedValue({ id: "existing-user" });

    await expect(
      service.register({
        name: "Renter",
        email: "RENTER@EXAMPLE.COM",
        password: "password123"
      })
    ).rejects.toBeInstanceOf(ConflictException);
    expect(usersService.findByEmail).toHaveBeenCalledWith("renter@example.com");
    expect(usersService.create).not.toHaveBeenCalled();
  });

  it("logs in with normalized email and valid password", async () => {
    const { jwtService, service, usersService } = createService();
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
    usersService.findByEmail.mockResolvedValue({
      id: "user-1",
      email: "renter@example.com",
      name: "Renter",
      passwordHash: "hashed-password",
      role: UserRole.RENTER
    });

    const result = await service.login({
      email: "RENTER@EXAMPLE.COM",
      password: "password123"
    });

    expect(usersService.findByEmail).toHaveBeenCalledWith("renter@example.com");
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: "user-1",
      email: "renter@example.com",
      role: UserRole.RENTER
    });
    expect(result.data.user).toEqual({
      id: "user-1",
      email: "renter@example.com",
      name: "Renter",
      role: UserRole.RENTER
    });
  });

  it("rejects invalid login credentials", async () => {
    const { service, usersService } = createService();
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);
    usersService.findByEmail.mockResolvedValue({
      id: "user-1",
      passwordHash: "hashed-password"
    });

    await expect(
      service.login({
        email: "renter@example.com",
        password: "wrong-password"
      })
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("loads the current public user", async () => {
    const { service, usersService } = createService();
    usersService.findPublicById.mockResolvedValue({ id: "user-1", email: "renter@example.com" });

    await expect(service.me("user-1")).resolves.toEqual({
      data: { id: "user-1", email: "renter@example.com" },
      meta: {},
      error: null
    });
  });

  it("creates a password reset token without exposing whether an email exists", async () => {
    const { service, usersService } = createService();
    usersService.findByEmail.mockResolvedValue({ id: "user-1", email: "renter@example.com" });

    const result = await service.forgotPassword({ email: "RENTER@EXAMPLE.COM" });

    expect(usersService.findByEmail).toHaveBeenCalledWith("renter@example.com");
    expect(usersService.updatePasswordReset).toHaveBeenCalledWith("user-1", expect.any(String), expect.any(Date));
    expect(result).toMatchObject({ data: null, error: null });
    expect(typeof result.meta.resetToken).toBe("string");
  });

  it("does not create a password reset record for unknown emails", async () => {
    const { service, usersService } = createService();
    usersService.findByEmail.mockResolvedValue(null);

    await expect(service.forgotPassword({ email: "missing@example.com" })).resolves.toEqual({
      data: null,
      meta: {},
      error: null
    });
    expect(usersService.updatePasswordReset).not.toHaveBeenCalled();
  });

  it("resets password with a valid token and clears token fields", async () => {
    const { service, usersService } = createService();
    jest.spyOn(bcrypt, "hash").mockResolvedValue("new-hashed-password" as never);
    usersService.findByEmail.mockResolvedValue({ id: "user-1", email: "renter@example.com" });

    const forgot = await service.forgotPassword({ email: "renter@example.com" });
    usersService.findByResetTokenHash.mockResolvedValue({
      id: "user-1",
      resetTokenExpiresAt: new Date(Date.now() + 60_000)
    });

    await service.resetPassword({ token: String(forgot.meta.resetToken), password: "newpassword123" });

    expect(usersService.findByResetTokenHash).toHaveBeenCalledWith(expect.any(String));
    expect(usersService.updatePassword).toHaveBeenCalledWith("user-1", "new-hashed-password");
  });

  it("rejects expired or invalid password reset tokens", async () => {
    const { service, usersService } = createService();
    usersService.findByResetTokenHash.mockResolvedValue({
      id: "user-1",
      resetTokenExpiresAt: new Date(Date.now() - 1)
    });

    await expect(service.resetPassword({ token: "expired-token", password: "newpassword123" })).rejects.toBeInstanceOf(
      UnauthorizedException
    );
    expect(usersService.updatePassword).not.toHaveBeenCalled();
  });
});
