"use client";

import {
  Box,
  Button,
  CircularProgress,
  CssVarsProvider,
  FormControl,
  FormLabel,
  GlobalStyles,
  Grid,
  Option,
  Select,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { useEffect, useState } from "react";
import CssBaseline from "@mui/joy/CssBaseline";
import PlayerSearch from "@/components/PlayerSearch";
import { ApiPlayer } from "./s/[dyn]/route";
import toRankUp from "@/utils/toRankUp";
import OpponentSearch, { Opponents } from "@/components/OpponentSearch";
import ratingToRank from "@/utils/ratingToRank";
import { loadOpponents, loadPlayer, loadTournamentClass } from "./load";
import PlayerDetails from "@/components/PlayerDetails";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollToBottom from "@/components/ScrollToBottom";
import EastIcon from "@mui/icons-material/East";
import MenuButton from "@/components/MenuButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddIcon from "@mui/icons-material/Add";
import { TournamentClass } from "@/utils/calcGor";

const loadPlayerKey = "playerMain";
const loadTournamentClassKey = "tournamentClass";
const loadOpponentsKey = "opponents";

export default function Home() {
  const [playerMain, setPlayerMain] = useState<ApiPlayer | null>(null);
  const [tournamentClass, setTournamentClass] = useState<TournamentClass>(
    TournamentClass.A,
  );
  const [opponents, setOpponents] = useState<Opponents>([]);
  const [progress, setProgress] = useState<number>(0); // from 0-100 - wheel input
  const [totalGorChange, setTotalGorChange] = useState<number | null>(null);
  const [progressGor, setProgressGor] = useState<number>(0); // full GoR - dynamic value

  // On init - localStorage
  useEffect(() => {
    loadPlayer(setPlayerMain, loadPlayerKey).catch(console.error);
    loadTournamentClass(setTournamentClass, loadTournamentClassKey);
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

  // Tournament class change localStorage
  useEffect(() => {
    localStorage.setItem(
      loadTournamentClassKey,
      JSON.stringify(tournamentClass),
    );
  }, [tournamentClass]);

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
      setTournamentClass(TournamentClass.A);
    }
  }, [playerMain, opponents]);

  return (
    <CssVarsProvider defaultMode="system">
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { "scrollBehavior": "smooth" },
          ":root": {
            "--Collapsed-breakpoint": "1000px", // form will stretch when viewport is below
            "--Cover-width": "40vw", // must be `vw` only
            "--Transition-duration": "0.3s", // set to `none` to disable transition
          },
        }}
      />

      <Grid
        container
        direction="column"
        sx={(theme) => ({
          minHeight: "100vh",
          width:
            "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)",
          minWidth: "420px", // otherwise the blur filter is resized on mobile and doesn't cover the full width of the screen
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(255 255 255 / 0.6)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        })}
      >
        <Grid container justifyContent={"center"} marginBottom={5}>
          <Stack>
            {/* Main Player */}
            <Sheet
              variant="outlined"
              color="primary"
              sx={{
                m: 3,
                p: 3,
                paddingTop: 3,
                borderRadius: 30,
                borderWidth: 4,
              }}
            >
              <FormControl size="lg" sx={{ m: 1 }}>
                <FormLabel>Main player</FormLabel>
                <PlayerSearch value={playerMain} setValue={setPlayerMain} />
                {playerMain && <PlayerDetails value={playerMain} />}
              </FormControl>
            </Sheet>

            <Stack
              direction="row"
              justifyContent="space-around"
              alignItems="flex-end"
              spacing={2}
            >
              <FormControl>
                <FormLabel>
                  Tournament class
                </FormLabel>
                <Select
                  size="sm"
                  value={tournamentClass}
                  onChange={(_event, newValue) => {
                    setTournamentClass(newValue as TournamentClass);
                  }}
                >
                  <Option value={TournamentClass.A}>A &nbsp; 100%</Option>
                  <Option value={TournamentClass.B}>B &nbsp;&nbsp; 75%</Option>
                  <Option value={TournamentClass.C}>C &nbsp;&nbsp; 50%</Option>
                  <Option value={TournamentClass.D}>D &nbsp;&nbsp; 25%</Option>
                </Select>
              </FormControl>

              {/* Opponents */}
              <Button
                sx={{ justifyContent: "end" }}
                color="danger"
                variant="soft"
                size="sm"
                startDecorator={<HighlightOffIcon />}
                onClick={() => setOpponents([])}
              >
                All opponents
              </Button>
            </Stack>

            <Stack marginBottom={2} spacing={2} sx={{ p: 3 }}>
              {opponents.map((e) => {
                return (
                  <OpponentSearch
                    key={e?.id}
                    id={e!.id}
                    opponents={opponents}
                    setOpponents={setOpponents}
                    mainPlayerGor={playerMain?.rating}
                    tournamentClass={tournamentClass}
                  />
                );
              })}
            </Stack>

            <Button
              size="lg"
              variant="outlined"
              sx={{ width: "auto", m: "auto", marginBottom: 4 }}
              startDecorator={<AddIcon />}
              onClick={() => {
                setOpponents([...opponents, {
                  id: Math.random(),
                  opponent: null,
                  win: true,
                  gorChange: null,
                }]);
                setTimeout(
                  () => window.scrollTo(0, document.body.scrollHeight),
                  // wait for the window height to update, otherwise it doesn't scroll all the way down
                  0,
                );
              }}
            >
              Opponent
            </Button>
          </Stack>

          <CircularProgress
            sx={{
              "--CircularProgress-size": "240px",
              // "--CircularProgress-trackThickness": "12px",
              "--CircularProgress-progressThickness": "15px",
              m: 4,
              // border: 2,
              // borderWidth: 4,
              boxShadow: "0 0 20px",
            }}
            color="primary"
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
                    {playerMain.rating} <EastIcon fontSize="medium" />{" "}
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
      </Grid>

      <Box
        sx={(theme) => ({
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left:
            "clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))",
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: "url(bg-light.avif)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage: "url(bg-dark.avif)",
            filter: "brightness(20%)",
          },
        })}
      />

      {/* Menu and scroll buttons have to be outside the blurred grid, because the backdropFilter causes them to not be "fixed" relatively to the window, but to the Grid. It is an exception created by this backdropFilter, creating an extra layer, breaking the otherwise functional fixed position. */}
      <MenuButton />
      <ScrollToTop />
      <ScrollToBottom />
    </CssVarsProvider>
  );
}
