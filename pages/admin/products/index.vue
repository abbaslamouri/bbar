<script setup lang="ts">
import slugify from 'slugify'
import debounce from 'lodash.debounce'
import { IProduct } from '~/server/utils/schemas/product'

import { IParams, IAppData } from '~/server/utils/schemas/app'

import { IMedia } from '~/server/utils/schemas/media'
// const { $swal } = useNuxtApp()
import { ISelectOption } from '~/server/utils/schemas/app'

definePageMeta({
  title: 'Admin Products',
  description: 'Admin products list',
  layout: 'admin',
  // middleware: ['auth'],
})

const { searchText, filter, page, perPage, sort, selectedItemsIds, selectedItems, appFetch } = useHttp()
const { $toast } = useNuxtApp()
const { appApiErrorMsgs, appFormErrors } = useAppErrors()
const viewportWidth = useViewportWidth()
const { authUser } = useAuthStore()
const config = useRuntimeConfig()
const tableCaption = ref('')
// const { $toast } = useNuxtApp()

// const showFilters = ref(true)

// const defaultPerPage = 20

// const selectedItems = ref<Array<IProduct>>([])
// const showUploader = ref(false)
// const searchText = ref('')
// const mediaType = ref('')
const selectAll = ref(false)
// const page = ref<number>(1)
// const perPage = ref<number>(defaultPerPage)
// const totalCount = ref<number>(0)
// const sort = ref({
//   dateCreated: 1,
//   //   field: '',
//   //   order: -1,
// })
const bulkSelect = ref(false)
const alertRef = ref()

const filterSelectOptions: Array<ISelectOption> = [
  // { value: '', text: 'All media' },
  // { value: 'image', text: 'Images' },
  // { value: 'csv', text: "CSV's" },
  // { value: 'pdf', text: "PDF's" },
]

const sortSelectOptions = [
  { value: 'dateCreated', text: 'Date Created' },
  { value: 'name', text: 'Name' },
  { value: 'price', text: 'Price' },
]

sort.value = { field: 'dateCreated', order: 1 }
filter.value = ''
perPage.value = 5

const params = computed(() => {
  const params = {
    resource: 'products',
    // match: `name[$regex]=${searchText.value}, price[$lt]=1234`,
    match: {
      name: { $regex: searchText.value, $options: 'i' },
      // mediaType: { $regex: filter.value, $options: 'i' },
      //   ...filter.value,
    },
    lookup: JSON.stringify({
      media: 'gallery',
      categories: 'categories',
    }),
    sort: sort.value.field && sort.value.order ? { [sort.value.field]: sort.value.order } : null,
    page: page.value,
    perPage: perPage.value,
  }

  const selectedFilterOption = filterSelectOptions.find((option: ISelectOption) => option.text === filter.value)

  // params.match = {
  //   ...params.match,
  //   mediaType: { $regex: (selectedFilterOption as ISelectOption)?.value ?? '', $options: 'i' },
  // }
  // filter.value = selectedValue?.value ?? ''

  // const filterObj =
  //   filter.value.field && filter.value.action && filter.value.text
  //     ? { [filter.value.field]: { [filter.value.action]: filter.value.text } }
  //     : null

  // if (filterObj) params.match = { ...params.match, ...filterObj }
  // if (searchText.value) params.match = { ...params.match, name: { $regex: searchText.value, $options: 'i' } }
  // params.match = JSON.stringify(params.match)

  return params
})

// const products = ref()

// const params = computed(() => {
//   return {
//     resource: 'products',
//     // match: `name[$regex]=${searchText.value}, price[$lt]=1234`,
//     match: JSON.stringify({
//       name: { $regex: searchText.value, $options: 'i' },
//       // price: { $lt: 2000 },
//     }),
//     lookup: JSON.stringify({
//       media: 'gallery',
//       categories: 'categories',
//     }),
//     sort: Object.keys(sort.value).length ? JSON.stringify(sort.value) : null,
//     page: page.value ?? 1,
//     perPage: perPage.value || defaultPerPage,
//   }
// })

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
  // totalCount.value = (response.value as IAppData).totalCount
  console.log(response.value)
  // products.value = (response.value as IAppData).docs
}

