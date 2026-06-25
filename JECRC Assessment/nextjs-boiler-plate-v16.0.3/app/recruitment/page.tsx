"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useHrms } from "../../stores/hrmsStore";
import { labelize } from "../../lib/hrms/util";
import { Avatar, Badge, Button, Card, Field, Input, Modal, PageHeader, Row, SectionTitle, Select } from "../../components/hrms/ui";
import { Candidate, CandidateStatus } from "../../lib/hrms/types";

const STATUSES: CandidateStatus[] = ["new", "screening", "shortlisted", "interview-scheduled", "interviewed", "offer-extended", "hired", "rejected"];

export default function RecruitmentPage() {
  const candidates = useHrms((s) => s.candidates);
  const jobPostings = useHrms((s) => s.jobPostings);
  const updateCandidate = useHrms((s) => s.updateCandidate);
  const [open, setOpen] = useState<Candidate | null>(null);
  const [status, setStatus] = useState<CandidateStatus>("new");
  const [date, setDate] = useState("");

  function openCandidate(c: Candidate) {
    setOpen(c);
    setStatus(c.status);
    setDate(c.interviewDate ?? "");
  }

  function save() {
    if (!open) return;
    updateCandidate(open.id, status, date || null);
    setOpen(null);
  }

  return (
    <div>
      <PageHeader title="Recruitment" subtitle="Job postings & candidate pipeline" />

      <SectionTitle>Open Positions</SectionTitle>
      <div className="space-y-2">
        {jobPostings.map((j) => (
          <Card key={j.id}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">{j.title}</p>
              <Badge status={j.status}>{labelize(j.status)}</Badge>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">{j.department} · {j.location} · {j.employmentType}</p>
            <p className="mt-0.5 text-xs text-slate-500">{j.experience} · {j.salaryRange}</p>
            <div className="mt-2 flex gap-2 text-[11px]">
              <Badge>{j.applicants} applied</Badge>
              <Badge status="shortlisted">{j.shortlisted} shortlisted</Badge>
              <Badge status="interview-scheduled">{j.interviewing} interviewing</Badge>
            </div>
          </Card>
        ))}
      </div>

      <SectionTitle>Candidate Pipeline</SectionTitle>
      <div className="space-y-2">
        {candidates.map((c) => (
          <Card key={c.id} className="flex items-center gap-3" >
            <Avatar name={c.name} color="bg-indigo-600" size="sm" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{c.name}</p>
              <p className="text-xs text-slate-500">{c.appliedRole}</p>
              <span className="inline-flex items-center gap-0.5 text-xs text-amber-500"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {c.rating}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge status={c.status}>{labelize(c.status)}</Badge>
              <button className="text-xs font-semibold text-teal-600" onClick={() => openCandidate(c)}>Details</button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} title={open?.name ?? ""}>
        {open ? (
          <div className="space-y-3">
            <Row left="Applied Role" right={open.appliedRole} />
            <Row left="Experience" right={open.experience} />
            <Row left="Expected Salary" right={open.expectedSalary} />
            <Row left="Notice Period" right={open.noticePeriod} />
            <Row left="Rating" right={`${open.rating} / 5`} />
            <div>
              <p className="text-xs font-semibold text-slate-500">Skills</p>
              <div className="mt-1 flex flex-wrap gap-1">{open.skills.map((s) => <Badge key={s}>{s}</Badge>)}</div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Notes</p>
              <p className="text-xs text-slate-600">{open.notes}</p>
            </div>
            <Field label="Update Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value as CandidateStatus)}>
                {STATUSES.map((s) => <option key={s} value={s}>{labelize(s)}</option>)}
              </Select>
            </Field>
            <Field label="Interview Date"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
            <Button className="w-full" onClick={save}>Save Changes</Button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
