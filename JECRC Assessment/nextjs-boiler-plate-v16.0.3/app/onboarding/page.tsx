"use client";

import { useState } from "react";
import { CheckCircle2, Circle, PlayCircle, Plane } from "lucide-react";
import { useHrms } from "../../stores/hrmsStore";
import { getEmployee, labelize } from "../../lib/hrms/util";
import { Avatar, Badge, Button, Card, PageHeader, Progress, Row, SectionTitle } from "../../components/hrms/ui";
import { OnboardingPhase } from "../../lib/hrms/types";

const PHASES: OnboardingPhase[] = ["pre-joining", "day-1", "week-1", "week-2", "month-1"];

export default function OnboardingPage() {
  const tasks = useHrms((s) => s.onboardingTasks);
  const completeTask = useHrms((s) => s.completeTask);
  const welcomeMessages = useHrms((s) => s.welcomeMessages);
  const relocation = useHrms((s) => s.relocation);
  const teamIntros = useHrms((s) => s.teamIntros);
  const milestones = useHrms((s) => s.milestones);
  const newJoiner = useHrms((s) => s.newJoiner);
  const [done, setDone] = useState(false);

  const completed = tasks.filter((t) => t.status === "completed").length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-xl font-bold text-slate-900">Onboarding Complete!</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome aboard. You now have the standard employee experience.</p>
        <Button className="mt-6" onClick={() => setDone(false)}>Back to checklist</Button>
      </div>
    );
  }

  if (!newJoiner || !relocation) return null;

  return (
    <div>
      <PageHeader title="Onboarding" subtitle={`First 90 days · ${newJoiner.name}`} />

      <Card className="bg-gradient-to-br from-orange-500 to-orange-400 text-white">
        <p className="text-lg font-bold">{newJoiner.name}</p>
        <p className="text-sm opacity-90">{newJoiner.designation} · {newJoiner.department}</p>
        <div className="mt-2 grid grid-cols-2 gap-1 text-xs opacity-90">
          <span>Manager: {newJoiner.manager}</span>
          <span>Buddy: {newJoiner.buddy}</span>
          <span>Joining: {newJoiner.joiningDate}</span>
        </div>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs"><span>Overall progress</span><span>{progress}%</span></div>
          <Progress value={progress} tone="bg-white" />
        </div>
      </Card>

      {PHASES.map((phase) => {
        const phaseTasks = tasks.filter((t) => t.phase === phase);
        if (phaseTasks.length === 0) return null;
        return (
          <div key={phase}>
            <SectionTitle>{labelize(phase)}</SectionTitle>
            <div className="space-y-2">
              {phaseTasks.map((t) => (
                <Card key={t.id} className="flex items-start gap-3">
                  <button onClick={() => completeTask(t.id)} className="mt-0.5">
                    {t.status === "completed" ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${t.status === "completed" ? "text-slate-400 line-through" : "text-slate-900"}`}>{t.title}</p>
                      <Badge status={t.priority}>{labelize(t.priority)}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">{t.description}</p>
                    <p className="text-[11px] text-slate-400">Due {t.dueDate} · {t.assignee}{t.completedDate ? ` · Done ${t.completedDate}` : ""}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      <SectionTitle>Welcome Messages</SectionTitle>
      <div className="space-y-2">
        {welcomeMessages.map((w) => (
          <Card key={w.id} className="flex items-start gap-3">
            <Avatar name={w.from} color="bg-teal-600" size="sm" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{w.from} <span className="text-xs font-normal text-slate-400">· {w.role}</span></p>
              <p className="text-xs text-slate-600">{w.message}</p>
              {w.hasVideo ? <button className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-teal-600"><PlayCircle className="h-3.5 w-3.5" /> Play video</button> : null}
            </div>
          </Card>
        ))}
      </div>

      <SectionTitle>Relocation Support</SectionTitle>
      <Card>
        <div className="mb-2 flex items-center gap-2 text-teal-600"><Plane className="h-4 w-4" /><span className="text-sm font-semibold">{relocation.relocationStatus}</span></div>
        <Row left="Visa" right={relocation.visaStatus} />
        <Row left="Accommodation" right={relocation.accommodation} />
        <Row left="Travel" right={relocation.travel} />
        <Row left="Allowance" right={relocation.allowance} />
        <Row left="Local Buddy" right={relocation.localBuddy} />
        <div className="mt-2 border-t border-slate-100 pt-2">
          {relocation.tickets.map((t) => <Row key={t.id} left={t.title} right={<Badge status={t.status}>{labelize(t.status)}</Badge>} />)}
        </div>
      </Card>

      <SectionTitle>Meet Your Team</SectionTitle>
      <div className="space-y-2">
        {teamIntros.map((m) => {
          const emp = getEmployee(m.memberId);
          return (
            <Card key={m.memberId} className="flex items-start gap-3">
              <Avatar name={emp?.name ?? "?"} color={emp?.avatarColor} size="sm" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{emp?.name}</p>
                <p className="text-xs text-slate-600">{m.bio}</p>
                <p className="mt-1 text-[11px] text-slate-400">Expertise: {m.expertise.join(", ")}</p>
                <p className="text-[11px] text-slate-400">Fun: {m.funFacts.join(", ")}</p>
              </div>
              {m.introduced ? <Badge status="done">Met</Badge> : <Badge status="pending">Pending</Badge>}
            </Card>
          );
        })}
      </div>

      <SectionTitle>Milestones</SectionTitle>
      <div className="space-y-2">
        {milestones.map((m) => (
          <Card key={m.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{m.title}</p>
              <p className="text-xs text-slate-500">{m.date} · {labelize(m.type)}</p>
            </div>
            <Badge status={m.status}>{labelize(m.status)}</Badge>
          </Card>
        ))}
      </div>

      <Button className="mt-5 w-full" onClick={() => setDone(true)}>Mark Onboarding Complete</Button>
    </div>
  );
}
