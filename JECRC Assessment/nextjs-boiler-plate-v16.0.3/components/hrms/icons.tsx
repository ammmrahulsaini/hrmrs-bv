"use client";

import {
  Award,
  BarChart3,
  CalendarDays,
  Clock,
  FileText,
  GraduationCap,
  Heart,
  LayoutDashboard,
  LucideIcon,
  Megaphone,
  Receipt,
  Rocket,
  Target,
  UserSearch,
  Users,
  Wallet,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Clock,
  CalendarDays,
  Wallet,
  FileText,
  Receipt,
  Target,
  Award,
  GraduationCap,
  UserSearch,
  Heart,
  Megaphone,
  Users,
  BarChart3,
  Rocket,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = MAP[name] ?? LayoutDashboard;
  return <Cmp className={className} />;
}
