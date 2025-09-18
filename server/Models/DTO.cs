namespace server.Models
{
    public record CreateUserDto(string Username, string Email, string FullName, string Password);
    public record UserOutDto(int UserId, string Username, string Email, string? FullName, DateTime CreatedAt);
    public record LoginDto(string Email, string Password);
    public record AuthResponse(string Token);
    public record CreatePostDto(int UserId, string Content);
    public record CreateCommentDto(int UserId, int PostId, string Content);
    public record CreateLikeDto(int UserId, int PostId);
    public record PostOutDto(
        int PostId,
        int UserId,
        string Username,
        string? FullName,
        string Content,
        DateTime CreatedAt,
        int LikeCount,
        int CommentCount,
        bool LikedByMe
    );
    public record CommentOutDto(
        int CommentId,
        int PostId,
        int UserId,
        string Username,
        string? FullName,
        string Content,
        DateTime CreatedAt
    );
}