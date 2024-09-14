<script setup lang="ts">
import {
  defineProps,
  ref,
  watch,
  computed,
  onBeforeUnmount,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
} from "vue";

import { $imageControls, defaults } from "@/controlStore";
import { useElementHover } from "@vueuse/core";

const props = defineProps<{
  baseWidth?: string;
  isAscii?: boolean;
  isDithered?: boolean;
  ditherShades?: number;
  class?: HTMLAttributes["class"];
  href?: AnchorHTMLAttributes["href"];
}>();

const target = ref<HTMLElement | null>(null);
const isHovered = useElementHover(target);

let interval: ReturnType<typeof setInterval>;

watch(isHovered, (hovering) => {
  if (!hovering) {
    $imageControls.set(defaults);
    clearInterval(interval);
    return;
  }

  $imageControls.set({
    ...defaults,
    baseWidth: props.baseWidth ?? defaults.baseWidth,
    isAscii: props.isAscii ?? defaults.isAscii,
    isDithered: props.isDithered ?? defaults.isDithered,
    ditherShades: props.ditherShades ?? defaults.ditherShades,
  });

  if (props.baseWidth) {
    let dir = 1;
    interval = setInterval(() => {
      const w = +$imageControls.get().baseWidth;

      if (w > 45 || w < 44) dir *= -1;

      +$imageControls.setKey("baseWidth", String(w + 1 * dir));
    }, 100);
  }
});

onBeforeUnmount(() => {
  $imageControls.set(defaults);
  clearInterval(interval);
});

const className = computed(() => {
  return {
    block: true,
    [props.class]: true,
  };
});
</script>

<template>
  <a ref="target" :class="className" :href="href">
    <slot />
  </a>
</template>
