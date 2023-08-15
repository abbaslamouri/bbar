<script setup lang="ts">
const viewportWidth = useViewportWidth()

const headerBreakpoint = 600

const burgerBarBgColor = ref()

onMounted(() => {
  burgerBarBgColor.value = window.getComputedStyle(document.body).getPropertyValue('--color-neutral-30')
})
</script>

<template>
  <div class="header" :class="{ resize: +viewportWidth < headerBreakpoint }">
    <Branding logoShade="dark" />
    <BurgerButton :burgerBarBgColor="burgerBarBgColor" label="Admin navigation" />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

.header {
  // height: var(--size-5xl);
  padding-inline: var(--space-xxl);
  background-color: var(--card-bg);
  // border: 1px solid red;

  // box-shadow: var(--shadow-2);
  // position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
