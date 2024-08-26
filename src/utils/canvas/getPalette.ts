type GetPalette = (
  imageData: ImageData,
  numberOfColors?: number
) => [number, number, number][];

export const getPalette =
  (numberOfColors = 5, sampleSize = 1000): GetPalette =>
  (imageData) => {
    const pixels = imageData.data;
    const sampledPixels: [number, number, number][] = [];

    // Sample pixels from the image
    for (
      let i = 0;
      i < pixels.length;
      i += 4 * Math.floor(pixels.length / sampleSize)
    ) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      sampledPixels.push([r, g, b]);
    }

    // Initialize centroids randomly from the sampled pixels
    const initializeCentroids = (
      pixels: [number, number, number][],
      k: number
    ): [number, number, number][] => {
      const centroids: [number, number, number][] = [];
      for (let i = 0; i < k; i++) {
        centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);
      }
      return centroids;
    };

    // Assign pixels to the nearest centroid
    const assignPixelsToClusters = (
      pixels: [number, number, number][],
      centroids: [number, number, number][]
    ): [number, number, number][][] => {
      const clusters: [number, number, number][][] = Array.from(
        { length: centroids.length },
        () => []
      );
      pixels.forEach((pixel) => {
        let nearestIndex = 0;
        let minDistance = Infinity;
        centroids.forEach((centroid, i) => {
          const distance = euclideanDistance(pixel, centroid);
          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = i;
          }
        });
        clusters[nearestIndex].push(pixel);
      });
      return clusters;
    };

    // Compute new centroids
    const computeNewCentroids = (
      clusters: [number, number, number][][]
    ): [number, number, number][] => {
      return clusters.map((cluster) => {
        const sum = cluster.reduce(
          (acc, pixel) => {
            return [acc[0] + pixel[0], acc[1] + pixel[1], acc[2] + pixel[2]];
          },
          [0, 0, 0]
        );
        return [
          Math.floor(sum[0] / cluster.length),
          Math.floor(sum[1] / cluster.length),
          Math.floor(sum[2] / cluster.length),
        ];
      });
    };

    // Check if centroids have converged
    const checkConvergence = (
      oldCentroids: [number, number, number][],
      newCentroids: [number, number, number][]
    ): boolean => {
      return oldCentroids.every(
        (centroid, i) => euclideanDistance(centroid, newCentroids[i]) < 1
      );
    };

    // Euclidean distance between two colors
    const euclideanDistance = (
      color1: [number, number, number],
      color2: [number, number, number]
    ): number => {
      return Math.sqrt(
        (color1[0] - color2[0]) ** 2 +
          (color1[1] - color2[1]) ** 2 +
          (color1[2] - color2[2]) ** 2
      );
    };

    // K-Means clustering algorithm
    const kMeans = (
      pixels: [number, number, number][],
      k: number
    ): [number, number, number][] => {
      let centroids = initializeCentroids(pixels, k);
      let iterations = 0;
      let converged = false;

      while (!converged && iterations < 100) {
        // Limit to 100 iterations
        const clusters = assignPixelsToClusters(pixels, centroids);
        const newCentroids = computeNewCentroids(clusters);
        converged = checkConvergence(centroids, newCentroids);
        centroids = newCentroids;
        iterations++;
      }

      return centroids;
    };

    // Extract the color palette with the desired number of colors
    const colorPalette = kMeans(sampledPixels, numberOfColors);
    return colorPalette;
  };
