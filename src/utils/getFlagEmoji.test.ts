import { getFlagEmoji } from "./getFlagEmoji";

test("getFlagEmoji", () => {
    expect(getFlagEmoji("US")).toBe(`🇺🇸`);
    expect(getFlagEmoji("NL")).toBe(`🇳🇱`);
    expect(getFlagEmoji("CH")).toBe(`🇨🇭`);
    expect(getFlagEmoji("GB")).toBe(`🇬🇧`);
});

test("exception", () => {
    expect(getFlagEmoji("UK")).toBe(`🇬🇧`);
});
