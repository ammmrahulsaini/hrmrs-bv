"use client";

import { useState } from "react";
import { Award, CheckCircle2, Circle, FileText, PlayCircle, Puzzle, HelpCircle } from "lucide-react";
import { useHrms } from "../../stores/hrmsStore";
import { labelize } from "../../lib/hrms/util";
import { Badge, Button, Card, Modal, PageHeader, Progress, SectionTitle } from "../../components/hrms/ui";
import { TrainingModule } from "../../lib/hrms/types";

const CONTENT_ICON = { video: PlayCircle, document: FileText, quiz: HelpCircle, interactive: Puzzle };

export default function TrainingPage() {
  const currentUserId = useHrms((s) => s.currentUserId());
  const modules = useHrms((s) => s.trainingModules);
  const completeContent = useHrms((s) => s.completeContent);
  const [openId, setOpenId] = useState<string | null>(null);

  const mine = modules.filter((m) => m.userId === currentUserId);
  const selected = mine.find((m) => m.id === openId) ?? null;

  return (
    <div>
      <PageHeader title="Training & Learning" subtitle="Modules, progress & certificates" />

      <SectionTitle>My Modules</SectionTitle>
      <div className="space-y-2">
        {mine.map((m) => (
          <Card key={m.id}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">{m.title}</p>
              {m.mandatory ? <Badge status="high">Mandatory</Badge> : <Badge>Optional</Badge>}
            </div>
            <p className="mt-0.5 text-xs text-slate-500">{labelize(m.category)} · {m.duration} · Due {m.dueDate}</p>
            <div className="mt-2">
              <div className="mb-1 flex justify-between text-xs text-slate-500"><span>{labelize(m.status)}</span><span>{m.progress}%</span></div>
              <Progress value={m.progress} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <Button size="sm" variant="outline" onClick={() => setOpenId(m.id)}>Open module</Button>
              {m.status === "completed" && m.certificateEligible ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600"><Award className="h-4 w-4" /> Certificate earned</span>
              ) : null}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={Boolean(selected)} onClose={() => setOpenId(null)} title={selected?.title ?? ""}>
        {selected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{labelize(selected.category)} · {selected.duration}</span>
              <span>{selected.progress}% complete</span>
            </div>
            <Progress value={selected.progress} />
            <div className="space-y-2">
              {selected.contents.map((c, i) => {
                const Ico = CONTENT_ICON[c.type];
                return (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                    <div className="flex items-center gap-2">
                      <Ico className="h-4 w-4 text-teal-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{c.title}</p>
                        <p className="text-[11px] text-slate-400">{labelize(c.type)}</p>
                      </div>
                    </div>
                    {c.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <button onClick={() => completeContent(selected.id, i)}><Circle className="h-5 w-5 text-slate-300" /></button>
                    )}
                  </div>
                );
              })}
            </div>
            {selected.progress === 100 && selected.certificateEligible ? (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700">
                <Award className="h-5 w-5" /> Certificate issued for this module
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
