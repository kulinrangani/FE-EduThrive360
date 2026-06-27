import { useState } from "react";
import { IconChevronDown, IconX } from "./Icons.jsx";

export const cn = (...parts) => parts.filter(Boolean).join(" ");

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}) {
  const sizes = {
    sm: "h-9 px-3.5 text-sm gap-1.5",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2",
  };
  const variants = {
    primary: "btn-gradient text-white shadow-soft font-semibold",
    ghost: "bg-transparent text-ink hover:bg-ink/5 font-medium",
    outline: "border border-ink/15 bg-white text-ink hover:border-teal hover:text-teal font-medium",
    danger: "bg-red-50 text-red-700 hover:bg-red-100 font-medium",
    dark: "bg-ink text-beige hover:opacity-90 font-semibold",
  };
  return (
    <button
      type="button"
      className={cn(
        "rounded-xl inline-flex items-center justify-center transition disabled:opacity-60 disabled:pointer-events-none",
        sizes[size],
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "", padded = true }) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-soft border border-ink/[.04]",
        padded && "p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({ children, tone = "teal", dot = false, className = "" }) {
  const tones = {
    teal: "bg-teal/10 text-teal-deep",
    orange: "bg-orange/15 text-orange",
    beige: "bg-beige-deep text-ink/70",
    red: "bg-red-50 text-red-600",
    green: "bg-emerald-50 text-emerald-700",
    ink: "bg-ink text-beige",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        tones[tone] ?? tones.teal,
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            tone === "teal" ? "bg-teal" : tone === "orange" ? "bg-orange" : "bg-ink/40",
          )}
        />
      )}
      {children}
    </span>
  );
}

export function Input({ icon, className = "", wrapperClass = "", type = "text", ...rest }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={cn("relative", wrapperClass)}>
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40">{icon}</span>
      )}
      <input
        type={inputType}
        className={cn(
          "w-full h-11 rounded-xl border border-ink/15 bg-white text-sm text-ink placeholder:text-ink/40",
          "focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition",
          icon ? "pl-10 pr-12" : isPassword ? "pl-4 pr-12" : "px-4",
          className,
        )}
        {...rest}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition flex items-center justify-center h-8 w-8 rounded-lg hover:bg-ink/5 focus:outline-none"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

export function Select({ children, className = "", ...rest }) {
  return (
    <div className="relative">
      <select
        className={cn(
          "appearance-none h-11 w-full rounded-xl border border-ink/15 bg-white text-sm text-ink pl-4 pr-10",
          "focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none">
        <IconChevronDown size={16} />
      </span>
    </div>
  );
}

export function Modal({ open, onClose, title, subtitle, children, footer, width = "max-w-lg" }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 fade-in"
      onClick={onClose}
      role="presentation"
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
      <div
        className={cn(
          "relative bg-white rounded-t-2xl sm:rounded-2xl shadow-lift w-full max-h-[90vh] overflow-y-auto",
          width,
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 flex items-start justify-between gap-4 border-b border-ink/5 sticky top-0 bg-white z-10">
          <div>
            <h3 id="modal-title" className="font-display text-xl sm:text-2xl text-ink">
              {title}
            </h3>
            {subtitle && <p className="text-sm text-ink/60 mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-beige hover:bg-beige-deep flex items-center justify-center text-ink/60 shrink-0"
            aria-label="Close"
          >
            <IconX size={16} />
          </button>
        </div>
        <div className="px-5 sm:px-6 py-5">{children}</div>
        {footer && (
          <div className="px-5 sm:px-6 py-4 border-t border-ink/5 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 bg-beige/40 rounded-b-2xl sticky bottom-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function Avatar({ name, size = 40, tone, src }) {
  if (src) {
    const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
    const fullSrc = src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")
      ? src
      : `${apiBase}${src}`;
    return (
      <img
        src={fullSrc}
        alt={name}
        className="inline-block rounded-full object-cover border border-ink/5 shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const tones = [
    "bg-teal text-white",
    "bg-orange text-white",
    "bg-ink text-beige",
    "bg-yellow text-ink",
  ];
  const t = tone ?? tones[(name.charCodeAt(0) + name.length) % tones.length];
  return (
    <span
      className={cn("inline-flex items-center justify-center rounded-full font-semibold shrink-0", t)}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}

export function FieldLabel({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-1.5"
    >
      {children}
    </label>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="py-12 px-6 text-center">
      {icon && <div className="flex justify-center text-ink/25 mb-4">{icon}</div>}
      <p className="font-semibold text-ink">{title}</p>
      {description && <p className="text-sm text-ink/50 mt-2 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
