"use client";

import {
  Button,
  CircularProgress,
  CssVarsProvider,
  FormControl,
  FormLabel,
  Grid,
  Link,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { useEffect, useState } from "react";
import CssBaseline from "@mui/joy/CssBaseline";
import PlayerSearch from "@/components/PlayerSearch";
import ColorSchemeToggle from "@/components/ColorSchemeToggle";
import { ApiPlayer } from "./[dyn]/route";
import toRankUp from "@/utils/toRankUp";
import OpponentSearch, { Opponents } from "@/components/OpponentSearch";
import LinkIcon from "@mui/icons-material/Link";
import ratingToRank from "@/utils/ratingToRank";
import { East } from "@mui/icons-material";

export default function Home() {
  const [playerMain, setPlayerMain] = useState<ApiPlayer | null>();
  const [opponents, setOpponents] = useState<Opponents>([{
    id: 0,
    opponent: null,
    win: true,
    gorChange: null,
  }]);
  const [progress, setProgress] = useState<number>(0);
  const [totalGorChange, setTotalGorChange] = useState<number>();
  const [progressGor, setProgressGor] = useState<number>(0);

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
    // setProgress here, to reset immediately to the new player rating
    setProgressGor(playerMain?.rating || 0);
    if (playerMain && opponents.some((o) => o?.opponent)) {
      const totalGorChange = opponents.reduce((acc, next) => {
        if (next?.gorChange) acc += next.gorChange;
        return acc;
      }, 0);
      const totalGorChangeRounded = Math.round(totalGorChange);
      setTotalGorChange(totalGorChangeRounded);
    } else {
      setTotalGorChange(undefined);
    }
  }, [playerMain, opponents]);

  return (
    <CssVarsProvider defaultMode="dark">
      <CssBaseline />
      <ColorSchemeToggle />

      <Grid container justifyContent={"center"}>
        <Stack width={420}>
          {/* Main Player */}
          <Sheet
            variant="outlined"
            color="primary"
            sx={{ m: 3, p: 3, paddingTop: 3, borderRadius: 50, borderWidth: 4 }}
          >
            <FormControl size="lg" sx={{ m: 1 }}>
              <FormLabel>Main player</FormLabel>
              <PlayerSearch value={playerMain} setValue={setPlayerMain} />
              {playerMain && (
                <Grid container sx={{ flexGrow: 1, marginTop: 1 }}>
                  <Typography
                    fontSize={"sm"}
                    textColor="neutral.300"
                    sx={{ marginRight: "auto" }}
                  >
                    GoR: {playerMain.rating}
                  </Typography>
                  <Typography
                    fontSize={"sm"}
                    textColor="neutral.400"
                    sx={{ marginLeft: "auto" }}
                  >
                    ID:{"  "}
                    <Link
                      href={`https://www.europeangodatabase.eu/EGD/Player_Card.php?&key=${playerMain.pin}`}
                      color="neutral"
                      endDecorator={<LinkIcon color="primary" />}
                      target="_blank"
                      rel="noopener"
                    >
                      {playerMain.pin}
                    </Link>
                  </Typography>
                </Grid>
              )}
            </FormControl>
          </Sheet>

          {/* Opponents */}
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
            sx={{ m: "auto", width: "70%" }}
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

          <Button
            color="danger"
            sx={{ width: 160, alignSelf: "end", m: 1, marginTop: 4 }}
            size="sm"
            onClick={() => setOpponents([])}
          >
            Clear all opponents
          </Button>
        </Stack>

        <CircularProgress
          // size="lg"
          sx={{
            "--CircularProgress-size": "210px",
            "--CircularProgress-progressThickness": "12px",
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
    </CssVarsProvider>
  );
}
