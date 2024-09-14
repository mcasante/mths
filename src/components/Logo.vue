<script setup lang="ts"></script>

<template>
  <h1 class="text-2xl font-bold group">
    <span>M</span>
    <span class="animated">A</span>
    <span>TH</span>
    <span class="animated">E</span>
    <span class="animated">U</span>
    <span>S.</span>
    <span class="opacity-80 font-normal">
      <span>C</span>
      <span class="animated">A</span>
      <span>S</span>
      <span class="animated">A</span>
      <span class="animated">N</span>
      <span>T</span>
      <span class="animated">E</span>
    </span>
  </h1>
</template>

<style scoped lang="postcss">
h1 {
  @apply bg-gray-700 cursor-pointer;
}

span.animated {
  @apply max-w-0 inline-block  group-hover:max-w-5 transition duration-500 ease-in-out
  opacity-0 group-hover:opacity-100
  scale-0 group-hover:scale-100;
  transition-property: all;
}
</style>
