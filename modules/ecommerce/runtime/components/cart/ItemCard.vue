<script lang="ts" setup>
import { ICartItem } from '~/server/schemas/cart'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const config = useRuntimeConfig()
const { cart, saveCart, removeItem } = useCartStore()
const addingToCart = ref()

const updateItemQuantity = async (event: Event) => {
  addingToCart.value = true
  const quantity = +(event.target as HTMLInputElement).value > 0 ? +(event.target as HTMLInputElement).value : 1
  const index = cart.value.items.findIndex((cartItem: ICartItem) => cartItem._id === props.item._id)
  if (index !== -1) cart.value.items[index].quantity = quantity
  await saveCart()
  addingToCart.value = false
}

const incerementItemQuantity = async () => {
  addingToCart.value = true
  const index = cart.value.items.findIndex((cartItem: ICartItem) => cartItem._id === props.item._id)
  if (index !== -1) cart.value.items[index].quantity += 1
  await saveCart()
  addingToCart.value = false
}

const decrementItemQuantity = async () => {
  addingToCart.value = true
  const index = cart.value.items.findIndex((cartItem: ICartItem) => cartItem._id === props.item._id)
  if (index !== -1) cart.value.items[index].quantity > 1 ? (cart.value.items[index].quantity -= 1) : 1
  await saveCart()
  addingToCart.value = false
}

const removeItemFromCart = async () => {
  addingToCart.value = true
  const found = cart.value.items.find((cartItem: ICartItem) => cartItem._id === props.item._id)
  if (found) await removeItem(found)
  addingToCart.value = false
}
</script>

<template>
  <div class="cart-item-card">
    <div class="image-title">
      <div class="image">
        <img
          :src="`${config.public.s3BaseUrl}/products/${item.gallery[0]}`"
          :alt="`${item.name}`"
          v-if="item.gallery && item.gallery.length"
        />
        <img class="" src="/assets/placeholder.png" alt="Image Placeholder" v-else />
      </div>
      <div class="">
        <p class="title">{{ item.name }}</p>
        <Icon class="icon" name="svg-spinners:270-ring" aria-hidden="true" focusable="false" v-if="addingToCart" />
        <CartPrice :product="item" v-else />
      </div>
    </div>
    <div class="quantity">
      <button class="" @click="decrementItemQuantity()">
        <Icon class="icon" name="mdi:minus" aria-hidden="true" focusable="false" />
        <span class="visually-hidden">-</span>
      </button>
      <input class="" type="text" :value="item.quantity" @input="updateItemQuantity" />
      <button class="" @click="incerementItemQuantity()">
        <Icon class="icon" name="mdi:plus" aria-hidden="true" focusable="false" />
        <span class="visually-hidden">+</span>
      </button>
    </div>
    <button class="" @click="removeItemFromCart">
      <Icon class="icon" name="mdi:delete-outline" aria-hidden="true" focusable="false" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.spinner {
  width: 2rem;
}
.cart-item-card {
  padding: var(--size-s);
  // padding-block: var(--size-s);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-xs);
  // background-color: var(--bg-featured);
  box-shadow: var(--shadow-2);

  .image-title {
    flex: 1;
    display: flex;
    gap: var(--space-xs);
    align-items: center;

    .image {
      background-color: var(--color-neutral-90);
      padding-block: var(--size-xs);
      img {
        height: var(--size-5xl);
        width: var(--size-5xl);
        object-fit: contain;
      }
    }

    .title {
      font-weight: bold;
      font-size: var(--font-size-0);
    }
  }

  .quantity {
    border: 1px solid var(--on-bg-dim);
    border-radius: var(--size-3xs);
    display: flex;
    justify-content: space-between;

    button {
      padding: var(--space-xxs);
    }

    input {
      border-inline: 1px solid var(--on-bg-dim);
      max-width: var(--size-4xl);
      padding: var(--size-3xs);
      text-align: center;

      &:hover,
      &:focus {
        outline: 3px solid var(--color-primary-50);
        outline-offset: 0.3ch;
      }
    }
  }

  button {
    cursor: pointer;
  }
}
</style>
