namespace backend.Models
{
    public class Feedback
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string EngineerName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string FeedbackText { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
    }
}
