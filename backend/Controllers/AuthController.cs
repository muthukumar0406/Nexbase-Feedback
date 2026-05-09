using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AdminSettings _adminSettings;

        public AuthController(IOptions<AdminSettings> adminSettings)
        {
            _adminSettings = adminSettings.Value;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new LoginResponse { Success = false, Message = "Username and password are required" });
            }

            if (request.Username == _adminSettings.Username && request.Password == _adminSettings.Password)
            {
                return Ok(new LoginResponse { Success = true, Message = "Login successful" });
            }

            return Unauthorized(new LoginResponse { Success = false, Message = "Invalid username or password" });
        }
    }
}
