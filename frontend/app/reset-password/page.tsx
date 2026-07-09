import { ResetPasswordForm } from "../../components/password-recovery-form";
import "../page.css";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p>Account recovery</p>
        <h1>Choose a new password</h1>
        {!params.token ? <p className="auth-error">This reset link is missing a token.</p> : null}
        <ResetPasswordForm token={params.token ?? ""} />
      </section>
    </main>
  );
}
