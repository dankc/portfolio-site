<template>
  <div class="tab-view">
    <div class="tab-view__nav-container">
      <slot name="nav" />
      <nav class="tab-view__nav" role="tablist" aria-live="polite">
        <button
          v-for="(tab, index) of tabs"
          :key="index"
          class="tab-view__nav-item"
          :class="{ active: currentTab === index }"
          role="tab"
          @click="changeTab(index)"
        >
          {{ tab }}
        </button>
      </nav>
    </div>
    <div class="tab-view__pane" role="tabpanel" aria-labelledby="tab-label" aria-live="polite">
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
