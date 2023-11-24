/*
Source: https://www.europeangodatabase.eu/EGD/EGF_rating_system.php#System

System description

Ratings are updated by: r' = r + con * (Sa - Se) + bonus
r is the old EGD rating (GoR) of the player
r' is the new EGD rating of the player
Sa is the actual game result (1.0 = win, 0.5 = jigo, 0.0 = loss)
Se is the expected game result as a winning probability (1.0 = 100%, 0.5 = 50%, 0.0 = 0%). See further below for its computation.
con is a factor that determines rating volatility (similar to K in regular Elo rating systems): con = ((3300 - r) / 200)^1.6
bonus (not found in regular Elo rating systems) is a term included to counter rating deflation: bonus = ln(1 + exp((2300 - rating) / 80)) / 5
Se is computed by the Bradley-Terry formula: Se = 1 / (1 + exp(β(r2) - β(r1)))
r1 is the EGD rating of the player
r2 is the EGD rating of the opponent
β is a mapping function for EGD ratings: β = -7 * ln(3300 - r)

Tournament classes
class A:
well organized tournament
time limit requirements: adjusted time minimum 75 minutes, basic time minimum 60 minutes;
Fischer time: basic time minimum 45 mins
weight for inclusion to EGF ratings: 1.00
class B:
well organized tournament
time limit requirements: adjusted time minimum 50 minutes, basic time minimum 40 minutes;
Fischer time: basic time minimum 30 mins
weight for inclusion to EGF ratings: 0.75
class C:
casual or club tournament
time limit requirements: adjusted time minimum 30 minutes, basic time minimum 25 minutes;
Fischer time: basic time minimum 20 mins
weight for inclusion to EGF ratings: 0.50
class D:
Tournaments played on Internet
time limit requirements: adjusted time minimum 50 minutes, basic time minimum 40 minutes;
Fischer time: basic time minimum 30 mins
weight for inclusion to EGF ratings: 0.25
*/

export type GorResult = {
    gorNew: number;
    gorChange: number;
    winProbability: number;
};

// export type TournamentClass = 1 | 0.75 | 0.5 | 0.25;

export enum TournamentClass {
    A = 1,
    B = 0.75,
    C = 0.5,
    D = 0.25,
}

export default function calcGor(
    player: number,
    tournamentClass: TournamentClass,
    opponent: number,
    win: boolean,
): GorResult {
    const r1 = player;
    const r2 = opponent;
    const Sa = win ? 1 : 0;
    const Se = 1 / (1 + Math.exp(beta(r2) - beta(r1)));
    const con = ((3300 - r1) / 200) ** 1.6;
    const bonus = Math.log(1 + Math.exp((2300 - r1) / 80)) / 5;
    const gorNew = r1 + con * (Sa - Se) + bonus;
    const gorChange = (gorNew - r1) * tournamentClass;

    function beta(r: number): number {
        return -7 * Math.log(3300 - r);
    }

    return { gorNew, gorChange, winProbability: Se };
}
