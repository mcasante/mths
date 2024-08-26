import type { MaybeRefOrGetter } from "vue";

export type Renderer = (
  imageData: MaybeRefOrGetter<ImageData>,
  options?: Record<string, unknown>
) => {
  render: (
    canvas: HTMLCanvasElement,
    options?: {
      width: MaybeRefOrGetter<number>;
    }
  ) => void;
  [key: string]: unknown;
};
