import { useEffect, useState } from "react";
import { apiClient } from "../api/client.js";

export function HomePage() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient
      .get("/health")
      .then((res) => setHealth(res.data))
      .catch((err) => setError(err.message ?? "API unreachable"));
  }, []);

  return (
    <div className="min-h-svh flex flex-col fade-in">
      <header className="px-4 py-6 max-w-lg mx-auto w-full">
        <p className="text-teal text-sm font-semibold tracking-wide uppercase">
          EM360
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-ink mt-1 leading-tight">
          Your wellness journey starts here
        </h1>
        <p className="text-ink/60 mt-2 text-sm sm:text-base">
          Quiz-first experience for students and employees. Plan 0 foundation —
          auth and assessments arrive in later plans.
        </p>
      </header>

      <main className="flex-1 px-4 pb-8 max-w-lg mx-auto w-full">
        <div className="rounded-2xl bg-white/70 border border-ink/8 p-5 shadow-soft">
          <h2 className="font-semibold text-ink">API status</h2>
          {health && (
            <dl className="mt-3 space-y-2 text-sm text-ink/80">
              <div className="flex justify-between gap-4">
                <dt>Service</dt>
                <dd className="font-mono text-teal">{health.status}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>MongoDB</dt>
                <dd className="font-mono">{health.mongo?.status ?? "—"}</dd>
              </div>
            </dl>
          )}
          {error && (
            <p className="mt-3 text-sm text-orange">
              Could not reach backend: {error}. Start the API and MongoDB, then
              refresh.
            </p>
          )}
          {!health && !error && (
            <p className="mt-3 text-sm text-ink/50">Checking API…</p>
          )}
        </div>

        <a
          href="/login"
          className="mt-6 block w-full py-3.5 px-4 rounded-xl text-white font-semibold btn-gradient shadow-soft text-center"
        >
          Sign in
        </a>
        <a
          href="/register"
          className="mt-3 block w-full py-3 text-center text-sm text-teal font-semibold hover:underline"
        >
          Create an account
        </a>
      </main>
    </div>
  );
}
