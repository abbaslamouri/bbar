<script lang="ts" setup>
const route = useRoute()
const { cart } = useCartStore()

definePageMeta({
  middleware: ['auth'],
  // middleware: function (to, from) {
  //   // console.log(useRoute())
  //   const { authUser, authenticated } = useAuthStore()
  //   if (authenticated.value) {
  //     return navigateTo('/')
  //   }
  // },
  layout: 'checkout',
})

// console.log(route.query.page)
</script>

<template>
  <div class="container">
    <Checkout />
  </div>
</template>

<style lang="scss" scoped></style>
