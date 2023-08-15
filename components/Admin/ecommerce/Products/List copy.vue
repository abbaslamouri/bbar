<script lang="ts" setup>
import slugify from 'slugify'
import debounce from 'lodash.debounce'
import { IProduct } from '~/server/utils/schemas/product'

import { IParams, IAppData } from '~/server/utils/schemas/app'

const { searchText, page, perPage, sort, appFetch } = useHttp()

const { appApiErrorMsgs, appFormErrors } = useAppErrors()
const viewportWidth = useViewportWidth()
const { authUser } = useAuthStore()
const config = useRuntimeConfig()
// const { $toast } = useNuxtApp()

const actionsRefs = ref<Array<boolean>>([])
const showFilters = ref(true)
const tableCaption = ref()

const sortSelectOptions = [
  { value: '', text: 'Date Created' },
  { value: 'name', text: 'Name' },
  { value: 'mediaType', text: 'File type' },
]

const selectedFiles = ref<Array<IProduct>>([] as Array<IProduct>)
// const showUploader = ref(false)
// const searchText = ref('')
// const mediaType = ref('')
// const bulkSelect = ref(false)
// const page = ref(1)
// const perPage = ref(6)
// const sort = ref({
//   field: '',
//   order: -1,
// })

perPage.value = 20

const params = computed(() => {
  return {
    resource: 'products',
    // match: `name[$regex]=${searchText.value}, price[$lt]=1234`,
    match: JSON.stringify({
      name: { $regex: searchText.value, $options: 'i' },
      // price: { $lt: 2000 },
    }),
    lookup: JSON.stringify({
      media: 'gallery',
      categories: 'categories',
    }),
    sort: sort.value?.field ? JSON.stringify({ [sort.value?.field]: sort.value.order }) : null,
    page: page.value,
    perPage: perPage.value,
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
  console.log(response.value)
}

const resetActions = (index: number) => {
  const currentState = actionsRefs.value[index] || false
  for (const prop in actionsRefs.value) {
    actionsRefs.value[prop] = false
  }
  actionsRefs.value[index] = currentState ? false : true
}

const handleEdit = (index: number) => {
  const product = (response.value as IAppData)?.docs[index] || {}
  resetActions(index)
  return navigateTo({
    path: `/admin/products/${(product as IProduct)._id}`,
    query: {
      // _id:product._id,
    },
  })
}

const handleDelete = async (index: number) => {
  const product = (response.value as IAppData)?.docs[index]

  resetActions(index)

  const { data, error, pending } = await useFetch(`ecommerce/deleteById`, {
    baseURL: config.public.apiUrl,
    method: 'DELETE',
    headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
    params: { resource: 'products', _id: (product as IProduct)._id },
  })
  if (error.value) {
    console.log(error.value.data)
    appApiErrorMsgs.value = error.value.data.data.messages
    // useToast().error(parseAppApiErrors(), { timeout: 10000 })
    // parseAppApiErrors()
  } else {
    console.log(data.value)
    // if (data.value) useToast().success(`Product ${product.name} deleted successfully `, { timeout: 10000 })
    // else useToast().error(`Unable to delete product ${product.name}`, { timeout: 10000 })
  }
  if (Array.isArray((response.value as IAppData)?.docs) && (response.value as IAppData)?.docs.length)
    (response.value as IAppData)?.docs.splice(index, 1)
}

const updateList = debounce((event: string) => {
  searchText.value = event
}, 500)
</script>

<template>
  <div
    class="list-inner | flow-l"
    :class="{
      'breakpoint-1': viewportWidth < 800,
      'breakpoint-2': viewportWidth < 400,
    }"
  >
    <!-- <div class="flow-l"> -->
    <div class="heading">
      <h1>Products</h1>
      <div class="actions">
        <button class="btn btn-svg" @click.prevent="showFilters = !showFilters">
          <Icon class="icon" name="ri:filter-2-line" aria-hidden="true" focusable="false" />
        </button>
        <NuxtLink class="btn btn-filled" :to="{ name: 'admin-products-_id', params: { _id: '_' } }">
          <Icon class="icon" name="mdi:plus" aria-hidden="true" focusable="false" />Add
        </NuxtLink>
      </div>
    </div>

    <!-- <transition name="products-list-filters"> -->
    <div class="filters" v-if="showFilters">
      <div class="sort-per-page">
        <Sort :selectOptions="sortSelectOptions" nullOption="Seelcet Date Crreated Sort Options" />
        <PerPage />
      </div>
      <SearchBar />
    </div>
    <div class="pending" v-if="pending">...loading</div>
    <!-- </transition> -->
    <AppErrors v-else-if="appApiErrorMsgs?.[0] || appFormErrors?.[0]" />
    <div class="table-wrapper" v-else>
      <table
        role="table"
        v-if="(response as IAppData).docs && Array.isArray((response as IAppData).docs) && (response as IAppData).docs.length"
      >
        <caption role="caption" v-if="tableCaption">
          {{
            tableCaption
          }}
        </caption>
        <thead role="rowgroup">
          <tr role="row">
            <th role="cell">Product</th>
            <th role="cell">Price</th>
            <th role="cell">Sale Price</th>
            <th role="cell">Featured</th>
            <th role="cell">Actions</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          <tr
            role="row"
            v-for="(product, index) in ((response as IAppData).docs as Array<IProduct>)"
            :key="product._id"
            :actionRefs="(el:any) => (actionsRefs[index] = false)"
          >
            <!-- <td role="cell" class="image-title"> -->
            <td role="cell" class="image-title" data-cell="">
              <div class="thumb">
                <img
                  :src="`${config.public.s3BaseUrl}/${product.gallery?.[0]?.slug}`"
                  :alt="`${product.name}`"
                  v-if="product.gallery?.[0]?.slug && `${config.public.s3BaseUrl}/${product.gallery?.[0]?.slug}`"
                />
                <img src="/assets/placeholder.png" alt="Product Image Placeholder" v-else />
              </div>
              <p class="title">{{ product.name }}</p>
            </td>
            <!-- </td> -->
            <td role="cell" data-cell="true" data-name="price">${{ (product.price / 100).toFixed(2) }}</td>
            <td role="cell" data-cell="true" data-name="sale price">${{ (product?.salePrice! / 100).toFixed(2) }}</td>
            <td role="cell" class="icon" data-cell="true" data-name="Featured">
              <Icon :class="{ featured: product.featured }" v-if="product.featured" name="ri:star-fill" />
              <Icon name="ri:star-line" v-else />
            </td>
            <td role="cell" data-cell="true" data-name="Actions">
              <AdminActions
                :showActions="actionsRefs[index]"
                @toggleAction="resetActions(index)"
                @edit="handleEdit(index)"
                @delete="handleDelete(index)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>NO Products to display</div>
    </div>
    <!-- </div> -->
  </div>
</template>

<style lang="scss" scoped>
// .products.list {
//   .search {
//     background-color: var(--card-bg);
//     border: 1px solid var(--on-bg-dim);
//     border-radius: var(--size-3xs);

//     display: flex;
//     align-items: center;
//     gap: var(--size-xs);
//     padding-block: var(--size-xs);
//     padding-inline: var(--size-s);
//   }
//   table {
//     td {
//       &.icon {
//         svg {
//           &.featured {
//             color: var(--color-primary-50);
//           }
//         }
//       }
//     }
//   }
// }
</style>
