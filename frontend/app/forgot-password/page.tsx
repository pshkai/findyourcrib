import { ForgotPasswordForm } from "../../components/password-recovery-form";
import "../page.css";

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
