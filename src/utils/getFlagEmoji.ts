export function getFlagEmoji(countryCode: string): string {
    const codePoints = mapException(countryCode)
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

function mapException(countryCode: string): string {
    const map: Record<string, string> = { UK: "GB" };
    return map[countryCode] || countryCode;
}
