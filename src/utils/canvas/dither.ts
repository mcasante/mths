interface DitherOptions {
  maxColors: number;
}

export const dither =
  (options: DitherOptions = { maxColors: 10 }) =>
  (imageData: ImageData) => {
    const dt = new Uint8ClampedArray(imageData.data);

    const imgData = new ImageData(imageData.width, imageData.height);
    imgData.data.set(dt);

    const data = imgData.data;
    const width = imageData.width;
    const height = imageData.height;

    const maxColors = options.maxColors;
    const possibleColors = Array.from({ length: maxColors }, (_, i) => {
      return Math.floor((i / maxColors) * 255);
    });

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;

        const oldColor = data[i * 4];
        const newColor = possibleColors.reduce((acc, color) => {
          return Math.abs(color - oldColor) < Math.abs(acc - oldColor)
            ? color
            : acc;
        }, 0);

        const err = oldColor - newColor;
        data[i * 4] = newColor;
        data[i * 4 + 1] = newColor;
        data[i * 4 + 2] = newColor;

        if (x + 1 < width) {
          data[i * 4 + 4] += (err * 7) / 16;
        }

        if (y + 1 < height) {
          if (x > 0) {
            data[(i + width - 1) * 4] += (err * 3) / 16;
          }

          data[(i + width) * 4] += (err * 5) / 16;

          if (x + 1 < width) {
            data[(i + width + 1) * 4] += err / 16;
          }
        }
      }
    }

    return imgData;
  };
