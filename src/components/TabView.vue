<template>
  <div class="tab-view">
    <div class="tab-view__nav-container">
      <slot name="nav" />
      <nav class="tab-view__nav">
        <div
          v-for="(tab, index) of tabs"
          :key="index"
          class="tab-view__nav-item"
          :class="{ active: currentTab === index }"
          @click="changeTab(index)"
        >
          {{ tab }}
        </div>
      </nav>
    </div>
    <div class="tab-view__pane">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const emit = defineEmits<{
    (e: 'tabChange', value: number): void;
  }>();

  const { tabs } = defineProps<{
    tabs: string[];
  }>();

  const currentTab = ref(0);

  const changeTab = (tab: number) => {
    currentTab.value = tab;
    emit('tabChange', currentTab.value);
  };
</script>

<style>
  .tab-view__nav-item {
    cursor: pointer;
  }
</style>
