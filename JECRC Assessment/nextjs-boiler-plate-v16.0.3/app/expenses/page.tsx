"use client";

import { useState } from "react";
import { useHrms } from "../../stores/hrmsStore";
import { canApprove } from "../../lib/hrms/rbac";
import { getEmployee, labelize, money } from "../../lib/hrms/util";
import { Badge, Button, Card, EmptyState, Field, Input, Modal, PageHeader, Row, SectionTitle, Select, Textarea } from "../../components/hrms/ui";
import { ExpenseCategory } from "../../lib/hrms/types";

const CATEGORIES: ExpenseCategory[] = ["travel", "food", "accommodation", "communication", "medical", "office-supplies", "other"];

export default function ExpensesPage() {
  const role = useHrms((s) => s.role);
  const currentUserId = useHrms((s) => s.currentUserId());
  const reimbursements = useHrms((s) => s.reimbursements);
  const submitExpense = useHrms((s) => s.submitExpense);
  const actOnExpense = useHrms((s) => s.actOnExpense);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: "travel" as ExpenseCategory, amount: "", currency: "$", description: "", date: "", receipt: "" });

  const mine = reimbursements.filter((r) => r.userId === currentUserId);
  const queue = reimbursements.filter((r) => r.userId !== currentUserId && r.status === "pending-approval");

  function submit() {
    if (!form.amount || !form.description || !form.date) return;
    submitExpense({ ...form, amount: Number(form.amount) });
    setForm({ category: "travel", amount: "", currency: "$", description: "", date: "", receipt: "" });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader title="Expenses" subtitle="Claims, receipts & approvals" action={<Button size="sm" onClick={() => setOpen(true)}>+ Claim</Button>} />

      <SectionTitle>My Reimbursements</SectionTitle>
      <div className="space-y-2">
        {mine.length === 0 ? <EmptyState>No claims yet</EmptyState> : null}
        {mine.map((r) => (
          <Card key={r.id}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">{labelize(r.category)} · {money(r.currency, r.amount)}</p>
              <Badge status={r.status}>{labelize(r.status)}</Badge>
            </div>
            <p className="mt-1 text-xs text-slate-600">{r.description}</p>
            <p className="mt-1 text-xs text-slate-400">{r.date} · {r.receipts.length} receipt(s)</p>
            {r.mileage ? <p className="text-xs text-slate-400">Mileage: {r.mileage.distance}km × {r.currency}{r.mileage.ratePerKm}</p> : null}
            <p className={`mt-1 text-xs font-medium ${r.withinPolicy ? "text-green-600" : "text-red-500"}`}>{r.policyNote}</p>
            {r.paidOn ? <p className="text-xs text-slate-400">Paid on {r.paidOn}</p> : null}
          </Card>
        ))}
      </div>

      {canApprove(role) ? (
        <>
          <SectionTitle>Approval Queue</SectionTitle>
          <div className="space-y-2">
            {queue.length === 0 ? <EmptyState>No pending claims</EmptyState> : null}
            {queue.map((r) => {
              const emp = getEmployee(r.userId);
              return (
                <Card key={r.id}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{emp?.name}</p>
                    <span className="text-sm font-bold text-slate-900">{money(r.currency, r.amount)}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{labelize(r.category)} · {r.description}</p>
                  <p className={`mt-1 text-xs font-medium ${r.withinPolicy ? "text-green-600" : "text-red-500"}`}>{r.policyNote}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => actOnExpense(r.id, "approved", "Approved")}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => actOnExpense(r.id, "rejected", "Rejected")}>Reject</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      ) : null}

      <Modal open={open} onClose={() => setOpen(false)} title="New Expense Claim">
        <div className="space-y-3">
          <Field label="Category">
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{labelize(c)}</option>)}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount"><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0" /></Field>
            <Field label="Currency">
              <Select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                <option value="$">$ USD</option>
                <option value="₹">₹ INR</option>
              </Select>
            </Field>
          </div>
          <Field label="Date"><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Description"><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What was this expense for?" /></Field>
          <Field label="Receipt"><Input value={form.receipt} onChange={(e) => setForm({ ...form, receipt: e.target.value })} placeholder="receipt.pdf" /></Field>
          <Row left="Policy check" right={Number(form.amount) <= 500 ? "Within limit" : "Needs review"} />
          <Button className="w-full" onClick={submit}>Submit Claim</Button>
        </div>
      </Modal>
    </div>
  );
}
