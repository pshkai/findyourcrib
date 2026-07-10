import { AuthForm } from "../../components/auth-form";
import { noIndexMetadata } from "../../lib/seo";
import "../page.css";

export const metadata = noIndexMetadata;

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p>Get started</p>
        <h1>Create your account</h1>
        <AuthForm mode="register" />
        <p className="auth-switch">
          Already registered? <a href="/login">Login</a>
        </p>
      </section>
    </main>
  );
}
