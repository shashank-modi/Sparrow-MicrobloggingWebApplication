using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UsersController(AppDbContext context) => _context = context;

        [HttpGet("me")]
        public async Task<ActionResult<UserOutDto>> GetMe()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == userId);
            if (user is null) return NotFound();
            return new UserOutDto(user.UserId, user.Username, user.Email, user.FullName, user.CreatedAt);
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserOutDto>>> GetUsers()
        {
            var users = await _context.Users
                .AsNoTracking()
                .Select(u => new UserOutDto(u.UserId, u.Username, u.Email, u.FullName, u.CreatedAt))
                .ToListAsync();
            return users;
        }
        [HttpGet("{id:int}")]
        public async Task<ActionResult<UserOutDto>> GetUser(int id)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null) return NotFound();
            return new UserOutDto(user.UserId, user.Username, user.Email, user.FullName, user.CreatedAt);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<UserOutDto>> PostUser(CreateUserDto dto)
        {
            var email = dto.Email.Trim().ToLowerInvariant();
            var username = dto.Username.Trim();

            if (await _context.Users.AnyAsync(u => u.Email == email))
                return BadRequest(new { message = "Email already in use." });

            if (await _context.Users.AnyAsync(u => u.Username == username))
                return BadRequest(new { message = "Username already in use." });

            var user = new User
            {
                Username = username,
                Email = email,
                FullName = dto.FullName.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            var outDto = new UserOutDto(user.UserId, user.Username, user.Email, user.FullName, user.CreatedAt);
            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, outDto);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> PutUser(int id, [FromBody] UserOutDto updated)
        {
            if (id != updated.UserId) return BadRequest();

            var callerIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (callerIdStr is null || callerIdStr != id.ToString())
                return Forbid();

            var user = await _context.Users.FindAsync(id);
            if (user is null) return NotFound();

            user.Username = updated.Username;
            user.Email = updated.Email.ToLowerInvariant();
            user.FullName = updated.FullName;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var callerIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (callerIdStr is null || callerIdStr != id.ToString())
                return Forbid();

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}