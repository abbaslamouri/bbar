<script setup lang="ts">
const viewportWidth = useViewportWidth()
</script>

<template>
  <footer :class="{ break: +viewportWidth < 600 }">
    <div class="container">
      <div class="copyright">
        <p>© {{ new Date().getFullYear() }} My Light LLC | All rights reserved​</p>
      </div>
      <div class="privacy-policy">
        <nuxt-link :to="{ name: 'index' }">Privacy policy</nuxt-link>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
// @import '@/assets/scss/_variables.scss';

// .wrapper {
footer {
  background-color: var(--bg-highlight);

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--size-m);

    p {
      font-size: var(--font-size--1);
      font-weight: var(--font-bold);
      letter-spacing: var(--tracking-3);
      text-transform: uppercase;
    }
  }
  &.break {
    .container {
      flex-direction: column;
    }
  }
}

// }
</style>
