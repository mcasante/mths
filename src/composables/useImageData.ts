import {
  ref,
  watchEffect,
  computed,
  toValue,
  type MaybeRefOrGetter,
  type ComputedRef,
} from "vue";

import { copyImageData, setCanvasSize, toAspects } from "@/utils";

type Modifier = (data: ImageData) => ImageData;

interface UseImageData {
  width: number | ComputedRef<number>;
  modifiers?: ComputedRef<Modifier[]>;
}

export const useImageData = (
  image: MaybeRefOrGetter<HTMLImageElement | undefined>,
  options: UseImageData = {
    width: toValue(image)?.width || 0,
  }
) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) {
    throw new Error("Failed to get 2d context");
  }

  if (!image) {
    throw new Error("Image is not defined");
  }

  const sourceImageData = ref(
    copyImageData(
      ctx.getImageData(0, 0, toValue(image)!.width, toValue(image)!.height)
    )
  );

  const sizes = computed(() =>
    toAspects(toValue(image)!, toValue(options.width))
  );

  watchEffect(() => {
    setCanvasSize(canvas, sizes.value.width, sizes.value.height);

    ctx.drawImage(toValue(image)!, 0, 0, sizes.value.width, sizes.value.height);
    sourceImageData.value = copyImageData(
      ctx.getImageData(0, 0, sizes.value.width, sizes.value.height)
    );
  });

  const imageData = computed(() => {
    const data = copyImageData(sourceImageData.value);
    const modifiers = toValue(options.modifiers) || [];

    const imageData = modifiers.length
      ? modifiers.reduce((data, modifier) => {
          return modifier(data);
        }, data)
      : data;

    return imageData;
  });

  const copy = () => copyImageData(imageData.value);

  return {
    imageData,
    copy,
  };
};
