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
    <img :src="`/assets/morelamplight-logo-${logoShade}-500x227.webp`" alt="morelamplight Logo" />
  </NuxtLink>
</template>

<style lang="scss" scoped>
.branding {
  display: block;
  width: var(--size-7xl);
  img {
    max-width: 100%;
    object-fit: contain;
  }
}
</style>
