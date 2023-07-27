export default function toRankUp(r: number | undefined): number {
    if (r === undefined) {
        return 100;
    } else {
        const doubleDigit = r % 100;
        if (doubleDigit < 50) {
            return 50 - doubleDigit;
        } else {
            return 150 - doubleDigit;
        }
    }
}
