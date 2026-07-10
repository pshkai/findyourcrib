import { ForgotPasswordForm } from "../../components/password-recovery-form";
import { noIndexMetadata } from "../../lib/seo";
import "../page.css";

export const metadata = noIndexMetadata;

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p>Account recovery</p>
        <h1>Reset your password</h1>
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
