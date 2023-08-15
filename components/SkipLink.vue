<script setup lang="ts"></script>

<template>
  <a href="#main" class="skip-link not-focus-visually-hidden">Skip to main content</a>
</template>

<style lang="scss" scoped>
.skip-link {
  display: inline-block;
  padding: 0.7rem 1rem 0.5rem 1rem;
  background: var(--on-bg);
  color: var(--bg);
  text-decoration: none;
  font-weight: var(--font-bold);
  text-transform: uppercase;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 99;

  &:hover {
    background: var(--on-bg);
    color: var(--bg-highlight);
  }

  &:focus-visible {
    outline: 3px solid var(--on-bg);
    outline-offset: 0.3ch;
  }
}
</style>
