import {
  Announcement,
  AttendanceRecord,
  Candidate,
  ContributionItem,
  EmployeeDocument,
  Employee,
  Goal,
  JobPosting,
  LeaderboardEntry,
  LeaveBalance,
  LeaveRequest,
  NewJoiner,
  OnboardingMilestone,
  OnboardingTask,
  PayrollRecord,
  PerformanceReview,
  Recognition,
  Reimbursement,
  RelocationSupport,
  Role,
  Shift,
  TeamIntroduction,
  TrainingModule,
  ValueContribution,
  WelcomeMessage,
} from "./types";

export const employees: Employee[] = [
  { id: "e1", name: "Sarah Chen", email: "sarah.chen@workflow.com", role: "employee", designation: "Software Engineer", department: "Engineering", managerId: "m1", reportingManagerId: "m1", country: "US", location: "San Francisco, CA", joiningDate: "2023-04-12", status: "active", avatarColor: "bg-teal-600" },
  { id: "e2", name: "Raj Patel", email: "raj.patel@workflow.com", role: "employee", designation: "Frontend Engineer", department: "Engineering", managerId: "m1", reportingManagerId: "m1", country: "IN", location: "Bengaluru, KA", joiningDate: "2022-09-01", status: "active", avatarColor: "bg-indigo-600" },
  { id: "e3", name: "Emily Davis", email: "emily.davis@workflow.com", role: "employee", designation: "QA Engineer", department: "Engineering", managerId: "m1", reportingManagerId: "m1", country: "US", location: "Austin, TX", joiningDate: "2024-01-15", status: "active", avatarColor: "bg-rose-600" },
  { id: "e4", name: "Carlos Mendez", email: "carlos.mendez@workflow.com", role: "employee", designation: "Backend Engineer", department: "Engineering", managerId: "m1", reportingManagerId: "m1", country: "US", location: "Remote", joiningDate: "2023-11-20", status: "on-leave", avatarColor: "bg-amber-600" },
  { id: "m1", name: "Michael Torres", email: "michael.torres@workflow.com", role: "manager", designation: "Engineering Manager", department: "Engineering", managerId: "a1", reportingManagerId: "a1", country: "US", location: "San Francisco, CA", joiningDate: "2020-06-03", status: "active", avatarColor: "bg-orange-600" },
  { id: "h1", name: "Priya Sharma", email: "priya.sharma@workflow.com", role: "hr", designation: "HR Specialist", department: "People Operations", managerId: "a1", reportingManagerId: "a1", country: "IN", location: "Mumbai, MH", joiningDate: "2021-02-18", status: "active", avatarColor: "bg-fuchsia-600" },
  { id: "a1", name: "Aisha Khan", email: "aisha.khan@workflow.com", role: "admin", designation: "System Administrator", department: "IT", managerId: null, reportingManagerId: null, country: "IN", location: "Mumbai, MH", joiningDate: "2019-08-09", status: "active", avatarColor: "bg-slate-700" },
];

export const currentUserByRole: Record<Role, string> = {
  employee: "e1",
  manager: "m1",
  hr: "h1",
  admin: "a1",
};

export const shifts: Shift[] = [
  { id: "s1", name: "Morning", start: "09:00", end: "18:00", current: true },
  { id: "s2", name: "Mid", start: "12:00", end: "21:00", current: false },
  { id: "s3", name: "Night", start: "21:00", end: "06:00", current: false },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: "att1", userId: "e1", date: "2026-06-22", clockIn: "09:04", clockOut: "18:12", status: "present", method: "selfie", locationVerified: true, ipValidated: true, totalHours: 9.1, productiveHours: 8.0, breakHours: 1.1, overtimeHours: 0.2, exception: null },
  { id: "att2", userId: "e1", date: "2026-06-23", clockIn: "09:36", clockOut: "18:30", status: "late", method: "geolocation", locationVerified: true, ipValidated: true, totalHours: 8.9, productiveHours: 7.6, breakHours: 1.3, overtimeHours: 0, exception: "Late arrival" },
  { id: "att3", userId: "e1", date: "2026-06-24", clockIn: "08:58", clockOut: "19:05", status: "present", method: "selfie", locationVerified: true, ipValidated: true, totalHours: 10.1, productiveHours: 8.4, breakHours: 1.0, overtimeHours: 1.1, exception: null },
  { id: "att4", userId: "e2", date: "2026-06-24", clockIn: "09:10", clockOut: "18:00", status: "present", method: "biometric", locationVerified: true, ipValidated: false, totalHours: 8.8, productiveHours: 7.9, breakHours: 0.9, overtimeHours: 0, exception: "IP not validated" },
  { id: "att5", userId: "e3", date: "2026-06-24", clockIn: "13:20", clockOut: "18:00", status: "half-day", method: "manual", locationVerified: false, ipValidated: true, totalHours: 4.6, productiveHours: 4.2, breakHours: 0.4, overtimeHours: 0, exception: "Half day" },
];

