using HRMS.Core.Postgres.Common;
using HRMS.Core.Postgres.Interfaces;
using HrmsFeature.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmsFeature.Infrastructure
{
    public class HrmsEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            Map<Employee>(modelBuilder);
            Map<Shift>(modelBuilder);
            Map<AttendanceRecord>(modelBuilder);
            Map<LeaveBalance>(modelBuilder);
            Map<LeaveRequest>(modelBuilder, e => e.OwnsMany(x => x.Approvals, b => b.ToJson()));
            Map<PayrollRecord>(modelBuilder, e =>
            {
                e.OwnsMany(x => x.Earnings, b => b.ToJson());
                e.OwnsMany(x => x.Deductions, b => b.ToJson());
                e.OwnsMany(x => x.EmployerContributions, b => b.ToJson());
            });
            Map<EmployeeDocument>(modelBuilder);
            Map<Reimbursement>(modelBuilder, e =>
            {
                e.OwnsOne(x => x.Mileage, b => b.ToJson());
                e.OwnsMany(x => x.Approvals, b => b.ToJson());
            });
            Map<Goal>(modelBuilder, e => e.OwnsMany(x => x.KeyResults, b => b.ToJson()));
            Map<PerformanceReview>(modelBuilder, e => e.OwnsMany(x => x.CategoryRatings, b => b.ToJson()));
            Map<ValueContribution>(modelBuilder, e => e.OwnsMany(x => x.Approvals, b => b.ToJson()));
            Map<ContributionItem>(modelBuilder);
            Map<LeaderboardEntry>(modelBuilder);
            Map<TrainingModule>(modelBuilder, e => e.OwnsMany(x => x.Contents, b => b.ToJson()));
            Map<JobPosting>(modelBuilder);
            Map<Candidate>(modelBuilder);
            Map<Recognition>(modelBuilder);
            Map<Announcement>(modelBuilder);
            Map<OnboardingTask>(modelBuilder);
            Map<WelcomeMessage>(modelBuilder);
            Map<RelocationSupport>(modelBuilder, e => e.OwnsMany(x => x.Tickets, b => b.ToJson()));
            Map<TeamIntroduction>(modelBuilder);
            Map<OnboardingMilestone>(modelBuilder);
            Map<NewJoinerProfile>(modelBuilder);
        }

        private static void Map<T>(ModelBuilder modelBuilder, Action<EntityTypeBuilder<T>>? extra = null) where T : BaseEntity
        {
            modelBuilder.Entity<T>(e =>
            {
                e.ToTable(typeof(T).Name);
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasMaxLength(128);
                e.Property(x => x.DocumentType).IsRequired().HasMaxLength(128);
                extra?.Invoke(e);
            });
        }
    }
}
