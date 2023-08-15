<script lang="ts" setup>
const route = useRoute()

const { cart, saveCart } = useCartStore()
const { authenticated } = useAuthStore()
const addressRef = ref()

const checkout = async () => {
  cart.value.status = 'checkout'
  await saveCart()
  if (!authenticated.value) return navigateTo({ path: '/checkout/secure' })
}
</script>

<template>
  <div class="cart">
    <!-- <Steps /> -->
    <div class="container">
      <div class="cart" v-if="cart.items && cart.items.length">
        <div class="content">
          <!-- <div style="border: 1px solid red">
            <input type="text" placeholder="address" ref="addressRef" style="min-width: 100%" />
          </div> -->
          <div class="items flow-l">
            <EcommerceCartItems />
            <div class="coupon">
              <FormsBaseInput label="Coupon code" placeholder="Coupon code" />
              <button class="btn btn-outlined">Apply coupn</button>
            </div>
            <!-- <div class="cart-total |"> -->
            <CartTotal v-if="cart.items" />
            <!-- </div> -->
            <div class="link">
              <NuxtLink :to="{ name: 'ecommerce-checkout' }" class="btn btn-filled" aria-label="morelamplight Home">
                Proceed to checkout
              </NuxtLink>
              <!-- <button class="btn btn-filled" @click="checkout">Proceed to ckeckout</button> -->
            </div>
          </div>
          <div class="benefits | flow-s">
            <p>Free shipping</p>
            <p>Free LED dimmer on all lamp purchases</p>
            <p>60-day Money Back Guarantee</p>
            <p>2-year Warranty</p>
            <p>100% Secure Checkout</p>
          </div>
        </div>
      </div>
      <EcommerceEmptyCart />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart {
  padding-block-start: var(--size-l);
  // box-shadow: var(--shadow-3);
  // border: 1px solid red;
  .content {
    display: flex;
    gap: var(--size-l); // align-items: center;
    .items {
      flex: 1;
      box-shadow: var(--shadow-3);
      background-color: var(--card-bg);
      padding: var(--size-3xl);

      .coupon {
        display: flex;
        align-items: stretch;
        // align-items: center;
      }

      .link {
        // display: inline-block;
        display: flex;
        justify-content: flex-end;
        // border: 1px solid red;
        text-align: flex-end;
        // justify-self: start;
        // justify-content: start;
        // display: block;
        // align-items: end;
      }
    }

    .benefits {
      width: var(--size-12xl);
      // padding-block: var(--size-3xl);
      box-shadow: var(--shadow-3);
      background-color: var(--card-bg);
      padding: var(--size-l);
    }
  }
}
</style>