export const leaveBalances: LeaveBalance[] = [
  { userId: "e1", type: "casual", total: 12, used: 4, pending: 1, available: 7, carriedForward: 2, encashed: 0 },
  { userId: "e1", type: "sick", total: 10, used: 2, pending: 0, available: 8, carriedForward: 0, encashed: 0 },
  { userId: "e1", type: "personal", total: 6, used: 1, pending: 0, available: 5, carriedForward: 0, encashed: 0 },
  { userId: "e1", type: "comp-off", total: 3, used: 0, pending: 0, available: 3, carriedForward: 1, encashed: 1 },
];

export const leaveRequests: LeaveRequest[] = [
  { id: "lv1", userId: "e1", type: "casual", startDate: "2026-07-02", endDate: "2026-07-03", totalDays: 2, reason: "Family function", status: "pending", appliedOn: "2026-06-20", approvals: [{ level: "Manager", approver: "Michael Torres", status: "pending", comment: null, actedOn: null }, { level: "HR", approver: "Priya Sharma", status: "pending", comment: null, actedOn: null }] },
  { id: "lv2", userId: "e1", type: "sick", startDate: "2026-05-14", endDate: "2026-05-14", totalDays: 1, reason: "Fever", status: "approved", appliedOn: "2026-05-13", approvals: [{ level: "Manager", approver: "Michael Torres", status: "approved", comment: "Take care", actedOn: "2026-05-13" }] },
  { id: "lv3", userId: "e2", type: "casual", startDate: "2026-06-30", endDate: "2026-07-01", totalDays: 2, reason: "Personal travel", status: "pending", appliedOn: "2026-06-21", approvals: [{ level: "Manager", approver: "Michael Torres", status: "pending", comment: null, actedOn: null }] },
  { id: "lv4", userId: "e3", type: "personal", startDate: "2026-07-05", endDate: "2026-07-05", totalDays: 1, reason: "Bank work", status: "pending", appliedOn: "2026-06-22", approvals: [{ level: "Manager", approver: "Michael Torres", status: "pending", comment: null, actedOn: null }] },
];

export const payrollRecords: PayrollRecord[] = [
  {
    id: "pay1", userId: "e1", period: "May 2026", payDate: "2026-05-31", country: "US", currency: "$", status: "paid",
    earnings: [{ label: "Basic", amount: 6500 }, { label: "Special Allowance", amount: 1800 }, { label: "Bonus", amount: 500 }, { label: "Overtime", amount: 220 }],
    deductions: [{ label: "Income Tax", amount: 1650 }, { label: "Health Insurance", amount: 240 }, { label: "401(k)", amount: 520 }],
    employerContributions: [{ label: "401(k) Match", amount: 390 }, { label: "Medicare", amount: 130 }],
    gross: 9020, totalDeductions: 2410, net: 6610,
  },
  {
    id: "pay2", userId: "e1", period: "April 2026", payDate: "2026-04-30", country: "US", currency: "$", status: "paid",
    earnings: [{ label: "Basic", amount: 6500 }, { label: "Special Allowance", amount: 1800 }, { label: "Bonus", amount: 0 }, { label: "Overtime", amount: 95 }],
    deductions: [{ label: "Income Tax", amount: 1580 }, { label: "Health Insurance", amount: 240 }, { label: "401(k)", amount: 520 }],
    employerContributions: [{ label: "401(k) Match", amount: 390 }, { label: "Medicare", amount: 125 }],
    gross: 8395, totalDeductions: 2340, net: 6055,
  },
  {
    id: "pay3", userId: "e2", period: "May 2026", payDate: "2026-05-31", country: "IN", currency: "₹", status: "paid",
    earnings: [{ label: "Basic", amount: 60000 }, { label: "HRA", amount: 24000 }, { label: "Special Allowance", amount: 16000 }],
    deductions: [{ label: "PF", amount: 7200 }, { label: "Professional Tax", amount: 200 }, { label: "Income Tax", amount: 9800 }, { label: "ESI", amount: 750 }],
    employerContributions: [{ label: "PF", amount: 7200 }, { label: "ESI", amount: 2600 }, { label: "Gratuity", amount: 2885 }],
    gross: 100000, totalDeductions: 17950, net: 82050,
  },
];

