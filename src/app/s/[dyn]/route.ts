import { NextResponse } from "next/server";

export type FetchPlayer = {
    Pin_Player: string; // "14349819";
    AGAID: string; // "0";
    Last_Name: string; // "Janos";
    Name: string; // "Radim";
    Country_Code: string; // "CZ";
    Club: string; // "UDec";
    Grade: string; // "3k";
    Grade_n: string; // "27";
    EGF_Placement: string; // "0";
    Gor: string; // "1766";
    DGor: string; // "0";
    Proposed_Grade: string; // "";
    Tot_Tournaments: string; // "20";
    Last_Appearance: string; // "T210911B";
    Elab_Date: string; // "2009-04-03";
    Hidden_History: string; // "0";
    Real_Last_Name: string; // "Janos";
    Real_Name: string; // "Radim";
};
type FetchRes = {
    retcode: string; // "Ok";
    players: FetchPlayer[];
};
export type ApiPlayer = {
    pin?: string;
    fullName: string;
    rank: string;
    rating: number;
    country: string;
    timestamp?: number;
};

function FetchPlayerToApiPlayer(p: FetchPlayer): ApiPlayer {
    return ({
        pin: p.Pin_Player,
        fullName: `${p.Last_Name} ${p.Name}`,
        rank: p.Grade,
        rating: +p.Gor,
        country: p.Country_Code,
        timestamp: new Date().getTime(),
    });
}

// 10 min store in browser header cache
const cacheBrowserSec = 10 * 60;

export async function GET(
    _request: Request,
    { params: { dyn } }: { params: { dyn: string } },
): Promise<NextResponse<ApiPlayer[]>> {
    if (!dyn) throw new Error("Missing search string in url path!"); // root should resolve to page anyway
    const res = await fetch(
        `https://www.europeangodatabase.eu/EGD/GetPlayerDataByData.php?lastname=${dyn}`,
        // the bellow doesn't work Y_Y
        // { cache: "force-cache", next: { revalidate: 10 } }, // in seconds
        // { next: { revalidate: 1000000 } }, // in seconds
    );
    if (res.status !== 200) throw new Error("EGD did't return any data");
    const json: FetchRes | undefined = await res.json();
    const players: ApiPlayer[] = json?.players?.map(FetchPlayerToApiPlayer) ||
        [];
    const response: NextResponse<ApiPlayer[]> = NextResponse.json(players);
    response.headers.set(
        "Cache-Control",
        `public, max-age=${cacheBrowserSec}, immutable`,
    );
    return response;
}
