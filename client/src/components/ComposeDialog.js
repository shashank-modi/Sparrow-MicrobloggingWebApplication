import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography
} from "@mui/material";
import { createPost } from "../components/api";

export default function ComposeDialog({ open, onClose, onPostCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const MAX_LEN = 400;

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const newPost = await createPost(content.trim());
      onPostCreated?.(newPost);
      setContent("");
      onClose();
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      BackdropProps={{
        sx: { backgroundColor: "rgba(0, 0, 0, 0.36)" },
      }}
    >
      <DialogTitle><Typography variant="h6" sx={{m: 1, fontWeight: 600}}>Compose Post</Typography></DialogTitle>
      <DialogContent>
        <TextField
          multiline
          minRows={4}
          fullWidth
          color="black"
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_LEN))}
          placeholder="What's happening?"
          variant="outlined"
          sx={{
                "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                }
            }}
        />
        <Box sx={{ mt: 1, textAlign: "right" }}>
          <Typography variant="caption" color="text.secondary">
            {content.length}/{MAX_LEN}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ color: "black", textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!content.trim() || loading}
          sx={{
            bgcolor: "black",
            color: "white",
            textTransform: "none",
            borderRadius: 2,
            "&:hover": { bgcolor: "#333" },
          }}
        >
          {loading ? "Posting…" : "Post"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}