export const documents: EmployeeDocument[] = [
  { id: "doc1", userId: "e1", name: "Passport", category: "identity", status: "verified", fileType: "PDF", size: "1.2 MB", uploadedOn: "2023-04-10", verifiedOn: "2023-04-14", expiryDate: "2029-03-01", rejectionReason: null },
  { id: "doc2", userId: "e1", name: "Offer Letter", category: "employment", status: "verified", fileType: "PDF", size: "320 KB", uploadedOn: "2023-04-08", verifiedOn: "2023-04-09", expiryDate: null, rejectionReason: null },
  { id: "doc3", userId: "e1", name: "H-1B Visa", category: "work-auth", status: "uploaded", fileType: "PDF", size: "900 KB", uploadedOn: "2026-06-18", verifiedOn: null, expiryDate: "2027-09-30", rejectionReason: null },
  { id: "doc4", userId: "e1", name: "W-2 Form", category: "tax", status: "rejected", fileType: "PDF", size: "210 KB", uploadedOn: "2026-06-10", verifiedOn: null, expiryDate: null, rejectionReason: "Document is illegible, please re-upload" },
  { id: "doc5", userId: "e1", name: "Degree Certificate", category: "education", status: "missing", fileType: "-", size: "-", uploadedOn: null, verifiedOn: null, expiryDate: null, rejectionReason: null },
];

export const reimbursements: Reimbursement[] = [
  { id: "ex1", userId: "e1", category: "travel", amount: 184, currency: "$", description: "Client visit cab fare", date: "2026-06-15", receipts: ["cab-receipt.pdf"], mileage: { distance: 92, from: "Office", to: "Client HQ", vehicle: "Car", ratePerKm: 0.5 }, taxable: false, withinPolicy: true, policyNote: "Within travel limit", status: "pending-approval", paidOn: null, approvals: [{ level: "Manager", approver: "Michael Torres", status: "pending", comment: null, actedOn: null }] },
  { id: "ex2", userId: "e1", category: "food", amount: 64, currency: "$", description: "Team lunch", date: "2026-06-10", receipts: ["lunch.jpg"], mileage: null, taxable: true, withinPolicy: true, policyNote: "Receipt attached", status: "approved", paidOn: null, approvals: [{ level: "Manager", approver: "Michael Torres", status: "approved", comment: "Approved", actedOn: "2026-06-11" }] },
  { id: "ex3", userId: "e1", category: "communication", amount: 45, currency: "$", description: "Internet reimbursement", date: "2026-05-30", receipts: ["isp-bill.pdf"], mileage: null, taxable: false, withinPolicy: true, policyNote: "Within limit", status: "paid", paidOn: "2026-06-05", approvals: [{ level: "Manager", approver: "Michael Torres", status: "approved", comment: "", actedOn: "2026-06-01" }] },
  { id: "ex4", userId: "e2", category: "accommodation", amount: 8200, currency: "₹", description: "Conference hotel stay", date: "2026-06-12", receipts: ["hotel.pdf"], mileage: null, taxable: false, withinPolicy: false, policyNote: "Exceeds nightly limit by ₹1200", status: "pending-approval", paidOn: null, approvals: [{ level: "Manager", approver: "Michael Torres", status: "pending", comment: null, actedOn: null }] },
];

