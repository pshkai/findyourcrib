import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { MailService } from "./mail.service";

jest.mock("nodemailer", () => ({
  createTransport: jest.fn()
}));

describe("MailService", () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, "log").mockImplementation();
    jest.mocked(nodemailer.createTransport).mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function config(values: Record<string, unknown>) {
    return {
      get: jest.fn((key: string) => values[key]),
      getOrThrow: jest.fn((key: string) => {
        const value = values[key];

        if (value === undefined) {
          throw new Error(`${key} missing`);
        }

        return value;
      })
    } as unknown as ConfigService;
  }

  it("logs reset links when SMTP is not configured", async () => {
    const service = new MailService(config({}));

    await service.sendPasswordReset({ email: "renter@example.com", resetUrl: "https://findyourcrib.test/reset" });

    expect(Logger.prototype.log).toHaveBeenCalledWith(
      "Password reset link for renter@example.com: https://findyourcrib.test/reset"
    );
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });

  it("sends reset email through SMTP when configured", async () => {
    const sendMail = jest.fn().mockResolvedValue(undefined);
    jest.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);
    const service = new MailService(
      config({
        SMTP_FROM: "FindYourCrib <support@findyourcrib.test>",
        SMTP_HOST: "smtp.example.com",
        SMTP_PASS: "secret",
        SMTP_PORT: 587,
        SMTP_SECURE: false,
        SMTP_USER: "apikey"
      })
    );

    await service.sendPasswordReset({ email: "renter@example.com", resetUrl: "https://findyourcrib.test/reset" });

    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "smtp.example.com",
        port: 587,
        secure: false
      })
    );
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: "renter@example.com" }));
  });
});
