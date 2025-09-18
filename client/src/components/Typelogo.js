import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/system";

const popIn = keyframes`
  0%   { opacity: 0; transform: translateY(6px) scale(0.98); }
  60%  { opacity: 1; transform: translateY(-6px) scale(1.02); }
  100% { opacity: 1; transform: translateY(0)    scale(1); }
`;

const blink = keyframes`
  0%,49%  { opacity: 1; }
  50%,100%{ opacity: 0; }
`;

export default function TypeLogo({ text = "Sparrow", delay = 140, variant="h3" }) {
  return (
    <Typography variant={variant} fontWeight={700} component="div" sx={{ display: "flex", alignItems: "center" }}>
      {text.split("").map((ch, i) => (
        <Box
          key={i}
          component="span"
          sx={{
            display: "inline-block",
            mr: ch === " " ? 1 : 0,
            opacity: 0,
            animation: `${popIn} 500ms ease-out forwards`,
            animationDelay: `${i * delay}ms`,
          }}
        >
          {ch}
        </Box>
      ))}
      <Box
        component="span"
        sx={{
          width: "2px",
          height: "1em",
          bgcolor: "text.primary",
          ml: 0.5,
          display: "inline-block",
          animation: `${blink} 1s step-end infinite`,
        }}
      />
    </Typography>
  );
}