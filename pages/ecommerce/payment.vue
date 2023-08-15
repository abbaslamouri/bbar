<script lang="ts" setup>
const route = useRoute()
const { cart } = useCartStore(0)

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
  <div class="signup">
    <!-- <div class="container"> -->
    <!-- <CheckoutProgress /> -->
    <!-- <div class="flex gap-m">
        <div class="flex-1 shadow-lg p-s">
          <div>Promo code</div>
          <div v-if="cart.items && cart.items.length">
            <EcommerceCartItems />
            <div class="cart-total | flex flex-col gap-xs font-bold tracking-3 mt-l">
              <CartTotal v-if="cart.items" />
            </div>
            <div class="flex justify-end mt-xs">
              <button class="btn btn-primary" @click="checkout">Proceed to ckeckout</button>
            </div>
          </div>
          <EcommerceEmptyCart />
        </div>
        <div class="min-w-14 shadow-lg p-s">
          <p>Promo section</p>
        </div>
      </div> -->
    <Payment />

    <!-- <SignIn v-if="route.query.page === 'signin'" />
      <SignUp v-if="route.query.page === 'signup'" />
      <SignupSuccess v-if="route.query.page === 'signup-success'" />
      <Verify v-if="route.query.page === 'verify'" />
      <ForgotPassword v-if="route.query.page === 'forgot-password'" /> -->
    <!-- </div> -->
  </div>
</template>

<style lang="scss" scoped></style>
