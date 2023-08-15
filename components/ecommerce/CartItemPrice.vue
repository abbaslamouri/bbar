<script setup lang="ts">
// import { type PropType } from 'vue'
const props = defineProps({
  product: {
    // type: Object as PropType<IProduct>,
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="cart-product-price">
    <p class="text--1">${{ (product.price / 100).toFixed(2) }}</p>
  </div>
</template>

<style lang="scss" scoped>
.cart-product-price {
  p {
    color: var(--color-primary-40);
    font-weight: bold;
    letter-spacing: var(--tracking-3);
    font-size: var(--font-size-0);
  }
}
</style>
