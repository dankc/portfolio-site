<template>
  <main class="error-page">
    <p>You look lost...</p>
    <p>Here, click this <br />👇</p>
    <router-link to="/" class="button">Return home</router-link>
  </main>
</template>

<script setup lang="ts"></script>

<style lang="postcss">
  .error-page {
    min-height: calc(100vh - var(--header-height) - var(--footer-height));
    padding: var(--section-gap) var(--gutter) 0;
    text-align: center;

    p {
      font-family: var(--f-mono);
      font-size: 3.75rem;

      &:not(:first-child) {
        margin-top: 1.5rem;
        font-size: 3.25rem;
        opacity: 0;
        animation: fade 2s reverse forwards;
      }
    }

    .button {
      display: block;
      width: max-content;
      margin: 2rem auto 0;
      background-color: var(--blue-bold);
      color: var(--white);
      opacity: 0;
      animation: fade 2s reverse forwards 1s;

      &:hover {
        background-color: var(--green-bold);
        color: var(--black);
      }
    }
  }
</style>
