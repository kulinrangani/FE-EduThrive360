import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { homePathForRole } from "../config/roles.js";
import { Input } from "../components/UI.jsx";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const loggedIn = await login(email, password);
      const dest = location.state?.from ?? homePathForRole(loggedIn.role);
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error ?? err.message ?? "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-svh flex flex-col fade-in px-4 py-8 max-w-lg mx-auto w-full">
      <header>
        <p className="text-teal text-sm font-semibold tracking-wide uppercase">
          EM360
        </p>
        <h1 className="font-display text-3xl text-ink mt-1">Sign in</h1>
        <p className="text-ink/60 mt-2 text-sm">
          Students, employees, organization admins, and counselors all sign in here.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 flex-1">
        {error && (
          <p className="text-sm text-orange bg-orange/10 rounded-xl px-3 py-2">{error}</p>
        )}
        <div>
          <label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">
            Email
          </label>
          <Input
            type="email"
            className="mt-1.5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">
            Password
          </label>
          <Input
            type="password"
            className="mt-1.5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-4 rounded-xl text-white font-semibold btn-gradient shadow-soft disabled:opacity-70"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-ink/60 text-center mt-6">
        New here?{" "}
        <Link to="/register" className="text-teal font-semibold hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
