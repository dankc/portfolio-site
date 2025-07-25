<template>
  <dialog ref="dialog-ref">
    <aside class="modal" ref="modal-ref" @click.self="closeModal">
      <button class="modal__close" v-if="!closeButtonDisabled && !closeButtonInside" type="button" @click="closeModal">
        <IconClose />
      </button>
      <Transition v-if="transition" v-bind="transition" @after-leave="closeAfterTransition">
        <div class="modal__content" v-if="showContent">
          <button class="modal__close" v-if="!closeButtonDisabled && closeButtonInside" type="button" @click="closeModal">
            <IconClose />
          </button>
          <slot />
        </div>
      </Transition>
      <div class="modal__content" v-else-if="!transition && showContent">
        <button class="modal__close" v-if="!closeButtonDisabled && closeButtonInside" type="button" @click="closeModal">
          <IconClose />
        </button>
        <slot />
      </div>
    </aside>
  </dialog>
</template>

<script setup lang="ts">
  import { type TransitionProps, useTemplateRef, ref, watch } from 'vue';
  import IconClose from '@/components/icons/IconClose.vue';

  const {
    toggleOn,
    transition,
    closeButtonDisabled = false,
    closeButtonInside = false,
  } = defineProps<{
    toggleOn: boolean;
    transition?: TransitionProps;
    closeButtonDisabled?: boolean;
    closeButtonInside?: boolean;
  }>();
  const dialogRef = useTemplateRef<HTMLDialogElement>('dialog-ref');
  const showContent = ref(false);

  const emit = defineEmits(['onClose']);
  function closeModal(): void {
    // Prevent running this twice when close button is clicked (the event will likely make toggleOn false triggering watch)
    if (showContent.value) {
      showContent.value = false;
      if (!transition) dialogRef.value?.close();
      // Only emit close if closing from inside the modal
      if (toggleOn) emit('onClose');
    }
  }

  function closeAfterTransition() {
    dialogRef.value?.close();
  }

  watch(
    () => toggleOn,
    (newVal) => {
      if (newVal) {
        dialogRef.value?.showModal();
        showContent.value = true;
      }
      if (!newVal) {
        // If close is triggered outside the modal
        closeModal();
      }
    },
    { immediate: false }
  );
</script>

<style lang="postcss">
  .modal {
    display: block;
    width: 100dvw;
    height: 100dvh;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    background-color: rgb(from var(--black) r g b / 33%);
    backdrop-filter: blur(var(--blur-amount));

    &__close {
      width: fit-content;
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 20px;
      right: 25px;
      z-index: 1;
      transition: transform 0.33s linear;
      transform: rotate(0);
      will-change: transform;

      &:hover {
        transform: rotate(90deg);
      }
    }

    &__content {
      max-height: 100%;
      position: relative;
      overflow-y: scroll;

      .modal__close {
        position: absolute;
        top: var(--gutter);
        right: var(--gutter);
      }
    }
  }
</style>
