import { OpenInNew } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  Button,
  Grid,
  Link,
  Modal,
  ModalClose,
  Sheet,
  Typography,
} from "@mui/joy";
import { useState } from "react";

export default function Bar() {
  const [openAbout, setOpenAbout] = useState<boolean>(false);
  return (
    <Grid
      container
      bgcolor={"background.level2"}
      justifyContent="center"
      p={1}
      marginBottom={1}
    >
      <Button
        variant="outlined"
        color="neutral"
        onClick={() => setOpenAbout(true)}
        sx={{
          marginRight: 5,
          fontSize: 17,
        }}
      >
        About
      </Button>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openAbout}
        onClose={() => setOpenAbout(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 500,
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
            I often saw on tournaments how people were trying to calculate their
            progress with the calculator on{" "}
            <Link href="https://europeangodatabase.eu/EGD/gor_calculator.php">
              EGD
            </Link>. It is very detailed and still the best choice if you are on
            a non-A class tournament. This app is currently only calculating
            A-class and non-handicap. As that is the most common anyway. I
            wanted to challenge myself to make something slightly more user
            friendly, that can look good on smartphones and remember the choices
            even after closing, as the tournament progresses. This app caches
            all the selected players. The main player gets refreshed once per
            day and the opponents stay unchanged until cleared. If you find any
            bugs or would like to provide some fix or feature, feel free to
            contact me via GitHub with a PR or with an issue. I leave this code
            fully open. <br />
            I love Go and I would be happy if this can be a useful way how to
            give back to the community.<br />
            <br />

            Good luck in your games and don&apos;t forget to have fun ;)<br />
            Radim Janoš
          </Typography>
        </Sheet>
      </Modal>

      <Button
        color="neutral"
        variant="outlined"
      >
        <Link
          textColor="inherit"
          href={"https://github.com/janos-r/gor-calculator"}
          startDecorator={<GitHubIcon sx={{ fontSize: 30 }} />}
          endDecorator={<OpenInNew />}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </Link>
      </Button>
    </Grid>
  );
}
