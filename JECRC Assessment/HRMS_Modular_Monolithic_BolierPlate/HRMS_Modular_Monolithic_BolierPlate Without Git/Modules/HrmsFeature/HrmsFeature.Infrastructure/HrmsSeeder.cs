using HRMS.Core.Postgres.Data;
using HrmsFeature.Domain;
using Microsoft.EntityFrameworkCore;

namespace HrmsFeature.Infrastructure
{
    public static class HrmsSeeder
    {
        public static void Seed(PostgresDbContext context)
        {
            if (context.Set<Employee>().Any())
                return;

            context.Set<Employee>().AddRange(
                new Employee { Id = "e1", Name = "Sarah Chen", Email = "sarah.chen@workflow.com", Role = "employee", Designation = "Software Engineer", Department = "Engineering", ManagerId = "m1", ReportingManagerId = "m1", Country = "US", Location = "San Francisco, CA", JoiningDate = "2023-04-12", Status = "active", AvatarColor = "bg-teal-600" },
                new Employee { Id = "e2", Name = "Raj Patel", Email = "raj.patel@workflow.com", Role = "employee", Designation = "Frontend Engineer", Department = "Engineering", ManagerId = "m1", ReportingManagerId = "m1", Country = "IN", Location = "Bengaluru, KA", JoiningDate = "2022-09-01", Status = "active", AvatarColor = "bg-indigo-600" },
                new Employee { Id = "e3", Name = "Emily Davis", Email = "emily.davis@workflow.com", Role = "employee", Designation = "QA Engineer", Department = "Engineering", ManagerId = "m1", ReportingManagerId = "m1", Country = "US", Location = "Austin, TX", JoiningDate = "2024-01-15", Status = "active", AvatarColor = "bg-rose-600" },
                new Employee { Id = "e4", Name = "Carlos Mendez", Email = "carlos.mendez@workflow.com", Role = "employee", Designation = "Backend Engineer", Department = "Engineering", ManagerId = "m1", ReportingManagerId = "m1", Country = "US", Location = "Remote", JoiningDate = "2023-11-20", Status = "on-leave", AvatarColor = "bg-amber-600" },
                new Employee { Id = "m1", Name = "Michael Torres", Email = "michael.torres@workflow.com", Role = "manager", Designation = "Engineering Manager", Department = "Engineering", ManagerId = "a1", ReportingManagerId = "a1", Country = "US", Location = "San Francisco, CA", JoiningDate = "2020-06-03", Status = "active", AvatarColor = "bg-orange-600" },
                new Employee { Id = "h1", Name = "Priya Sharma", Email = "priya.sharma@workflow.com", Role = "hr", Designation = "HR Specialist", Department = "People Operations", ManagerId = "a1", ReportingManagerId = "a1", Country = "IN", Location = "Mumbai, MH", JoiningDate = "2021-02-18", Status = "active", AvatarColor = "bg-fuchsia-600" },
                new Employee { Id = "a1", Name = "Aisha Khan", Email = "aisha.khan@workflow.com", Role = "admin", Designation = "System Administrator", Department = "IT", ManagerId = null, ReportingManagerId = null, Country = "IN", Location = "Mumbai, MH", JoiningDate = "2019-08-09", Status = "active", AvatarColor = "bg-slate-700" }
            );

            context.Set<Shift>().AddRange(
                new Shift { Id = "s1", Name = "Morning", Start = "09:00", End = "18:00", Current = true },
                new Shift { Id = "s2", Name = "Mid", Start = "12:00", End = "21:00", Current = false },
                new Shift { Id = "s3", Name = "Night", Start = "21:00", End = "06:00", Current = false }
            );

            context.Set<AttendanceRecord>().AddRange(
                new AttendanceRecord { Id = "att1", UserId = "e1", Date = "2026-06-22", ClockIn = "09:04", ClockOut = "18:12", Status = "present", Method = "selfie", LocationVerified = true, IpValidated = true, TotalHours = 9.1, ProductiveHours = 8.0, BreakHours = 1.1, OvertimeHours = 0.2 },
                new AttendanceRecord { Id = "att2", UserId = "e1", Date = "2026-06-23", ClockIn = "09:36", ClockOut = "18:30", Status = "late", Method = "geolocation", LocationVerified = true, IpValidated = true, TotalHours = 8.9, ProductiveHours = 7.6, BreakHours = 1.3, OvertimeHours = 0, Exception = "Late arrival" },
                new AttendanceRecord { Id = "att3", UserId = "e1", Date = "2026-06-24", ClockIn = "08:58", ClockOut = "19:05", Status = "present", Method = "selfie", LocationVerified = true, IpValidated = true, TotalHours = 10.1, ProductiveHours = 8.4, BreakHours = 1.0, OvertimeHours = 1.1 },
                new AttendanceRecord { Id = "att4", UserId = "e2", Date = "2026-06-24", ClockIn = "09:10", ClockOut = "18:00", Status = "present", Method = "biometric", LocationVerified = true, IpValidated = false, TotalHours = 8.8, ProductiveHours = 7.9, BreakHours = 0.9, OvertimeHours = 0, Exception = "IP not validated" },
                new AttendanceRecord { Id = "att5", UserId = "e3", Date = "2026-06-24", ClockIn = "13:20", ClockOut = "18:00", Status = "half-day", Method = "manual", LocationVerified = false, IpValidated = true, TotalHours = 4.6, ProductiveHours = 4.2, BreakHours = 0.4, OvertimeHours = 0, Exception = "Half day" }
            );

            context.Set<LeaveBalance>().AddRange(
                new LeaveBalance { Id = "lb1", UserId = "e1", Type = "casual", Total = 12, Used = 4, Pending = 1, Available = 7, CarriedForward = 2, Encashed = 0 },
                new LeaveBalance { Id = "lb2", UserId = "e1", Type = "sick", Total = 10, Used = 2, Pending = 0, Available = 8, CarriedForward = 0, Encashed = 0 },
                new LeaveBalance { Id = "lb3", UserId = "e1", Type = "personal", Total = 6, Used = 1, Pending = 0, Available = 5, CarriedForward = 0, Encashed = 0 },
                new LeaveBalance { Id = "lb4", UserId = "e1", Type = "comp-off", Total = 3, Used = 0, Pending = 0, Available = 3, CarriedForward = 1, Encashed = 1 }
            );

            context.Set<LeaveRequest>().AddRange(
                new LeaveRequest { Id = "lv1", UserId = "e1", Type = "casual", StartDate = "2026-07-02", EndDate = "2026-07-03", TotalDays = 2, Reason = "Family function", Status = "pending", AppliedOn = "2026-06-20", Approvals = new() { new ApprovalStep { Level = "Manager", Approver = "Michael Torres", Status = "pending" }, new ApprovalStep { Level = "HR", Approver = "Priya Sharma", Status = "pending" } } },
                new LeaveRequest { Id = "lv2", UserId = "e1", Type = "sick", StartDate = "2026-05-14", EndDate = "2026-05-14", TotalDays = 1, Reason = "Fever", Status = "approved", AppliedOn = "2026-05-13", Approvals = new() { new ApprovalStep { Level = "Manager", Approver = "Michael Torres", Status = "approved", Comment = "Take care", ActedOn = "2026-05-13" } } },
                new LeaveRequest { Id = "lv3", UserId = "e2", Type = "casual", StartDate = "2026-06-30", EndDate = "2026-07-01", TotalDays = 2, Reason = "Personal travel", Status = "pending", AppliedOn = "2026-06-21", Approvals = new() { new ApprovalStep { Level = "Manager", Approver = "Michael Torres", Status = "pending" } } },
                new LeaveRequest { Id = "lv4", UserId = "e3", Type = "personal", StartDate = "2026-07-05", EndDate = "2026-07-05", TotalDays = 1, Reason = "Bank work", Status = "pending", AppliedOn = "2026-06-22", Approvals = new() { new ApprovalStep { Level = "Manager", Approver = "Michael Torres", Status = "pending" } } }
            );

            context.Set<PayrollRecord>().AddRange(
                new PayrollRecord { Id = "pay1", UserId = "e1", Period = "May 2026", PayDate = "2026-05-31", Country = "US", Currency = "$", Status = "paid", Gross = 9020, TotalDeductions = 2410, Net = 6610,
                    Earnings = new() { new PayComponent { Label = "Basic", Amount = 6500 }, new PayComponent { Label = "Special Allowance", Amount = 1800 }, new PayComponent { Label = "Bonus", Amount = 500 }, new PayComponent { Label = "Overtime", Amount = 220 } },
                    Deductions = new() { new PayComponent { Label = "Income Tax", Amount = 1650 }, new PayComponent { Label = "Health Insurance", Amount = 240 }, new PayComponent { Label = "401(k)", Amount = 520 } },
                    EmployerContributions = new() { new PayComponent { Label = "401(k) Match", Amount = 390 }, new PayComponent { Label = "Medicare", Amount = 130 } } },
                new PayrollRecord { Id = "pay2", UserId = "e1", Period = "April 2026", PayDate = "2026-04-30", Country = "US", Currency = "$", Status = "paid", Gross = 8395, TotalDeductions = 2340, Net = 6055,
                    Earnings = new() { new PayComponent { Label = "Basic", Amount = 6500 }, new PayComponent { Label = "Special Allowance", Amount = 1800 }, new PayComponent { Label = "Overtime", Amount = 95 } },
                    Deductions = new() { new PayComponent { Label = "Income Tax", Amount = 1580 }, new PayComponent { Label = "Health Insurance", Amount = 240 }, new PayComponent { Label = "401(k)", Amount = 520 } },
                    EmployerContributions = new() { new PayComponent { Label = "401(k) Match", Amount = 390 }, new PayComponent { Label = "Medicare", Amount = 125 } } },
                new PayrollRecord { Id = "pay3", UserId = "e2", Period = "May 2026", PayDate = "2026-05-31", Country = "IN", Currency = "₹", Status = "paid", Gross = 100000, TotalDeductions = 17950, Net = 82050,
                    Earnings = new() { new PayComponent { Label = "Basic", Amount = 60000 }, new PayComponent { Label = "HRA", Amount = 24000 }, new PayComponent { Label = "Special Allowance", Amount = 16000 } },
                    Deductions = new() { new PayComponent { Label = "PF", Amount = 7200 }, new PayComponent { Label = "Professional Tax", Amount = 200 }, new PayComponent { Label = "Income Tax", Amount = 9800 }, new PayComponent { Label = "ESI", Amount = 750 } },
                    EmployerContributions = new() { new PayComponent { Label = "PF", Amount = 7200 }, new PayComponent { Label = "ESI", Amount = 2600 }, new PayComponent { Label = "Gratuity", Amount = 2885 } } }
            );

            context.Set<EmployeeDocument>().AddRange(
                new EmployeeDocument { Id = "doc1", UserId = "e1", Name = "Passport", Category = "identity", Status = "verified", FileType = "PDF", Size = "1.2 MB", UploadedOn = "2023-04-10", VerifiedOn = "2023-04-14", ExpiryDate = "2029-03-01" },
                new EmployeeDocument { Id = "doc2", UserId = "e1", Name = "Offer Letter", Category = "employment", Status = "verified", FileType = "PDF", Size = "320 KB", UploadedOn = "2023-04-08", VerifiedOn = "2023-04-09" },
                new EmployeeDocument { Id = "doc3", UserId = "e1", Name = "H-1B Visa", Category = "work-auth", Status = "uploaded", FileType = "PDF", Size = "900 KB", UploadedOn = "2026-06-18", ExpiryDate = "2027-09-30" },
                new EmployeeDocument { Id = "doc4", UserId = "e1", Name = "W-2 Form", Category = "tax", Status = "rejected", FileType = "PDF", Size = "210 KB", UploadedOn = "2026-06-10", RejectionReason = "Document is illegible, please re-upload" },
                new EmployeeDocument { Id = "doc5", UserId = "e1", Name = "Degree Certificate", Category = "education", Status = "missing" }
            );

            context.Set<Reimbursement>().AddRange(
                new Reimbursement { Id = "ex1", UserId = "e1", Category = "travel", Amount = 184, Currency = "$", Description = "Client visit cab fare", Date = "2026-06-15", Receipts = new() { "cab-receipt.pdf" }, Mileage = new Mileage { Distance = 92, From = "Office", To = "Client HQ", Vehicle = "Car", RatePerKm = 0.5 }, Taxable = false, WithinPolicy = true, PolicyNote = "Within travel limit", Status = "pending-approval", Approvals = new() { new ApprovalStep { Level = "Manager", Approver = "Michael Torres", Status = "pending" } } },
                new Reimbursement { Id = "ex2", UserId = "e1", Category = "food", Amount = 64, Currency = "$", Description = "Team lunch", Date = "2026-06-10", Receipts = new() { "lunch.jpg" }, Taxable = true, WithinPolicy = true, PolicyNote = "Receipt attached", Status = "approved", Approvals = new() { new ApprovalStep { Level = "Manager", Approver = "Michael Torres", Status = "approved", Comment = "Approved", ActedOn = "2026-06-11" } } },
                new Reimbursement { Id = "ex3", UserId = "e1", Category = "communication", Amount = 45, Currency = "$", Description = "Internet reimbursement", Date = "2026-05-30", Receipts = new() { "isp-bill.pdf" }, Taxable = false, WithinPolicy = true, PolicyNote = "Within limit", Status = "paid", PaidOn = "2026-06-05", Approvals = new() { new ApprovalStep { Level = "Manager", Approver = "Michael Torres", Status = "approved", ActedOn = "2026-06-01" } } },
                new Reimbursement { Id = "ex4", UserId = "e2", Category = "accommodation", Amount = 8200, Currency = "₹", Description = "Conference hotel stay", Date = "2026-06-12", Receipts = new() { "hotel.pdf" }, Taxable = false, WithinPolicy = false, PolicyNote = "Exceeds nightly limit", Status = "pending-approval", Approvals = new() { new ApprovalStep { Level = "Manager", Approver = "Michael Torres", Status = "pending" } } }
            );

            context.Set<Goal>().AddRange(
                new Goal { Id = "g1", UserId = "e1", Title = "Ship payments revamp", Description = "Lead the redesign of the checkout payments flow", Category = "individual", Type = "quarterly", Weight = 40, DueDate = "2026-09-30", Status = "on-track", Progress = 65, KeyResults = new() { new KeyResult { Title = "Reduce checkout errors", Target = 90, Current = 70 }, new KeyResult { Title = "Add 3 payment methods", Target = 3, Current = 2 } } },
                new Goal { Id = "g2", UserId = "e1", Title = "Improve test coverage", Description = "Raise unit test coverage across services", Category = "team", Type = "quarterly", Weight = 30, DueDate = "2026-08-31", Status = "at-risk", Progress = 35, KeyResults = new() { new KeyResult { Title = "Coverage to 80%", Target = 80, Current = 58 } } },
                new Goal { Id = "g3", UserId = "e1", Title = "Mentor a junior engineer", Description = "Onboard and mentor a new team member", Category = "individual", Type = "annual", Weight = 30, DueDate = "2026-12-31", Status = "in-progress", Progress = 50, KeyResults = new() { new KeyResult { Title = "Weekly 1:1s", Target = 24, Current = 12 } } }
            );

            context.Set<PerformanceReview>().Add(
                new PerformanceReview { Id = "rev1", UserId = "e1", Period = "Q1 2026", Type = "quarterly", OverallRating = 4.3, GoalsAchieved = 3, GoalsTotal = 4, Recommendations = "Ready for senior responsibilities next cycle.", Comments = "Grateful for the support from the team this quarter.",
                    CategoryRatings = new() { new CategoryRating { Category = "Delivery", Rating = 4.5 }, new CategoryRating { Category = "Collaboration", Rating = 4.2 }, new CategoryRating { Category = "Ownership", Rating = 4.0 }, new CategoryRating { Category = "Communication", Rating = 4.4 } },
                    Strengths = new() { "Strong technical execution", "Reliable under pressure" }, Improvements = new() { "Delegate more", "Document decisions" } }
            );

            context.Set<ValueContribution>().AddRange(
                new ValueContribution { Id = "c1", UserId = "e1", Title = "Automated release checklist", Description = "Built a script that cut release prep time in half", Type = "self-initiated", Category = "process-improvement", Points = 120, SuggestedPoints = 100, Impact = "high", Status = "completed", Tags = new() { "automation", "devex" }, Approvals = new() { new ApprovalStep { Level = "Manager", Approver = "Michael Torres", Status = "approved", Comment = "Great impact", ActedOn = "2026-06-01" } } },
                new ValueContribution { Id = "c2", UserId = "e2", Title = "Reduced cloud spend", Description = "Right-sized staging infrastructure", Type = "committed", Category = "cost-saving", Points = 90, SuggestedPoints = 90, Impact = "medium", Status = "under-review", Tags = new() { "cost" }, Approvals = new() { new ApprovalStep { Level = "Manager", Approver = "Michael Torres", Status = "pending" } } },
                new ValueContribution { Id = "c3", UserId = "e1", Title = "Internal design system docs", Description = "Documented shared components for the org", Type = "assigned", Category = "quality", Points = 0, SuggestedPoints = 60, Impact = "medium", Status = "in-progress", Tags = new() { "docs" } }
            );

            context.Set<ContributionItem>().AddRange(
                new ContributionItem { Id = "ci1", Title = "Write onboarding runbook", Category = "process-improvement", SuggestedPoints = 50 },
                new ContributionItem { Id = "ci2", Title = "Run a lunch-and-learn session", Category = "team-building", SuggestedPoints = 40 },
                new ContributionItem { Id = "ci3", Title = "Prototype an AI support bot", Category = "innovation", SuggestedPoints = 80 },
                new ContributionItem { Id = "ci4", Title = "Improve checkout conversion", Category = "revenue-generation", SuggestedPoints = 100, ClaimedBy = "e2" }
            );

            context.Set<LeaderboardEntry>().AddRange(
                new LeaderboardEntry { Id = "le1", UserId = "e1", Points = 320, Badges = new() { "Innovator", "Mentor" }, AvgRating = 4.5 },
                new LeaderboardEntry { Id = "le2", UserId = "e2", Points = 280, Badges = new() { "Cost Saver" }, AvgRating = 4.2 },
                new LeaderboardEntry { Id = "le3", UserId = "e3", Points = 190, Badges = new() { "Quality Champ" }, AvgRating = 4.0 },
                new LeaderboardEntry { Id = "le4", UserId = "e4", Points = 140, Badges = new(), AvgRating = 3.8 }
            );

            context.Set<TrainingModule>().AddRange(
                new TrainingModule { Id = "tr1", UserId = "e1", Title = "Security Awareness 2026", Category = "compliance", Duration = "45 min", DueDate = "2026-07-15", Mandatory = true, Status = "in-progress", Progress = 40, CertificateEligible = true, Contents = new() { new TrainingContent { Title = "Phishing basics", Type = "video", Completed = true }, new TrainingContent { Title = "Password hygiene", Type = "document", Completed = true }, new TrainingContent { Title = "Final quiz", Type = "quiz", Completed = false } } },
                new TrainingModule { Id = "tr2", UserId = "e1", Title = "Advanced React Patterns", Category = "technical", Duration = "2 h", DueDate = "2026-08-01", Mandatory = false, Status = "not-started", Progress = 0, CertificateEligible = true, Contents = new() { new TrainingContent { Title = "Hooks deep dive", Type = "video", Completed = false }, new TrainingContent { Title = "Hands-on lab", Type = "interactive", Completed = false } } },
                new TrainingModule { Id = "tr3", UserId = "e1", Title = "Company Orientation", Category = "orientation", Duration = "30 min", DueDate = "2026-05-01", Mandatory = true, Status = "completed", Progress = 100, CertificateEligible = true, Contents = new() { new TrainingContent { Title = "Welcome video", Type = "video", Completed = true }, new TrainingContent { Title = "Policies overview", Type = "document", Completed = true } } }
            );

            context.Set<JobPosting>().AddRange(
                new JobPosting { Id = "j1", Title = "Senior Backend Engineer", Department = "Engineering", Location = "Remote (US)", EmploymentType = "Full-time", Experience = "5+ years", SalaryRange = "$130k - $160k", Requirements = new() { "Go or C#", "Distributed systems", "PostgreSQL" }, Responsibilities = new() { "Design services", "Mentor engineers" }, Status = "open", Applicants = 42, Shortlisted = 8, Interviewing = 3 },
                new JobPosting { Id = "j2", Title = "Product Designer", Department = "Design", Location = "Bengaluru, IN", EmploymentType = "Full-time", Experience = "3+ years", SalaryRange = "₹18L - ₹26L", Requirements = new() { "Figma", "Design systems" }, Responsibilities = new() { "Own product flows", "Run research" }, Status = "open", Applicants = 31, Shortlisted = 5, Interviewing = 2 }
            );

            context.Set<Candidate>().AddRange(
                new Candidate { Id = "cand1", JobId = "j1", Name = "Daniel Wright", AppliedRole = "Senior Backend Engineer", Status = "interview-scheduled", Rating = 4, Skills = new() { "C#", "Kubernetes", "PostgreSQL" }, Experience = "7 years", ExpectedSalary = "$150k", NoticePeriod = "30 days", Notes = "Strong systems background", InterviewDate = "2026-06-28" },
                new Candidate { Id = "cand2", JobId = "j1", Name = "Nina Rao", AppliedRole = "Senior Backend Engineer", Status = "shortlisted", Rating = 5, Skills = new() { "Go", "gRPC", "AWS" }, Experience = "6 years", ExpectedSalary = "$145k", NoticePeriod = "Immediate", Notes = "Excellent referral" },
                new Candidate { Id = "cand3", JobId = "j2", Name = "Leo Martins", AppliedRole = "Product Designer", Status = "new", Rating = 3, Skills = new() { "Figma", "Prototyping" }, Experience = "4 years", ExpectedSalary = "₹22L", NoticePeriod = "60 days", Notes = "Good portfolio" },
                new Candidate { Id = "cand4", JobId = "j1", Name = "Sofia Greco", AppliedRole = "Senior Backend Engineer", Status = "interviewed", Rating = 4, Skills = new() { "C#", "Azure" }, Experience = "8 years", ExpectedSalary = "$158k", NoticePeriod = "45 days", Notes = "Pending feedback", InterviewDate = "2026-06-20" }
            );

            context.Set<Recognition>().AddRange(
                new Recognition { Id = "rg1", FromUserId = "m1", ToUserId = "e1", Category = "excellence", Message = "Sarah's payments work was outstanding this sprint!", Visibility = "public", Likes = 12, Comments = 3, CreatedOnDate = "2026-06-22" },
                new Recognition { Id = "rg2", FromUserId = "e2", ToUserId = "e3", Category = "team-player", Message = "Emily jumped in to unblock the release. Legend!", Visibility = "public", Likes = 8, Comments = 1, CreatedOnDate = "2026-06-21" },
                new Recognition { Id = "rg3", FromUserId = "h1", ToUserId = "m1", Category = "leadership", Message = "Thank you Michael for mentoring the new hires.", Visibility = "public", Likes = 15, Comments = 4, CreatedOnDate = "2026-06-19" }
            );

            context.Set<Announcement>().AddRange(
                new Announcement { Id = "an1", Title = "Updated Leave Policy 2026", Category = "policy", Priority = "high", Content = "We have revised the carry-forward limits. Please review and acknowledge.", Scope = "global", Target = "All employees", Attachments = new() { "leave-policy-2026.pdf" }, ExpiryDate = "2026-08-01", Views = 240, Likes = 18, Acknowledgments = 156, Comments = 9, RequiresAck = true, AcknowledgedBy = new(), CreatedOnDate = "2026-06-18", AuthorId = "h1" },
                new Announcement { Id = "an2", Title = "Summer Town Hall", Category = "event", Priority = "medium", Content = "Join us for the quarterly town hall this Friday at 4 PM.", Scope = "global", Target = "All employees", Attachments = new(), ExpiryDate = "2026-06-27", Views = 198, Likes = 33, Acknowledgments = 0, Comments = 12, RequiresAck = false, AcknowledgedBy = new(), CreatedOnDate = "2026-06-20", AuthorId = "h1" },
                new Announcement { Id = "an3", Title = "Security Compliance Reminder", Category = "compliance", Priority = "high", Content = "Complete the mandatory security training before July 15.", Scope = "department", Target = "Engineering", Attachments = new(), ExpiryDate = "2026-07-15", Views = 88, Likes = 4, Acknowledgments = 40, Comments = 1, RequiresAck = true, AcknowledgedBy = new(), CreatedOnDate = "2026-06-15", AuthorId = "a1" }
            );

            context.Set<OnboardingTask>().AddRange(
                new OnboardingTask { Id = "ot1", Phase = "pre-joining", Title = "Sign offer letter", Description = "Review and e-sign the offer", DueDate = "2026-06-20", Priority = "high", Assignee = "Alex Johnson", Status = "completed", CompletedDate = "2026-06-19" },
                new OnboardingTask { Id = "ot2", Phase = "pre-joining", Title = "Submit tax forms", Description = "Upload W-4 and state forms", DueDate = "2026-06-24", Priority = "high", Assignee = "Alex Johnson", Status = "pending" },
                new OnboardingTask { Id = "ot3", Phase = "pre-joining", Title = "Add bank details", Description = "Enter payroll bank account", DueDate = "2026-06-25", Priority = "medium", Assignee = "Alex Johnson", Status = "pending" },
                new OnboardingTask { Id = "ot4", Phase = "day-1", Title = "Collect laptop", Description = "Pick up device from IT", DueDate = "2026-06-30", Priority = "high", Assignee = "IT", Status = "pending" },
                new OnboardingTask { Id = "ot5", Phase = "week-1", Title = "Meet your team", Description = "Intro calls with the team", DueDate = "2026-07-04", Priority = "medium", Assignee = "Alex Johnson", Status = "pending" },
                new OnboardingTask { Id = "ot6", Phase = "week-2", Title = "Setup dev environment", Description = "Clone repos and run locally", DueDate = "2026-07-11", Priority = "medium", Assignee = "Alex Johnson", Status = "pending" },
                new OnboardingTask { Id = "ot7", Phase = "month-1", Title = "First 1:1 with manager", Description = "30-day check-in", DueDate = "2026-07-30", Priority = "low", Assignee = "Michael Torres", Status = "pending" }
            );

            context.Set<WelcomeMessage>().AddRange(
                new WelcomeMessage { Id = "wm1", FromName = "Aisha Khan", Role = "CEO", Message = "Welcome to WorkFlow, Alex! Thrilled to have you on board.", HasVideo = true },
                new WelcomeMessage { Id = "wm2", FromName = "Michael Torres", Role = "Manager", Message = "Excited to work with you. Reach out anytime!", HasVideo = false },
                new WelcomeMessage { Id = "wm3", FromName = "Sarah Chen", Role = "Buddy", Message = "I'm your onboarding buddy. Let's grab a coffee on day one.", HasVideo = false }
            );

            context.Set<RelocationSupport>().Add(
                new RelocationSupport { Id = "rs1", RelocationStatus = "In progress", VisaStatus = "H-1B approved", Accommodation = "Corporate housing booked for 30 days", Travel = "Flight confirmed for June 28", Allowance = "$3,000 relocation allowance", LocalBuddy = "Sarah Chen", Tickets = new() { new RelocationTicket { Id = "rt1", Title = "Shipping personal items", Status = "in-progress" }, new RelocationTicket { Id = "rt2", Title = "Local bank account setup", Status = "open" } } }
            );

            context.Set<TeamIntroduction>().AddRange(
                new TeamIntroduction { Id = "ti1", MemberId = "e1", Bio = "Software Engineer focused on payments.", Expertise = new() { "React", "Payments", "TypeScript" }, FunFacts = new() { "Loves hiking", "Makes espresso" }, Introduced = true, Welcomed = true },
                new TeamIntroduction { Id = "ti2", MemberId = "e2", Bio = "Frontend Engineer and design-system fan.", Expertise = new() { "React", "CSS", "Accessibility" }, FunFacts = new() { "Plays guitar" }, Introduced = true, Welcomed = false },
                new TeamIntroduction { Id = "ti3", MemberId = "e3", Bio = "QA Engineer who breaks things on purpose.", Expertise = new() { "Automation", "Cypress" }, FunFacts = new() { "Marathon runner" }, Introduced = false, Welcomed = false }
            );

            context.Set<OnboardingMilestone>().AddRange(
                new OnboardingMilestone { Id = "ms1", Title = "Day 1 welcome", Date = "2026-06-30", Type = "celebration", Status = "upcoming" },
                new OnboardingMilestone { Id = "ms2", Title = "Week 1 check-in", Date = "2026-07-04", Type = "check-in", Status = "upcoming" },
                new OnboardingMilestone { Id = "ms3", Title = "30-day review", Date = "2026-07-30", Type = "review", Status = "upcoming" },
                new OnboardingMilestone { Id = "ms4", Title = "90-day completion", Date = "2026-09-28", Type = "celebration", Status = "upcoming" }
            );

            context.Set<NewJoinerProfile>().Add(
                new NewJoinerProfile { Id = "nj1", Name = "Alex Johnson", Designation = "Software Engineer", Department = "Engineering", Manager = "Michael Torres", Buddy = "Sarah Chen", JoiningDate = "2026-06-30" }
            );

            context.SaveChanges();
        }
    }
}
