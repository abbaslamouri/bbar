<script setup lang="ts">
// const viewportWidth = useViewportWidth()
// const wrapperRef = ref()

// onMounted(() => {
//   const resizeObserver = new ResizeObserver((entries) => {
//     entries.forEach(async (entry) => {
//       viewportWidth.value = entry.contentRect.width
//     })
//   })
//   if (wrapperRef.value) resizeObserver.observe(wrapperRef.value)
// })
</script>

<template>
  <div class="public">
    <SkipLink />
    <Header class="" />
    <div id="main" tabindex="-1">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.public {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  #main {
    flex: 1;
    display: flex;
    flex-direction: row;
    // align-items: initial;
    // border: 1px solid green;
  }
}
</style>
