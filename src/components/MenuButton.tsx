import { useRef, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { OpenInNew } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";
import InfoIcon from "@mui/icons-material/Info";
import Menu from "@mui/joy/Menu";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalOverflow from "@mui/joy/ModalOverflow";
import {
  Box,
  IconButton,
  Link,
  ListItemDecorator,
  MenuItem,
  Modal,
  ModalClose,
  Typography,
} from "@mui/joy";
import ColorSchemeToggle from "./ColorSchemeToggle";

export default function MenuButton() {
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openAbout, setOpenAbout] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton
        ref={buttonRef}
        id="menu-button"
        aria-controls={"menu"}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        // variant="solid"
        color="neutral"
        size="lg"
        onClick={() => {
          setOpen(!open);
        }}
        sx={{
          position: "fixed",
          zIndex: 999,
          bottom: "2rem",
          left: "2rem",
          boxShadow: "sm",
        }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu"
        size="lg"
        // variant="solid"
        anchorEl={buttonRef.current}
        open={open}
        onClose={handleClose}
        aria-labelledby="menu-button"
        placement="top-start"
        sx={{ "--List-padding": "var(--ListDivider-gap)" }}
      >
        <Box alignSelf={"center"}>
          <ColorSchemeToggle />
        </Box>
        <Link
          variant="plain"
          color="neutral"
          href={`https://github.com/janos-r/gor-calculator`}
          endDecorator={<OpenInNew />}
          target="_blank"
          rel="noreferrer"
          sx={{ p: 1, marginInline: 0.05 }}
        >
          <ListItemDecorator>
            <GitHubIcon sx={{ marginInline: 1, fontSize: 25 }} />
          </ListItemDecorator>
          GitHub
        </Link>
        <MenuItem onClick={() => setOpenAbout(true)}>
          <ListItemDecorator>
            <InfoIcon />
          </ListItemDecorator>
          About
        </MenuItem>
      </Menu>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openAbout}
        onClose={() => setOpenAbout(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <ModalOverflow>
          <ModalDialog
            aria-labelledby="modal-dialog-overflow"
            layout={"center"}
            variant="outlined"
            sx={{
              width: 500,
              maxWidth: "80%",
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
            }}
          >
            <ModalClose
              variant="outlined"
              sx={{
                top: "calc(-1/4 * var(--IconButton-size))",
                right: "calc(-1/4 * var(--IconButton-size))",
                boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
                borderRadius: "50%",
                bgcolor: "background.body",
              }}
            />
            <Typography
              component="h2"
              id="modal-title"
              level="h4"
              textColor="inherit"
              fontWeight="lg"
              mb={1}
            >
              GoR Calculator
            </Typography>
            <Typography id="modal-desc" textColor="text.tertiary">
              Thank you for using GoR Calculator. <br />
              I often saw on tournaments how people were trying to calculate
              their progress with the calculator on{" "}
              <Link href="https://europeangodatabase.eu/EGD/gor_calculator.php">
                EGD
              </Link>. It is very detailed and still the best choice if you are
              on a non-A class tournament. This app is currently only
              calculating A-class and non-handicap. As that is the most common
              anyway. I wanted to challenge myself to make something slightly
              more user friendly, that can look good on smartphones and remember
              the choices even after closing, as the tournament progresses. This
              app caches all the selected players. The main player gets
              refreshed once per day and the opponents stay unchanged until
              cleared. If you find any bugs or would like to provide some fix or
              feature, feel free to contact me via GitHub with a PR or with an
              issue. I leave this code fully open. <br />
              I love Go and I would be happy if this can be a useful way how to
              give back to the community.<br />
              <br />

              Good luck in your games and don&apos;t forget to have fun ;)<br />
              Radim Janoš
            </Typography>
          </ModalDialog>
        </ModalOverflow>
      </Modal>
    </div>
  );
}
