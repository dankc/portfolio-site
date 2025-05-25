<template>
  <main class="loading-screen" ref="page">
    <div class="loading-screen__content"><span class="spinner"></span> Loading...</div>
  </main>
</template>

<style scoped lang="postcss">
  .loading-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: 48px;
    color: var(--blue-stp);
    backdrop-filter: blur(10px);

    &__content {
      position: relative;
      z-index: 1;
    }
  }

  .spinner::before {
    content: '';
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 2px solid var(--red-stp);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
<script setup lang="ts"></script>
