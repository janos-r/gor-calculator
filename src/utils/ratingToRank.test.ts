import ratingToRank from "./ratingToRank";

const r1 = 1766;
const r2 = 1824;
const r3 = 2043;
const r4 = 2075;
const k3 = "3k";
const k1 = "1k";
const d1 = "1d";

test("ratingToRank", () => {
    expect(ratingToRank(r1)).toBe(k3);
    expect(ratingToRank(r2)).toBe(k3);
    expect(ratingToRank(r3)).toBe(k1);
    expect(ratingToRank(r4)).toBe(d1);
});
