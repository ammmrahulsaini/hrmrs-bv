"use client";

import { useHrms } from "../../stores/hrmsStore";
import { getEmployee, labelize } from "../../lib/hrms/util";
import { Avatar, Badge, Card, EmptyState, PageHeader, Stat } from "../../components/hrms/ui";

export default function TeamPage() {
  const role = useHrms((s) => s.role);
  const currentUserId = useHrms((s) => s.currentUserId());
  const employees = useHrms((s) => s.employees);

  const roster = role === "manager" ? employees.filter((e) => e.managerId === currentUserId) : employees.filter((e) => e.id !== currentUserId);
  const active = roster.filter((e) => e.status === "active").length;

  return (
    <div>
      <PageHeader title="Team Management" subtitle={role === "manager" ? "Your direct reports" : "Organization roster"} />

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Team Size" value={roster.length} />
        <Stat label="Active" value={active} tone="text-green-600" />
      </div>

      <div className="mt-4 space-y-2">
        {roster.length === 0 ? <EmptyState>No team members</EmptyState> : null}
        {roster.map((e) => {
          const manager = getEmployee(e.reportingManagerId ?? "");
          return (
            <Card key={e.id} className="flex items-center gap-3">
              <Avatar name={e.name} color={e.avatarColor} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{e.name}</p>
                <p className="text-xs text-slate-500">{e.designation} · {e.department}</p>
                <p className="text-[11px] text-slate-400">{e.location}{manager ? ` · Reports to ${manager.name}` : ""}</p>
              </div>
              <Badge status={e.status}>{labelize(e.status)}</Badge>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
