export const STAFF_ROLES = ["org_admin", "org_counselor"];

export function isStaffRole(role) {
  return STAFF_ROLES.includes(role);
}

export function homePathForRole(role) {
  if (role === "org_admin") return "/workspace";
  if (role === "org_counselor") return "/reviews";
  if (role === "user") return "/home";
  return "/login";
}

export const ROLE_MODULES = {
  user: [
    { path: "/home", label: "Home", description: "Your quizzes and wellness" },
  ],
  org_admin: [
    { path: "/workspace", label: "Workspace", description: "Organization overview & code" },
    { path: "/team", label: "Counselors", description: "Supervisors & counselors" },
    { path: "/reviews", label: "Results", description: "Quiz outcomes for your org" },
  ],
  org_counselor: [
    { path: "/reviews", label: "Reviews", description: "Review quiz results" },
    { path: "/members", label: "Members", description: "Users in your organization" },
  ],
};