export const goals: Goal[] = [
  { id: "g1", userId: "e1", title: "Ship payments revamp", description: "Lead the redesign of the checkout payments flow", category: "individual", type: "quarterly", weight: 40, dueDate: "2026-09-30", status: "on-track", progress: 65, keyResults: [{ title: "Reduce checkout errors", target: 90, current: 70, completed: false }, { title: "Add 3 payment methods", target: 3, current: 2, completed: false }] },
  { id: "g2", userId: "e1", title: "Improve test coverage", description: "Raise unit test coverage across services", category: "team", type: "quarterly", weight: 30, dueDate: "2026-08-31", status: "at-risk", progress: 35, keyResults: [{ title: "Coverage to 80%", target: 80, current: 58, completed: false }] },
  { id: "g3", userId: "e1", title: "Mentor a junior engineer", description: "Onboard and mentor a new team member", category: "individual", type: "annual", weight: 30, dueDate: "2026-12-31", status: "in-progress", progress: 50, keyResults: [{ title: "Weekly 1:1s", target: 24, current: 12, completed: false }] },
];

export const reviews: PerformanceReview[] = [
  { id: "rev1", userId: "e1", period: "Q1 2026", type: "quarterly", overallRating: 4.3, categoryRatings: [{ category: "Delivery", rating: 4.5 }, { category: "Collaboration", rating: 4.2 }, { category: "Ownership", rating: 4.0 }, { category: "Communication", rating: 4.4 }], strengths: ["Strong technical execution", "Reliable under pressure"], improvements: ["Delegate more", "Document decisions"], goalsAchieved: 3, goalsTotal: 4, recommendations: "Ready for senior responsibilities next cycle.", comments: "Grateful for the support from the team this quarter." },
];

export const contributions: ValueContribution[] = [
  { id: "c1", userId: "e1", title: "Automated release checklist", description: "Built a script that cut release prep time in half", type: "self-initiated", category: "process-improvement", points: 120, suggestedPoints: 100, impact: "high", status: "completed", tags: ["automation", "devex"], approvals: [{ level: "Manager", approver: "Michael Torres", status: "approved", comment: "Great impact", actedOn: "2026-06-01" }] },
  { id: "c2", userId: "e2", title: "Reduced cloud spend", description: "Right-sized staging infrastructure", type: "committed", category: "cost-saving", points: 90, suggestedPoints: 90, impact: "medium", status: "under-review", tags: ["cost"], approvals: [{ level: "Manager", approver: "Michael Torres", status: "pending", comment: null, actedOn: null }] },
  { id: "c3", userId: "e1", title: "Internal design system docs", description: "Documented shared components for the org", type: "assigned", category: "quality", points: 0, suggestedPoints: 60, impact: "medium", status: "in-progress", tags: ["docs"], approvals: [] },
];

export const contributionItems: ContributionItem[] = [
  { id: "ci1", title: "Write onboarding runbook", category: "process-improvement", suggestedPoints: 50, claimedBy: null },
  { id: "ci2", title: "Run a lunch-and-learn session", category: "team-building", suggestedPoints: 40, claimedBy: null },
  { id: "ci3", title: "Prototype an AI support bot", category: "innovation", suggestedPoints: 80, claimedBy: null },
  { id: "ci4", title: "Improve checkout conversion", category: "revenue-generation", suggestedPoints: 100, claimedBy: "e2" },
];

export const leaderboard: LeaderboardEntry[] = [
  { userId: "e1", points: 320, badges: ["Innovator", "Mentor"], avgRating: 4.5 },
  { userId: "e2", points: 280, badges: ["Cost Saver"], avgRating: 4.2 },
  { userId: "e3", points: 190, badges: ["Quality Champ"], avgRating: 4.0 },
  { userId: "e4", points: 140, badges: [], avgRating: 3.8 },
];

export const trainingModules: TrainingModule[] = [
  { id: "tr1", userId: "e1", title: "Security Awareness 2026", category: "compliance", duration: "45 min", dueDate: "2026-07-15", mandatory: true, status: "in-progress", progress: 40, certificateEligible: true, contents: [{ title: "Phishing basics", type: "video", completed: true }, { title: "Password hygiene", type: "document", completed: true }, { title: "Final quiz", type: "quiz", completed: false }] },
  { id: "tr2", userId: "e1", title: "Advanced React Patterns", category: "technical", duration: "2 h", dueDate: "2026-08-01", mandatory: false, status: "not-started", progress: 0, certificateEligible: true, contents: [{ title: "Hooks deep dive", type: "video", completed: false }, { title: "Hands-on lab", type: "interactive", completed: false }] },
  { id: "tr3", userId: "e1", title: "Company Orientation", category: "orientation", duration: "30 min", dueDate: "2026-05-01", mandatory: true, status: "completed", progress: 100, certificateEligible: true, contents: [{ title: "Welcome video", type: "video", completed: true }, { title: "Policies overview", type: "document", completed: true }] },
];

