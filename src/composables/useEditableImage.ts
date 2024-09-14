import {
  computed,
  toValue,
  type ComputedRef,
  type MaybeRefOrGetter,
} from "vue";

import { useImage } from "@vueuse/core";
import { useColorMode } from "@vueuse/core";

import { useImageData } from "./useImageData";
import { useRender } from "./useRender";
import { useAscii } from "./useAscii";
import { dither } from "@/utils";

interface UseEditableImageOptions {
  baseWidth: string;
  isAscii: boolean;
  isDithered: boolean;
  ditherShades: number;
  targetWidth: number;
}

type UseEditableImage = (
  sourceImage: MaybeRefOrGetter<ImageMetadata>,
  options: ComputedRef<UseEditableImageOptions>
) => {
  dataUrl: ComputedRef<string | undefined>;
};

export const useEditableImage: UseEditableImage = (sourceImage, options) => {
  const { system, store: colorStore } = useColorMode();

  const colorMode = computed(() =>
    colorStore.value === "auto" ? system.value : colorStore.value
  );

  const { state } = useImage({ src: toValue(sourceImage).src });

  const modifiers = computed(() => {
    if (!options.value.isDithered) return [];

    return [dither({ maxColors: options.value.ditherShades })];
  });

  const imageData = computed(() => {
    if (!state.value) return;
    const { imageData } = useImageData(state.value!, {
      width: computed(() => Number(options.value.baseWidth)),
      modifiers,
    });

    return imageData;
  });

  const dataUrl = computed(() => {
    if (!globalThis.window) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx || !imageData.value) return;

    const useRenderer = options.value.isAscii ? useAscii(colorMode) : useRender;
    const { render } = useRenderer(imageData.value);

    render(canvas, { width: options.value.targetWidth });

    return canvas.toDataURL();
  });

  return { dataUrl };
};
