export default function ratingToRank(r: number): string {
    const rank = Math.round(r / 100);
    if (rank < 21) return (21 - rank) + "k";
    else return (rank - 20) + "d";
}
