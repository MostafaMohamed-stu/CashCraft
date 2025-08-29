using System;
using System.Linq;
using System.Threading.Tasks;
using CashCraft.Api.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CashCraft.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public UsersController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var users = await _db.Users
                .Select(u => new { u.Id, u.Email, u.DisplayName, u.Role, u.IsPremium, u.CreatedAt })
                .ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _db.Users
                .Where(u => u.Id == id)
                .Select(u => new { u.Id, u.Email, u.Username, u.DisplayName, u.Role, u.IsPremium, u.CreatedAt })
                .FirstOrDefaultAsync();
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var user = await _db.Users
                .Where(u => u.Id == userId)
                .Select(u => new { u.Id, u.Email, u.Username, u.DisplayName, u.Role, u.IsPremium, u.CreatedAt })
                .FirstOrDefaultAsync();
            
            if (user == null) return NotFound();
            return Ok(user);
        }
    }
}


