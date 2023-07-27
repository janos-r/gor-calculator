import toRankUp from "./toRankUp";

const r1 = 1766;
const r1Missing = 1850 - r1;
const r2 = 1824;
const r2Missing = 1850 - r2;

test("toRankUp", () => {
    expect(toRankUp(r1)).toBe(r1Missing);
    expect(toRankUp(r2)).toBe(r2Missing);
});
