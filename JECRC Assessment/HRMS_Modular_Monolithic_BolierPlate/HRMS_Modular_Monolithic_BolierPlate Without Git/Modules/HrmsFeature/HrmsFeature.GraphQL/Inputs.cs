namespace HrmsFeature.GraphQL
{
    public class SubmitLeaveInput
    {
        public string UserId { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string StartDate { get; set; } = string.Empty;
        public string EndDate { get; set; } = string.Empty;
        public int TotalDays { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class SubmitExpenseInput
    {
        public string UserId { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public double Amount { get; set; }
        public string Currency { get; set; } = "$";
        public string Description { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string? Receipt { get; set; }
    }

    public class SendRecognitionInput
    {
        public string FromUserId { get; set; } = string.Empty;
        public string ToUserId { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Visibility { get; set; } = "public";
    }

    public class CreateAnnouncementInput
    {
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Priority { get; set; } = "medium";
        public string Content { get; set; } = string.Empty;
        public string Scope { get; set; } = "global";
        public string Target { get; set; } = string.Empty;
        public bool RequiresAck { get; set; }
        public string AuthorId { get; set; } = string.Empty;
    }
}