// provide('products', (response.value as IAppData).docs)
// provide('selectedItems', selectedItems)
// provide('page', page)
// provide('perPage', perPage)
// provide('sort', sort)
// provide('sortSelectOptions', sortSelectOptions)

provide('sortSelectOptions', sortSelectOptions)
provide('filterSelectOptions', filterSelectOptions)
provide('bulkSelect', bulkSelect)
// provide('selectedItems', selectedItems)
provide('media', (response.value as IAppData).docs)

const handleEdit = (index: number) => {
  const product = (response.value as IAppData)?.docs[index] || {}
  // resetActions(index)
  return navigateTo({
    path: `/admin/products/${(product as IProduct)._id}`,
    query: {
      // _id:product._id,
    },
  })
}

const deleteOne = async (product: IProduct) => {
  const found = ((response.value as IAppData)?.docs as IProduct[]).find((item: IProduct) => item._id === product._id)
  if (!found) return 0
  return await appFetch({
    route: `products/${found._id}`,
    method: 'DELETE',
    params: { resource: 'products' },
  })
  // console.log(deletedCount)
  // if (deletedCount == 1)
  //   $toast(`Product ${(product as IProduct)?.name} deleted succesfully`, { type: 'success', duration: 5 })
  // return deletedCount
}

const deleteItem = async (item: IProduct) => {
  if (!(await alertRef.value.alertConfirm('This cannot be undone'))) return
  const deletedCount = await deleteOne(item)
  if (deletedCount !== 1) {
    console.log('Fail')
  } else {
    refresh()
  }
}

// const handleDeleteAll = async () => {
//   if (!confirm('Are you sure')) return
//   console.log(selectedItems.value)
//   const errorMsgs: string[] = []
//   Promise.all(
//     selectedItems.value.map(async (product) => {
//       const deletedCount = await deleteOne(product)
//       console.log('DC', deletedCount)
//       if (deletedCount !== 1) {
//         errorMsgs.push(`Unable to delete product ${product.name}`)
//       } else {
//         let index = selectedItems.value.findIndex((p: IProduct) => p._id === product._id)
//         if (index !== -1) selectedItems.value.splice(index, 1)
//       }
//     })
//   )
//   if (errorMsgs.length) appApiErrorMsgs.value = errorMsgs
//   else $toast(`Selected products deleted succesfully`, { type: 'success', duration: 5 })
//   console.log('FFFFF', selectedItems.value)
//   refresh()
// }

// const updateList = debounce((event: string) => {
//   searchText.value = event
// }, 500)

// const updatePerPage = (event: number) => {
//   console.log(event)
//   page.value = 1
//   perPage.value = event
// }

// const updateSortField = (event: any) => {
//   console.log(event)
//   sort.value = event
// }

const toggleSelectAll = () => {
  // console.log('AAAAAA', selectedItems.value)

  if (selectedItems.value?.length) {
    selectedItems.value = []
    selectedItemsIds.value = []
  } else {
    for (const item of (response.value as IAppData).docs as Array<IProduct>) {
      selectedItems.value.push(item)
      selectedItemsIds.value.push(item?._id as string)
    }
  }
}

const cancelBulkSelect = () => {
  // console.log('AAAAAA', selectedItems.value)

  // if (selectedItems.value?.length) {
  selectedItems.value = []
  selectedItemsIds.value = []
  bulkSelect.value = !bulkSelect.value
  // } else {
  //   for (const item of (response.value as IAppData).docs as Array<IProduct>) {
  //     selectedItems.value.push(item)
  //     selectedItemsIds.value.push(item?._id as string)
  //   }
  // }
}

const updateSelectedItems = (product: IProduct) => {
  // const index = selectedItems.value.findIndex((p: IProduct) => p._id === product._id)
  // if (index === -1) selectedItems.value.push(product)
  // else selectedItems.value.splice(index, 1)
}

// const updateSortField = (event) => {
//   console.log(event)
//   sort.value = event
// }

