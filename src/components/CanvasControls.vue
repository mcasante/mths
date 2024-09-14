<script setup lang="ts">
import { useVModel } from "@nanostores/vue";
import { $imageControls } from "@/controlStore";
import { ref } from "vue";

const { baseWidthModel, isAsciiModel, isDitheredModel, ditherShadesModel } =
  useVModel($imageControls, [
    "baseWidth",
    "isAscii",
    "isDithered",
    "ditherShades",
  ]);

const a = ref("45");

const sizes = ["45", "90", "180", "360", "720"];

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
</script>

<template>
  <div class="flex items-center justify-between">
    <Label for="is-ascii" class="flex flex-col space-y-1">
      <span>Source Size</span>
      <span class="font-normal leading-snug text-muted-foreground">
        The size of the source image
      </span>
    </Label>

    <Select v-model="baseWidthModel">
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
    <Switch id="is-ascii" v-model:checked="isAsciiModel" />
  </div>

  <div class="flex items-center justify-between space-x-2">
    <Label for="is-dither" class="flex flex-col space-y-1">
      <span>Dither</span>
      <span class="font-normal leading-snug text-muted-foreground">
        Apply dithering to the image
      </span>
    </Label>
    <Switch id="is-dither" v-model:checked="isDitheredModel" />
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
      :min="1"
      :max="20"
      v-model="ditherShadesModel"
      :disabled="!isDitheredModel"
    >
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </div>
</template>
