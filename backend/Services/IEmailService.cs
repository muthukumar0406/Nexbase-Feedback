using backend.Models;

namespace backend.Services
{
    public interface IEmailService
    {
        Task SendFeedbackEmailAsync(Feedback feedback);
    }
}