export const jobPostings: JobPosting[] = [
  { id: "j1", title: "Senior Backend Engineer", department: "Engineering", location: "Remote (US)", employmentType: "Full-time", experience: "5+ years", salaryRange: "$130k - $160k", requirements: ["Go or C#", "Distributed systems", "PostgreSQL"], responsibilities: ["Design services", "Mentor engineers"], status: "open", applicants: 42, shortlisted: 8, interviewing: 3 },
  { id: "j2", title: "Product Designer", department: "Design", location: "Bengaluru, IN", employmentType: "Full-time", experience: "3+ years", salaryRange: "₹18L - ₹26L", requirements: ["Figma", "Design systems"], responsibilities: ["Own product flows", "Run research"], status: "open", applicants: 31, shortlisted: 5, interviewing: 2 },
];

export const candidates: Candidate[] = [
  { id: "cand1", jobId: "j1", name: "Daniel Wright", appliedRole: "Senior Backend Engineer", status: "interview-scheduled", rating: 4, skills: ["C#", "Kubernetes", "PostgreSQL"], experience: "7 years", expectedSalary: "$150k", noticePeriod: "30 days", notes: "Strong systems background", interviewDate: "2026-06-28" },
  { id: "cand2", jobId: "j1", name: "Nina Rao", appliedRole: "Senior Backend Engineer", status: "shortlisted", rating: 5, skills: ["Go", "gRPC", "AWS"], experience: "6 years", expectedSalary: "$145k", noticePeriod: "Immediate", notes: "Excellent referral", interviewDate: null },
  { id: "cand3", jobId: "j2", name: "Leo Martins", appliedRole: "Product Designer", status: "new", rating: 3, skills: ["Figma", "Prototyping"], experience: "4 years", expectedSalary: "₹22L", noticePeriod: "60 days", notes: "Good portfolio", interviewDate: null },
  { id: "cand4", jobId: "j1", name: "Sofia Greco", appliedRole: "Senior Backend Engineer", status: "interviewed", rating: 4, skills: ["C#", "Azure"], experience: "8 years", expectedSalary: "$158k", noticePeriod: "45 days", notes: "Pending feedback", interviewDate: "2026-06-20" },
];

export const recognitions: Recognition[] = [
  { id: "rg1", fromUserId: "m1", toUserId: "e1", category: "excellence", message: "Sarah's payments work was outstanding this sprint!", visibility: "public", likes: 12, comments: 3, likedByMe: false, createdOn: "2026-06-22" },
  { id: "rg2", fromUserId: "e2", toUserId: "e3", category: "team-player", message: "Emily jumped in to unblock the release. Legend!", visibility: "public", likes: 8, comments: 1, likedByMe: true, createdOn: "2026-06-21" },
  { id: "rg3", fromUserId: "h1", toUserId: "m1", category: "leadership", message: "Thank you Michael for mentoring the new hires.", visibility: "public", likes: 15, comments: 4, likedByMe: false, createdOn: "2026-06-19" },
];

export const announcements: Announcement[] = [
  { id: "an1", title: "Updated Leave Policy 2026", category: "policy", priority: "high", content: "We have revised the carry-forward limits. Please review and acknowledge.", scope: "global", target: "All employees", attachments: ["leave-policy-2026.pdf"], expiryDate: "2026-08-01", views: 240, likes: 18, acknowledgments: 156, comments: 9, requiresAck: true, acknowledgedBy: [], createdOn: "2026-06-18", authorId: "h1" },
  { id: "an2", title: "Summer Town Hall", category: "event", priority: "medium", content: "Join us for the quarterly town hall this Friday at 4 PM.", scope: "global", target: "All employees", attachments: [], expiryDate: "2026-06-27", views: 198, likes: 33, acknowledgments: 0, comments: 12, requiresAck: false, acknowledgedBy: [], createdOn: "2026-06-20", authorId: "h1" },
  { id: "an3", title: "Security Compliance Reminder", category: "compliance", priority: "high", content: "Complete the mandatory security training before July 15.", scope: "department", target: "Engineering", attachments: [], expiryDate: "2026-07-15", views: 88, likes: 4, acknowledgments: 40, comments: 1, requiresAck: true, acknowledgedBy: [], createdOn: "2026-06-15", authorId: "a1" },
];

