import { ApiPlayer } from "@/app/s/[dyn]/route";
import countryCodes from "@/utils/countryCodes";
import { getFlagEmoji } from "@/utils/getFlagEmoji";
import { OpenInNew } from "@mui/icons-material";
import { Grid, Link, Typography } from "@mui/joy";

export default function PlayerDetails(
  props: { value: ApiPlayer },
) {
  const { value: player } = props;
  return typeof player?.rating === "number"
    ? (
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginTop: 1 }}
      >
        <Grid sx={{ marginRight: 3 }}>
          <Typography fontSize={"sm"}>
            GoR: {player.rating}
          </Typography>
          {player.pin &&
            (
              <Typography
                fontSize={"sm"}
                textColor="neutral"
              >
                ID:{" "}
                <Link
                  tabIndex={-1}
                  href={`https://www.europeangodatabase.eu/EGD/Player_Card.php?&key=${player.pin}`}
                  textColor={"inherit"}
                  endDecorator={<OpenInNew />}
                  target="_blank"
                  rel="noopener"
                >
                  {player.pin}
                </Link>
              </Typography>
            )}
        </Grid>
        <Grid container alignItems="center">
          <Typography fontSize={"sm"}>
            {countryCodes[player.country]}
          </Typography>
          <Typography
            fontSize={25}
            sx={{ marginLeft: 0.5 }}
          >
            {player?.country && getFlagEmoji(player.country)}
          </Typography>
        </Grid>
      </Grid>
    )
    : (
      <Typography
        sx={{ marginTop: 2 }}
        textAlign={"center"}
        color="danger"
      >
        Please select a real player, or a rating 0-4000!
      </Typography>
    );
}
