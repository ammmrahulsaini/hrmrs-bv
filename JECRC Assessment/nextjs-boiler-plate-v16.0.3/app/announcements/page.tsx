"use client";

import { useState } from "react";
import { Eye, Heart, MessageCircle, CheckCircle2 } from "lucide-react";
import { useHrms } from "../../stores/hrmsStore";
import { canManageContent } from "../../lib/hrms/rbac";
import { labelize } from "../../lib/hrms/util";
import { Badge, Button, Card, Field, Input, Modal, PageHeader, SectionTitle, Select, Textarea } from "../../components/hrms/ui";
import { AnnouncementCategory } from "../../lib/hrms/types";

const CATEGORIES: AnnouncementCategory[] = ["hr-update", "event", "policy", "celebration", "compliance", "general"];

export default function AnnouncementsPage() {
  const role = useHrms((s) => s.role);
  const currentUserId = useHrms((s) => s.currentUserId());
  const announcements = useHrms((s) => s.announcements);
  const acknowledge = useHrms((s) => s.acknowledgeAnnouncement);
  const create = useHrms((s) => s.createAnnouncement);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", category: "general" as AnnouncementCategory, priority: "medium" as "low" | "medium" | "high", content: "", scope: "global" as "global" | "department" | "location", target: "All employees", requiresAck: false });

  function submit() {
    if (!form.title || !form.content) return;
    create(form);
    setForm({ title: "", category: "general", priority: "medium", content: "", scope: "global", target: "All employees", requiresAck: false });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader title="Announcements" subtitle="Company communications" action={canManageContent(role) ? <Button size="sm" onClick={() => setOpen(true)}>+ Create</Button> : undefined} />

      <div className="space-y-2">
        {announcements.map((a) => {
          const acked = a.acknowledgedBy.includes(currentUserId);
          return (
            <Card key={a.id}>
              <div className="mb-1 flex items-center justify-between">
                <Badge status={a.category}>{labelize(a.category)}</Badge>
                <Badge status={a.priority}>{labelize(a.priority)}</Badge>
              </div>
              <p className="text-sm font-semibold text-slate-900">{a.title}</p>
              <p className="mt-1 text-xs text-slate-600">{a.content}</p>
              <p className="mt-1 text-[11px] text-slate-400">{labelize(a.scope)} · {a.target}{a.expiryDate ? ` · Expires ${a.expiryDate}` : ""}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {a.views}</span>
                <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {a.likes}</span>
                <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {a.comments}</span>
                {a.requiresAck ? <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> {a.acknowledgments}</span> : null}
              </div>
              {a.requiresAck ? (
                <div className="mt-3">
                  {acked ? <Badge status="approved">Acknowledged</Badge> : <Button size="sm" onClick={() => acknowledge(a.id)}>Acknowledge</Button>}
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Announcement">
        <div className="space-y-3">
          <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as AnnouncementCategory })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{labelize(c)}</option>)}
              </Select>
            </Field>
            <Field label="Priority">
              <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as "low" | "medium" | "high" })}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Scope">
              <Select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value as "global" | "department" | "location" })}>
                <option value="global">Global</option><option value="department">Department</option><option value="location">Location</option>
              </Select>
            </Field>
            <Field label="Target"><Input value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} /></Field>
          </div>
          <Field label="Content"><Textarea rows={3} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></Field>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.requiresAck} onChange={(e) => setForm({ ...form, requiresAck: e.target.checked })} /> Require acknowledgment
          </label>
          <Button className="w-full" onClick={submit}>Publish Announcement</Button>
        </div>
      </Modal>
    </div>
  );
}
