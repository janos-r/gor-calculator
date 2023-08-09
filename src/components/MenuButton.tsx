import { useRef, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { OpenInNew } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";
import InfoIcon from "@mui/icons-material/Info";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import Menu from "@mui/joy/Menu";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalOverflow from "@mui/joy/ModalOverflow";
import {
  AspectRatio,
  Box,
  Button,
  IconButton,
  Link,
  ListItemDecorator,
  MenuItem,
  Modal,
  ModalClose,
  Tooltip,
  Typography,
} from "@mui/joy";
import ColorSchemeToggle from "./ColorSchemeToggle";
import Image from "next/image";

const moneroAddr =
  /* cspell:disable-next-line */
  "833dULnxf5SEnDubGZ3Anmh1R7MyTsGe9Y6zwqQ3HXWeiiw54U42CVYb9p57PB1P3DK7qJvH3GKiJgt3bDSYzvxMLv1WavL";

export default function MenuButton() {
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openAbout, setOpenAbout] = useState<boolean>(false);
  const [openDonate, setOpenDonate] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [copied, setCopied] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const handleCopy = () => {
    navigator.clipboard.writeText(moneroAddr);
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 1000);
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

        <MenuItem onClick={() => setOpenDonate(true)}>
          <ListItemDecorator>
            <CurrencyBitcoinIcon />
          </ListItemDecorator>
          Donate
        </MenuItem>

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

      <Modal
        aria-labelledby="modal-title1"
        aria-describedby="modal-desc1"
        open={openDonate}
        onClose={() => setOpenDonate(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ModalOverflow>
          <ModalDialog
            aria-labelledby="modal-dialog-overflow1"
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
              id="modal-title1"
              level="h4"
              fontWeight="lg"
              mb={1}
            >
              Donate
            </Typography>
            <AspectRatio
              ratio="1"
              maxHeight={50}
              sx={{ width: 200, m: "auto" }}
            >
              <Image
                layout="fill"
                src="/monero-logo.png"
                alt="monero-logo"
                style={{ backgroundColor: "Background" }}
              />
            </AspectRatio>
            <Box
              maxWidth={310}
              alignSelf={"center"}
              textAlign={"center"}
            >
              <AspectRatio ratio="1" sx={{ mt: 1, mb: 1 }}>
                <Image
                  layout="fill"
                  alt="monero-qr"
                  src="/monero-qr.png"
                />
              </AspectRatio>
              <Typography
                textColor="text.tertiary"
                sx={{ wordWrap: "break-word" }}
              >
                <code>{moneroAddr}</code>
              </Typography>
              <Tooltip
                title="Copied!"
                open={copied}
                arrow
                variant="solid"
                placement="right"
              >
                <Button
                  color="neutral"
                  size="sm"
                  onClick={handleCopy}
                >
                  Copy
                </Button>
              </Tooltip>
            </Box>
          </ModalDialog>
        </ModalOverflow>
      </Modal>
    </div>
  );
}
