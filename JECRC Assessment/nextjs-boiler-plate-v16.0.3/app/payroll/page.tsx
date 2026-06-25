"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useHrms } from "../../stores/hrmsStore";
import { canManageContent } from "../../lib/hrms/rbac";
import { labelize, money } from "../../lib/hrms/util";
import { Badge, Button, Card, EmptyState, Modal, PageHeader, Row, SectionTitle } from "../../components/hrms/ui";
import { PayrollRecord } from "../../lib/hrms/types";

export default function PayrollPage() {
  const role = useHrms((s) => s.role);
  const currentUserId = useHrms((s) => s.currentUserId());
  const payrollRecords = useHrms((s) => s.payrollRecords);
  const mine = payrollRecords.filter((p) => p.userId === currentUserId);
  const [selected, setSelected] = useState<PayrollRecord | null>(null);

  return (
    <div>
      <PageHeader title="Payroll" subtitle="Payslips, deductions & compliance" />

      <SectionTitle>My Payslips</SectionTitle>
      <div className="space-y-2">
        {mine.length === 0 ? <EmptyState>No payslips for this profile. Switch to the Employee role to view Sarah&apos;s payslips.</EmptyState> : null}
        {mine.map((p) => (
          <Card key={p.id} className="flex items-center justify-between" >
            <div>
              <p className="text-sm font-semibold text-slate-900">{p.period}</p>
              <p className="text-xs text-slate-500">Paid {p.payDate} · {p.country}</p>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-teal-600">{money(p.currency, p.net)}</p>
              <button className="text-xs font-semibold text-teal-600" onClick={() => setSelected(p)}>View details</button>
            </div>
          </Card>
        ))}
      </div>

      {canManageContent(role) ? (
        <>
          <SectionTitle>Compliance Dashboard</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3"><p className="text-xs text-slate-500">India · PF / ESI</p><p className="mt-1 text-sm font-semibold text-green-600">On track</p></Card>
            <Card className="p-3"><p className="text-xs text-slate-500">India · Professional Tax</p><p className="mt-1 text-sm font-semibold text-green-600">Filed</p></Card>
            <Card className="p-3"><p className="text-xs text-slate-500">US · Federal Tax</p><p className="mt-1 text-sm font-semibold text-green-600">On track</p></Card>
            <Card className="p-3"><p className="text-xs text-slate-500">US · 401(k)</p><p className="mt-1 text-sm font-semibold text-amber-600">Review due</p></Card>
          </div>
        </>
      ) : null}

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `Payslip · ${selected.period}` : ""}>
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge status={selected.status}>{labelize(selected.status)}</Badge>
              <span className="text-xs text-slate-500">{selected.country} · {selected.currency}</span>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Earnings</p>
              {selected.earnings.map((e) => <Row key={e.label} left={e.label} right={money(selected.currency, e.amount)} />)}
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Deductions</p>
              {selected.deductions.map((e) => <Row key={e.label} left={e.label} right={`- ${money(selected.currency, e.amount)}`} />)}
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Employer Contributions</p>
              {selected.employerContributions.map((e) => <Row key={e.label} left={e.label} right={money(selected.currency, e.amount)} />)}
            </div>
            <div className="space-y-1 border-t border-slate-200 pt-2">
              <Row left="Gross Pay" right={money(selected.currency, selected.gross)} />
              <Row left="Total Deductions" right={`- ${money(selected.currency, selected.totalDeductions)}`} />
              <div className="flex items-center justify-between pt-1 text-base font-bold text-teal-600">
                <span>Net Pay</span><span>{money(selected.currency, selected.net)}</span>
              </div>
            </div>
            <Button className="w-full" onClick={() => window.print()}><Download className="h-4 w-4" /> Download Payslip</Button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
