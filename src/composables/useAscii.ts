import {
  computed,
  toValue,
  type MaybeRefOrGetter,
  type ComputedRef,
} from "vue";
import { setCanvasSize, toAscii, toAspects } from "@/utils";
import type { Renderer } from "./types";
import type { BasicColorMode } from "@vueuse/core";

const decimalRound = (num: number, decimalPlaces = 2) => {
  return Math.round(num * 10 ** decimalPlaces) / 10 ** decimalPlaces;
};

export const useAscii =
  (mode: ComputedRef<BasicColorMode>): Renderer =>
  (imageData) => {
    const ascii = computed(() => toAscii(toValue(imageData), toValue(mode)));

    const getAsciiString = () => ascii.value.join("");

    const render = (
      canvas: HTMLCanvasElement,
      options: { width: MaybeRefOrGetter<number> } = {
        width: canvas.width,
      }
    ) => {
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas context is not available");
      }

      const { width, height } = toAspects(
        toValue(imageData),
        toValue(options.width)
      );

      setCanvasSize(canvas, width, height);

      const asciiString = getAsciiString();
      const lines = asciiString.split("\n");

      const fontSize = decimalRound(height / lines.length);

      const renderW = lines[0].length * fontSize;
      const renderH = lines.length * fontSize;

      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = mode.value === "dark" ? "white" : "black";

      lines.forEach((line, i) => {
        line.split("").forEach((char, j) => {
          // centered
          ctx.fillText(
            char,
            j * fontSize + (width - renderW) / 2,
            i * fontSize + (height - renderH) / 2
          );
        });
      });

      // fill borders with random chars
      const borderChars = [
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
      ];
    };

    return { getAsciiString, render };
  };
