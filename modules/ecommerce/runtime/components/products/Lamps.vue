<script lang="ts" setup>
import { ICartItem } from '~/server/utils/schemas/cart'
import { IProduct } from '~/server/utils/schemas/product'

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },

  selectedProduct: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['mouseEnter', 'mouseLeave', 'setSelectedProduct'])
// definePageMeta({
//   title: 'Products',
//   description: 'My Light Products',
// })

const { cart } = useCartStore()

// console.log(props.selectedProduct)
const viewportWidth = useViewportWidth()

const config = useRuntimeConfig()

// const selectedProduct = ref()
const lampImage = ref()
</script>

<template>
  <div>
    <ul role="list">
      <li v-for="product in (products as Array<IProduct>)">
        <button
          :class="{ featured: product == selectedProduct }"
          @mouseenter="$emit('mouseEnter', product)"
          @mouseleave="$emit('mouseLeave')"
          @click="$emit('setSelectedProduct', product)"
        >
          <div class="name-price">
            <span> {{ product.name }}</span>
            <span class="price"> ${{ (product.price / 100).toFixed(2) }}</span>
            <span class="sale-price"> ${{ (product.salePrice / 100).toFixed(2) }}</span>
          </div>
          <div class="added-icon">
            <span class="added-to-bag" v-if="cart.items.find((p:ICartItem) => p._id ===product._id)">
              Added to bag
            </span>
            <Icon
              class="icon"
              name="mdi:check"
              aria-hidden="true"
              focusable="false"
              v-if="product == selectedProduct"
            />
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
ul {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-xs);
  // border: 1px solid pink;

  li {
    // border: 1px solid green;
    min-width: 100%;
    button {
      width: 100%;
      padding: var(--space-xs);
      // border: 1px solid blue;
      // font-size: var(--font-size--1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      border: 1px solid var(--bg-grey);
      border-radius: var(--size-3xs);

      &:hover {
        // border: 1px solid var(--bg-grey);
        background-color: var(--bg-grey);
      }
      .name-price {
        display: flex;
        align-items: center;
        gap: var(--space-xs);

        .price {
          color: var(--bg-highlight-dark);
        }

        .sale-price {
          color: var(--on-bg-dim);
          text-decoration: line-through;
          font-size: var(--font-size--1);
        }
      }

      .added-icon {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        .icon {
          width: var(--size-2xl);
          height: var(--size-2xl);
          background-color: var(--bg-highlight);
          border-radius: var(--size-4xl);
          padding: var(--space-xxs);
        }

        .added-to-bag {
          background-color: var(--bg-highlight);
          padding: var(--space-xs);
          border-radius: var(--size-3xs);
          font-size: var(--font-size--1);
        }
      }

      &.featured {
        background-color: var(--bg-grey);
      }
    }
  }
}
</style>
