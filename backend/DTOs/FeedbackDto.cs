using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class FeedbackDto
    {
        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        public string CompanyName { get; set; } = string.Empty;

        [Required]
        public string EngineerName { get; set; } = string.Empty;

        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        [Required]
        public string FeedbackText { get; set; } = string.Empty;
    }
}
