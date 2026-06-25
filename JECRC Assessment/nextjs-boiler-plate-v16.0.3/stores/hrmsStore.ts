import { create } from "zustand";
import { loadAll, mutations, refreshers } from "../lib/hrms/api";
import {
  Announcement, AnnouncementCategory, AttendanceRecord, Candidate, CandidateStatus,
  ContributionItem, Employee, EmployeeDocument, ExpenseCategory, Goal, LeaderboardEntry,
  LeaveBalance, LeaveRequest, LeaveType, NewJoiner, OnboardingMilestone, OnboardingTask,
  PayrollRecord, PerformanceReview, Recognition, RecognitionCategory, RelocationSupport,
  Reimbursement, RequestStatus, Role, Shift, TeamIntroduction, TrainingModule, ValueContribution,
  WelcomeMessage,
} from "../lib/hrms/types";

const ROLE_USER: Record<Role, string> = { employee: "e1", manager: "m1", hr: "h1", admin: "a1" };

interface HrmsState {
  role: Role;
  setRole: (role: Role) => void;
  currentUserId: () => string;
  hydrated: boolean;
  hydrate: () => Promise<void>;

  employees: Employee[];
  shifts: Shift[];
  attendance: AttendanceRecord[];
  leaveBalances: LeaveBalance[];
  leaveRequests: LeaveRequest[];
  payrollRecords: PayrollRecord[];
  documents: EmployeeDocument[];
  reimbursements: Reimbursement[];
  goals: Goal[];
  reviews: PerformanceReview[];
  contributions: ValueContribution[];
  contributionItems: ContributionItem[];
  leaderboard: LeaderboardEntry[];
  trainingModules: TrainingModule[];
  jobPostings: any[];
  candidates: Candidate[];
  recognitions: Recognition[];
  announcements: Announcement[];
  onboardingTasks: OnboardingTask[];
  welcomeMessages: WelcomeMessage[];
  relocation: RelocationSupport | null;
  teamIntros: TeamIntroduction[];
  milestones: OnboardingMilestone[];
  newJoiner: NewJoiner | null;

  clockIn: (method: AttendanceRecord["method"]) => Promise<void>;
  clockOut: () => Promise<void>;
  submitLeave: (input: { type: LeaveType; startDate: string; endDate: string; totalDays: number; reason: string }) => Promise<void>;
  actOnLeave: (id: string, level: string, decision: RequestStatus, comment: string) => Promise<void>;
  submitExpense: (input: { category: ExpenseCategory; amount: number; currency: string; description: string; date: string; receipt: string }) => Promise<void>;
  actOnExpense: (id: string, decision: RequestStatus, comment: string) => Promise<void>;
  uploadDocument: (id: string) => Promise<void>;
  reviewDocument: (id: string, decision: "verified" | "rejected", reason: string) => Promise<void>;
  claimItem: (id: string) => Promise<void>;
  approveContribution: (id: string, points: number, comment: string) => Promise<void>;
  completeContent: (moduleId: string, index: number) => Promise<void>;
  updateCandidate: (id: string, status: CandidateStatus, interviewDate: string | null) => Promise<void>;
  sendRecognition: (input: { toUserId: string; category: RecognitionCategory; message: string; visibility: "public" | "private" }) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  createAnnouncement: (input: { title: string; category: AnnouncementCategory; priority: "low" | "medium" | "high"; content: string; scope: "global" | "department" | "location"; target: string; requiresAck: boolean }) => Promise<void>;
  acknowledgeAnnouncement: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
}

async function refresh(keys: string[], set: (partial: Partial<HrmsState>) => void) {
  const entries = await Promise.all(keys.map(async (k) => [k, await refreshers[k]()] as const));
  const update: Record<string, unknown> = {};
  for (const [k, v] of entries) update[k] = v;
  set(update as Partial<HrmsState>);
}

export const useHrms = create<HrmsState>((set, get) => ({
  role: "employee",
  setRole: (role) => set({ role }),
  currentUserId: () => ROLE_USER[get().role],
  hydrated: false,
  hydrate: async () => {
    const data = await loadAll();
    set({ ...(data as unknown as Partial<HrmsState>), hydrated: true });
  },

  employees: [],
  shifts: [],
  attendance: [],
  leaveBalances: [],
  leaveRequests: [],
  payrollRecords: [],
  documents: [],
  reimbursements: [],
  goals: [],
  reviews: [],
  contributions: [],
  contributionItems: [],
  leaderboard: [],
  trainingModules: [],
  jobPostings: [],
  candidates: [],
  recognitions: [],
  announcements: [],
  onboardingTasks: [],
  welcomeMessages: [],
  relocation: null,
  teamIntros: [],
  milestones: [],
  newJoiner: null,

  clockIn: async (method) => { await mutations.clockIn(get().currentUserId(), method); await refresh(["attendance"], set); },
  clockOut: async () => { await mutations.clockOut(get().currentUserId()); await refresh(["attendance"], set); },
  submitLeave: async (input) => { await mutations.submitLeave({ userId: get().currentUserId(), ...input }); await refresh(["leaveRequests", "leaveBalances"], set); },
  actOnLeave: async (id, level, decision, comment) => { await mutations.actOnLeave(id, level, decision, comment); await refresh(["leaveRequests"], set); },
  submitExpense: async (input) => { await mutations.submitExpense({ userId: get().currentUserId(), ...input }); await refresh(["reimbursements"], set); },
  actOnExpense: async (id, decision, comment) => { await mutations.actOnExpense(id, decision, comment); await refresh(["reimbursements"], set); },
  uploadDocument: async (id) => { await mutations.uploadDocument(id); await refresh(["documents"], set); },
  reviewDocument: async (id, decision, reason) => { await mutations.reviewDocument(id, decision, reason); await refresh(["documents"], set); },
  claimItem: async (id) => { await mutations.claimItem(id, get().currentUserId()); await refresh(["contributionItems"], set); },
  approveContribution: async (id, points, comment) => { await mutations.approveContribution(id, points, comment); await refresh(["contributions"], set); },
  completeContent: async (moduleId, index) => { await mutations.completeContent(moduleId, index); await refresh(["trainingModules"], set); },
  updateCandidate: async (id, status, interviewDate) => { await mutations.updateCandidate(id, status, interviewDate); await refresh(["candidates"], set); },
  sendRecognition: async (input) => { await mutations.sendRecognition({ fromUserId: get().currentUserId(), ...input }); await refresh(["recognitions"], set); },
  toggleLike: async (id) => {
    const next = get().recognitions.map((r) => (r.id === id ? { ...r, likedByMe: !r.likedByMe, likes: r.likedByMe ? r.likes - 1 : r.likes + 1 } : r));
    const liked = next.find((r) => r.id === id)?.likedByMe ?? false;
    set({ recognitions: next });
    await mutations.toggleLike(id, liked);
  },
  createAnnouncement: async (input) => { await mutations.createAnnouncement({ ...input, authorId: get().currentUserId() }); await refresh(["announcements"], set); },
  acknowledgeAnnouncement: async (id) => { await mutations.acknowledgeAnnouncement(id, get().currentUserId()); await refresh(["announcements"], set); },
  completeTask: async (id) => { await mutations.completeTask(id); await refresh(["onboardingTasks"], set); },
}));
