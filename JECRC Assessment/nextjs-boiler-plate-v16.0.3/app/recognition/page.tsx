"use client";

import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { useHrms } from "../../stores/hrmsStore";
import { getEmployee, labelize } from "../../lib/hrms/util";
import { Avatar, Badge, Button, Card, Field, Modal, PageHeader, SectionTitle, Select, Textarea } from "../../components/hrms/ui";
import { RecognitionCategory } from "../../lib/hrms/types";

const CATEGORIES: RecognitionCategory[] = ["excellence", "team-player", "innovation", "leadership", "customer-focus"];

export default function RecognitionPage() {
  const currentUserId = useHrms((s) => s.currentUserId());
  const recognitions = useHrms((s) => s.recognitions);
  const employees = useHrms((s) => s.employees);
  const sendRecognition = useHrms((s) => s.sendRecognition);
  const toggleLike = useHrms((s) => s.toggleLike);

  const [open, setOpen] = useState(false);
  const peers = employees.filter((e) => e.id !== currentUserId);
  const [form, setForm] = useState({ toUserId: peers[0]?.id ?? "", category: "excellence" as RecognitionCategory, message: "", visibility: "public" as "public" | "private" });

  function submit() {
    if (!form.message) return;
    sendRecognition(form);
    setForm({ toUserId: peers[0]?.id ?? "", category: "excellence", message: "", visibility: "public" });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader title="Recognition" subtitle="Celebrate your peers" action={<Button size="sm" onClick={() => setOpen(true)}>+ Recognize</Button>} />

      <SectionTitle>Recognition Feed</SectionTitle>
      <div className="space-y-2">
        {recognitions.map((r) => {
          const from = getEmployee(r.fromUserId);
          const to = getEmployee(r.toUserId);
          return (
            <Card key={r.id}>
              <div className="flex items-center gap-2">
                <Avatar name={from?.name ?? "?"} color={from?.avatarColor} size="sm" />
                <div className="flex-1 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">{from?.name}</span> recognized <span className="font-semibold text-slate-800">{to?.name}</span>
                </div>
                <Badge status={r.category}>{labelize(r.category)}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-700">{r.message}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                <button onClick={() => toggleLike(r.id)} className={`inline-flex items-center gap-1 ${r.likedByMe ? "text-red-500" : ""}`}>
                  <Heart className={`h-4 w-4 ${r.likedByMe ? "fill-red-500" : ""}`} /> {r.likes}
                </button>
                <span className="inline-flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {r.comments}</span>
                {r.visibility === "private" ? <Badge>Private</Badge> : null}
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Send Recognition">
        <div className="space-y-3">
          <Field label="Recognize">
            <Select value={form.toUserId} onChange={(e) => setForm({ ...form, toUserId: e.target.value })}>
              {peers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </Field>
          <Field label="Category">
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as RecognitionCategory })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{labelize(c)}</option>)}
            </Select>
          </Field>
          <Field label="Message"><Textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Say something nice..." /></Field>
          <Field label="Visibility">
            <Select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as "public" | "private" })}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </Select>
          </Field>
          <Button className="w-full" onClick={submit}>Send Recognition</Button>
        </div>
      </Modal>
    </div>
  );
}