const updateFilterList = (event: string) => {
  console.log('EEEEE', event)
}

// const toggleBulkSelect = () => {
//   bulkSelect.value = !bulkSelect.value
// }

const deleteSelected = async () => {
  if (!(await alertRef.value.alertConfirm('This cannot be undone'))) return
  // if (!confirm('Are you sure')) return
  console.log(selectedItems.value)
  const errorMsgs: string[] = []

  // console.log('KKKKKK', await alertRef.value.alertConfirm())
  Promise.all(
    (selectedItems.value as IProduct[]).map(async (item) => {
      const deletedCount = await deleteOne(item)
      console.log('DC', deletedCount)
      if (deletedCount !== 1) {
        errorMsgs.push(`Unable to delete product ${item.name}`)
      } else {
        let index = (selectedItems.value as IProduct[]).findIndex((item: IProduct) => item._id === item._id)
        if (index !== -1) selectedItems.value.splice(index, 1)
      }
    })
  )
  if (errorMsgs.length) {
    appApiErrorMsgs.value = errorMsgs
  } else {
    $toast(`Selected products deleted succesfully`, { type: 'success', duration: 5 })
    console.log('FFFFF', selectedItems.value)
    refresh()
  }
}
</script>

<template>
  <div class="admin-ecommerce-list">
    <div class="container">
      <div class="flow-l">
        <!-- {{ selectedItems }} -->
        <!-- <AdminEcommerceHeading title="Products" route="admin-products-_id" /> -->
        <!-- <AdminFilters
          @updateSortField="sort = $event"
          @toggleSelectAll="toggleSelectAll"
          @updatePerPage="updatePerPage"
          @handleDeleteAll="handleDeleteAll"
        /> -->
        <div class="px-5 pt-5 d-flex align-center justify-space-between">
          <h1 class="text-h5 text-sm-h4">Products</h1>
          <!-- <v-spacer></v-spacer> -->
          <div>
            <v-btn prepend-icon="mdi-plus" size="x-large" color="primary">
              <template v-slot:prepend>
                <v-icon color="success"></v-icon>
              </template>
              Add
            </v-btn>

            <!-- <button class="btn btn-filled" @click="openUploader = !openUploader">
          <Icon class="icon" name="mdi:plus" aria-hidden="true" focusable="false" />Add
        </button> -->
          </div>
        </div>
        <AdminFilters
          @showBulkSelect="bulkSelect = !bulkSelect"
          @cancelBulkSelect="cancelBulkSelect"
          @toggleSelectAll="toggleSelectAll"
          @deleteSelected="deleteSelected"
        />
        <AppErrors />
        <div class="border d-flex justify-center align-center h-75" v-if="pending">
          <v-progress-circular :size="100" :width="7" color="primary" indeterminate></v-progress-circular>
        </div>
        <!-- <div class="pending" v-if="pending">...loading</div>
        <AppErrors v-else-if="appApiErrorMsgs?.[0] || appFormErrors?.[0]" /> -->
        <div class="content" v-else>
          <div
            class="table-pagination | flow-l"
            v-if="(response as IAppData).docs && Array.isArray((response as IAppData).docs) && (response as IAppData).docs.length"
          >
            <AdminEcommerceProductsList
              :products="((response as IAppData).docs as Array<IProduct>)"
              :totalCount="(response as IAppData).totalCount"
              :tableCaption="tableCaption"
              :bulkSelect="bulkSelect"
              @edit="handleEdit($event)"
              @deleteItem="deleteItem"
            />
            <!-- <LazyPagination
              class="pagination"
              :page="page"
              :perPage="perPage"
              :totalCount="(response as IAppData).totalCount"
              @updatePage="page = $event"
              v-if="(response as IAppData).totalCount > perPage"
            /> -->
          </div>
          <p class="no-items" v-else>There are no products in the database</p>
        </div>
        <!-- </div> -->
      </div>
    </div>
    <Alert ref="alertRef" />
  </div>
</template>

<style lang="scss" scoped>
.admin-products-list {
  flex: 1;
  display: flex;
}
</style>



