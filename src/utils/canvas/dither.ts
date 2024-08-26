import { getPalette } from "./getPalette";
interface DitherOptions {
  maxColors: number;
}

type Color = [number, number, number];

const distance = (color1: Color, color2: Color): number => {
  return Math.sqrt(
    (color1[0] - color2[0]) ** 2 +
      (color1[1] - color2[1]) ** 2 +
      (color1[2] - color2[2]) ** 2
  );
};

const filter = (imageData: ImageData, palette: Color[]) => {
  const dt = imageData.data;
  for (let i = 0; i < dt.length; i += 4) {
    const color: Color = [dt[i], dt[i + 1], dt[i + 2]];

    const distances = palette.map((p) => distance(p, color));
    const nColor = palette[distances.indexOf(Math.min(...distances))];

    dt[i] = nColor[0];
    dt[i + 1] = nColor[1];
    dt[i + 2] = nColor[2];
  }
};

const dithering = (imageData: ImageData, width: number, shades = 5) => {
  const idxs = [0, 1, 2];
  const compute = (c: number) =>
    Math.round((shades * c) / 255) * (255 / shades);

  const k = [
    [4, 7 / 16],
    [width - 4, 3 / 16],
    [width, 5 / 16],
    [width + 4, 1 / 16],
  ];

  for (let i = 0; i < imageData.data.length; i += 4) {
    const colors = idxs.map((n) => [
      imageData.data[i + n],
      compute(imageData.data[i + n]),
    ]);
    const diff = colors.map((c) => c[0] - c[1]);

    idxs.forEach((n) => (imageData.data[i + n] = colors[n][1]));

    k.forEach(([start, factor]) =>
      idxs.forEach(
        (n) =>
          (imageData.data[i + start + n] =
            imageData.data[i + start + n] + diff[n] * factor)
      )
    );
  }
};

export const dither =
  (options: DitherOptions = { maxColors: 10 }) =>
  (imageData: ImageData) => {
    const dt = new Uint8ClampedArray(imageData.data);

    const imgData = new ImageData(imageData.width, imageData.height);
    imgData.data.set(dt);

    const width = imageData.width;
    const maxColors = options.maxColors;
    const palette = getPalette(10, 500)(imgData);

    filter(imgData, palette);
    dithering(imgData, width, maxColors);

    return imgData;
  };
