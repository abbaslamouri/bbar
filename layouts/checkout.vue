<script setup lang="ts">
const wrapperRef = ref()

const viewportWidth = useViewportWidth()
const { authUser } = useAuthStore()
const { cart } = useCartStore()
// const { $cartSession } = useNuxtApp()

// console.log(useNuxtApp().payload.cartSession)

authUser.value = { ...useNuxtApp().payload.userSession }
if (useNuxtApp().payload.cartSession) cart.value = { ...useNuxtApp().payload.cartSession }

onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach(async (entry) => {
      viewportWidth.value = entry.contentRect.width
    })
  })
  if (wrapperRef.value) resizeObserver.observe(wrapperRef.value)
})
</script>

<template>
  <div class="wrapper" ref="wrapperRef">
    <SkipLink />
    <HeaderAdmin />
    <div id="main" tabindex="-1">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  // background-color: var(--bg);
  // @media (prefers-color-scheme: dark) {
  //   // background-color: var(--color-neutral-10);
  // }
}
</style>
