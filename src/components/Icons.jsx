const mkIcon =
  (paths, defaults = {}) =>
  ({ size = 20, className = "", stroke = 1.6, ...rest }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...defaults}
      {...rest}
    >
      {paths}
    </svg>
  );

export const IconSearch = mkIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </>,
);

export const IconPlus = mkIcon(
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>,
);

export const IconX = mkIcon(
  <>
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </>,
);

export const IconEdit = mkIcon(
  <>
    <path d="M14 4l6 6-10 10H4v-6z" />
    <path d="M13 5l6 6" />
  </>,
);

export const IconUsers = mkIcon(
  <>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 20c.5-3.5 3.3-5.5 6.5-5.5s6 2 6.5 5.5" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M15 20c.3-2.7 2-4.5 4.3-4.5" />
  </>,
);

export const IconMail = mkIcon(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </>,
);

export const IconLock = mkIcon(
  <>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 018 0v3" />
  </>,
);

export const IconDots = mkIcon(
  <>
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </>,
);

export const IconChevronDown = mkIcon(
  <>
    <path d="M6 9l6 6 6-6" />
  </>,
);

export const IconShield = mkIcon(
  <>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
  </>,
);
