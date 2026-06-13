import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ROLE_MODULES } from "../config/roles.js";

function getIconForPath(path) {
  switch (path) {
    case "/home":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case "/wellness-hub":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "/workspace":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case "/team":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case "/reviews":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case "/members":
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );
  }
}

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AppShell({ children, title, subtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const modules = ROLE_MODULES[user?.role] ?? ROLE_MODULES.user;
  const roleLabel =
    user?.role === "org_admin"
      ? "Org Admin"
      : user?.role === "org_counselor"
        ? "Counselor"
        : "Student/Member";

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const navLinks = (
    <div className="flex-1 space-y-1.5 px-3 py-4">
      {modules.map((m) => (
        <NavLink
          key={m.path}
          to={m.path}
          onClick={() => setIsMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
              isActive
                ? "bg-teal text-white shadow-soft"
                : "text-beige/75 hover:text-white hover:bg-white/5"
            }`
          }
        >
          {getIconForPath(m.path)}
          <span>{m.label}</span>
        </NavLink>
      ))}
    </div>
  );

  const sidebarFooter = (
    <div className="border-t border-white/5 p-4 flex items-center gap-3 shrink-0">
      <div className="w-10 h-10 rounded-full bg-teal-deep text-white flex items-center justify-center font-bold text-sm">
        {getInitials(user?.fullName)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate text-white">{user?.fullName}</div>
        <div className="text-[10px] text-beige/50 uppercase tracking-wider font-semibold">{roleLabel}</div>
      </div>
      <button
        onClick={handleSignOut}
        title="Sign Out"
        className="w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center text-beige/60 hover:text-white transition shrink-0"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-beige fade-in">
      
      {/* 1. Desktop Left Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-ink text-beige border-r border-white/5 z-20 sticky top-0 h-screen">
        {/* Brand/Logo */}
        <div className="px-5 pt-6 pb-5 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-yellow flex items-center justify-center shrink-0 shadow-lift">
            <span className="font-display text-ink font-bold text-lg">E</span>
          </div>
          <div>
            <div className="font-display text-lg font-bold text-white leading-none">EduThrive360</div>
            <span className="text-[9px] uppercase tracking-widest text-teal font-bold">Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">{navLinks}</nav>

        {/* User Footer */}
        {sidebarFooter}
      </aside>

      {/* 2. Mobile Drawer Navigation */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-ink/60 transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-ink text-beige">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Logo */}
            <div className="px-5 pt-6 pb-5 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-yellow flex items-center justify-center shrink-0 shadow-lift">
                <span className="font-display text-ink font-bold text-lg">E</span>
              </div>
              <div className="font-display text-lg font-bold text-white leading-none">EduThrive360</div>
            </div>
            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto">{navLinks}</nav>
            {/* Footer */}
            {sidebarFooter}
          </div>
        </div>
      )}

      {/* 3. Main Viewport */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 min-h-screen">
        
        {/* Sticky Top Header on Mobile & Normal Header on Desktop */}
        <header className="sticky top-0 z-10 md:static flex items-center justify-between h-16 md:h-auto bg-ink text-beige md:bg-white/20 md:text-ink border-b border-ink/8 px-4 md:px-8 py-4 shrink-0">
          
          {/* Hamburger toggle on Mobile, empty spacing / header details on Desktop */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              className="text-beige hover:text-white"
              onClick={() => setIsMobileOpen(true)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-display font-bold text-base text-white">EduThrive360</span>
          </div>

          {/* Title & Subtitle block on Desktop */}
          <div className="hidden md:block">
            <h1 className="font-display text-2xl text-ink font-bold leading-tight">{title}</h1>
            {subtitle && <p className="text-ink/60 text-xs mt-0.5 font-medium">{subtitle}</p>}
          </div>

          {/* Quick Stats or Small Action widget */}
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="px-2.5 py-1 rounded-full bg-teal/10 text-teal font-semibold hidden md:inline-block">
              {roleLabel}
            </span>
          </div>
        </header>

        {/* Page Specific Header on Mobile */}
        <div className="block md:hidden px-4 pt-5 pb-1 shrink-0">
          <h2 className="font-display text-xl text-ink font-bold leading-tight">{title}</h2>
          {subtitle && <p className="text-ink/60 text-xs mt-0.5">{subtitle}</p>}
        </div>

        {/* 4. Page Content (Full width with padding) */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6">
          {children}
        </main>
      </div>

    </div>
  );
}
