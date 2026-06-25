"use client";

import { useState } from "react";
import { useHrms } from "../../stores/hrmsStore";
import { canApprove } from "../../lib/hrms/rbac";
import { getEmployee, labelize } from "../../lib/hrms/util";
import { Badge, Button, Card, EmptyState, Field, Input, Modal, PageHeader, Row, SectionTitle, Select, Textarea } from "../../components/hrms/ui";
import { LeaveType } from "../../lib/hrms/types";

const TYPES: LeaveType[] = ["casual", "sick", "personal", "maternity", "paternity", "leave-without-pay", "comp-off"];

export default function LeavePage() {
  const role = useHrms((s) => s.role);
  const currentUserId = useHrms((s) => s.currentUserId());
  const balances = useHrms((s) => s.leaveBalances).filter((b) => b.userId === currentUserId);
  const requests = useHrms((s) => s.leaveRequests);
  const submitLeave = useHrms((s) => s.submitLeave);
  const actOnLeave = useHrms((s) => s.actOnLeave);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: "casual" as LeaveType, startDate: "", endDate: "", reason: "" });

  const mine = requests.filter((r) => r.userId === currentUserId);
  const queue = requests.filter((r) => r.userId !== currentUserId && r.status === "pending");

  function days() {
    if (!form.startDate || !form.endDate) return 1;
    const diff = (new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000;
    return Math.max(1, Math.round(diff) + 1);
  }

  function submit() {
    if (!form.startDate || !form.endDate || !form.reason) return;
    submitLeave({ ...form, totalDays: days() });
    setForm({ type: "casual", startDate: "", endDate: "", reason: "" });
    setOpen(false);
  }

  function act(id: string, decision: "approved" | "rejected") {
    const req = requests.find((r) => r.id === id);
    const level = req?.approvals.find((a) => a.status === "pending")?.level ?? "Manager";
    actOnLeave(id, level, decision, decision === "approved" ? "Approved" : "Rejected");
  }

  return (
    <div>
      <PageHeader title="Leave" subtitle="Balances, requests & approvals" action={<Button size="sm" onClick={() => setOpen(true)}>+ Request</Button>} />

      <SectionTitle>My Balances</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        {balances.map((b) => (
          <Card key={b.type} className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">{labelize(b.type)}</p>
              <span className="text-lg font-bold text-teal-600">{b.available}</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">Used {b.used} · Pending {b.pending} · Total {b.total}</div>
            {b.carriedForward || b.encashed ? (
              <div className="mt-0.5 text-[11px] text-slate-400">CF {b.carriedForward} · Encashed {b.encashed}</div>
            ) : null}
          </Card>
        ))}
      </div>

      <SectionTitle>My Requests</SectionTitle>
      <div className="space-y-2">
        {mine.length === 0 ? <EmptyState>No requests yet</EmptyState> : null}
        {mine.map((r) => (
          <Card key={r.id}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">{labelize(r.type)} · {r.totalDays}d</p>
              <Badge status={r.status}>{labelize(r.status)}</Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500">{r.startDate} → {r.endDate}</p>
            <p className="mt-1 text-xs text-slate-600">{r.reason}</p>
            <div className="mt-2 space-y-1 border-t border-slate-100 pt-2">
              {r.approvals.map((a) => (
                <Row key={a.level} left={`${a.level} · ${a.approver}`} right={<Badge status={a.status}>{labelize(a.status)}</Badge>} />
              ))}
            </div>
          </Card>
        ))}
      </div>

      {canApprove(role) ? (
        <>
          <SectionTitle>Approval Queue</SectionTitle>
          <div className="space-y-2">
            {queue.length === 0 ? <EmptyState>No pending approvals</EmptyState> : null}
            {queue.map((r) => {
              const emp = getEmployee(r.userId);
              return (
                <Card key={r.id}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{emp?.name}</p>
                    <Badge status={r.type}>{labelize(r.type)}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{r.startDate} → {r.endDate} · {r.totalDays}d</p>
                  <p className="mt-1 text-xs text-slate-600">{r.reason}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => act(r.id, "approved")}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => act(r.id, "rejected")}>Reject</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      ) : null}

      <Modal open={open} onClose={() => setOpen(false)} title="New Leave Request">
        <div className="space-y-3">
          <Field label="Leave Type">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as LeaveType })}>
              {TYPES.map((t) => {
                const bal = balances.find((b) => b.type === t);
                return <option key={t} value={t}>{labelize(t)}{bal ? ` (${bal.available} left)` : ""}</option>;
              })}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date"><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
            <Field label="End Date"><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></Field>
          </div>
          <Row left="Total Days" right={`${days()} day(s)`} />
          <Field label="Reason"><Textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reason for leave" /></Field>
          <Button className="w-full" onClick={submit}>Submit Request</Button>
        </div>
      </Modal>
    </div>
  );
}
