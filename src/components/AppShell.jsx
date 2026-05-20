import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ROLE_MODULES } from "../config/roles.js";

export function AppShell({ children, title, subtitle, wide = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const modules = ROLE_MODULES[user?.role] ?? ROLE_MODULES.user;

  return (
    <div className="min-h-svh flex flex-col fade-in">
      <header
        className={`px-4 py-5 mx-auto w-full border-b border-ink/8 ${wide ? "max-w-3xl" : "max-w-lg"}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-teal text-xs font-semibold tracking-wide uppercase">EduThrive360</p>
            <h1 className="font-display text-2xl text-ink mt-0.5">{title}</h1>
            {subtitle && <p className="text-ink/60 text-sm mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-sm text-ink/50 hover:text-teal shrink-0"
          >
            Sign out
          </button>
        </div>
        {modules.length > 1 && (
          <nav className="flex gap-2 mt-4 flex-wrap">
            {modules.map((m) => (
              <NavLink
                key={m.path}
                to={m.path}
                end={m.path === "/"}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    isActive ? "bg-teal text-white" : "bg-white/80 text-ink/70 hover:text-teal"
                  }`
                }
              >
                {m.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main
        className={`flex-1 px-4 py-6 mx-auto w-full ${wide ? "max-w-3xl" : "max-w-lg"}`}
      >
        {children}
      </main>
    </div>
  );
}
