using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class FeedbackRequest
    {
        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        public string EngineerName { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        public string FeedbackText { get; set; } = string.Empty;
    }
}
