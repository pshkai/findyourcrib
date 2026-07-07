import { AuthForm } from "../../components/auth-form";
import "../page.css";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p>Welcome back</p>
        <h1>Login to FindYourCrib</h1>
        <AuthForm mode="login" />
        <p className="auth-switch">
          New here? <a href="/register">Create an account</a>
        </p>
      </section>
    </main>
  );
}
