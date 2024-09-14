import type { BasicColorMode } from "@vueuse/core";

export const toAscii = (imageData: ImageData, mode: BasicColorMode) => {
  const data = imageData.data;
  const charSet = [
    "@",
    "#",
    "S",
    "%",
    "?",
    "*",
    "+",
    ";",
    ":",
    ",",
    ".",
    " ",
    " ",
    " ",
  ];
  const chars = mode === "dark" ? charSet.reverse() : charSet;
  // const chars = "█▓▒░".split("");

  const shades = new Set<number>();

  for (let i = 0; i < data.length; i += 4) {
    const brightness = data[i] + data[i + 1] + data[i + 2];
    shades.add(brightness);
  }

  const brightest = Math.max(...Array.from(shades));
  const intervals = ~~(brightest / chars.length);

  const contrast = 1.2;
  const intercept = (chars.length / 2) * (1 - contrast);
  const charData = [];

  for (let i = 0; i < data.length; i += 4) {
    const shade = data[i] + data[i + 1] + data[i + 2];
    // const index = Math.floor((shade * chars.length) / 256);
    const index = Math.floor((shade / intervals) * contrast + intercept);
    const finalIndex =
      index >= chars.length ? chars.length - 1 : index < 0 ? 0 : index;

    charData.push(chars[finalIndex]);

    if ((i / 4) % imageData.width === imageData.width - 1) {
      charData.push("\n");
    }
  }

  return charData;
};
