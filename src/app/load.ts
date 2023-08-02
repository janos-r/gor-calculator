import { Opponents } from "@/components/OpponentSearch";
import { Dispatch, SetStateAction } from "react";
import { ApiPlayer, FetchPlayer } from "./s/[dyn]/route";

export async function loadPlayer(
    setPlayerMain: Dispatch<SetStateAction<ApiPlayer | null>>,
    playerMainKey: string,
): Promise<void> {
    const playerMainVal = localStorage.getItem(playerMainKey);
    let playerMainLoaded: ApiPlayer | null = playerMainVal
        ? JSON.parse(playerMainVal)
        : null;

    // Refresh once per day
    // 86,400,000 milliseconds (the number of seconds in one day)
    const t24hAgo = Date.now() - 864e5;
    if (playerMainLoaded && playerMainLoaded.timestamp < t24hAgo) {
        // fetch by pin
        const res = await fetch(
            `https://www.europeangodatabase.eu/EGD/GetPlayerDataByPIN.php?pin=${playerMainLoaded.pin}`,
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const resJson: FetchPlayer = await res.json();

        const playerUpdated: ApiPlayer = {
            ...playerMainLoaded,
            rank: resJson.Grade,
            rating: +resJson.Gor,
            timestamp: new Date().getTime(),
        };
        playerMainLoaded = playerUpdated;
    }
    setPlayerMain(playerMainLoaded);
}

export function loadOpponents(
    setOpponents: Dispatch<SetStateAction<Opponents>>,
    opponentsKey: string,
): void {
    const opponentsDefault = [{
        id: 0,
        opponent: null,
        win: true,
        gorChange: null,
    }];
    const opponentsVal = localStorage.getItem(opponentsKey);
    let opponentsLoaded: Opponents = opponentsVal
        ? JSON.parse(opponentsVal)
        : opponentsDefault;
    if (opponentsLoaded.length === 0) opponentsLoaded = opponentsDefault;
    setOpponents(opponentsLoaded);
}
