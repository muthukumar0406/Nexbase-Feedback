using backend.Models;

namespace backend.Repositories
{
    public interface IFeedbackRepository
    {
        Task<IEnumerable<Feedback>> GetAllFeedbacksAsync();
        Task<Feedback?> GetFeedbackByIdAsync(int id);
        Task<Feedback> AddFeedbackAsync(Feedback feedback);
        Task<bool> DeleteFeedbackAsync(int id);
    }
}
