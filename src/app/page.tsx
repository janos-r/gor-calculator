"use client";

import {
  Button,
  CircularProgress,
  CssVarsProvider,
  FormControl,
  FormLabel,
  GlobalStyles,
  Grid,
  IconButton,
  Link,
  Sheet,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useEffect, useState } from "react";
import CssBaseline from "@mui/joy/CssBaseline";
import PlayerSearch from "@/components/PlayerSearch";
import ColorSchemeToggle from "@/components/ColorSchemeToggle";
import { ApiPlayer } from "./[dyn]/route";
import toRankUp from "@/utils/toRankUp";
import OpponentSearch, { Opponents } from "@/components/OpponentSearch";
import ratingToRank from "@/utils/ratingToRank";
import { East } from "@mui/icons-material";
import { loadOpponents, loadPlayer } from "./load";
import PlayerDetails from "@/components/PlayerDetails";
import Footer from "@/components/footer";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const loadPlayerKey = "playerMain";
const loadOpponentsKey = "opponents";

export default function Home() {
  const [playerMain, setPlayerMain] = useState<ApiPlayer | null>(null);
  const [opponents, setOpponents] = useState<Opponents>([]);
  const [progress, setProgress] = useState<number>(0); // from 0-100 - wheel input
  const [totalGorChange, setTotalGorChange] = useState<number | null>(null);
  const [progressGor, setProgressGor] = useState<number>(0); // full GoR - dynamic value

  // On init - localStorage
  useEffect(() => {
    loadPlayer(setPlayerMain, loadPlayerKey).catch(console.error);
    loadOpponents(setOpponents, loadOpponentsKey);
  }, []);

  // Player change localStorage
  useEffect(() => {
    /*
    This works as expected on prod!
    To make loading work on a dev build, this would be necessary:
    Don't change on init render:
    const initialPlayerRender = useRef(true);
    const initialOpponentsRender = useRef(true);
    if (initialPlayerRender.current) {
     initialPlayerRender.current = false;
    } else {...}
    */
    if (playerMain) {
      localStorage.setItem(loadPlayerKey, JSON.stringify(playerMain));
    } else {
      localStorage.removeItem(loadPlayerKey);
    }
  }, [playerMain]);

  // Opponents change localStorage
  useEffect(() => {
    localStorage.setItem(loadOpponentsKey, JSON.stringify(opponents));
  }, [opponents]);

  // progress
  useEffect(() => {
    setProgress((
      _prevProgress,
    ): number => {
      if (!playerMain) {
        return 0;
      } else if (!progressGor) {
        return (100 - toRankUp(playerMain.rating));
      } else {
        return (100 - toRankUp(progressGor));
      }
    });
  }, [playerMain, progressGor]);

  // progressGor
  useEffect(() => {
    let timer: NodeJS.Timer;
    if (totalGorChange && playerMain) {
      let usePoints = totalGorChange;
      let paused = false;
      if (totalGorChange > 0) {
        timer = setInterval(() => {
          if (usePoints <= 0) {
            if (!paused) {
              paused = true;
              setTimeout(() => {
                // reset
                usePoints = totalGorChange;
                setProgressGor(playerMain.rating);
              }, 2000);
            }
          } else if (paused) {
            setTimeout(() => {
              paused = false;
            }, 1000);
          } else {
            const increment = 1; // has to stay 1 for now; no check on setProgressGor
            usePoints -= increment;
            setProgressGor((r) => r ? r + increment : r);
          }
        }, 40);
      } else if (totalGorChange < 0) {
        timer = setInterval(() => {
          if (usePoints >= 0) {
            if (!paused) {
              paused = true;
              setTimeout(() => {
                // reset after staying on new rating
                usePoints = totalGorChange;
                setProgressGor(playerMain.rating);
              }, 2000);
            }
          } else if (paused) {
            setTimeout(() => {
              // show starting rating for a while
              paused = false;
            }, 1000);
          } else {
            const increment = 1; // has to stay 1 for now; no check on setProgressGor
            usePoints += increment;
            setProgressGor((r) => r ? r - increment : r);
          }
        }, 40);
      }
    }
    return () => {
      clearInterval(timer);
    };
  }, [totalGorChange]);

  useEffect(() => {
    // setProgress here, to change immediately to the new player and/or start animation from base
    setProgressGor(playerMain?.rating || 0);
    // GorChange
    if (playerMain && opponents.some((o) => o?.opponent)) {
      const totalGorChange = opponents.reduce((acc, next) => {
        if (next?.gorChange) acc += next.gorChange;
        return acc;
      }, 0);
      const totalGorChangeRounded = Math.round(totalGorChange);
      setTotalGorChange(totalGorChangeRounded);
    } else {
      setTotalGorChange(null);
    }
  }, [playerMain, opponents]);

  return (
    <CssVarsProvider defaultMode="dark">
      <CssBaseline />
      <GlobalStyles styles={{ html: { "scroll-behavior": "smooth" } }} />
      <ColorSchemeToggle />

      <Grid
        container
        direction="column"
        justifyContent="space-between"
        sx={{ minHeight: "100vh" }}
      >
        <Grid container justifyContent={"center"} marginBottom={5}>
          <Stack width={420}>
            {/* Main Player */}
            <Sheet
              variant="outlined"
              color="primary"
              sx={{
                m: 3,
                p: 3,
                paddingTop: 3,
                borderRadius: 50,
                borderWidth: 4,
              }}
            >
              <FormControl size="lg" sx={{ m: 1 }}>
                <FormLabel>Main player</FormLabel>
                <PlayerSearch value={playerMain} setValue={setPlayerMain} />
                {playerMain && <PlayerDetails value={playerMain} />}
              </FormControl>
            </Sheet>

            {/* Opponents */}
            <Button
              color="danger"
              sx={{ width: 160, alignSelf: "end", m: 1, marginTop: 4 }}
              size="sm"
              onClick={() => setOpponents([])}
            >
              Clear all opponents
            </Button>

            <Stack marginBottom={2} spacing={2} sx={{ p: 3 }}>
              {opponents.map((e) => {
                return (
                  <OpponentSearch
                    key={e?.id}
                    id={e!.id}
                    opponents={opponents}
                    setOpponents={setOpponents}
                    mainPlayerGor={playerMain?.rating}
                  />
                );
              })}
            </Stack>

            <Button
              sx={{ width: "70%", m: "auto", marginBottom: 4 }}
              onClick={() =>
                setOpponents([...opponents, {
                  id: Math.random(),
                  opponent: null,
                  win: true,
                  gorChange: null,
                }])}
            >
              Add opponent
            </Button>
          </Stack>

          <CircularProgress
            id="circle"
            sx={{
              "--CircularProgress-size": "230px",
              "--CircularProgress-progressThickness": "15px",
              m: 4,
            }}
            determinate
            value={progress}
            variant="outlined"
          >
            {playerMain && (
              <Typography textAlign={"center"}>
                <Typography level="h2">
                  {ratingToRank(progressGor)} <br />
                </Typography>
                <Typography>
                  {progressGor} GoR<br />
                </Typography>
                {totalGorChange && (
                  <Typography>
                    {
                      /* TODO: make the arrow lower or smaller.
                      There are some type issues with using fontSize. "md" builds in dev, but not in build. And "medium" doesn't have an effect. */
                    }
                    {playerMain.rating} <East fontSize="medium" />{" "}
                    <Typography
                      color={totalGorChange > 0 ? "success" : "danger"}
                    >
                      {playerMain.rating + totalGorChange}
                    </Typography>
                    <br />
                  </Typography>
                )}
                {toRankUp(playerMain.rating)} to rank up<br />
                {totalGorChange && (
                  <Typography
                    level="h3"
                    fontWeight="bold"
                    color={totalGorChange > 0 ? "success" : "danger"}
                    marginRight={"1ch"}
                  >
                    {totalGorChange > 0 ? "+" : ""}
                    {totalGorChange}
                  </Typography>
                )}
              </Typography>
            )}
          </CircularProgress>
        </Grid>

        <Link href="#top">
          <Tooltip title="Scroll to top" variant="soft">
            <IconButton
              aria-label="Scroll to top"
              size="lg"
              variant="soft"
              color="neutral"
              sx={{
                position: "fixed",
                zIndex: 999,
                bottom: "2rem",
                right: "2rem",
                borderRadius: "50%",
                boxShadow: "sm",
              }}
            >
              <KeyboardArrowUpIcon />
            </IconButton>
          </Tooltip>
        </Link>

        <Footer />
      </Grid>
    </CssVarsProvider>
  );
}
