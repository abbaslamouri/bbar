<script lang="ts" setup>
import { IProduct } from '~/server/utils/schemas/product'
import { zodCartItemSchema } from '~/server/utils/schemas/cart'

// import { useToast } from 'vue-toastification'
const { addItem, cart, showCartModal } = useCartStore()

const viewportWidth = useViewportWidth()
const config = useRuntimeConfig()
const selectedProduct = ref()
const selectedLampImage = ref()
const addingToCart = ref()

const { data, pending, error, refresh } = await useFetch(`ecommerce/products/index`, {
  baseURL: config.public.apiUrl,
  method: 'GET',
  // params: { csrfToken: useNuxtApp().payload.csrfToken },
  // headers: { ...useRequestHeaders(['cookie']), csrfToken: useNuxtApp().payload.csrfToken },
})
console.log(data.value)

const floorLamps = (data.value as Array<IProduct>).filter((p: IProduct) => {
  return p.categories.find((c) => c.name.includes('Floor Lamps'))
})

const tableLamps = (data.value as Array<IProduct>).filter((p: IProduct) => {
  return p.categories.find((c) => c.name.includes('Table Lamps'))
})

const accessories = (data.value as Array<IProduct>).filter((p: IProduct) => {
  return p.categories.find((c) => c.name.includes('Accessories'))
})
// const tableLamps = (data.value as Array<IProduct>).filter((p: IProduct) => p.categories.includes('Table Lamps'))
// const accessories = (data.value as Array<IProduct>).filter(
//   (p: IProduct) => p.categories.includes('Accessories') || p.categories.includes('Modules')
// )

selectedProduct.value = (data.value as Array<IProduct>).find((p: IProduct) => p.featured) || floorLamps[0]
if (selectedProduct.value) {
  // console.log(selectedProduct.value)
  selectedLampImage.value = selectedProduct.value.gallery[0]
}

const addItemToCart = async () => {
  const cartItem = zodCartItemSchema.safeParse({ ...selectedProduct.value, quantity: 1 })
  // if (!cartItem.success)
  //   return useToast().error(
  //     `We are not able to add ${selectedProduct.value.name} to your shopping cart.  Please try again later`
  //   )
  // if (await updateCart(cartItem, 'inc')) useToast().success(`1 ${selectedProduct.value.name} added to your cart`)
  addingToCart.value = true
  await addItem(cartItem.data)
  showCartModal.value = true
  setTimeout(() => {
    showCartModal.value = false
  }, 1000)

  addingToCart.value = false
}
</script>

<template>
  <div class="products | flow-3xl" :class="{ 'step-1': +viewportWidth < 800, 'step-2': +viewportWidth < 200 }">
    <div class="container">
      {{ cart }}
      <div class="content-wrapper">
        <div class="image">
          <img :src="`${config.public.s3BaseUrl}/products/${selectedLampImage}`" :alt="`${selectedProduct.name}`" />
        </div>
        <div class="content | flow-2xl">
          <h1>Choose your KIS lamp</h1>
          <div class="flow-xl">
            <div class="product-list | flow-l">
              <div class="floor-lamps | flow-xs">
                <h2>Floor Lamps</h2>
                <ProductLamps
                  :products="floorLamps"
                  :selectedProduct="selectedProduct"
                  @mouseEnter="selectedLampImage = $event.gallery[0]"
                  @mouseLeave="selectedLampImage = selectedProduct.gallery[0]"
                  @setSelectedProduct="selectedProduct = $event"
                />
              </div>
              <div class="table-lamps | flow-xs">
                <h2>Table Lamps</h2>
                <ProductLamps
                  :products="tableLamps"
                  :selectedProduct="selectedProduct"
                  @mouseEnter="selectedLampImage = $event.gallery[0]"
                  @mouseLeave="selectedLampImage = selectedProduct.gallery[0]"
                  @setSelectedProduct="selectedProduct = $event"
                />
              </div>
            </div>
            <p>Free shipping and LED dimmer on all lamp purchases</p>
            <div class="benefits">
              <ul class="flow-s" role="list">
                <li>The KIS source focuses the light where you need it most</li>
                <li>Swing arm extends 6”</li>
                <li>Lamp height adjust from 43” to 58”</li>
                <li>Soft linen lampshade diffuses ambient light for less glare</li>
              </ul>
            </div>
            <div class="add-to-cart">
              <span>${{ (selectedProduct.price / 100).toFixed(2) }}</span>
              <button class="btn btn-filled" @click="addItemToCart" v-if="!addingToCart">Add to cart</button>
              <button class="btn btn-filled" v-else><Spinner /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ProductModule />
    <ProductAccessories :accessories="accessories" />
    <ProductBenefits />
  </div>
</template>

<style lang="scss" scoped>
.products {
  .content-wrapper {
    display: grid;
    grid-template-columns: 1fr 2fr;
    align-items: center;
    gap: var(--size-l);

    h1 {
      font-size: var(--font-size-3);
    }

    h2 {
      font-size: var(--font-size-2);
    }

    p {
      font-size: var(--font-size--1);
    }

    .image {
      // flex: 4;
      // display: grid;
      // place-content: center;
      display: flex;
      justify-content: center;

      img {
        max-width: var(--size-8xl);
        object-fit: contain;
        // max-height: 100%;
        height: 40rem;
        // border: 1px solid red;
      }
    }
    .content {
      flex: 6;

      box-shadow: var(--shadow-3);
      background-color: var(--card-bg);
      padding: var(--size-2xl);

      .benefits {
        ul {
          li {
            font-size: var(--font-size--1);
          }
        }
      }

      .add-to-cart {
        display: flex;
        justify-content: space-between;

        span {
          font-size: var(--font-size-2);
          color: var(--color-primary-50);
        }
      }
    }
    // }
  }

  &.step-1 {
    .content-wrapper {
      // align-items: stretch;
      // flex-direction: column;
      grid-template-columns: 1fr;

      .image {
        // flex: 1;
        // border: 1px solid red;
        height: 14rem;

        img {
          // max-width: 4rem;
          // height: auto;
          // max-height: 100%;
        }
      }

      .content {
        flex: 1;
        // padding: 0;
      }
    }
  }

  &.step-2 {
    .content-wrapper {
      // align-items: stretch;
      // flex-direction: column;
      grid-template-columns: 1fr 5fr;

      .image {
        // flex: 1;
        // border: 1px solid red;
        // width: 10rem;

        img {
          max-width: 12rem;
          // height: auto;
          // max-height: 100%;
        }
      }

      .content {
        flex: 1;
        // padding: 0;
      }
    }
  }
}
</style>
