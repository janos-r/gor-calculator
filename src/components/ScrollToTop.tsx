import { IconButton, Tooltip } from "@mui/joy";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function ScrollToTop() {
  return (
    <Tooltip title="Scroll to top" variant="soft" placement="left">
      <IconButton
        aria-label="Scroll to top"
        size="lg"
        variant="soft"
        color="neutral"
        onClick={() => window.scrollTo(0, 0)}
        sx={{
          position: "fixed",
          zIndex: 999,
          bottom: "5rem",
          // right: "1rem",
          left:
            "clamp(100vw - var(--Cover-width) - 4rem, (var(--Collapsed-breakpoint) - 100vw) * 999 - 4rem, 100% - 4rem)",
          borderRadius: "50%",
          boxShadow: "sm",
        }}
      >
        <KeyboardArrowUpIcon />
      </IconButton>
    </Tooltip>
  );
}
