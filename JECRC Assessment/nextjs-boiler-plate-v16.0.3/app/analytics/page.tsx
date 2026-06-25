"use client";

import { useHrms } from "../../stores/hrmsStore";
import { PageHeader, Card, SectionTitle, Stat } from "../../components/hrms/ui";

function Bar({ label, value, max, tone = "bg-teal-600" }: { label: string; value: number; max: number; tone?: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-slate-500"><span>{label}</span><span>{value}</span></div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const role = useHrms((s) => s.role);
  const currentUserId = useHrms((s) => s.currentUserId());
  const attendance = useHrms((s) => s.attendance);
  const leaveRequests = useHrms((s) => s.leaveRequests);
  const reimbursements = useHrms((s) => s.reimbursements);
  const leaderboard = useHrms((s) => s.leaderboard);
  const employees = useHrms((s) => s.employees);

  if (role === "employee") {
    const mine = attendance.filter((a) => a.userId === currentUserId);
    const maxHours = Math.max(1, ...mine.map((a) => a.totalHours));
    const avg = mine.length ? (mine.reduce((s, a) => s + a.totalHours, 0) / mine.length).toFixed(1) : "0";
    const overtime = mine.reduce((s, a) => s + a.overtimeHours, 0).toFixed(1);
    return (
      <div>
        <PageHeader title="My Analytics" subtitle="Your attendance patterns" />
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Avg Hours / Day" value={`${avg}h`} />
          <Stat label="Total Overtime" value={`${overtime}h`} tone="text-orange-600" />
        </div>
        <SectionTitle>Daily Hours</SectionTitle>
        <Card>
          <div className="space-y-3">
            {mine.map((a) => <Bar key={a.id} label={a.date} value={a.totalHours} max={maxHours} />)}
          </div>
        </Card>
      </div>
    );
  }

  const departments = Array.from(new Set(employees.map((e) => e.department)));
  const deptCounts = departments.map((d) => ({ d, n: employees.filter((e) => e.department === d).length }));
  const maxDept = Math.max(1, ...deptCounts.map((x) => x.n));
  const pendingApprovals = leaveRequests.filter((r) => r.status === "pending").length + reimbursements.filter((r) => r.status === "pending-approval").length;
  const avgRating = (leaderboard.reduce((s, l) => s + l.avgRating, 0) / leaderboard.length).toFixed(1);

  return (
    <div>
      <PageHeader title="HR Analytics" subtitle="Workforce health overview" />
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Headcount" value={employees.length} />
        <Stat label="Departments" value={departments.length} />
        <Stat label="Pending Approvals" value={pendingApprovals} tone="text-orange-600" />
        <Stat label="Avg Rating" value={`⭐ ${avgRating}`} />
      </div>

      <SectionTitle>Headcount by Department</SectionTitle>
      <Card>
        <div className="space-y-3">
          {deptCounts.map((x) => <Bar key={x.d} label={x.d} value={x.n} max={maxDept} tone="bg-orange-500" />)}
        </div>
      </Card>

      <SectionTitle>Top Contributors</SectionTitle>
      <Card>
        <div className="space-y-3">
          {leaderboard.map((l) => {
            const emp = employees.find((e) => e.id === l.userId);
            return <Bar key={l.userId} label={emp?.name ?? l.userId} value={l.points} max={Math.max(...leaderboard.map((x) => x.points))} />;
          })}
        </div>
      </Card>
    </div>
  );
}
