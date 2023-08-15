<script lang="ts" setup>
const emit = defineEmits(['closeCartModal'])

const { cart, showCartModal } = useCartStore()

const checkout = async () => {
  showCartModal.value = false

  return navigateTo({
    path: '/ecommerce/checkout',
    query: {
      // page: 'signup-request-sent',
    },
  })
  // emit('closeCartModal')
  // return navigateTo({ path: '/checkout' })
}
</script>

<template>
  <div class="cart |">
    <div class="cart__header">
      <p class="">Shopping Bag</p>
      <button class="btn" @click="showCartModal = false">
        <Icon class="icon" name="mdi:close" aria-hidden="true" focusable="false" />
        <span class="visually-hidden">Close cart</span>
      </button>
    </div>
    <div class="cart__main">
      <div class="non-empty | flow-l" v-if="cart.items && cart.items.length">
        <p class="center mt-xs">Free shipping and Led Dimmer with all orders. Add at checkout</p>
        <div class="items">
          <EcommerceCartItems />
          {{ cart.removedItems }}
          <div class="flow-xs">
            <CartTotal />
            <p>Shipping costs and special offers not included</p>
            <button class="btn btn-filled" @click="checkout">Ckeckout</button>
          </div>
        </div>
      </div>
      <EcommerceEmptyCart />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart {
  // position: fixed;
  // inset: 0;
  height: 100vh;
  background-color: var(--color-primary-90);
  // border: 1px solid red;
  // display: flex;
  // flex-direction: column;
  max-width: var(--size-13xl);

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  // padding: var(--size-s);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--color-neutral-90);
    padding: var(--size-s);

    p {
      color: var(--on-bg);
      text-transform: uppercase;
    }

    .icon {
      width: var(--size-l);
      height: var(--size-l);
    }
  }

  &__main {
    flex: 1;
    padding: var(--size-s);

    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;
    // border: 1px solid green;

    .non-empty {
      // flex: 1;
      // border: 1px solid blue;
      min-height: 100%;
      display: flex;
      flex-direction: column;
      .items {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 100%;

        // border: 1px solid pink;

        button {
          width: 100%;
        }
      }
    }
  }
  // .spinner {
  //   width: 1.4rem;
  //   height: 1.4rem;
  // }
}
</style>
