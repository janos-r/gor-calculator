import type { ApiPlayer } from "@/app/s/[dyn]/route";
import calcGor, { type GorResult, type TournamentClass } from "@/utils/calcGor";
import { Close } from "@mui/icons-material";
import {
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Sheet,
  Switch,
  Typography,
} from "@mui/joy";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import PlayerDetails from "./PlayerDetails";
import PlayerSearch from "./PlayerSearch";

export type Opponents = Array<{
  id: number;
  opponent: ApiPlayer | null;
  win: boolean;
  gorChange: number | null;
}>;

export default function OpponentSearch(
  props: {
    id: number;
    opponents: Opponents;
    setOpponents: Dispatch<SetStateAction<Opponents>>;
    mainPlayerGor: number | undefined;
    tournamentClass: TournamentClass;
  },
) {
  const { id, opponents, setOpponents, mainPlayerGor, tournamentClass } = props;
  const index = opponents.findIndex((o) => o?.id === id);
  const item = opponents[index];
  const loadOpponent = item?.opponent || null;
  const loadWin = item?.win;
  const loadGorChange = item?.gorChange;

  const [opponent, setOpponent] = useState<ApiPlayer | null>(
    loadOpponent,
  );
  const [win, setWin] = useState(loadWin ?? true);
  const [calcGorResult, setCalcGorResult] = useState<GorResult | null>(null);

  useEffect(() => {
    setCalcGorResult(
      (mainPlayerGor && opponent)
        ? calcGor(mainPlayerGor, tournamentClass, opponent.rating, win)
        : null,
    );
  }, [mainPlayerGor, tournamentClass, opponent, win]);

  useEffect(() => {
    setOpponents((arr) => {
      const index = arr.findIndex((el) => el?.id === id);
      arr[index] = {
        id,
        opponent: opponent || null,
        win,
        gorChange: calcGorResult?.gorChange || loadGorChange || null,
      };
      return [...arr];
    });
  }, [opponent, win, calcGorResult]);

  return (
    <Sheet
      variant="outlined"
      color="primary"
      sx={{ p: 3, borderRadius: 30, borderWidth: 4 }}
    >
      <FormControl size="lg" sx={{ m: 1, marginBottom: 0 }}>
        <IconButton
          size="sm"
          variant="plain"
          // This stupid negative setting is a workaround. It didn't work outside of FormControl with positive numbers
          sx={{ position: "absolute", right: -12, top: -12 }}
          onClick={() => {
            setOpponents((arr) => arr.filter((o) => o?.id !== id));
          }}
        >
          <Close />
        </IconButton>
        <FormLabel>Opponent {index + 1}</FormLabel>
        <PlayerSearch value={opponent} setValue={setOpponent} />
        {opponent && <PlayerDetails value={opponent} />}

        <Switch
          sx={{ m: 2 }}
          color={win ? "success" : "danger"}
          startDecorator={<Typography textColor="primary.300">Win</Typography>}
          endDecorator={<Typography textColor="primary.300">Loss</Typography>}
          onChange={() => setWin(!win)}
          checked={!win}
        />
      </FormControl>

      {calcGorResult && (
        <Grid container sx={{ flexGrow: 1 }}>
          <Grid xs={6}>
            <Typography
              fontSize={30}
              textAlign={"center"}
              sx={{ marginRight: "1ch" }}
              color={calcGorResult.gorChange > 0 ? "success" : "danger"}
              fontWeight={"bold"}
            >
              {calcGorResult.gorChange > 0 ? "+" : ""}
              {calcGorResult.gorChange.toFixed(1)}
            </Typography>
            <Typography textAlign={"center"}>
              GoR change
            </Typography>
          </Grid>
          <Grid xs={6}>
            <Typography
              fontSize={30}
              textAlign={"center"}
            >
              {(calcGorResult.winProbability * 100).toFixed()}%
            </Typography>
            <Typography textAlign={"center"}>
              Win probability
            </Typography>
          </Grid>
        </Grid>
      )}
    </Sheet>
  );
}
