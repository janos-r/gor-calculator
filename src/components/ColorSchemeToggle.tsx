import { IconButton } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";
import { useEffect, useState } from "react";

// Icons import
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

export default function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <IconButton
      tabIndex={-1}
      id="toggle-mode"
      size="lg"
      variant="outlined"
      color="neutral"
      onClick={() => {
        if (mode === "light") {
          setMode("dark");
        } else {
          setMode("light");
        }
      }}
      sx={{
        // position: "fixed",
        // zIndex: 999,
        // top: "1rem",
        // right: "1rem",
        borderRadius: "50%",
        // boxShadow: "md",
      }}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}
