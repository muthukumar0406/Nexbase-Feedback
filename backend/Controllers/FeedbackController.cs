using backend.DTOs;
using backend.Models;
using backend.Repositories;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackRepository _feedbackRepository;
        private readonly IEmailService _emailService;

        public FeedbackController(IFeedbackRepository feedbackRepository, IEmailService emailService)
        {
            _feedbackRepository = feedbackRepository;
            _emailService = emailService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbacks()
        {
            try
            {
                var feedbacks = await _feedbackRepository.GetAllFeedbacksAsync();
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Feedback>> GetFeedback(int id)
        {
            try
            {
                var feedback = await _feedbackRepository.GetFeedbackByIdAsync(id);

                if (feedback == null)
                {
                    return NotFound();
                }

                return Ok(feedback);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Feedback>> PostFeedback([FromBody] FeedbackDto feedbackDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var feedback = new Feedback
                {
                    CustomerName = feedbackDto.CustomerName,
                    CompanyName = feedbackDto.CompanyName,
                    EngineerName = feedbackDto.EngineerName,
                    Rating = feedbackDto.Rating,
                    FeedbackText = feedbackDto.FeedbackText,
                    CreatedDate = DateTime.UtcNow
                };

                var createdFeedback = await _feedbackRepository.AddFeedbackAsync(feedback);

                // Send email notification automatically
                // Fire and forget so we don't block the response
                _ = Task.Run(() => _emailService.SendFeedbackEmailAsync(createdFeedback));

                return CreatedAtAction(nameof(GetFeedback), new { id = createdFeedback.Id }, createdFeedback);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PostFeedback: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFeedback(int id)
        {
            try
            {
                var deleted = await _feedbackRepository.DeleteFeedbackAsync(id);

                if (!deleted)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
