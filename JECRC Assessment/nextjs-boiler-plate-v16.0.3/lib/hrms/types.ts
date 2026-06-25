export type Role = "employee" | "manager" | "hr" | "admin";

export type Country = "IN" | "US";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: Role;
  designation: string;
  department: string;
  managerId: string | null;
  reportingManagerId: string | null;
  country: Country;
  location: string;
  joiningDate: string;
  status: "active" | "on-leave" | "probation";
  avatarColor: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "half-day" | "on-leave";

export interface Shift {
  id: string;
  name: string;
  start: string;
  end: string;
  current: boolean;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  status: AttendanceStatus;
  method: "selfie" | "geolocation" | "ip" | "biometric" | "manual";
  locationVerified: boolean;
  ipValidated: boolean;
  totalHours: number;
  productiveHours: number;
  breakHours: number;
  overtimeHours: number;
  exception: string | null;
}

export type LeaveType =
  | "casual"
  | "sick"
  | "personal"
  | "maternity"
  | "paternity"
  | "leave-without-pay"
  | "comp-off";

export interface LeaveBalance {
  userId: string;
  type: LeaveType;
  total: number;
  used: number;
  pending: number;
  available: number;
  carriedForward: number;
  encashed: number;
}

export type RequestStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface ApprovalStep {
  level: string;
  approver: string;
  status: RequestStatus;
  comment: string | null;
  actedOn: string | null;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: RequestStatus;
  appliedOn: string;
  approvals: ApprovalStep[];
}

export interface PayComponent {
  label: string;
  amount: number;
}

export type PayrollStatus = "draft" | "processing" | "approved" | "paid";

export interface PayrollRecord {
  id: string;
  userId: string;
  period: string;
  payDate: string;
  country: Country;
  currency: string;
  earnings: PayComponent[];
  deductions: PayComponent[];
  employerContributions: PayComponent[];
  gross: number;
  totalDeductions: number;
  net: number;
  status: PayrollStatus;
}

export type DocumentCategory = "identity" | "employment" | "work-auth" | "tax" | "education" | "other";

export type DocumentStatus = "missing" | "uploaded" | "verified" | "rejected";

export interface EmployeeDocument {
  id: string;
  userId: string;
  name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  fileType: string;
  size: string;
  uploadedOn: string | null;
  verifiedOn: string | null;
  expiryDate: string | null;
  rejectionReason: string | null;
}

export type ExpenseCategory =
  | "travel"
  | "food"
  | "accommodation"
  | "communication"
  | "medical"
  | "office-supplies"
  | "other";

export type ExpenseStatus = "draft" | "submitted" | "pending-approval" | "approved" | "rejected" | "paid";

export interface Mileage {
  distance: number;
  from: string;
  to: string;
  vehicle: string;
  ratePerKm: number;
}

export interface Reimbursement {
  id: string;
  userId: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  description: string;
  date: string;
  receipts: string[];
  mileage: Mileage | null;
  taxable: boolean;
  withinPolicy: boolean;
  policyNote: string;
  status: ExpenseStatus;
  paidOn: string | null;
  approvals: ApprovalStep[];
}

export type GoalCategory = "individual" | "team" | "departmental" | "organizational";
export type GoalType = "quarterly" | "annual" | "project";
export type GoalStatus = "not-started" | "in-progress" | "on-track" | "at-risk" | "completed" | "cancelled";

export interface KeyResult {
  title: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: GoalCategory;
  type: GoalType;
  weight: number;
  dueDate: string;
  status: GoalStatus;
  progress: number;
  keyResults: KeyResult[];
}

export interface CategoryRating {
  category: string;
  rating: number;
}

export interface PerformanceReview {
  id: string;
  userId: string;
  period: string;
  type: "quarterly" | "annual" | "probation" | "project" | "360-degree";
  overallRating: number;
  categoryRatings: CategoryRating[];
  strengths: string[];
  improvements: string[];
  goalsAchieved: number;
  goalsTotal: number;
  recommendations: string;
  comments: string;
}

