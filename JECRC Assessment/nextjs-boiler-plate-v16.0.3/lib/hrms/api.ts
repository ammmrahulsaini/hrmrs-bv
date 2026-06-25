const ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || "/graphql";

async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message ?? "GraphQL error");
  return json.data as T;
}

const APPROVALS = "approvals { level approver status comment actedOn }";

const SELECTIONS: Record<string, string> = {
  employees: "id name email role designation department managerId reportingManagerId country location joiningDate status avatarColor",
  shifts: "id name start end current",
  attendanceRecords: "id userId date clockIn clockOut status method locationVerified ipValidated totalHours productiveHours breakHours overtimeHours exception",
  leaveBalances: "id userId type total used pending available carriedForward encashed",
  leaveRequests: `id userId type startDate endDate totalDays reason status appliedOn ${APPROVALS}`,
  payrollRecords: "id userId period payDate country currency gross totalDeductions net status earnings { label amount } deductions { label amount } employerContributions { label amount }",
  documents: "id userId name category status fileType size uploadedOn verifiedOn expiryDate rejectionReason",
  reimbursements: `id userId category amount currency description date receipts mileage { distance from to vehicle ratePerKm } taxable withinPolicy policyNote status paidOn ${APPROVALS}`,
  goals: "id userId title description category type weight dueDate status progress keyResults { title target current completed }",
  performanceReviews: "id userId period type overallRating categoryRatings { category rating } strengths improvements goalsAchieved goalsTotal recommendations comments",
  contributions: `id userId title description type category points suggestedPoints impact status tags ${APPROVALS}`,
  contributionItems: "id title category suggestedPoints claimedBy",
  leaderboard: "id userId points badges avgRating",
  trainingModules: "id userId title category duration dueDate mandatory status progress certificateEligible contents { title type completed }",
  jobPostings: "id title department location employmentType experience salaryRange requirements responsibilities status applicants shortlisted interviewing",
  candidates: "id jobId name appliedRole status rating skills experience expectedSalary noticePeriod notes interviewDate",
  recognitions: "id fromUserId toUserId category message visibility likes comments createdOn: createdOnDate",
  announcements: "id title category priority content scope target attachments expiryDate views likes acknowledgments comments requiresAck acknowledgedBy createdOn: createdOnDate authorId",
  onboardingTasks: "id phase title description dueDate priority assignee status completedDate",
  welcomeMessages: "id from: fromName role message hasVideo",
  relocationSupport: "relocationStatus visaStatus accommodation travel allowance localBuddy tickets { id title status }",
  teamIntroductions: "id memberId bio expertise funFacts introduced welcomed",
  onboardingMilestones: "id title date type status",
  newJoinerProfiles: "id name designation department manager buddy joiningDate",
};

async function fetchField<T>(field: string): Promise<T> {
  const data = await gql<Record<string, T>>(`query { ${field} { ${SELECTIONS[field]} } }`);
  return data[field];
}

export interface LoadedData {
  employees: any[];
  shifts: any[];
  attendance: any[];
  leaveBalances: any[];
  leaveRequests: any[];
  payrollRecords: any[];
  documents: any[];
  reimbursements: any[];
  goals: any[];
  reviews: any[];
  contributions: any[];
  contributionItems: any[];
  leaderboard: any[];
  trainingModules: any[];
  jobPostings: any[];
  candidates: any[];
  recognitions: any[];
  announcements: any[];
  onboardingTasks: any[];
  welcomeMessages: any[];
  relocation: any | null;
  teamIntros: any[];
  milestones: any[];
  newJoiner: any | null;
}

export async function loadAll(): Promise<LoadedData> {
  const [
    employees, shifts, attendance, leaveBalances, leaveRequests, payrollRecords, documents,
    reimbursements, goals, reviews, contributions, contributionItems, leaderboard, trainingModules,
    jobPostings, candidates, recognitions, announcements, onboardingTasks, welcomeMessages,
    relocationSupport, teamIntros, milestones, newJoinerProfiles,
  ] = await Promise.all([
    fetchField<any[]>("employees"),
    fetchField<any[]>("shifts"),
    fetchField<any[]>("attendanceRecords"),
    fetchField<any[]>("leaveBalances"),
    fetchField<any[]>("leaveRequests"),
    fetchField<any[]>("payrollRecords"),
    fetchField<any[]>("documents"),
    fetchField<any[]>("reimbursements"),
    fetchField<any[]>("goals"),
    fetchField<any[]>("performanceReviews"),
    fetchField<any[]>("contributions"),
    fetchField<any[]>("contributionItems"),
    fetchField<any[]>("leaderboard"),
    fetchField<any[]>("trainingModules"),
    fetchField<any[]>("jobPostings"),
    fetchField<any[]>("candidates"),
    fetchField<any[]>("recognitions"),
    fetchField<any[]>("announcements"),
    fetchField<any[]>("onboardingTasks"),
    fetchField<any[]>("welcomeMessages"),
    fetchField<any[]>("relocationSupport"),
    fetchField<any[]>("teamIntroductions"),
    fetchField<any[]>("onboardingMilestones"),
    fetchField<any[]>("newJoinerProfiles"),
  ]);

  return {
    employees, shifts, attendance, leaveBalances, leaveRequests, payrollRecords, documents,
    reimbursements, goals, reviews, contributions, contributionItems, leaderboard, trainingModules,
    jobPostings, candidates,
    recognitions: recognitions.map((r) => ({ ...r, likedByMe: false })),
    announcements, onboardingTasks, welcomeMessages,
    relocation: relocationSupport[0] ?? null,
    teamIntros, milestones,
    newJoiner: newJoinerProfiles[0] ?? null,
  };
}

