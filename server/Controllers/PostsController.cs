using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PostsController : ControllerBase
{
    private readonly AppDbContext _db;
    public PostsController(AppDbContext db) => _db = db;

    int? Me() => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : (int?)null;
    [HttpPost]
    public async Task<ActionResult<PostOutDto>> Create(CreatePostDto dto)
    {
        var me = Me(); if (me is null) return Unauthorized();
        if (string.IsNullOrWhiteSpace(dto.Content)) return BadRequest("Content required.");

        var post = new Post { UserId = me.Value, Content = dto.Content };
        _db.Posts.Add(post);
        await _db.SaveChangesAsync();

        return await ProjectPost(post.PostId, me.Value);
    }
    [HttpGet("feed")]
    public async Task<ActionResult<IEnumerable<PostOutDto>>> Feed([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var me = Me(); if (me is null) return Unauthorized();

        var followingIds = await _db.Followers
            .Where(f => f.FollowerId == me)
            .Select(f => f.FollowingId)
            .ToListAsync();

        followingIds.Add(me.Value);

        var posts = await _db.Posts
            .Where(p => followingIds.Contains(p.UserId))
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(p => new PostOutDto(
                p.PostId,
                p.UserId,
                p.User.Username,
                p.User.FullName,
                p.Content,
                p.CreatedAt,
                p.Likes.Count,
                p.Comments.Count,
                p.Likes.Any(l => l.UserId == me)
            ))
            .ToListAsync();

        return posts;
    }
    // Like a post
    [HttpPost("{postId}/like")]
    public async Task<IActionResult> Like(int postId)
    {
        var me = Me(); if (me is null) return Unauthorized();

        var exists = await _db.Likes.FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == me);
        if (exists != null) return NoContent();

        _db.Likes.Add(new Like { PostId = postId, UserId = me.Value });
        await _db.SaveChangesAsync();
        return NoContent();
    }
    // Unlike
    [HttpDelete("{postId}/like")]
    public async Task<IActionResult> Unlike(int postId)
    {
        var me = Me(); if (me is null) return Unauthorized();

        var like = await _db.Likes.FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == me);
        if (like == null) return NoContent();

        _db.Likes.Remove(like);
        await _db.SaveChangesAsync();
        return NoContent();
    }
    // Comment
    [HttpPost("{postId}/comments")]
    public async Task<ActionResult<CommentOutDto>> Comment(int postId, CreateCommentDto dto)
    {
        var me = Me(); if (me is null) return Unauthorized();
        if (string.IsNullOrWhiteSpace(dto.Content)) return BadRequest("Content required.");

        var c = new Comment { PostId = postId, UserId = me.Value, Content = dto.Content };
        _db.Comments.Add(c);
        await _db.SaveChangesAsync();

        var outDto = await _db.Comments
            .Where(x => x.CommentId == c.CommentId)
            .Select(x => new CommentOutDto(
                x.CommentId, x.PostId, x.UserId,
                x.User.Username, x.User.FullName,
                x.Content, x.CreatedAt
            ))
            .SingleAsync();

        return outDto;
    }

    // Helper to project a post
    private async Task<PostOutDto> ProjectPost(int postId, int meId)
    {
        var p = await _db.Posts
            .Where(x => x.PostId == postId)
            .Select(x => new PostOutDto(
                x.PostId,
                x.UserId,
                x.User.Username,
                x.User.FullName,
                x.Content,
                x.CreatedAt,
                x.Likes.Count,
                x.Comments.Count,
                x.Likes.Any(l => l.UserId == meId)
            ))
            .SingleAsync();

        return p;
    }
}