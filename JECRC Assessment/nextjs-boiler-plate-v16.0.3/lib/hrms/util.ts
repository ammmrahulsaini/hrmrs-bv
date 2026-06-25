import { useHrms } from "../../stores/hrmsStore";
import { Employee } from "./types";

export function getEmployee(id: string): Employee | undefined {
  return useHrms.getState().employees.find((e) => e.id === id);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function labelize(value: string): string {
  return value
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function money(currency: string, amount: number): string {
  return `${currency}${amount.toLocaleString()}`;
}

const TONES: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  verified: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  paid: "bg-green-100 text-green-700",
  present: "bg-green-100 text-green-700",
  active: "bg-green-100 text-green-700",
  "on-track": "bg-green-100 text-green-700",
  done: "bg-green-100 text-green-700",
  hired: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  "pending-approval": "bg-amber-100 text-amber-700",
  "proposal-pending": "bg-amber-100 text-amber-700",
  "in-progress": "bg-amber-100 text-amber-700",
  submitted: "bg-amber-100 text-amber-700",
  uploaded: "bg-amber-100 text-amber-700",
  processing: "bg-amber-100 text-amber-700",
  late: "bg-amber-100 text-amber-700",
  "half-day": "bg-amber-100 text-amber-700",
  "under-review": "bg-amber-100 text-amber-700",
  screening: "bg-amber-100 text-amber-700",
  "interview-scheduled": "bg-blue-100 text-blue-700",
  interviewed: "bg-blue-100 text-blue-700",
  shortlisted: "bg-blue-100 text-blue-700",
  "offer-extended": "bg-violet-100 text-violet-700",
  rejected: "bg-red-100 text-red-700",
  absent: "bg-red-100 text-red-700",
  missing: "bg-red-100 text-red-700",
  "at-risk": "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
  "not-started": "bg-slate-100 text-slate-600",
  draft: "bg-slate-100 text-slate-600",
  "on-leave": "bg-slate-100 text-slate-600",
  new: "bg-slate-100 text-slate-600",
  open: "bg-teal-100 text-teal-700",
  upcoming: "bg-teal-100 text-teal-700",
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

export function tone(status: string): string {
  return TONES[status] ?? "bg-slate-100 text-slate-600";
}
