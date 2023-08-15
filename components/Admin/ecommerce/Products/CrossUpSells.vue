<script setup lang="ts">
// import { useToast } from 'vue-toastification'

import { IProduct } from '~/server/utils/schemas/product'
import { IParams, IAppData } from '~/server/utils/schemas/app'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  itemsTitle: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['updateItems'])

const { appFormErrors, appApiErrorMsgs, parseAppApiErrors, parseAppZodErrors } = useAppErrors()
const { authUser } = useAuthStore()
const config = useRuntimeConfig()

const products = ref<Array<IProduct>>([])
const localItems = ref([...(props.items as Array<IProduct>)])

const itemToAddId = ref('')

const searchText = ref('')

const params = computed(() => {
  return {
    resource: 'products',
    match: JSON.stringify({
      name: { $regex: searchText.value, $options: 'i' },
    }),
    lookup: JSON.stringify({
      media: 'gallery',
      categories: 'categories',
    }),
  }
})

const {
  data: response,
  error,
  pending,
  refresh,
} = await useFetch(`products`, {
  baseURL: config.public.apiUrl as string,
  method: 'GET',
  headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
  params,
})
if (error.value) {
  appApiErrorMsgs.value = error.value?.data?.data?.messages
} else {
  // console.log(response.value)
}

// const { data, error } = await useFetch(`ecommerce`, {
//   baseURL: config.public.apiUrl,
//   method: 'GET',
//   headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
//   params: {
//     resource: 'products',
//   },
// })
// if (error.value) {
//   console.log(error.value.data)
//   // appApiErrorMsgs.value = error.value.data.data.messages
//   // useToast().error(parseAppApiErrors(), { timeout: 10000 })
// } else {
//   // console.log(data.value)
//   products.value = data.value as Array<IProduct>
// }

const getAutocompleteItems = () => {
  const products = (response.value as IAppData)?.docs as Array<IProduct>
  // console.log(products)
  if (!products) return
  const filtered = products.map((c: IProduct) => {
    return { text: c.name ?? '', value: c._id ?? '' }
  })
  // console.log(filtered)
  return filtered
}

const updateProductItems = () => {
  // const newItems = []
  // for (const itemId of localItems.value) {
  //   const found = (products.value as Array<IProduct>).find((item: IProduct) => item._id == itemId)
  //   if (found) newItems.push(found)
  // }
  // emit('updateItems', newItems)
}

const removeItems = (productId: string) => {
  const index = (localItems.value as Array<IProduct>).findIndex((item: IProduct) => item._id === productId)
  console.log(index)
  if (index !== -1) localItems.value.splice(index, 1)
  updateProductItems()
}

// watch(localItems, () => {
//   console.log(localItems.value)
//   updateProductItems()
// })

watch(itemToAddId, (newVal) => {
  // console.log(newVal)
  const index = ((response.value as IAppData)?.docs as Array<IProduct>).findIndex(
    (item: IProduct) => item._id === newVal
  )
  console.log(index)
  if (index !== -1) localItems.value.push(((response.value as IAppData)?.docs as Array<IProduct>)[index])
  emit('updateItems', localItems.value)
  // updateproductCategories()
  // emit('updateProductCategories', newOption)
  // updateproductCategories()
})
</script>

<template>
  <div class="section cross-up-sells | flow-l" id="cross-sells">
    <h2>{{ itemsTitle }}</h2>
    <div class="inner">
      <div class="selector">
        <FormsBaseAutocomplete
          v-model="itemToAddId"
          label="Filter Categories"
          ariaLabelledBy="categoriesLabel"
          :selectOptions="getAutocompleteItems()"
          nullOption="Select category"
          @updateSearchText="searchText = $event"
        />
        <!-- <FormsBaseListbox
          v-model="products"
          :selectOptions="
            (products as Array<IProduct>).map((c) => {
              return { text: c.name ?? '', value: c._id ?? '' }
            })
          "
          :nullOption="`Select ${itemsTitle}`"
        /> -->
      </div>
      <div>
        <ul role="list" class="" v-if="items.length">
          <li v-for="product in (items as Array<IProduct>)" :key="product._id">
            <div class="thumb">
              <img
                :src="`${config.public.s3BaseUrl}/${product.gallery?.[0]?.slug}`"
                :alt="`${product.name}`"
                v-if="product.gallery?.[0]?.slug && `${config.public.s3BaseUrl}/${product.gallery?.[0]?.slug}`"
              />
              <img src="/assets/placeholder.png" alt="Product Image Placeholder" v-else />
            </div>
            <p class="tooltip">{{ product.name }}</p>
            <button @click.prevent="removeItems(product._id ?? '')">
              <Icon class="" name="ri:close-line" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cross-up-sells {
  .inner {
    display: flex;
    gap: var(--size-l);
    .selector {
      min-width: var(--size-11xl);
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      gap: var(--size-l);
      border: 1px solid var(--color-light);
      padding: var(--size-l);

      li {
        position: relative;
        background-color: var(--bg-grey);
        padding-inline: var(--size-s);
        padding-block: var(--size-3xs);

        .thumb {
          width: var(--size-6xl);
          aspect-ratio: 1;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
        }

        .tooltip {
          position: absolute;
          top: calc(-1 * var(--size-l));
          left: 50%;
          transform: translate(-50%, -50%);
          width: max-content;
          padding-inline: var(--size-xs);
          padding-block: var(--space-xxs);
          border-radius: var(--size-3xs);
          background-color: var(--on-bg);
          font-size: var(--font-size--1);
          color: var(--bg);
          // visibility: hidden;
          // opacity: 0;

          &::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 1rem;
            height: 1rem;

            border: 0.5rem solid transparent;
            border-top: 0.5rem solid var(--on-bg);
          }
        }

        button {
          position: absolute;
          top: 1%;
          left: 99%;
          transform: translate(-50%, -50%);
          background-color: var(--clr-danger-3);
          border-radius: 100%;
          display: grid;
          place-content: center;
          font-size: var(--font-size--1);
          color: var(--bg);
          // visibility: hidden;
          // opacity: 0;
          cursor: pointer;
          border: none;

          svg {
            width: var(--size-l);
            height: var(--size-l);
          }
        }

        &:hover {
          .tooltip,
          button {
            // visibility: visible;
            // opacity: 1;
          }
        }
      }
    }
  }
}
</style>
