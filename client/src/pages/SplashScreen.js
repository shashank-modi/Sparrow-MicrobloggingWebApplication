import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import TypeLogo from "../components/Typelogo";
import logoPng from "../assets/logo.png";

export default function SplashScreen() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}      
      transition={{ duration: 0.6 }}
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        color: "black",
        background:
          "radial-gradient(1200px 600px at 20% 20%, #f6f3ff 0%, transparent 60%), radial-gradient(1000px 500px at 80% 80%, #e9fcf4 0%, transparent 60%), #ffffff",
      }}
    >
      <Box
        component={motion.div}
        initial={{ scale: 0.9, y: 10 }}
        animate={{ scale: 1, y: [0, -6, 0] }}
        transition={{ duration: 0.6, ease: "easeOut", repeat: Infinity, repeatDelay: 2 }}
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <Box
          component={motion.img}
          src={logoPng}
          alt="Sparrow logo"
          initial={{ rotate: -8, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ width: 44, height: 44, objectFit: "contain" }}
        />
        <TypeLogo text="Sparrow" />
      </Box>
      <Typography
        component={motion.p}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{ marginTop: 8 }}
      >
        Like old times, send messages via Sparrow!
      </Typography>
    </Box>
  );
}