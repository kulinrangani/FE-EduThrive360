import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationCode, setOrganizationCode] = useState("");
  const [memberType, setMemberType] = useState("student");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register({
        fullName,
        email,
        password,
        organizationCode: organizationCode.trim(),
        memberType,
        age: age ? Number.parseInt(age, 10) : undefined,
      });
      navigate("/home", { replace: true });
    } catch (err) {
      const details = err.response?.data?.details;
      const detailMsg = Array.isArray(details) ? details[0]?.msg : null;
      setError(err.response?.data?.error ?? detailMsg ?? err.message ?? "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-svh flex flex-col fade-in px-4 py-8 max-w-lg mx-auto w-full">
      <header>
        <p className="text-teal text-sm font-semibold tracking-wide uppercase">
          EduThrive360
        </p>
        <h1 className="font-display text-3xl text-ink mt-1">Create account</h1>
        <p className="text-ink/60 mt-2 text-sm">
          Use the organization code from your school or employer (not your email).
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <p className="text-sm text-orange bg-orange/10 rounded-xl px-3 py-2">{error}</p>
        )}
        <div>
          <label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">
            Full name
          </label>
          <input
            className="mt-1.5 w-full h-11 rounded-xl border border-ink/15 px-4 text-sm focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">
            Email
          </label>
          <input
            type="email"
            className="mt-1.5 w-full h-11 rounded-xl border border-ink/15 px-4 text-sm focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">
            Password (min 8 characters)
          </label>
          <input
            type="password"
            className="mt-1.5 w-full h-11 rounded-xl border border-ink/15 px-4 text-sm focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">
            Organization code
          </label>
          <input
            className="mt-1.5 w-full h-11 rounded-xl border border-ink/15 px-4 text-sm font-mono uppercase tracking-wider focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
            value={organizationCode}
            onChange={(e) => setOrganizationCode(e.target.value.toUpperCase())}
            placeholder="e.g. WILO-A1B2C3"
            required
          />
          <p className="text-xs text-ink/50 mt-1.5">
            Ask your organization admin for this code. It is not your student or employee ID.
          </p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">
            I am a
          </label>
          <select
            className="mt-1.5 w-full h-11 rounded-xl border border-ink/15 px-4 text-sm focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
            value={memberType}
            onChange={(e) => setMemberType(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">
            Age (optional)
          </label>
          <input
            type="number"
            min={0}
            max={120}
            className="mt-1.5 w-full h-11 rounded-xl border border-ink/15 px-4 text-sm focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-4 rounded-xl text-white font-semibold btn-gradient shadow-soft disabled:opacity-70"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-ink/60 text-center mt-6">
        Staff (admin or counselor)?{" "}
        <Link to="/login" className="text-teal font-semibold hover:underline">
          Sign in
        </Link>
      </p>
      <p className="text-sm text-ink/60 text-center mt-2">
        Already registered?{" "}
        <Link to="/login" className="text-teal font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
