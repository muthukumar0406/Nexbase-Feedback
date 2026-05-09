using backend.Models;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;

        public EmailService(IOptions<SmtpSettings> smtpSettings)
        {
            _smtpSettings = smtpSettings.Value;
        }

        public async Task SendFeedbackEmailAsync(Feedback feedback)
        {
            try
            {
                using var client = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port)
                {
                    Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_smtpSettings.SenderEmail, _smtpSettings.SenderName),
                    Subject = $"New Feedback from {feedback.CustomerName} - {feedback.CompanyName}",
                    Body = $@"
                        <h2>New Feedback Received</h2>
                        <p><strong>Customer Name:</strong> {feedback.CustomerName}</p>
                        <p><strong>Company Name:</strong> {feedback.CompanyName}</p>
                        <p><strong>Engineer Name:</strong> {feedback.EngineerName}</p>
                        <p><strong>Rating:</strong> {feedback.Rating} / 5</p>
                        <p><strong>Feedback:</strong> {feedback.FeedbackText}</p>
                        <p><strong>Submitted Date:</strong> {feedback.CreatedDate:yyyy-MM-dd HH:mm:ss}</p>
                    ",
                    IsBodyHtml = true
                };

                // For testing/demonstration, we send the email to the sender's own email address
                // In a real scenario, this might be sent to an admin or a specific support email
                mailMessage.To.Add(_smtpSettings.SenderEmail);

                await client.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                // In production, we should log this error properly using ILogger
                Console.WriteLine($"Error sending email: {ex.Message}");
            }
        }
    }
}
