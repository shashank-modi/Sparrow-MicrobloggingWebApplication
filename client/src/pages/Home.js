import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  api, getAllUsers, follow, unfollow, getFollowing, getFeed,
  likePost, unlikePost, addComment
} from "../components/api";
import FloatingDock from "../components/FloatingDock";
import Sidebar from "../components/Sidebar";
import ComposeDialog from "../components/ComposeDialog";
import ProfileDialog from "../components/ProfileDialog";
import {Box, Typography, Avatar, Menu, MenuItem, Grid, Stack, IconButton,
  Divider, Dialog, DialogTitle, DialogContent, Button, TextField, DialogActions
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

export default function Home() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [followingIds, setFollowingIds] = useState(new Set());

  const [posts, setPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuPostId, setMenuPostId] = useState(null);
  const openMenuPosts = (e, postId) => { setMenuAnchor(e.currentTarget); setMenuPostId(postId); };
  const closeMenuPosts = () => { setMenuAnchor(null); setMenuPostId(null); };

  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);

  const [commentOpen, setCommentOpen] = useState(false);
  const [commentPost, setCommentPost] = useState(null);
  const [newComment, setNewComment] = useState("");

  const timeAgo = (date) => {
    const d = new Date(date);
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const dd = Math.floor(h / 24);
    return `${dd}d`;
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await api("/api/users/me");
        const data = await r.json();
        setMe(data);
      } catch {
        setErr("Failed to load your profile.");
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  useEffect(() => {
    (async () => {
      try {
        const rows = await getFollowing(1, 1000);
        setFollowingIds(new Set(rows.map(u => u.userId)));
      } catch { /* ignore */ }
    })();
  }, []);

  const normalizePost = (p) => ({
    ...p,
    likesCount: p.likeCount ?? p.likesCount ?? 0,
    commentsCount: p.commentCount ?? p.commentsCount ?? 0,
    likedByMe: !!p.likedByMe,
  });

  const loadFeed = async ({ merge = false } = {}) => {
    if (!me) return;
    if (!merge) setFeedLoading(true);
    try {
      const rows = await getFeed(1, 20);
      const fresh = rows.map(normalizePost);

      if (!merge) {
        setPosts(fresh);
      } else {
        setPosts(prev => {
          const byId = new Map(prev.map(p => [p.postId, p]));
          for (const f of fresh) {
            const old = byId.get(f.postId);
            if (old) {
              byId.set(f.postId, { ...old, ...f });
            } else {
              byId.set(f.postId, f);
            }
          }
          const ordered = fresh.map(f => byId.get(f.postId));
          for (const old of prev) {
            if (!byId.has(old.postId)) ordered.push(old);
          }
          return ordered;
        });
      }
    } catch (e) {
      console.error("Failed to load feed", e);
    } finally {
      if (!merge) setFeedLoading(false);
    }
  };

  useEffect(() => {
    if (me) loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);

  useEffect(() => {
    if (!me) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadFeed({ merge: true });
      }
    }, 8000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);

  const logout = () => {
    localStorage.removeItem("sparrow_token");
    navigate("/login", { replace: true });
  };

  const fetchUsersForDock = async (query) => {
    const rows = await getAllUsers(query);
    if (!me) return rows;
    return rows.map(u => ({
      ...u,
      isFollowing: u.userId !== me.userId && followingIds.has(u.userId),
    }));
  };

  const openQuickProfile = (u) => {
    const isFollowing =
      typeof u.isFollowing === "boolean"
        ? u.isFollowing
        : (me && u.userId !== me.userId && followingIds.has(u.userId));
    setSelectedUser({ ...u, isFollowing: Boolean(isFollowing) });
    setProfileOpen(true);
  };
  const closeQuickProfile = () => { setProfileOpen(false); setSelectedUser(null); };

  const openCompose = () => setComposeOpen(true);

  if (loading) return <Typography sx={{ p: 3 }}>Loading…</Typography>;
  if (err) return <Typography color="error" sx={{ p: 3 }}>{err}</Typography>;
  if (!me) return null;
  return (
    <Grid container columns={{ xs: 12, md: 24 }} sx={{ minHeight: "100vh" }}>
      <Sidebar me={me} logout={logout} navigate={navigate} onCompose={openCompose} />
      <ComposeDialog
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onPostCreated={(newPost) => {
          const n = normalizePost(newPost);
          setPosts(prev => [n, ...prev]);
        }}
      />
      <Grid
        size={{ xs: 12, md: 18 }}
        sx={{ py: 3, position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 5 }}>
          Home
        </Typography>
        <Box
          sx={{
            display: "grid",
            p: 2.5,
            width: "80%",
            borderRadius: 5,
            boxShadow: "0 10px 30px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}
        >
          {feedLoading && <Typography sx={{ p: 2 }}>Loading feed…</Typography>}
          {!feedLoading && posts.length === 0 && (
            <Typography sx={{ p: 2 }} color="text.secondary">No posts yet.</Typography>
          )}
          {posts.map((post, idx, arr) => (
            <Box key={post.postId}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", p: 2 }}>
                <Avatar>{(post.username?.[0] || "U").toUpperCase()}</Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography fontWeight={600} noWrap>
                      {post.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      • {timeAgo(post.createdAt)}
                    </Typography>
                  </Box>
                  <Typography sx={{ mt: 2.25, whiteSpace: "pre-wrap" }}>
                    {post.content}
                  </Typography>
                  <Stack direction="row" spacing={3} sx={{ mt: 2.25, alignItems: "center", color: "text.secondary" }}>
                    {/* LIKE */}
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, cursor: "pointer", ml: 2 }}>
                      <IconButton
                        onClick={async () => {
                          try {
                            if (post.likedByMe) {
                              await unlikePost(post.postId);
                              setPosts(prev => prev.map(p =>
                                p.postId === post.postId
                                  ? {
                                      ...p,
                                      likedByMe: false,
                                      likesCount: Math.max(0, (p.likesCount ?? 0) - 1),
                                    }
                                  : p
                              ));
                            } else {
                              await likePost(post.postId);
                              setPosts(prev => prev.map(p =>
                                p.postId === post.postId
                                  ? {
                                      ...p,
                                      likedByMe: true,
                                      likesCount: (p.likesCount ?? 0) + 1,
                                    }
                                  : p
                              ));
                            }
                          } catch (err) {
                            console.error("Failed to toggle like", err);
                          }
                        }}
                      >
                        <FavoriteBorderIcon
                          fontSize="small"
                          color={post.likedByMe ? "error" : "inherit"}
                        />
                      </IconButton>
                      <Typography variant="body2">{post.likesCount}</Typography>
                    </Box>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, cursor: "pointer" }}>
                      <IconButton onClick={() => { setCommentOpen(true); setCommentPost(post); }}>
                        <ChatBubbleOutlineIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body2">{post.commentsCount}</Typography>
                    </Box>
                  </Stack>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => openMenuPosts(e, post.postId)}
                  sx={{ ml: "auto" }}
                  aria-label="post menu"
                >
                  <MoreHorizIcon />
                </IconButton>
              </Box>

              {idx < arr.length - 1 && <Divider />}

              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor) && menuPostId === post.postId}
                onClose={closeMenuPosts}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={() => { closeMenuPosts(); /* navigate(`/u/${post.username}`) */ }}>
                  Visit profile
                </MenuItem>
                <MenuItem onClick={() => { closeMenuPosts(); /* mute/remove */ }}>
                  Remove user
                </MenuItem>
              </Menu>
            </Box>
          ))}
          <Dialog
            open={commentOpen}
            onClose={() => setCommentOpen(false)}
            fullWidth
            maxWidth="sm"
            BackdropProps={{ sx: { backgroundColor: "rgba(0, 0, 0, 0.17)" } }}
          >
            <DialogTitle>Comments</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                multiline
                minRows={2}
                placeholder="Write a comment…"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCommentOpen(false)}>Close</Button>
              <Button
                variant="contained"
                disabled={!newComment.trim()}
                onClick={async () => {
                  try {
                    await addComment(commentPost.postId, newComment.trim());
                    setPosts(prev => prev.map(p =>
                      p.postId === commentPost.postId
                        ? { ...p, commentsCount: (p.commentsCount ?? 0) + 1 }
                        : p
                    ));
                    setNewComment("");
                    setCommentOpen(false);
                  } catch (e) {
                    console.error("Failed to add comment", e);
                  }
                }}
              >
                Post
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Grid>
      <FloatingDock
        onFollowers={() => { /* open followers */ }}
        onLikes={() => { /* open likes */ }}
        fetchUsers={fetchUsersForDock}
        onUserSelect={openQuickProfile}
      />
      <ProfileDialog
        open={profileOpen}
        onClose={closeQuickProfile}
        user={selectedUser}
        me={me}
        onToggleFollow={async () => {
          try {
            if (selectedUser.isFollowing) {
              await unfollow(selectedUser.userId);
              setFollowingIds(prev => {
                const next = new Set(prev); next.delete(selectedUser.userId); return next;
              });
            } else {
              await follow(selectedUser.userId);
              setFollowingIds(prev => new Set(prev).add(selectedUser.userId));
            }
            setSelectedUser(prev => prev ? { ...prev, isFollowing: !prev.isFollowing } : prev);
          } catch (e) {
            console.error("Follow/unfollow failed", e);
          }
        }}
      />
    </Grid>
  );
}