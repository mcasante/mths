export const getHeight = <T>(
  aspect: T extends { width: number; height: number } ? T : never,
  width: number
) => {
  return (aspect.height / aspect.width) * width;
};

export const toAspects = <T>(
  image: T extends { width: number; height: number } ? T : never,
  width: number = 100
) => {
  const height = getHeight(image, width);
  return { width, height };
};
