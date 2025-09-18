import { useState } from "react";
import {
  Box, Grid, Stack, Avatar, Typography, Button, Menu, MenuItem,
  IconButton, Drawer
} from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddIcon from "@mui/icons-material/Add";
import TypeLogo from "./Typelogo";
import logoPng from "../assets/logo.png";

export default function Sidebar({ me, logout, navigate, onCompose}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const menuItems = (
    <Stack spacing={2.25} sx={{ mt: 4 }}>
      <Button
        fullWidth
        variant="text"
        startIcon={<HomeOutlinedIcon />}
        onClick={() => navigate("/home")}
        sx={{ justifyContent: "flex-start" ,fontWeight: 600, textTransform: "none", color: "black"}}
      >
        Home
      </Button>
      <Button
        fullWidth
        variant="text"
        startIcon={<AddIcon />}
        onClick={() => onCompose?.()}       
        sx={{ justifyContent:"flex-start", fontWeight:600, textTransform:"none", color:"black" }}
      >
        Compose
      </Button>
      <Button
        fullWidth
        onClick={() => onCompose && onCompose()}
        variant="text"
        startIcon={<PersonOutlineIcon />}
        sx={{ justifyContent: "flex-start", fontWeight: 600, textTransform: "none", color: "black" }}
      >
        Profile
      </Button>
      <Button
        fullWidth
        variant="text"
        startIcon={<SettingsOutlinedIcon />}
        onClick={openMenu}
        sx={{ justifyContent: "flex-start", fontWeight: 600, textTransform: "none", color: "black" }}
      >
        Settings
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem onClick={closeMenu}>Preferences</MenuItem>
        <MenuItem onClick={closeMenu}>Open Settings</MenuItem>
      </Menu>
      <Button
        fullWidth
        variant="text"
        startIcon={<LogoutOutlinedIcon />}
        onClick={logout}
        sx={{ justifyContent: "flex-start", fontWeight: 600, textTransform: "none", "&:hover": { color: "red" }, color: "black"}}
      >
        Logout
      </Button>
    </Stack>
  );

  return (
    <>
      <Grid
        item
        xs={0}
        md={4}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          bgcolor: "#ffffff93",
          p: 2,
          height: "100dvh",
          position: "sticky",
          top: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Box component="img" src={logoPng} alt="Sparrow" sx={{ width: 36, height: 36 }} />
          <TypeLogo text="Sparrow" variant="h5" />
        </Box>
        {menuItems}
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 1.25 }}>
          <Avatar sx={{ width: 48, height: 48 }}>
            {(me.username?.[0] || "S").toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontWeight={700} noWrap>
              {me.fullName || me.username}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              @{me.username}
            </Typography>
          </Box>
        </Box>
      </Grid>
      {/* Mobile trigger */}
      <Box sx={{ display: {xs:"flex", md: "none"}, gap: 1, m: 2, mx: "auto"}}>
          <Box component="img" src={logoPng} alt="Sparrow" sx={{ width: 36, height: 36 }} />
          <TypeLogo text="Sparrow" variant="h5" />
      </Box>
      <IconButton
        sx={{
          position: "absolute",
          display: { xs: "flex", md: "none" },
          bgcolor: "white",
          m:1
        }}
        onClick={() => setMobileOpen(true)}
      >
        <Avatar>{(me.username?.[0] || "S").toUpperCase()}</Avatar>
      </IconButton>
      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 260, p: 2 } }}
      >
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: 1, 
            mb: 2 
          }}
        >
          <Box
            component="img"
            src={logoPng}
            alt="Sparrow"
            sx={{ width: 32, height: 32 }}
          />
          <TypeLogo text="Sparrow" variant="h6" />
        </Box>

        {menuItems}
      </Drawer>
    </>
  );
}