"use client";

import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { useHrms } from "../../stores/hrmsStore";
import { ROLE_LABELS } from "../../lib/hrms/rbac";

interface ChatMessage {
  from: "user" | "bot";
  text: string;
}

function reply(question: string, role: string, view: string): string {
  const q = question.toLowerCase();
  if (q.includes("leave") || q.includes("vacation")) return "You can apply for leave from the Leave module. Your current casual balance is shown there, and requests route to your manager and HR for approval.";
  if (q.includes("payslip") || q.includes("salary") || q.includes("pay")) return "Your latest payslip is under Payroll. It itemizes earnings, deductions and employer contributions, and you can download it.";
  if (q.includes("clock") || q.includes("attendance")) return "Head to Attendance to clock in or out. Your location and IP are verified automatically when you check in.";
  if (q.includes("expense") || q.includes("reimburse")) return "Submit expenses with receipts from the Expenses module. Policy validation runs automatically and managers approve claims.";
  if (q.includes("onboard")) return "Your onboarding checklist is in the Onboarding module, grouped by phase with an overall progress tracker for your first 90 days.";
  return `I'm your HR Copilot. You're viewing ${view || "Home"} as ${role}. Ask me about leave, payroll, attendance, expenses, training or onboarding and I'll guide you.`;
}

export function Copilot() {
  const [open, setOpen] = useState(false);
  const role = useHrms((s) => s.role);
  const pathname = usePathname();
  const view = pathname?.replace(/^\/(hrms\/)?/, "").replace(/^\//, "") || "Home";
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "bot", text: "Hi! I'm your HR Copilot. How can I help you today?" },
  ]);
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;
    const question = text.trim();
    setMessages((m) => [...m, { from: "user", text: question }, { from: "bot", text: reply(question, ROLE_LABELS[role], view) }]);
    setText("");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-orange-500 text-white shadow-lg"
        aria-label="Open HR Copilot"
      >
        <Bot className="h-6 w-6" />
      </button>

      {open ? (
        <div className="absolute inset-0 z-40 flex flex-col bg-white">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-gradient-to-r from-teal-600 to-orange-500 px-4 py-3 text-white">
            <Sparkles className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-bold">HR Copilot</p>
              <p className="text-xs opacity-90">Context: {view} · {ROLE_LABELS[role]}</p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full px-2 py-1 text-sm hover:bg-white/20">Close</button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === "user" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-800"}`}>{m.text}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-slate-200 p-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about leave, payroll, attendance..."
              className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm outline-none focus:border-teal-500"
            />
            <button onClick={send} className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
