<script setup lang="ts">
const props = defineProps({
  logoShade: {
    logoShade: String,
    default: 'light',
  },
})
</script>

<template>
  <NuxtLink :to="{ name: 'index' }" class="branding" aria-label="morelamplight Home">
    <img :src="`/assets/genvac-logo-250x100.png`" alt="morelamplight Logo" />
  </NuxtLink>
</template>

<style lang="scss" scoped>
.branding {
  display: block;
  width: var(--size-8xl);
  img {
    max-width: 100%;
    object-fit: contain;
  }
}
</style>
