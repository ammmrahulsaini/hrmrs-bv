import { Role } from "./types";

export interface ModuleDef {
  key: string;
  label: string;
  href: string;
  icon: string;
  roles: Role[];
}

export const MODULES: ModuleDef[] = [
  { key: "home", label: "Home", href: "/", icon: "LayoutDashboard", roles: ["employee", "manager", "hr", "admin"] },
  { key: "attendance", label: "Attendance", href: "/attendance", icon: "Clock", roles: ["employee", "manager", "hr", "admin"] },
  { key: "leave", label: "Leave", href: "/leave", icon: "CalendarDays", roles: ["employee", "manager", "hr", "admin"] },
  { key: "payroll", label: "Payroll", href: "/payroll", icon: "Wallet", roles: ["employee", "manager", "hr", "admin"] },
  { key: "documents", label: "Documents", href: "/documents", icon: "FileText", roles: ["employee", "manager", "hr", "admin"] },
  { key: "expenses", label: "Expenses", href: "/expenses", icon: "Receipt", roles: ["employee", "manager", "hr", "admin"] },
  { key: "performance", label: "Performance", href: "/performance", icon: "Target", roles: ["employee", "manager", "hr", "admin"] },
  { key: "contributions", label: "Contributions", href: "/contributions", icon: "Award", roles: ["employee", "manager", "hr", "admin"] },
  { key: "training", label: "Training", href: "/training", icon: "GraduationCap", roles: ["employee", "manager", "hr", "admin"] },
  { key: "recruitment", label: "Recruitment", href: "/recruitment", icon: "UserSearch", roles: ["hr", "admin"] },
  { key: "recognition", label: "Recognition", href: "/recognition", icon: "Heart", roles: ["employee", "manager", "hr", "admin"] },
  { key: "announcements", label: "Announcements", href: "/announcements", icon: "Megaphone", roles: ["employee", "manager", "hr", "admin"] },
  { key: "team", label: "Team", href: "/team", icon: "Users", roles: ["manager", "hr", "admin"] },
  { key: "analytics", label: "Analytics", href: "/analytics", icon: "BarChart3", roles: ["employee", "manager", "hr", "admin"] },
  { key: "onboarding", label: "Onboarding", href: "/onboarding", icon: "Rocket", roles: ["employee", "hr", "manager", "admin"] },
];

const BOTTOM_NAV: Record<Role, string[]> = {
  employee: ["home", "attendance", "performance", "training", "contributions"],
  manager: ["home", "team", "leave", "performance", "training"],
  hr: ["home", "recruitment", "analytics", "training", "announcements"],
  admin: ["home", "analytics", "team", "training", "announcements"],
};

export function canAccess(role: Role, moduleKey: string): boolean {
  const mod = MODULES.find((m) => m.key === moduleKey);
  return mod ? mod.roles.includes(role) : false;
}

export function modulesForRole(role: Role): ModuleDef[] {
  return MODULES.filter((m) => m.roles.includes(role) && m.key !== "home");
}

export function bottomNavForRole(role: Role): ModuleDef[] {
  return BOTTOM_NAV[role]
    .map((key) => MODULES.find((m) => m.key === key))
    .filter((m): m is ModuleDef => Boolean(m));
}

export function canApprove(role: Role): boolean {
  return role === "manager" || role === "hr" || role === "admin";
}

export function canManageContent(role: Role): boolean {
  return role === "hr" || role === "admin";
}

export const ROLE_LABELS: Record<Role, string> = {
  employee: "Employee",
  manager: "Manager",
  hr: "HR Specialist",
  admin: "Admin",
};
