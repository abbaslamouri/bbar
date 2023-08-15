<script lang="ts" setup>
// import { useToast } from 'vue-toastification'
import { zodCartItemSchema } from '~/server/utils/schemas/cart'
import { IProduct } from '~/server/utils/schemas/product'

const props = defineProps({
  accessories: {
    type: Array,
    required: true,
  },
})

const { updateCart, cart } = useCartStore()

const config = useRuntimeConfig()

const viewportWidth = useViewportWidth()

const addingToCart = ref()

const addItemToCart = async (product: IProduct) => {
  addingToCart.value = true
  const cartItem = zodCartItemSchema.parse({ ...product, quantity: 1 })
  // if (await updateCart(cartItem, 'inc')) useToast().success(`1 ${product.name} added to your cart`)
  addingToCart.value = false
}
</script>

<template>
  <div class="accessories" :class="{ 'columns-1': viewportWidth < 1000 }">
    <div class="container | flow-l">
      <h2>You may also want</h2>
      <div>
        <ul role="list">
          <li class="flow-l" v-for="product in (accessories as Array<IProduct>)">
            <div class="image">
              <img :src="`${config.public.s3BaseUrl}/products/${product.gallery[0]}`" :alt="`${product.name}`" />
              <!-- <img :src="`images/${product.image}.webp`" :alt="`${product.name}`" /> -->
            </div>
            <div class="name-price">
              <p>{{ product.name }}</p>
              <span class="price">${{ (product.price / 100).toFixed(2) }}</span>
            </div>
            <button class="btn btn-outlined" @click="addItemToCart(product)" v-if="!addingToCart">Add to cart</button>
            <button class="btn btn-filled" v-else><Spinner /></button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/_grid.scss';
.accessories {
  .container {
    display: flex;
    flex-direction: column;
    // align-items: center;

    // place-content: center;
    // margin-inline: auto;
    // border: 1px solid red;

    h2 {
      text-align: center;
      align-self: center;
      // border: 1px solid red;
    }
    ul {
      // border: 1px solid red;
      @include grid-421(1200, 800);
      // display: grid;
      // grid-template-columns: repeat(4, 1fr);
      gap: var(--size-xl);
      li {
        background-color: var(--card-bg);
        box-shadow: var(--shadow-3);
        padding: var(--size-s);
        // flex: 1;
        display: grid;
        place-items: center;
        // min-width: 18rem;
        // display: flex;
        // flex-direction: column;
        // align-items: center;

        .image {
          max-width: 10rem;
        }

        .name-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
          place-self: stretch;

          p {
            font-size: var(--font-size--1);
          }

          .price {
            font-size: var(--font-size--1);
            font-weight: var(--font-bold);
            color: var(--bg-highlight);
          }
        }
      }
    }
  }

  // &.columns-1 {
  //   .container {
  //     ul {
  //       grid-template-columns: 1fr;
  //       // gap: var(--size-l);
  //     }
  //   }
  // }
}
</style>
