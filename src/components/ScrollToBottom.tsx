import { IconButton, Tooltip } from "@mui/joy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function ScrollToBottom() {
  return (
    <Tooltip title="Scroll to bottom" variant="soft" placement="left">
      <IconButton
        aria-label="Scroll to bottom"
        size="lg"
        variant="soft"
        color="neutral"
        onClick={() => window.scrollTo(0, document.body.scrollHeight)}
        sx={{
          position: "fixed",
          zIndex: 999,
          bottom: "1rem",
          right: "2rem",
          borderRadius: "50%",
          boxShadow: "sm",
        }}
      >
        <KeyboardArrowDownIcon />
      </IconButton>
    </Tooltip>
  );
}
