import { useEffect, useMemo, useRef, useState } from "react";
import {
  Paper, Box, IconButton, Tooltip, TextField, InputAdornment,
  CircularProgress, Avatar, Typography, Popper, List, ListItemButton, ListItemAvatar, ListItemText
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function FloatingDock({
  onFollowers = () => {},
  onLikes = () => {},
  fetchUsers,       
  onUserSelect,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const fieldRef = useRef(null);

  const debouncedFetch = useMemo(() => (value) => {
    if (!fetchUsers) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (!value?.trim()) {
        setOptions([]);
        setDropdownOpen(false);
        return;
      }
      setLoading(true);
      try {
        const rows = await fetchUsers(value);
        setOptions(rows || []);
        setDropdownOpen(true);
      } catch {
        setOptions([]);
        setDropdownOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);
  }, [fetchUsers]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setOptions([]);
    setDropdownOpen(false);
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    debouncedFetch(v);
  };

  const selectUser = (u) => {
    onUserSelect?.(u);
    closeSearch();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        left: { xs: "50%", md: "auto" },
        right: { xs: "auto", md: 24 },
        transform: { xs: "translateX(-50%)", md: "none" },
        bottom: `calc(20px + env(safe-area-inset-bottom, 0px))`,
        zIndex: (t) => t.zIndex.appBar + 2,
        pointerEvents: "none",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          pointerEvents: "auto",
          px: 2,
          py: 1,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: "rgba(255,255,255,0.85)",
          backdropFilter: "saturate(180%) blur(10px)",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)",
          minWidth: searchOpen ? 320 : "auto",
          transition: "all 0.25s ease",
        }}
      >
        {!searchOpen && (
          <Tooltip title="Followers" arrow>
            <IconButton onClick={onFollowers} sx={{ color: "text.primary" }}>
              <GroupOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
        {searchOpen ? (
          <>
          <Box sx={{ position: "relative", flex: 1 }} ref={fieldRef}>
            <TextField
              inputRef={inputRef}
              value={query}
              onChange={handleChange}
              size="small"
              autoFocus
              placeholder="Search Sparrow…"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {loading ? <CircularProgress size={16} /> : null}
                    <InputAdornment position="end">
                      <IconButton onClick={closeSearch} size="small" edge="end">
                        <CloseRoundedIcon />
                      </IconButton>
                    </InputAdornment>
                  </Box>
                ),
              }}
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                "& fieldset": { border: "none" },
              }}
            />
          </Box>
          <Popper
            open={dropdownOpen && !!options.length}
            anchorEl={fieldRef.current}                      
            placement="top-start"
            modifiers={[
              { name: "offset", options: { offset: [0, 8] } },
              { name: "preventOverflow", options: { padding: 8 } },
              { name: "computeStyles", options: { gpuAcceleration: false } },
            ]}
            sx={{
              zIndex: (t) => t.zIndex.modal + 1,
              width: fieldRef.current ? fieldRef.current.offsetWidth : 360,
            }}
          >
            <Paper elevation={1} sx={{ p: 0.8 ,mb: 1 , borderRadius: 5}}>
              <List dense disablePadding>
                {options.map((u) => (
                  <ListItemButton key={u.userId} onClick={() => selectUser(u)}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 28, height: 28 }}>
                        {(u.username?.[0] || "U").toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                          <Typography fontWeight={700} noWrap>
                            {u.fullName || u.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            @{u.username}
                          </Typography>
                        </Box>
                      }
                      secondary={u.email || ""}
                      secondaryTypographyProps={{ noWrap: true }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Popper>
          </>
        ) : (
          <IconButton
            onClick={() => setSearchOpen(true)}
            sx={{
              color: "text.primary",
              "&:hover": { bgcolor: "#131313ff", color: "#fff" },
            }}
          >
            <SearchRoundedIcon />
          </IconButton>
        )}
        {!searchOpen && (
          <Tooltip title="Likes" arrow>
            <IconButton onClick={onLikes} sx={{ color: "text.primary" }}>
              <FavoriteBorderIcon />
            </IconButton>
          </Tooltip>
        )}
      </Paper>
    </Box>
  );
}