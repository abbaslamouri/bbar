<script lang="ts" setup>
useHead({
  // script: [
  //   {
  //     src: `https://maps.googleapis.com/maps/api/js?libraries=places&key=${process.env.NUXT_GOOGLE_MAPS_API_KEY}`,
  //     type: 'text/javascript',
  //     async: true,
  //   },
  // ],
})
const route = useRoute()

const { cart, saveCart } = useCartStore()
const { authenticated } = useAuthStore()
const addressRef = ref()

const checkout = async () => {
  cart.value.status = 'checkout'
  await saveCart()
  if (!authenticated.value) return navigateTo({ path: '/checkout/secure' })
}

onMounted(() => {
  const streetAutocomplete = new google.maps.places.Autocomplete(addressRef.value, {
    bounds: new google.maps.LatLngBounds(new google.maps.LatLng(41.505493, -81.68129)),
  })
  streetAutocomplete.addListener('place_changed', () => {
    console.log(streetAutocomplete.getPlace())
  })
})
</script>

<template>
  <div class="checkout">
    <Steps />
    <div>
      <div class="" v-if="cart.items && cart.items.length">
        <div class="">
          <div style="border: 1px solid red">
            <input type="text" placeholder="address" ref="addressRef" style="min-width: 100%" />
          </div>
          <div>
            <EcommerceCartItems />
            <div class="cart-total |">
              <CartTotal v-if="cart.items" />
            </div>
            <div class="">
              <button class="btn btn-filled" @click="checkout">Proceed to ckeckout</button>
            </div>
          </div>
        </div>
        <div class="">
          <p>Promo section</p>
        </div>
      </div>
      <EcommerceEmptyCart />
    </div>
  </div>
</template>

<style lang="" scoped></style>
