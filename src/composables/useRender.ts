import { toAspects, setCanvasSize } from "@/utils";
import { toValue, type MaybeRefOrGetter } from "@vueuse/core";
import type { Renderer } from "./types";

interface RenderOptions {
  width: number | MaybeRefOrGetter<number>;
}

export const useRender: Renderer = (imageData: MaybeRefOrGetter<ImageData>) => {
  const auxCanvas = document.createElement("canvas");
  const auxCtx = auxCanvas.getContext("2d");

  if (!auxCtx) {
    throw new Error("Failed to get 2d context");
  }

  const { width, height } = toAspects(
    toValue(imageData),
    toValue(imageData).width
  );

  setCanvasSize(auxCanvas, width, height);
  auxCtx.putImageData(toValue(imageData), 0, 0);

  const render = (
    canvas: HTMLCanvasElement,
    options: RenderOptions = {
      width: toValue(imageData).width,
    }
  ) => {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get 2d context");
    }

    const { width, height } = toAspects(
      toValue(imageData),
      toValue(options.width)
    );

    setCanvasSize(canvas, width, height);
    ctx.drawImage(auxCanvas, 0, 0, width, height);
  };

  const toDataURL = () => auxCanvas.toDataURL();

  return { render, toDataURL };
};
