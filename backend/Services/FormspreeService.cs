using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace backend.Services
{
    public interface IFormspreeService
    {
        Task<bool> SendEmailAsync(object payload);
    }

    public class FormspreeService : IFormspreeService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly ILogger<FormspreeService> _logger;

        public FormspreeService(HttpClient httpClient, IConfiguration config, ILogger<FormspreeService> logger)
        {
            _httpClient = httpClient;
            _config = config;
            _logger = logger;
        }

        public async Task<bool> SendEmailAsync(object payload)
        {
            var endpoint = _config["Formspree:Endpoint"];
            if (string.IsNullOrEmpty(endpoint) || endpoint.Contains("YOUR_FORMSPREE_ID"))
            {
                _logger.LogWarning("Formspree endpoint is not configured correctly. Skipping email notification.");
                return false;
            }

            try
            {
                var response = await _httpClient.PostAsJsonAsync(endpoint, payload);
                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Email sent successfully via Formspree.");
                    return true;
                }
                else
                {
                    _logger.LogError($"Failed to send email via Formspree. Status Code: {response.StatusCode}");
                    return false;
                }
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Exception occurred while sending email via Formspree.");
                return false;
            }
        }
    }
}
