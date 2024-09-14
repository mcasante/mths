<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@nanostores/vue";
import { useElementSize } from "@vueuse/core";

import { $imageControls } from "@/controlStore";
import { useEditableImage } from "@/composables";

const props = defineProps<{
  fallbackSrc: string;
}>();

const imageElement = ref<HTMLImageElement | null>(null);
const { width: targetWidth } = useElementSize(imageElement);

const store = useStore($imageControls);

const options = computed(() => ({
  baseWidth: store.value.baseWidth,
  isDithered: store.value.isDithered,
  ditherShades: store.value.ditherShades,
  isAscii: store.value.isAscii,
  targetWidth: targetWidth.value,
}));

const { dataUrl } = useEditableImage(store.value.sourceImage, options);
const src = computed(() => dataUrl.value || props.fallbackSrc);
</script>

<template>
  <img ref="imageElement" class="w-full transition-all" :src="src" />
</template>
