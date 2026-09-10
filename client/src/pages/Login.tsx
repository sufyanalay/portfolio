import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/auth/login", { email, password });
      navigate("/dashboard");
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <Link to="/" className="text-sm text-primary hover:underline">← Back to portfolio</Link>
        <p className="mt-12 text-[11px] font-medium tracking-[0.08em] text-primary">ADMIN AREA</p>
        <h1 className="mt-2 font-heading text-3xl font-medium text-text-dark">Welcome back</h1>
        <p className="mt-2 text-sm text-text-gray">Sign in to update your portfolio content.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block text-xs font-medium text-text-dark">
            Email
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </label>
          <label className="block text-xs font-medium text-text-dark">
            Password
            <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={submitting} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white disabled:opacity-60">
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}