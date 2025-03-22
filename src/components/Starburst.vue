<template>
  <div class="starburst" :style="{ '--size': size }">
    <div class="starburst__inner">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  const { size = '8.5rem' } = defineProps<{
    size?: string;
  }>();
</script>

<style>
  .starburst,
  .starburst:before,
  .starburst:after,
  .starburst .starburst__inner,
  .starburst .starburst__inner:before,
  .starburst .starburst__inner:after {
    height: var(--size);
    width: var(--size);
    background: crimson;
    transform-origin: center;
  }
  .starburst:before,
  .starburst:after,
  .starburst .starburst__inner:before,
  .starburst .starburst__inner:after {
    content: '';
    position: absolute;
    z-index: -1;
  }
  .starburst {
    position: relative; /* Context */
    top: calc(var(--size) * 0.29);
    left: calc(var(--size) * 0.29);
    transform: rotate(-45deg);
  }
  .starburst:before {
    top: 0;
    left: 0;
    transform: rotate(-30deg);
  }
  .starburst:after {
    top: 0;
    left: 0;
    transform: rotate(-15deg);
  }
  .starburst .starburst__inner {
    padding: 0.5em 0em;
    position: absolute;
    bottom: 0;
    right: 0;
    transform: rotate(45deg);
    z-index: 1; /* important so the text shows up */
  }
  .starburst .starburst__inner:before {
    top: 0;
    left: 0;
    transform: rotate(60deg);
  }
  .starburst .starburst__inner:after {
    top: 0;
    left: 0;
    transform: rotate(75deg);
  }
</style>
