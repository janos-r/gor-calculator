import { ApiPlayer } from "@/app/[dyn]/route";
import {
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Link,
  Sheet,
  Switch,
  Typography,
} from "@mui/joy";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import PlayerSearch from "./PlayerSearch";
import { Close } from "@mui/icons-material";
import LinkIcon from "@mui/icons-material/Link";
import calcGor, { GorResult } from "@/utils/calcGor";

export type Opponents = Array<
  {
    id: number;
    opponent: ApiPlayer | null;
    win: boolean;
    gorChange: number | null;
  } | null
>;

export default function OpponentSearch(
  props: {
    id: number;
    opponents: Opponents;
    setOpponents: Dispatch<SetStateAction<Opponents>>;
    mainPlayerGor: number | undefined;
  },
) {
  const { id, opponents, setOpponents, mainPlayerGor } = props;
  const index = opponents.findIndex((o) => o?.id === id);
  const item = opponents[index];
  const loadOpponent = item?.opponent;
  const loadWin = item?.win;

  const [opponent, setOpponent] = useState<ApiPlayer | null | undefined>(
    loadOpponent,
  );
  const [win, setWin] = useState(loadWin ?? true);
  const [calcGorRes, setCalcGorRes] = useState<GorResult | null>(null);

  useEffect(() => {
    setCalcGorRes(
      (mainPlayerGor && opponent)
        ? calcGor(mainPlayerGor, opponent.rating, win)
        : null,
    );
  }, [mainPlayerGor, opponent, win]);

  useEffect(() => {
    setOpponents((arr) => {
      const index = arr.findIndex((el) => el?.id === id);
      arr[index] = {
        id,
        opponent: opponent || null,
        win,
        gorChange: calcGorRes?.gorChange || null,
      };
      return [...arr];
    });
    console.log(`opponents: ${JSON.stringify(opponents)}`);
  }, [opponent, win, calcGorRes]);

  return (
    <Sheet
      variant="outlined"
      color="primary"
      sx={{ p: 3, borderRadius: 50 }}
    >
      <FormControl size="lg" sx={{ m: 1, marginBottom: 0 }}>
        <IconButton
          size="sm"
          variant="soft"
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
        {opponent && (
          <Grid container sx={{ flexGrow: 1, marginTop: 1 }}>
            <Typography
              fontSize={"sm"}
              textColor="neutral.300"
              sx={{ marginRight: "auto" }}
            >
              GoR: {opponent.rating}
            </Typography>
            <Typography
              fontSize={"sm"}
              textColor="neutral.400"
              sx={{ marginLeft: "auto" }}
            >
              ID:{" "}
              <Link
                href={`https://www.europeangodatabase.eu/EGD/Player_Card.php?&key=${opponent.pin}`}
                color="neutral"
                endDecorator={<LinkIcon color="primary" />}
                target="_blank"
                rel="noopener"
              >
                {opponent.pin}
              </Link>
            </Typography>
          </Grid>
        )}

        <Switch
          sx={{ m: 2 }}
          color={win ? "success" : "danger"}
          startDecorator={<Typography textColor="primary.300">Win</Typography>}
          endDecorator={<Typography textColor="primary.300">Loss</Typography>}
          onChange={() => setWin(!win)}
          checked={!win}
        />
      </FormControl>

      {calcGorRes && (
        <Grid container sx={{ flexGrow: 1 }}>
          <Grid xs={6}>
            <Typography
              fontSize={30}
              textAlign={"center"}
              sx={{ marginRight: "1ch" }}
              color={calcGorRes.gorChange > 0 ? "success" : "danger"}
              fontWeight={"bold"}
            >
              {calcGorRes.gorChange > 0 ? "+" : ""}
              {calcGorRes.gorChange.toFixed(1)}
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
              {(calcGorRes.winProbability * 100).toFixed()}%
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