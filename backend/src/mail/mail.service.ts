import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

interface PasswordResetEmail {
  email: string;
  resetUrl: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendPasswordReset({ email, resetUrl }: PasswordResetEmail) {
    const transporter = this.createTransporter();

    if (!transporter) {
      this.logger.log(`Password reset link for ${email}: ${resetUrl}`);
      return;
    }

    await transporter.sendMail({
      from: this.configService.getOrThrow<string>("SMTP_FROM"),
      to: email,
      subject: "Reset your FindYourCrib password",
      text: `Reset your FindYourCrib password: ${resetUrl}`,
      html: `<p>Reset your FindYourCrib password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
    });
  }

  private createTransporter() {
    const host = this.configService.get<string>("SMTP_HOST");

    if (!host) {
      return null;
    }

    return nodemailer.createTransport({
      auth: {
        pass: this.configService.get<string>("SMTP_PASS"),
        user: this.configService.get<string>("SMTP_USER")
      },
      host,
      port: this.configService.getOrThrow<number>("SMTP_PORT"),
      secure: this.configService.getOrThrow<boolean>("SMTP_SECURE")
    });
  }
}
