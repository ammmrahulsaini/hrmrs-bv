using HRMS.Core.Postgres.Common;

namespace HrmsFeature.Domain
{
    public class Employee : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string? ManagerId { get; set; }
        public string? ReportingManagerId { get; set; }
        public string Country { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string JoiningDate { get; set; } = string.Empty;
        public string Status { get; set; } = "active";
        public string AvatarColor { get; set; } = "bg-teal-600";
    }

    public class Shift : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Start { get; set; } = string.Empty;
        public string End { get; set; } = string.Empty;
        public bool Current { get; set; }
    }

    public class AttendanceRecord : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string? ClockIn { get; set; }
        public string? ClockOut { get; set; }
        public string Status { get; set; } = "present";
        public string Method { get; set; } = "selfie";
        public bool LocationVerified { get; set; }
        public bool IpValidated { get; set; }
        public double TotalHours { get; set; }
        public double ProductiveHours { get; set; }
        public double BreakHours { get; set; }
        public double OvertimeHours { get; set; }
        public string? Exception { get; set; }
    }

    public class LeaveBalance : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Total { get; set; }
        public int Used { get; set; }
        public int Pending { get; set; }
        public int Available { get; set; }
        public int CarriedForward { get; set; }
        public int Encashed { get; set; }
    }

    public class ApprovalStep
    {
        public string Level { get; set; } = string.Empty;
        public string Approver { get; set; } = string.Empty;
        public string Status { get; set; } = "pending";
        public string? Comment { get; set; }
        public string? ActedOn { get; set; }
    }

    public class LeaveRequest : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string StartDate { get; set; } = string.Empty;
        public string EndDate { get; set; } = string.Empty;
        public int TotalDays { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = "pending";
        public string AppliedOn { get; set; } = string.Empty;
        public List<ApprovalStep> Approvals { get; set; } = new();
    }

    public class PayComponent
    {
        public string Label { get; set; } = string.Empty;
        public double Amount { get; set; }
    }

    public class PayrollRecord : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string Period { get; set; } = string.Empty;
        public string PayDate { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
        public List<PayComponent> Earnings { get; set; } = new();
        public List<PayComponent> Deductions { get; set; } = new();
        public List<PayComponent> EmployerContributions { get; set; } = new();
        public double Gross { get; set; }
        public double TotalDeductions { get; set; }
        public double Net { get; set; }
        public string Status { get; set; } = "paid";
    }

    public class EmployeeDocument : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Status { get; set; } = "missing";
        public string FileType { get; set; } = "-";
        public string Size { get; set; } = "-";
        public string? UploadedOn { get; set; }
        public string? VerifiedOn { get; set; }
        public string? ExpiryDate { get; set; }
        public string? RejectionReason { get; set; }
    }

    public class Mileage
    {
        public double Distance { get; set; }
        public string From { get; set; } = string.Empty;
        public string To { get; set; } = string.Empty;
        public string Vehicle { get; set; } = string.Empty;
        public double RatePerKm { get; set; }
    }

    public class Reimbursement : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public double Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public List<string> Receipts { get; set; } = new();
        public Mileage? Mileage { get; set; }
        public bool Taxable { get; set; }
        public bool WithinPolicy { get; set; }
        public string PolicyNote { get; set; } = string.Empty;
        public string Status { get; set; } = "pending-approval";
        public string? PaidOn { get; set; }
        public List<ApprovalStep> Approvals { get; set; } = new();
    }

    public class KeyResult
    {
        public string Title { get; set; } = string.Empty;
        public double Target { get; set; }
        public double Current { get; set; }
        public bool Completed { get; set; }
    }

    public class Goal : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Weight { get; set; }
        public string DueDate { get; set; } = string.Empty;
        public string Status { get; set; } = "in-progress";
        public int Progress { get; set; }
        public List<KeyResult> KeyResults { get; set; } = new();
    }

    public class CategoryRating
    {
        public string Category { get; set; } = string.Empty;
        public double Rating { get; set; }
    }

    public class PerformanceReview : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string Period { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public double OverallRating { get; set; }
        public List<CategoryRating> CategoryRatings { get; set; } = new();
        public List<string> Strengths { get; set; } = new();
        public List<string> Improvements { get; set; } = new();
        public int GoalsAchieved { get; set; }
        public int GoalsTotal { get; set; }
        public string Recommendations { get; set; } = string.Empty;
        public string Comments { get; set; } = string.Empty;
    }

    public class ValueContribution : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int Points { get; set; }
        public int SuggestedPoints { get; set; }
        public string Impact { get; set; } = "medium";
        public string Status { get; set; } = "in-progress";
        public List<string> Tags { get; set; } = new();
        public List<ApprovalStep> Approvals { get; set; } = new();
    }

    public class ContributionItem : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int SuggestedPoints { get; set; }
        public string? ClaimedBy { get; set; }
    }

    public class LeaderboardEntry : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public int Points { get; set; }
        public List<string> Badges { get; set; } = new();
        public double AvgRating { get; set; }
    }

    public class TrainingContent
    {
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = "video";
        public bool Completed { get; set; }
    }

    public class TrainingModule : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public string DueDate { get; set; } = string.Empty;
        public bool Mandatory { get; set; }
        public string Status { get; set; } = "not-started";
        public int Progress { get; set; }
        public bool CertificateEligible { get; set; }
        public List<TrainingContent> Contents { get; set; } = new();
    }

    public class JobPosting : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string EmploymentType { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
        public string SalaryRange { get; set; } = string.Empty;
        public List<string> Requirements { get; set; } = new();
        public List<string> Responsibilities { get; set; } = new();
        public string Status { get; set; } = "open";
        public int Applicants { get; set; }
        public int Shortlisted { get; set; }
        public int Interviewing { get; set; }
    }

    public class Candidate : BaseEntity
    {
        public string JobId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string AppliedRole { get; set; } = string.Empty;
        public string Status { get; set; } = "new";
        public int Rating { get; set; }
        public List<string> Skills { get; set; } = new();
        public string Experience { get; set; } = string.Empty;
        public string ExpectedSalary { get; set; } = string.Empty;
        public string NoticePeriod { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string? InterviewDate { get; set; }
    }

    public class Recognition : BaseEntity
    {
        public string FromUserId { get; set; } = string.Empty;
        public string ToUserId { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Visibility { get; set; } = "public";
        public int Likes { get; set; }
        public int Comments { get; set; }
        public string CreatedOnDate { get; set; } = string.Empty;
    }

    public class Announcement : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Priority { get; set; } = "medium";
        public string Content { get; set; } = string.Empty;
        public string Scope { get; set; } = "global";
        public string Target { get; set; } = string.Empty;
        public List<string> Attachments { get; set; } = new();
        public string? ExpiryDate { get; set; }
        public int Views { get; set; }
        public int Likes { get; set; }
        public int Acknowledgments { get; set; }
        public int Comments { get; set; }
        public bool RequiresAck { get; set; }
        public List<string> AcknowledgedBy { get; set; } = new();
        public string CreatedOnDate { get; set; } = string.Empty;
        public string AuthorId { get; set; } = string.Empty;
    }

    public class OnboardingTask : BaseEntity
    {
        public string Phase { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string DueDate { get; set; } = string.Empty;
        public string Priority { get; set; } = "medium";
        public string Assignee { get; set; } = string.Empty;
        public string Status { get; set; } = "pending";
        public string? CompletedDate { get; set; }
    }

    public class WelcomeMessage : BaseEntity
    {
        public string FromName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool HasVideo { get; set; }
    }

    public class RelocationTicket
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = "open";
    }

    public class RelocationSupport : BaseEntity
    {
        public string RelocationStatus { get; set; } = string.Empty;
        public string VisaStatus { get; set; } = string.Empty;
        public string Accommodation { get; set; } = string.Empty;
        public string Travel { get; set; } = string.Empty;
        public string Allowance { get; set; } = string.Empty;
        public string LocalBuddy { get; set; } = string.Empty;
        public List<RelocationTicket> Tickets { get; set; } = new();
    }

    public class TeamIntroduction : BaseEntity
    {
        public string MemberId { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public List<string> Expertise { get; set; } = new();
        public List<string> FunFacts { get; set; } = new();
        public bool Introduced { get; set; }
        public bool Welcomed { get; set; }
    }

    public class OnboardingMilestone : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string Type { get; set; } = "check-in";
        public string Status { get; set; } = "upcoming";
    }

    public class NewJoinerProfile : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Manager { get; set; } = string.Empty;
        public string Buddy { get; set; } = string.Empty;
        public string JoiningDate { get; set; } = string.Empty;
    }
}
