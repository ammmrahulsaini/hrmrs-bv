using HRMS.Core.Postgres.Data;
using HRMS.Shared.Application.GraphQL;
using HotChocolate;
using HotChocolate.Types;
using HrmsFeature.Domain;
using Microsoft.EntityFrameworkCore;

namespace HrmsFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class HrmsMutation
    {
        private static string Now() => DateTime.UtcNow.ToString("HH:mm");
        private static string Today() => DateTime.UtcNow.ToString("yyyy-MM-dd");
        private static string Uid(string prefix) => $"{prefix}-{Guid.NewGuid().ToString("N")[..8]}";

        public async Task<AttendanceRecord> ClockInAsync(string userId, string method, [Service] PostgresDbContext db)
        {
            var record = new AttendanceRecord
            {
                Id = Uid("att"),
                UserId = userId,
                Date = Today(),
                ClockIn = Now(),
                ClockOut = null,
                Status = "present",
                Method = method,
                LocationVerified = true,
                IpValidated = true,
            };
            db.Set<AttendanceRecord>().Add(record);
            await db.SaveChangesAsync();
            return record;
        }

        public async Task<AttendanceRecord?> ClockOutAsync(string userId, [Service] PostgresDbContext db)
        {
            var record = await db.Set<AttendanceRecord>()
                .Where(x => x.UserId == userId && x.ClockOut == null)
                .OrderByDescending(x => x.Date)
                .FirstOrDefaultAsync();
            if (record == null) return null;

            record.ClockOut = Now();
            var total = HoursBetween(record.ClockIn, record.ClockOut);
            record.TotalHours = total;
            record.BreakHours = 0.8;
            record.ProductiveHours = Math.Max(0, Math.Round((total - 0.8) * 10) / 10);
            record.OvertimeHours = total > 9 ? Math.Round((total - 9) * 10) / 10 : 0;
            await db.SaveChangesAsync();
            return record;
        }

        public async Task<LeaveRequest> SubmitLeaveAsync(SubmitLeaveInput input, [Service] PostgresDbContext db)
        {
            var request = new LeaveRequest
            {
                Id = Uid("lv"),
                UserId = input.UserId,
                Type = input.Type,
                StartDate = input.StartDate,
                EndDate = input.EndDate,
                TotalDays = input.TotalDays,
                Reason = input.Reason,
                Status = "pending",
                AppliedOn = Today(),
                Approvals = new List<ApprovalStep>
                {
                    new() { Level = "Manager", Approver = "Michael Torres", Status = "pending" },
                    new() { Level = "HR", Approver = "Priya Sharma", Status = "pending" },
                },
            };
            db.Set<LeaveRequest>().Add(request);

            var balance = await db.Set<LeaveBalance>().FirstOrDefaultAsync(b => b.UserId == input.UserId && b.Type == input.Type);
            if (balance != null)
            {
                balance.Pending += input.TotalDays;
                balance.Available = Math.Max(0, balance.Available - input.TotalDays);
            }
            await db.SaveChangesAsync();
            return request;
        }

        public async Task<LeaveRequest?> ActOnLeaveAsync(string id, string level, string decision, string comment, [Service] PostgresDbContext db)
        {
            var request = await db.Set<LeaveRequest>().FirstOrDefaultAsync(x => x.Id == id);
            if (request == null) return null;

            request.Approvals = request.Approvals
                .Select(a => a.Level == level ? new ApprovalStep { Level = a.Level, Approver = a.Approver, Status = decision, Comment = comment, ActedOn = Today() } : a)
                .ToList();
            request.Status = request.Approvals.Any(a => a.Status == "rejected") ? "rejected"
                : request.Approvals.All(a => a.Status == "approved") ? "approved" : "pending";
            await db.SaveChangesAsync();
            return request;
        }

        public async Task<Reimbursement> SubmitExpenseAsync(SubmitExpenseInput input, [Service] PostgresDbContext db)
        {
            var claim = new Reimbursement
            {
                Id = Uid("ex"),
                UserId = input.UserId,
                Category = input.Category,
                Amount = input.Amount,
                Currency = input.Currency,
                Description = input.Description,
                Date = input.Date,
                Receipts = string.IsNullOrWhiteSpace(input.Receipt) ? new List<string>() : new List<string> { input.Receipt },
                Taxable = false,
                WithinPolicy = input.Amount <= 500,
                PolicyNote = input.Amount <= 500 ? "Within policy limit" : "Exceeds policy limit, needs review",
                Status = "pending-approval",
                Approvals = new List<ApprovalStep> { new() { Level = "Manager", Approver = "Michael Torres", Status = "pending" } },
            };
            db.Set<Reimbursement>().Add(claim);
            await db.SaveChangesAsync();
            return claim;
        }

        public async Task<Reimbursement?> ActOnExpenseAsync(string id, string decision, string comment, [Service] PostgresDbContext db)
        {
            var claim = await db.Set<Reimbursement>().FirstOrDefaultAsync(x => x.Id == id);
            if (claim == null) return null;
            claim.Status = decision == "approved" ? "approved" : "rejected";
            claim.Approvals = claim.Approvals.Select(a => new ApprovalStep { Level = a.Level, Approver = a.Approver, Status = decision, Comment = comment, ActedOn = Today() }).ToList();
            await db.SaveChangesAsync();
            return claim;
        }

        public async Task<EmployeeDocument?> UploadDocumentAsync(string id, [Service] PostgresDbContext db)
        {
            var doc = await db.Set<EmployeeDocument>().FirstOrDefaultAsync(x => x.Id == id);
            if (doc == null) return null;
            doc.Status = "uploaded";
            doc.UploadedOn = Today();
            doc.FileType = "PDF";
            doc.Size = "0.8 MB";
            doc.RejectionReason = null;
            await db.SaveChangesAsync();
            return doc;
        }

        public async Task<EmployeeDocument?> ReviewDocumentAsync(string id, string decision, string reason, [Service] PostgresDbContext db)
        {
            var doc = await db.Set<EmployeeDocument>().FirstOrDefaultAsync(x => x.Id == id);
            if (doc == null) return null;
            doc.Status = decision;
            doc.VerifiedOn = decision == "verified" ? Today() : null;
            doc.RejectionReason = decision == "rejected" ? reason : null;
            await db.SaveChangesAsync();
            return doc;
        }

        public async Task<ContributionItem?> ClaimItemAsync(string id, string userId, [Service] PostgresDbContext db)
        {
            var item = await db.Set<ContributionItem>().FirstOrDefaultAsync(x => x.Id == id);
            if (item == null) return null;
            item.ClaimedBy = userId;
            await db.SaveChangesAsync();
            return item;
        }

        public async Task<ValueContribution?> ApproveContributionAsync(string id, int points, string comment, [Service] PostgresDbContext db)
        {
            var contribution = await db.Set<ValueContribution>().FirstOrDefaultAsync(x => x.Id == id);
            if (contribution == null) return null;
            contribution.Status = "completed";
            contribution.Points = points;
            contribution.Approvals = new List<ApprovalStep> { new() { Level = "Manager", Approver = "Michael Torres", Status = "approved", Comment = comment, ActedOn = Today() } };
            await db.SaveChangesAsync();
            return contribution;
        }

        public async Task<TrainingModule?> CompleteContentAsync(string moduleId, int index, [Service] PostgresDbContext db)
        {
            var module = await db.Set<TrainingModule>().FirstOrDefaultAsync(x => x.Id == moduleId);
            if (module == null) return null;
            var contents = module.Contents.Select((c, i) => i == index ? new TrainingContent { Title = c.Title, Type = c.Type, Completed = true } : c).ToList();
            var done = contents.Count(c => c.Completed);
            module.Contents = contents;
            module.Progress = (int)Math.Round((double)done / contents.Count * 100);
            module.Status = module.Progress == 100 ? "completed" : module.Progress == 0 ? "not-started" : "in-progress";
            await db.SaveChangesAsync();
            return module;
        }

        public async Task<Candidate?> UpdateCandidateAsync(string id, string status, string? interviewDate, [Service] PostgresDbContext db)
        {
            var candidate = await db.Set<Candidate>().FirstOrDefaultAsync(x => x.Id == id);
            if (candidate == null) return null;
            candidate.Status = status;
            if (!string.IsNullOrWhiteSpace(interviewDate)) candidate.InterviewDate = interviewDate;
            await db.SaveChangesAsync();
            return candidate;
        }

        public async Task<Recognition> SendRecognitionAsync(SendRecognitionInput input, [Service] PostgresDbContext db)
        {
            var recognition = new Recognition
            {
                Id = Uid("rg"),
                FromUserId = input.FromUserId,
                ToUserId = input.ToUserId,
                Category = input.Category,
                Message = input.Message,
                Visibility = input.Visibility,
                Likes = 0,
                Comments = 0,
                CreatedOnDate = Today(),
            };
            db.Set<Recognition>().Add(recognition);
            await db.SaveChangesAsync();
            return recognition;
        }

        public async Task<Recognition?> ToggleLikeAsync(string id, bool liked, [Service] PostgresDbContext db)
        {
            var recognition = await db.Set<Recognition>().FirstOrDefaultAsync(x => x.Id == id);
            if (recognition == null) return null;
            recognition.Likes = Math.Max(0, recognition.Likes + (liked ? 1 : -1));
            await db.SaveChangesAsync();
            return recognition;
        }

        public async Task<Announcement> CreateAnnouncementAsync(CreateAnnouncementInput input, [Service] PostgresDbContext db)
        {
            var announcement = new Announcement
            {
                Id = Uid("an"),
                Title = input.Title,
                Category = input.Category,
                Priority = input.Priority,
                Content = input.Content,
                Scope = input.Scope,
                Target = input.Target,
                Attachments = new List<string>(),
                Views = 0,
                Likes = 0,
                Acknowledgments = 0,
                Comments = 0,
                RequiresAck = input.RequiresAck,
                AcknowledgedBy = new List<string>(),
                CreatedOnDate = Today(),
                AuthorId = input.AuthorId,
            };
            db.Set<Announcement>().Add(announcement);
            await db.SaveChangesAsync();
            return announcement;
        }

        public async Task<Announcement?> AcknowledgeAnnouncementAsync(string id, string userId, [Service] PostgresDbContext db)
        {
            var announcement = await db.Set<Announcement>().FirstOrDefaultAsync(x => x.Id == id);
            if (announcement == null) return null;
            if (!announcement.AcknowledgedBy.Contains(userId))
            {
                announcement.AcknowledgedBy = announcement.AcknowledgedBy.Append(userId).ToList();
                announcement.Acknowledgments += 1;
            }
            await db.SaveChangesAsync();
            return announcement;
        }

        public async Task<OnboardingTask?> CompleteTaskAsync(string id, [Service] PostgresDbContext db)
        {
            var task = await db.Set<OnboardingTask>().FirstOrDefaultAsync(x => x.Id == id);
            if (task == null) return null;
            task.Status = "completed";
            task.CompletedDate = Today();
            await db.SaveChangesAsync();
            return task;
        }

        private static double HoursBetween(string? start, string? end)
        {
            if (string.IsNullOrEmpty(start) || string.IsNullOrEmpty(end)) return 0;
            var s = ToMinutes(start);
            var e = ToMinutes(end);
            return Math.Max(0, Math.Round((e - s) / 6.0) / 10);
        }

        private static int ToMinutes(string hhmm)
        {
            var parts = hhmm.Split(':');
            return int.Parse(parts[0]) * 60 + int.Parse(parts[1]);
        }
    }
}
