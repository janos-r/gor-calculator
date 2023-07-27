import calcGor from "./calcGor";

const r1 = 1766; // Janos - win
const r2 = 1824; // Miyagaki
const gor1should = 16.102;
const gor2should = -12.693;

test("calcGor - win", () => {
    const { gorChange: gor1calc } = calcGor(r1, r2, true);
    expect(gor1calc.toFixed(3)).toBe(gor1should.toString());
});

test("calcGor - loos", () => {
    const { gorChange: gor2calc } = calcGor(r2, r1, false);
    expect(gor2calc.toFixed(3)).toBe(gor2should.toString());
});
