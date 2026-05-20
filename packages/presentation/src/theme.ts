type Hex = string;

type Palette = {
  ink: Hex;
  inkSoft: Hex;
  muted: Hex;
  line: Hex;
  bg: Hex;
  panel: Hex;
  teal: Hex;
  tealSoft: Hex;
  gold: Hex;
  goldSoft: Hex;
  red: Hex;
  redSoft: Hex;
  orange: Hex;
  orangeSoft: Hex;
  green: Hex;
  greenSoft: Hex;
  white: Hex;
};

export const presentationPalette: Palette = {
  ink: "172033",
  inkSoft: "2A3447",
  muted: "5B667A",
  line: "D6DEE8",
  bg: "F7FAFC",
  panel: "FFFFFF",
  teal: "0F766E",
  tealSoft: "CDEDE9",
  gold: "B45309",
  goldSoft: "FDE68A",
  red: "B91C1C",
  redSoft: "FECACA",
  orange: "C2410C",
  orangeSoft: "FED7AA",
  green: "15803D",
  greenSoft: "BBF7D0",
  white: "FFFFFF",
};

export const presentationFonts = {
  head: "Aptos Display" as string,
  body: "Aptos" as string,
  mono: "Consolas" as string,
};

export const riskColorById: Record<string, { fill: Hex; soft: Hex }> = {
  low: { fill: presentationPalette.green, soft: presentationPalette.greenSoft },
  medium: { fill: presentationPalette.gold, soft: presentationPalette.goldSoft },
  high: { fill: presentationPalette.orange, soft: presentationPalette.orangeSoft },
  critical: { fill: presentationPalette.red, soft: presentationPalette.redSoft },
};

export const termPaletteByIndex: Hex[] = [
  presentationPalette.teal,
  presentationPalette.gold,
  presentationPalette.orange,
  presentationPalette.red,
  presentationPalette.green,
];
