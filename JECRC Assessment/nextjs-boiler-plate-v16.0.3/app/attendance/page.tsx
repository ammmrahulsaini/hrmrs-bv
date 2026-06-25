"use client";

import { useState } from "react";
import { MapPin, ShieldCheck, Camera } from "lucide-react";
import { useHrms } from "../../stores/hrmsStore";
import { canApprove } from "../../lib/hrms/rbac";
import { getEmployee, labelize } from "../../lib/hrms/util";
import { Badge, Button, Card, EmptyState, Modal, PageHeader, SectionTitle, Stat } from "../../components/hrms/ui";
import { AttendanceRecord } from "../../lib/hrms/types";

const METHODS: AttendanceRecord["method"][] = ["selfie", "geolocation", "ip", "biometric", "manual"];

export default function AttendancePage() {
  const role = useHrms((s) => s.role);
  const currentUserId = useHrms((s) => s.currentUserId());
  const attendance = useHrms((s) => s.attendance);
  const shifts = useHrms((s) => s.shifts);
  const clockIn = useHrms((s) => s.clockIn);
  const clockOut = useHrms((s) => s.clockOut);

  const [modal, setModal] = useState(false);
  const [method, setMethod] = useState<AttendanceRecord["method"]>("selfie");

  const clockedInAt = attendance.find((a) => a.userId === currentUserId && !a.clockOut)?.clockIn ?? null;
  const mine = attendance.filter((a) => a.userId === currentUserId);
  const latest = mine[0];
  const team = attendance.filter((a) => a.userId !== currentUserId);

  function confirmClockIn() {
    clockIn(method);
    setModal(false);
  }

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Time capture, shifts & overtime" />

      <Card className="bg-gradient-to-br from-teal-600 to-teal-500 text-white">
        <p className="text-xs uppercase tracking-wide opacity-90">Today</p>
        <p className="mt-1 text-2xl font-bold">{clockedInAt ? `Clocked in at ${clockedInAt}` : "Not clocked in"}</p>
        {clockedInAt ? (
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Location verified</span>
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> IP validated</span>
          </div>
        ) : null}
        <div className="mt-4">
          {clockedInAt ? (
            <Button variant="secondary" onClick={clockOut}>Clock Out</Button>
          ) : (
            <Button variant="secondary" onClick={() => setModal(true)}><Camera className="h-4 w-4" /> Clock In</Button>
          )}
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat label="Total Hours" value={latest ? `${latest.totalHours}h` : "0h"} />
        <Stat label="Productive" value={latest ? `${latest.productiveHours}h` : "0h"} />
        <Stat label="Break" value={latest ? `${latest.breakHours}h` : "0h"} />
        <Stat label="Overtime" value={latest ? `${latest.overtimeHours}h` : "0h"} tone="text-orange-600" />
      </div>

      <SectionTitle>Shift Calendar</SectionTitle>
      <div className="space-y-2">
        {shifts.map((s) => (
          <Card key={s.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{s.name} Shift</p>
              <p className="text-xs text-slate-500">{s.start} - {s.end}</p>
            </div>
            {s.current ? <Badge status="active">Current</Badge> : null}
          </Card>
        ))}
      </div>

      <SectionTitle>My Records</SectionTitle>
      <div className="space-y-2">
        {mine.map((a) => (
          <Card key={a.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{a.date}</p>
              <p className="text-xs text-slate-500">{a.clockIn ?? "--"} - {a.clockOut ?? "--"} · {labelize(a.method)}</p>
            </div>
            <Badge status={a.status}>{labelize(a.status)}</Badge>
          </Card>
        ))}
      </div>

      {canApprove(role) ? (
        <>
          <SectionTitle>Team Attendance & Exceptions</SectionTitle>
          <div className="space-y-2">
            {team.length === 0 ? <EmptyState>No team records</EmptyState> : null}
            {team.map((a) => {
              const emp = getEmployee(a.userId);
              return (
                <Card key={a.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{emp?.name}</p>
                    <p className="text-xs text-slate-500">{a.date} · {a.clockIn ?? "--"} - {a.clockOut ?? "--"}</p>
                    {a.exception ? <p className="text-xs font-medium text-red-500">{a.exception}</p> : null}
                  </div>
                  <Badge status={a.status}>{labelize(a.status)}</Badge>
                </Card>
              );
            })}
          </div>
        </>
      ) : null}

      <Modal open={modal} onClose={() => setModal(false)} title="Clock In">
        <p className="mb-2 text-sm text-slate-600">Select verification method</p>
        <div className="grid grid-cols-2 gap-2">
          {METHODS.map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`rounded-xl border px-3 py-2 text-sm font-medium ${method === m ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-600"}`}
            >
              {labelize(m)}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          <ShieldCheck className="h-4 w-4 text-green-600" /> Location verified · IP validated
        </div>
        <Button className="mt-4 w-full" onClick={confirmClockIn}>Confirm Clock In</Button>
      </Modal>
    </div>
  );
}
