import { useState } from "react";
import {useNavigate} from "react-router-dom";
import TypeLogo from "../components/Typelogo";
import {
  Box, Grid, Paper, Tabs, Tab, TextField, Button, Typography, Alert
} from "@mui/material";
import heroPng from "../assets/authpagepng1.jpg";  
import logoPng from "../assets/logo.png";

export default function Auth() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const navigate = useNavigate();

  const API = process.env.REACT_APP_API_BASE;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const res = await fetch(`${API}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      localStorage.setItem("sparrow_token", data.token);
      navigate("/home", { replace: true });
    } catch {
      setErr("Invalid credentials or server error.");
    } finally { setLoading(false); }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const res = await fetch(`${API}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(), 
          email: signupEmail.trim().toLowerCase(),
          fullName: fullName.trim(),
          password: signupPassword
        })
      });
      if (!res.ok) throw new Error(await res.text());
      setTab(0);
    } catch {
      setErr("Signup failed. Try a different email/username.");
    } finally { setLoading(false); }
  };

  return (
    <Grid container sx={{ minHeight: "100vh"}}>
      <Grid
        size={{xs:12, md:8}} 
        sx={{
          display: { xs: "none", md: "block" },
          backgroundImage: `url(${heroPng})`,
          backgroundSize: "cover" ,
          backgroundPosition: "center",
        }}
      />
      <Grid
        size={{xs: 12, md: 4}}
        sx={{
          display: "grid",
          placeItems: "center",
          p: { xs: 2, md: 4 },
        }}
      > 
        <Box sx={{display: "flex", flexDirection:"column", alignItems:"center", gap: 1.25}}>
        <Box sx={{ display: "flex", mb: 3.25, mr: 4}}>
        <Box
            component="img"
            src={logoPng}
            alt="Sparrow logo"
            sx={{ width: 36, height: 36, objectFit: "contain" }}
        />
        <TypeLogo text="Sparrow" />
        </Box>
        <Paper elevation={3} sx={{ width: 420, maxWidth: "95vw", p: 2.5, borderRadius: 4 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Welcome back! Sign in or create an account.
        </Typography>
        <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            centered
            sx={{
            mb: 1.5,
            "& .MuiTab-root.Mui-selected": { color: "black" },
            "& .MuiTabs-indicator": { backgroundColor: "black" },
            }}
            textColor="inherit"
        >
            <Tab label="Login" />
            <Tab label="Sign Up" />
        </Tabs>

        {err && <Alert severity="error" sx={{ mb: 1.5 }}>{err}</Alert>}

        {tab === 0 ? (
            <Box component="form" onSubmit={handleLogin}>
            <TextField
                label="Email"
                type="email"
                fullWidth
                required
                margin="normal"
                color="black"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            />
            <TextField
                label="Password"
                type="password"
                fullWidth
                required
                margin="normal"
                color="black"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            />
            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                mt: 1.5,
                borderRadius: 2,
                bgcolor: "black", fontWeight: 600,
                "&:hover": { bgcolor: "#111" },
                textTransform:'none'
                }}
                disabled={loading}
            >
                {loading ? "Signing in..." : "Login"}
            </Button>
            </Box>
        ) : (
            <Box component="form" onSubmit={handleSignup}>
            <TextField
                label="Username"
                fullWidth
                required
                margin="normal"
                color="black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            />
            <TextField
                label="Full Name"
                fullWidth
                required
                margin="normal"
                color="black"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            />
            <TextField
                label="Email"
                type="email"
                fullWidth
                required
                margin="normal"
                color="black"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            />
            <TextField
                label="Password"
                type="password"
                fullWidth
                required
                margin="normal"
                color="black"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            />
            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                mt: 1.5,
                borderRadius: 2,
                bgcolor: "black", fontWeight: 600,
                "&:hover": { bgcolor: "#111" }, textTransform: 'none'
                }}
                disabled={loading}
            >
                {loading ? "Creating account..." : "Sign Up"}
            </Button>
            </Box>
        )}
        </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}