export type ContributionType = "self-initiated" | "committed" | "assigned";
export type ContributionCategory =
  | "innovation"
  | "process-improvement"
  | "cost-saving"
  | "revenue-generation"
  | "quality"
  | "customer-satisfaction"
  | "team-building"
  | "other";
export type ContributionStatus =
  | "draft"
  | "proposal-pending"
  | "approved-to-start"
  | "in-progress"
  | "under-review"
  | "completed"
  | "rejected";

export interface ValueContribution {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: ContributionType;
  category: ContributionCategory;
  points: number;
  suggestedPoints: number;
  impact: "low" | "medium" | "high";
  status: ContributionStatus;
  tags: string[];
  approvals: ApprovalStep[];
}

export interface ContributionItem {
  id: string;
  title: string;
  category: ContributionCategory;
  suggestedPoints: number;
  claimedBy: string | null;
}

export interface LeaderboardEntry {
  userId: string;
  points: number;
  badges: string[];
  avgRating: number;
}

export type TrainingCategory = "orientation" | "technical" | "compliance" | "soft-skills" | "product";
export type TrainingStatus = "not-started" | "in-progress" | "completed";

export interface TrainingContent {
  title: string;
  type: "video" | "document" | "quiz" | "interactive";
  completed: boolean;
}

export interface TrainingModule {
  id: string;
  userId: string;
  title: string;
  category: TrainingCategory;
  duration: string;
  dueDate: string;
  mandatory: boolean;
  status: TrainingStatus;
  progress: number;
  certificateEligible: boolean;
  contents: TrainingContent[];
}

export type CandidateStatus =
  | "new"
  | "screening"
  | "shortlisted"
  | "interview-scheduled"
  | "interviewed"
  | "offer-extended"
  | "hired"
  | "rejected";

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
  salaryRange: string;
  requirements: string[];
  responsibilities: string[];
  status: "open" | "closed";
  applicants: number;
  shortlisted: number;
  interviewing: number;
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  appliedRole: string;
  status: CandidateStatus;
  rating: number;
  skills: string[];
  experience: string;
  expectedSalary: string;
  noticePeriod: string;
  notes: string;
  interviewDate: string | null;
}

export type RecognitionCategory = "excellence" | "team-player" | "innovation" | "leadership" | "customer-focus";

export interface Recognition {
  id: string;
  fromUserId: string;
  toUserId: string;
  category: RecognitionCategory;
  message: string;
  visibility: "public" | "private";
  likes: number;
  comments: number;
  likedByMe: boolean;
  createdOn: string;
}

export type AnnouncementCategory = "hr-update" | "event" | "policy" | "celebration" | "compliance" | "general";

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  priority: "low" | "medium" | "high";
  content: string;
  scope: "global" | "department" | "location";
  target: string;
  attachments: string[];
  expiryDate: string | null;
  views: number;
  likes: number;
  acknowledgments: number;
  comments: number;
  requiresAck: boolean;
  acknowledgedBy: string[];
  createdOn: string;
  authorId: string;
}

export type OnboardingPhase = "pre-joining" | "day-1" | "week-1" | "week-2" | "month-1";

export interface OnboardingTask {
  id: string;
  phase: OnboardingPhase;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  assignee: string;
  status: "pending" | "completed";
  completedDate: string | null;
}

export interface WelcomeMessage {
  id: string;
  from: string;
  role: string;
  message: string;
  hasVideo: boolean;
}

export interface RelocationTicket {
  id: string;
  title: string;
  status: "open" | "in-progress" | "resolved";
}

export interface RelocationSupport {
  relocationStatus: string;
  visaStatus: string;
  accommodation: string;
  travel: string;
  allowance: string;
  localBuddy: string;
  tickets: RelocationTicket[];
}

export interface TeamIntroduction {
  memberId: string;
  bio: string;
  expertise: string[];
  funFacts: string[];
  introduced: boolean;
  welcomed: boolean;
}

export interface OnboardingMilestone {
  id: string;
  title: string;
  date: string;
  type: "check-in" | "review" | "celebration";
  status: "upcoming" | "done";
}

export interface NewJoiner {
  id: string;
  name: string;
  designation: string;
  department: string;
  manager: string;
  buddy: string;
  joiningDate: string;
}