export const refreshers: Record<string, () => Promise<any>> = {
  attendance: () => fetchField("attendanceRecords"),
  leaveBalances: () => fetchField("leaveBalances"),
  leaveRequests: () => fetchField("leaveRequests"),
  reimbursements: () => fetchField("reimbursements"),
  documents: () => fetchField("documents"),
  contributions: () => fetchField("contributions"),
  contributionItems: () => fetchField("contributionItems"),
  trainingModules: () => fetchField("trainingModules"),
  candidates: () => fetchField("candidates"),
  announcements: () => fetchField("announcements"),
  onboardingTasks: () => fetchField("onboardingTasks"),
  recognitions: async () => (await fetchField<any[]>("recognitions")).map((r) => ({ ...r, likedByMe: false })),
};

export const mutations = {
  clockIn: (userId: string, method: string) =>
    gql(`mutation($userId:String!,$method:String!){ clockIn(userId:$userId,method:$method){ id } }`, { userId, method }),
  clockOut: (userId: string) =>
    gql(`mutation($userId:String!){ clockOut(userId:$userId){ id } }`, { userId }),
  submitLeave: (input: unknown) =>
    gql(`mutation($input:SubmitLeaveInput!){ submitLeave(input:$input){ id } }`, { input }),
  actOnLeave: (id: string, level: string, decision: string, comment: string) =>
    gql(`mutation($id:String!,$level:String!,$decision:String!,$comment:String!){ actOnLeave(id:$id,level:$level,decision:$decision,comment:$comment){ id } }`, { id, level, decision, comment }),
  submitExpense: (input: unknown) =>
    gql(`mutation($input:SubmitExpenseInput!){ submitExpense(input:$input){ id } }`, { input }),
  actOnExpense: (id: string, decision: string, comment: string) =>
    gql(`mutation($id:String!,$decision:String!,$comment:String!){ actOnExpense(id:$id,decision:$decision,comment:$comment){ id } }`, { id, decision, comment }),
  uploadDocument: (id: string) =>
    gql(`mutation($id:String!){ uploadDocument(id:$id){ id } }`, { id }),
  reviewDocument: (id: string, decision: string, reason: string) =>
    gql(`mutation($id:String!,$decision:String!,$reason:String!){ reviewDocument(id:$id,decision:$decision,reason:$reason){ id } }`, { id, decision, reason }),
  claimItem: (id: string, userId: string) =>
    gql(`mutation($id:String!,$userId:String!){ claimItem(id:$id,userId:$userId){ id } }`, { id, userId }),
  approveContribution: (id: string, points: number, comment: string) =>
    gql(`mutation($id:String!,$points:Int!,$comment:String!){ approveContribution(id:$id,points:$points,comment:$comment){ id } }`, { id, points, comment }),
  completeContent: (moduleId: string, index: number) =>
    gql(`mutation($moduleId:String!,$index:Int!){ completeContent(moduleId:$moduleId,index:$index){ id } }`, { moduleId, index }),
  updateCandidate: (id: string, status: string, interviewDate: string | null) =>
    gql(`mutation($id:String!,$status:String!,$interviewDate:String){ updateCandidate(id:$id,status:$status,interviewDate:$interviewDate){ id } }`, { id, status, interviewDate }),
  sendRecognition: (input: unknown) =>
    gql(`mutation($input:SendRecognitionInput!){ sendRecognition(input:$input){ id } }`, { input }),
  toggleLike: (id: string, liked: boolean) =>
    gql(`mutation($id:String!,$liked:Boolean!){ toggleLike(id:$id,liked:$liked){ id } }`, { id, liked }),
  createAnnouncement: (input: unknown) =>
    gql(`mutation($input:CreateAnnouncementInput!){ createAnnouncement(input:$input){ id } }`, { input }),
  acknowledgeAnnouncement: (id: string, userId: string) =>
    gql(`mutation($id:String!,$userId:String!){ acknowledgeAnnouncement(id:$id,userId:$userId){ id } }`, { id, userId }),
  completeTask: (id: string) =>
    gql(`mutation($id:String!){ completeTask(id:$id){ id } }`, { id }),
};
