import { ApiPlayer } from "@/app/[dyn]/route";
import countryCodes from "@/utils/countryCodes";
import { getFlagEmoji } from "@/utils/getFlagEmoji";
import { OpenInNew } from "@mui/icons-material";
import { Grid, Link, Typography } from "@mui/joy";

export default function PlayerDetails(
  props: { value: ApiPlayer },
) {
  const { value: player } = props;
  return (
    <Grid
      container
      justifyContent="flex-start"
      alignItems="center"
      sx={{ marginTop: 1 }}
    >
      <Grid sx={{ marginRight: 3 }}>
        <Typography fontSize={"sm"}>
          GoR: {player.rating}
        </Typography>
        <Typography
          fontSize={"sm"}
          textColor="neutral.400"
        >
          ID:{" "}
          <Link
            href={`https://www.europeangodatabase.eu/EGD/Player_Card.php?&key=${player.pin}`}
            color="neutral"
            endDecorator={<OpenInNew color="primary" />}
            target="_blank"
            rel="noopener"
          >
            {player.pin}
          </Link>
        </Typography>
      </Grid>
      <Grid container alignItems="center">
        <Typography
          fontSize={30}
          sx={{ marginRight: 0.5 }}
        >
          {getFlagEmoji(player.country)}
        </Typography>
        <Typography fontSize={"sm"}>
          {countryCodes[player.country]}
        </Typography>
      </Grid>
    </Grid>
  );
}
