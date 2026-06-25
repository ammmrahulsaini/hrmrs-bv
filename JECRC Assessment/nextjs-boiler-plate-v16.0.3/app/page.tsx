"use client";

import Link from "next/link";
import { useHrms } from "../stores/hrmsStore";
import { modulesForRole, canApprove, ROLE_LABELS } from "../lib/hrms/rbac";
import { Icon } from "../components/hrms/icons";
import { Badge, Card, SectionTitle, Stat } from "../components/hrms/ui";
import { labelize } from "../lib/hrms/util";

export default function HomePage() {
  const role = useHrms((s) => s.role);
  const currentUserId = useHrms((s) => s.currentUserId());
  const leaveRequests = useHrms((s) => s.leaveRequests);
  const reimbursements = useHrms((s) => s.reimbursements);
  const announcements = useHrms((s) => s.announcements);
  const attendance = useHrms((s) => s.attendance);

  const tiles = modulesForRole(role);
  const pendingLeaves = leaveRequests.filter((r) => r.userId !== currentUserId && r.status === "pending").length;
  const pendingExpenses = reimbursements.filter((r) => r.userId !== currentUserId && r.status === "pending-approval").length;
  const myPending = leaveRequests.filter((r) => r.userId === currentUserId && r.status === "pending").length;
  const clockedIn = attendance.some((a) => a.userId === currentUserId && !a.clockOut);

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-slate-500">Welcome back</p>
        <h1 className="text-2xl font-bold text-slate-900">{ROLE_LABELS[role]} Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Status" value={clockedIn ? "Clocked In" : "Clocked Out"} tone={clockedIn ? "text-green-600" : "text-slate-900"} />
        {canApprove(role) ? (
          <Stat label="Pending Approvals" value={pendingLeaves + pendingExpenses} hint="leaves + expenses" tone="text-orange-600" />
        ) : (
          <Stat label="My Open Requests" value={myPending} hint="awaiting approval" tone="text-orange-600" />
        )}
      </div>

      <SectionTitle>Quick Access</SectionTitle>
      <div className="grid grid-cols-3 gap-3">
        {tiles.map((m) => (
          <Link key={m.key} href={m.href}>
            <Card className="flex flex-col items-center gap-2 p-3 text-center transition-transform active:scale-95">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
                <Icon name={m.icon} className="h-5 w-5 text-teal-600" />
              </div>
              <span className="text-xs font-medium text-slate-700">{m.label}</span>
            </Card>
          </Link>
        ))}
      </div>

      <SectionTitle action={<Link href="/announcements" className="text-xs font-semibold text-teal-600">View all</Link>}>
        Latest Announcements
      </SectionTitle>
      <div className="space-y-3">
        {announcements.slice(0, 2).map((a) => (
          <Card key={a.id}>
            <div className="mb-1 flex items-center justify-between">
              <Badge status={a.category}>{labelize(a.category)}</Badge>
              <Badge status={a.priority}>{labelize(a.priority)}</Badge>
            </div>
            <p className="text-sm font-semibold text-slate-900">{a.title}</p>
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">{a.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
