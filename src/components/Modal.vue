<template>
  <dialog class="modal" @click="closeModal()">
    <div class="modal__close">X</div>
    <slot />
  </dialog>
</template>

<script setup lang="ts">
  const emit = defineEmits(['closeModal']);
  function closeModal() {
    emit('closeModal');
  }
</script>

<style lang="postcss">
  .modal {
    display: block;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    background-color: rgb(from var(--black) r g b / 33%);
    overflow-y: scroll;

    &__close {
      color: var(--white);
      position: fixed;
      top: 20px;
      right: 25px;
      cursor: pointer;
      transition: transform 0.33s linear;
      transform: rotate(0);
      will-change: transform;
      font-size: 2.5rem;

      &:hover {
        transform: rotate(180deg);
      }
    }
  }
</style>
