<script lang="ts" setup>
const { cart, cartTotal } = useCartStore()
</script>

<template>
  <div class="cart-total | flow-s" v-if="cart.items && cart.items.length">
    <div class="subtotal">
      <p class="">Subtotal</p>
      <p class="price">${{ (cartTotal() / 100).toFixed(2) }}</p>
    </div>
    <div class="subtotal">
      <p class="">Shipping</p>
      <p class="price">Free</p>
    </div>
    <div class="subtotal">
      <p class="">Total</p>
      <p class="price">${{ (cartTotal() / 100).toFixed(2) }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart-total {
  .subtotal {
    display: flex;
    justify-content: space-between;
    p {
      font-size: var(--font-size-0);
      font-weight: var(--font-bold);

      &.price {
        color: var(--color-primary-30);
      }
    }
  }
}
</style>
