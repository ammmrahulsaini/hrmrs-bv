"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import { PropsWithChildren, useEffect } from "react";
import { useHrms } from "../../stores/hrmsStore";
import { bottomNavForRole, canAccess, MODULES, ROLE_LABELS } from "../../lib/hrms/rbac";
import { Role } from "../../lib/hrms/types";
import { Avatar } from "./ui";
import { Icon } from "./icons";
import { Copilot } from "./Copilot";

const ROLES: Role[] = ["employee", "manager", "hr", "admin"];

export function AppShell({ children }: PropsWithChildren) {
  const role = useHrms((s) => s.role);
  const setRole = useHrms((s) => s.setRole);
  const employees = useHrms((s) => s.employees);
  const currentUserId = useHrms((s) => s.currentUserId());
  const hydrated = useHrms((s) => s.hydrated);
  const hydrate = useHrms((s) => s.hydrate);
  const pathname = usePathname() || "/";
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) hydrate().catch(() => undefined);
  }, [hydrated, hydrate]);

  const user = employees.find((e) => e.id === currentUserId);
  const nav = bottomNavForRole(role);
  const activeKey = MODULES.find((m) => (m.href === "/" ? pathname === "/" : pathname.startsWith(m.href)))?.key ?? "home";

  function changeRole(next: Role) {
    setRole(next);
    if (!canAccess(next, activeKey)) router.push("/");
  }

  return (
    <div className="flex min-h-screen justify-center bg-slate-100">
      <div className="relative flex min-h-screen w-full max-w-[430px] flex-col bg-slate-50 shadow-xl">
        <header className="sticky top-0 z-20 bg-gradient-to-r from-teal-600 to-teal-500 px-4 pb-4 pt-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user ? <Avatar name={user.name} color="bg-white/20" /> : <div className="h-10 w-10 rounded-full bg-white/20" />}
              <div>
                <p className="text-sm font-bold leading-tight">{user?.name ?? "Loading..."}</p>
                <p className="text-xs opacity-90">{user?.designation ?? ""}</p>
              </div>
            </div>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => changeRole(e.target.value as Role)}
                className="appearance-none rounded-full bg-white/20 py-1.5 pl-3 pr-8 text-xs font-semibold text-white outline-none"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="text-slate-800">
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
            </div>
          </div>
          <p className="mt-1 text-[11px] uppercase tracking-wider opacity-80">WorkFlow HRMS</p>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-28 pt-4">
          {hydrated ? children : (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
              <p className="text-sm">Loading your workspace...</p>
            </div>
          )}
        </main>

        <Copilot />

        <nav className="sticky bottom-0 z-20 flex items-center justify-around border-t border-slate-200 bg-white px-1 py-2">
          {nav.map((m) => {
            const active = m.key === activeKey;
            return (
              <Link key={m.key} href={m.href} className="flex flex-1 flex-col items-center gap-0.5 py-1">
                <Icon name={m.icon} className={`h-5 w-5 ${active ? "text-teal-600" : "text-slate-400"}`} />
                <span className={`text-[10px] font-medium ${active ? "text-teal-600" : "text-slate-400"}`}>{m.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
