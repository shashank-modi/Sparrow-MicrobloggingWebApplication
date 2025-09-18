using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FollowController : ControllerBase
{
    private readonly AppDbContext _context;
    public FollowController(AppDbContext context) => _context = context;

    int? Me() => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : (int?)null;

    [HttpPost("{followingId:int}")]
    public async Task<IActionResult> Follow(int followingId)
    {
        var me = Me(); if (me is null) return Unauthorized();
        if (me == followingId) return BadRequest(new { message = "Cannot follow yourself." });

        var exists = await _context.Followers.FindAsync(me, followingId);
        if (exists is not null) return NoContent();

        var targetExists = await _context.Users.AnyAsync(u => u.UserId == followingId);
        if (!targetExists) return NotFound();

        _context.Followers.Add(new Follower { FollowerId = me.Value, FollowingId = followingId });
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{followingId:int}")]
    public async Task<IActionResult> Unfollow(int followingId)
    {
        var me = Me(); if (me is null) return Unauthorized();
        var row = await _context.Followers.FindAsync(me, followingId);
        if (row is null) return NoContent();
        _context.Followers.Remove(row);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("following")]
    public async Task<ActionResult<IEnumerable<UserOutDto>>> Following([FromQuery] int page=1, [FromQuery] int pageSize=50)
    {
        var me = Me(); if (me is null) return Unauthorized();
        return await _context.Followers.AsNoTracking()
            .Where(f => f.FollowerId == me)
            .OrderBy(f => f.FollowingId)
            .Select(f => new UserOutDto(f.FollowingUser.UserId, f.FollowingUser.Username, f.FollowingUser.Email, f.FollowingUser.FullName, f.FollowingUser.CreatedAt))
            .Skip((page-1)*pageSize).Take(pageSize).ToListAsync();
    }

    [HttpGet("followers")]
    public async Task<ActionResult<IEnumerable<UserOutDto>>> Followers([FromQuery] int page=1, [FromQuery] int pageSize=50)
    {
        var me = Me(); if (me is null) return Unauthorized();
        return await _context.Followers.AsNoTracking()
            .Where(f => f.FollowingId == me)
            .OrderBy(f => f.FollowerId)
            .Select(f => new UserOutDto(f.FollowerUser.UserId, f.FollowerUser.Username, f.FollowerUser.Email, f.FollowerUser.FullName, f.FollowerUser.CreatedAt))
            .Skip((page-1)*pageSize).Take(pageSize).ToListAsync();
    }
}