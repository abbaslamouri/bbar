<script lang="ts" setup>
// import { useToast } from 'vue-toastification'

import { ICartItem } from '~/server/schemas/cart'
import CommerceCartRemovedItems from './CommerceCartRemovedItems.vue'

// import { storeToRefs } from 'pinia'
// import { useCartStore } from '~~/stores/useCartStorexxexx'

// const { cart } = useCartStore()
const { cart, cartTotal, updateCart, removeItem, undoRemoveItem, removeItemPermanently } = useCartStore()
const addingToCart = ref()
const removedItems = ref<Array<ICartItem>>([])

const updateEcommerceCartItems = async (payload: { item: ICartItem; action: string }) => {
  addingToCart.value = true
  // if (await updateCart({ ...payload.item, quantity: 1 }, payload.action))
  //   useToast().success(`1 ${payload.item.acsPartNumber} updated`)
  // addingToCart.value = false
}

const removeItemFromCart = async (item: ICartItem) => {
  addingToCart.value = true
  removeItem(item)
  // if (await removeItem(item)) useToast().success(`${item.acsPartNumber} removed from your cart`)
  addingToCart.value = false
}

const undoRemoveItemFromCart = async (item: ICartItem) => {
  // if (await undoRemoveItem(item)) useToast().success(`${item.acsPartNumber} restored`)
}

const RemoveItemFromCartPermanently = async (item: ICartItem) => {
  // if (await removeItemPermanently(item)) useToast().success(`${item.acsPartNumber} removed`)
}
</script>

<template>
  <div class="cart-items">
    <!-- <CommerceCartRemovedItems /> -->
    <ul class="flow-m" role="list" v-if="cart.items && cart.items.length">
      <li class="" v-for="item in cart.items" :index="item._id">
        <EcommerceItemCard :item="item" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.cart-items {
  // border: 1px solid green;
  ul {
    // border: 1px solid green;
    li {
      min-width: 100%;
      // border: 1px solid green;
    }
  }
}
// .spinner {
//   width: 1.4rem;
//   height: 1.4rem;
// }
</style>
