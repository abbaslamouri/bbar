<script lang="ts" setup>
// const emit = defineEmits(['closeCartModal'])

const { cart, showCartModal } = useCartStore()

const shopNow = () => {
  showCartModal.value = false
  return navigateTo({
    path: '/products',
    query: {},
  })
  // emit('closeCartModal')
}
</script>

<template>
  <div class="cart-empty | flow-s" v-if="!cart.items || !cart.items.length">
    <p class="text-center">You have no items in your shopping bag</p>
    <button class="btn btn-filled cart" @click="shopNow">Shop</button>
  </div>
</template>

<style lang="scss" scoped>
.cart-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
