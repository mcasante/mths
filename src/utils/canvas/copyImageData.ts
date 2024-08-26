export const copyImageData = (data: ImageData) => {
  return new ImageData(
    new Uint8ClampedArray(data.data),
    data.width,
    data.height
  );
};
