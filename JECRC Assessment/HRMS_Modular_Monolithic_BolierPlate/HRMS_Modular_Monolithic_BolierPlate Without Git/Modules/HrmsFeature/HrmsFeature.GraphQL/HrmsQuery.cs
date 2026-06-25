using HRMS.Core.Postgres.Data;
using HRMS.Shared.Application.GraphQL;
using HotChocolate;
using HotChocolate.Types;
using HrmsFeature.Domain;
using Microsoft.EntityFrameworkCore;

namespace HrmsFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class HrmsQuery
    {
        public Task<List<Employee>> GetEmployeesAsync([Service] PostgresDbContext db) => db.Set<Employee>().AsNoTracking().ToListAsync();

        public Task<List<Shift>> GetShiftsAsync([Service] PostgresDbContext db) => db.Set<Shift>().AsNoTracking().ToListAsync();

        public Task<List<AttendanceRecord>> GetAttendanceRecordsAsync([Service] PostgresDbContext db) => db.Set<AttendanceRecord>().AsNoTracking().ToListAsync();

        public Task<List<LeaveBalance>> GetLeaveBalancesAsync([Service] PostgresDbContext db) => db.Set<LeaveBalance>().AsNoTracking().ToListAsync();

        public Task<List<LeaveRequest>> GetLeaveRequestsAsync([Service] PostgresDbContext db) => db.Set<LeaveRequest>().AsNoTracking().ToListAsync();

        public Task<List<PayrollRecord>> GetPayrollRecordsAsync([Service] PostgresDbContext db) => db.Set<PayrollRecord>().AsNoTracking().ToListAsync();

        public Task<List<EmployeeDocument>> GetDocumentsAsync([Service] PostgresDbContext db) => db.Set<EmployeeDocument>().AsNoTracking().ToListAsync();

        public Task<List<Reimbursement>> GetReimbursementsAsync([Service] PostgresDbContext db) => db.Set<Reimbursement>().AsNoTracking().ToListAsync();

        public Task<List<Goal>> GetGoalsAsync([Service] PostgresDbContext db) => db.Set<Goal>().AsNoTracking().ToListAsync();

        public Task<List<PerformanceReview>> GetPerformanceReviewsAsync([Service] PostgresDbContext db) => db.Set<PerformanceReview>().AsNoTracking().ToListAsync();

        public Task<List<ValueContribution>> GetContributionsAsync([Service] PostgresDbContext db) => db.Set<ValueContribution>().AsNoTracking().ToListAsync();

        public Task<List<ContributionItem>> GetContributionItemsAsync([Service] PostgresDbContext db) => db.Set<ContributionItem>().AsNoTracking().ToListAsync();

        public Task<List<LeaderboardEntry>> GetLeaderboardAsync([Service] PostgresDbContext db) => db.Set<LeaderboardEntry>().AsNoTracking().ToListAsync();

        public Task<List<TrainingModule>> GetTrainingModulesAsync([Service] PostgresDbContext db) => db.Set<TrainingModule>().AsNoTracking().ToListAsync();

        public Task<List<JobPosting>> GetJobPostingsAsync([Service] PostgresDbContext db) => db.Set<JobPosting>().AsNoTracking().ToListAsync();

        public Task<List<Candidate>> GetCandidatesAsync([Service] PostgresDbContext db) => db.Set<Candidate>().AsNoTracking().ToListAsync();

        public Task<List<Recognition>> GetRecognitionsAsync([Service] PostgresDbContext db) => db.Set<Recognition>().AsNoTracking().ToListAsync();

        public Task<List<Announcement>> GetAnnouncementsAsync([Service] PostgresDbContext db) => db.Set<Announcement>().AsNoTracking().ToListAsync();

        public Task<List<OnboardingTask>> GetOnboardingTasksAsync([Service] PostgresDbContext db) => db.Set<OnboardingTask>().AsNoTracking().ToListAsync();

        public Task<List<WelcomeMessage>> GetWelcomeMessagesAsync([Service] PostgresDbContext db) => db.Set<WelcomeMessage>().AsNoTracking().ToListAsync();

        public Task<List<RelocationSupport>> GetRelocationSupportAsync([Service] PostgresDbContext db) => db.Set<RelocationSupport>().AsNoTracking().ToListAsync();

        public Task<List<TeamIntroduction>> GetTeamIntroductionsAsync([Service] PostgresDbContext db) => db.Set<TeamIntroduction>().AsNoTracking().ToListAsync();

        public Task<List<OnboardingMilestone>> GetOnboardingMilestonesAsync([Service] PostgresDbContext db) => db.Set<OnboardingMilestone>().AsNoTracking().ToListAsync();

        public Task<List<NewJoinerProfile>> GetNewJoinerProfilesAsync([Service] PostgresDbContext db) => db.Set<NewJoinerProfile>().AsNoTracking().ToListAsync();
    }
}