export const newJoiner: NewJoiner = {
  id: "nj1",
  name: "Alex Johnson",
  designation: "Software Engineer",
  department: "Engineering",
  manager: "Michael Torres",
  buddy: "Sarah Chen",
  joiningDate: "2026-06-30",
};

export const onboardingTasks: OnboardingTask[] = [
  { id: "ot1", phase: "pre-joining", title: "Sign offer letter", description: "Review and e-sign the offer", dueDate: "2026-06-20", priority: "high", assignee: "Alex Johnson", status: "completed", completedDate: "2026-06-19" },
  { id: "ot2", phase: "pre-joining", title: "Submit tax forms", description: "Upload W-4 and state forms", dueDate: "2026-06-24", priority: "high", assignee: "Alex Johnson", status: "pending", completedDate: null },
  { id: "ot3", phase: "pre-joining", title: "Add bank details", description: "Enter payroll bank account", dueDate: "2026-06-25", priority: "medium", assignee: "Alex Johnson", status: "pending", completedDate: null },
  { id: "ot4", phase: "day-1", title: "Collect laptop", description: "Pick up device from IT", dueDate: "2026-06-30", priority: "high", assignee: "IT", status: "pending", completedDate: null },
  { id: "ot5", phase: "week-1", title: "Meet your team", description: "Intro calls with the team", dueDate: "2026-07-04", priority: "medium", assignee: "Alex Johnson", status: "pending", completedDate: null },
  { id: "ot6", phase: "week-2", title: "Setup dev environment", description: "Clone repos and run locally", dueDate: "2026-07-11", priority: "medium", assignee: "Alex Johnson", status: "pending", completedDate: null },
  { id: "ot7", phase: "month-1", title: "First 1:1 with manager", description: "30-day check-in", dueDate: "2026-07-30", priority: "low", assignee: "Michael Torres", status: "pending", completedDate: null },
];

export const welcomeMessages: WelcomeMessage[] = [
  { id: "wm1", from: "Aisha Khan", role: "CEO", message: "Welcome to WorkFlow, Alex! Thrilled to have you on board.", hasVideo: true },
  { id: "wm2", from: "Michael Torres", role: "Manager", message: "Excited to work with you. Reach out anytime!", hasVideo: false },
  { id: "wm3", from: "Sarah Chen", role: "Buddy", message: "I'm your onboarding buddy. Let's grab a coffee on day one.", hasVideo: false },
];

export const relocation: RelocationSupport = {
  relocationStatus: "In progress",
  visaStatus: "H-1B approved",
  accommodation: "Corporate housing booked for 30 days",
  travel: "Flight confirmed for June 28",
  allowance: "$3,000 relocation allowance",
  localBuddy: "Sarah Chen",
  tickets: [
    { id: "rt1", title: "Shipping personal items", status: "in-progress" },
    { id: "rt2", title: "Local bank account setup", status: "open" },
  ],
};

export const teamIntros: TeamIntroduction[] = [
  { memberId: "e1", bio: "Software Engineer focused on payments.", expertise: ["React", "Payments", "TypeScript"], funFacts: ["Loves hiking", "Makes espresso"], introduced: true, welcomed: true },
  { memberId: "e2", bio: "Frontend Engineer and design-system fan.", expertise: ["React", "CSS", "Accessibility"], funFacts: ["Plays guitar"], introduced: true, welcomed: false },
  { memberId: "e3", bio: "QA Engineer who breaks things on purpose.", expertise: ["Automation", "Cypress"], funFacts: ["Marathon runner"], introduced: false, welcomed: false },
];

export const milestones: OnboardingMilestone[] = [
  { id: "ms1", title: "Day 1 welcome", date: "2026-06-30", type: "celebration", status: "upcoming" },
  { id: "ms2", title: "Week 1 check-in", date: "2026-07-04", type: "check-in", status: "upcoming" },
  { id: "ms3", title: "30-day review", date: "2026-07-30", type: "review", status: "upcoming" },
  { id: "ms4", title: "90-day completion", date: "2026-09-28", type: "celebration", status: "upcoming" },
];
