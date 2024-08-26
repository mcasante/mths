<script setup lang="ts">
import { ref, computed } from "vue";
import { useImage, useElementSize } from "@vueuse/core";
import { useImageData, useRender, useAscii } from "@/composables";
import { useColorMode } from "@vueuse/core";

const { system, store } = useColorMode();

const colorMode = computed(() =>
  store.value === "auto" ? system.value : store.value
);

import { dither } from "@/utils";

import pfp from "@/assets/images/pfp.jpeg";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sizes = ["45", "90", "180", "360"];

const wrapper = ref<HTMLDivElement>();

const { width } = useElementSize(wrapper);
const { state } = useImage({ src: pfp.src });

const sourceWidth = ref("180");
const isAscii = ref(false);
const isDithered = ref(false);
const ditherShades = ref(12);

const modifiers = computed(() => {
  if (!isDithered.value) return [];

  return [dither({ maxColors: ditherShades.value })];
});

const imageData = computed(() => {
  if (!state.value) return;
  const { imageData } = useImageData(state.value!, {
    width: computed(() => Number(sourceWidth.value)),
    modifiers,
  });

  return imageData;
});

const dataUrl = computed(() => {
  if (!globalThis.window) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx || !imageData.value) return;

  const useRenderer = isAscii.value ? useAscii(colorMode) : useRender;
  const { render } = useRenderer(imageData.value);

  render(canvas, { width });

  return canvas.toDataURL();
});
</script>

<template>
  <div class="w-full" ref="wrapper">
    <Card>
      <CardHeader>
        <img
          class="rounded-md mb-2"
          v-if="dataUrl"
          :src="dataUrl"
          alt="Ascii Art"
        />
        <CardTitle>Controller</CardTitle>
        <CardDescription>
          Adjust the settings to see the changes
        </CardDescription>
      </CardHeader>

      <CardContent class="grid gap-6">
        <div class="flex items-center justify-between">
          <Label for="is-ascii" class="flex flex-col space-y-1">
            <span>Source Size</span>
            <span class="font-normal leading-snug text-muted-foreground">
              The size of the source image
            </span>
          </Label>

          <Select v-model="sourceWidth">
            <SelectTrigger class="w-20">
              <SelectValue placeholder="Source size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="size in sizes" :value="size">
                {{ size }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex items-center justify-between space-x-2">
          <Label for="is-ascii" class="flex flex-col space-y-1">
            <span>Ascii</span>
            <span class="font-normal leading-snug text-muted-foreground">
              Convert the image to ascii art
            </span>
          </Label>
          <Switch id="is-ascii" v-model:checked="isAscii" />
        </div>

        <div class="flex items-center justify-between space-x-2">
          <Label for="is-dither" class="flex flex-col space-y-1">
            <span>Dither</span>
            <span class="font-normal leading-snug text-muted-foreground">
              Apply dithering to the image
            </span>
          </Label>
          <Switch id="is-dither" v-model:checked="isDithered" />
        </div>

        <div class="flex items-center justify-between space-x-2">
          <Label for="dither-shades" class="flex flex-col space-y-1">
            <span>Dither shades</span>
            <span class="font-normal leading-snug text-muted-foreground">
              Number of shades to use for dithering
            </span>
          </Label>
          <NumberField
            id="dither-shades"
            :min="2"
            :max="20"
            v-model="ditherShades"
            :disabled="!isDithered"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
