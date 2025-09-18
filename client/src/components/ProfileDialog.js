import {
  Dialog, DialogTitle, DialogContent, IconButton, Avatar, Box, Typography, Button
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function ProfileDialog({ open, onClose, user, me, onToggleFollow }) {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={onClose}>
          <CloseRoundedIcon sx={{ color: "black" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 3, alignItems: "center", mb: 3 }}>
          <Avatar sx={{ width: 90, height: 90 }}>
            {(user.username?.[0] || "U").toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              {user.fullName || user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
            {user.createdAt && (
              <Typography variant="caption" color="text.secondary">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
              <Typography variant="body2"><strong>{user.followersCount ?? 0}</strong> Followers</Typography>
              <Typography variant="body2"><strong>{user.followingCount ?? 0}</strong> Following</Typography>
              <Typography variant="body2"><strong>{user.postsCount ?? 0}</strong> Posts</Typography>
            </Box>
            {me.userId !== user.userId && (
              <Button
                variant={user.isFollowing ? "outlined" : "contained"}
                onClick={onToggleFollow}
                sx={{ mt: 2, textTransform: "none", borderRadius: 2, px: 3 }}
              >
                {user.isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}