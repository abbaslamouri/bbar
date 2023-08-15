<script setup lang="ts">
import { bytesFromNumber } from '~/server/utils/bytesFromNumber'

import slugify from 'slugify'
// import { useToast } from 'vue-toastification'
import { ICategory } from '~/server/utils/schemas/category'
import { zodProductSchema, IProduct } from '~/server/utils/schemas/product'
import { IMedia } from '~/server/utils/schemas/media'
import { IParams, IAppData } from '~/server/utils/schemas/app'

definePageMeta({
  title: 'Add Product',
  description: 'Add Product',
  layout: 'admin',
})

const { appFetch } = useHttp()
const viewportWidth = useViewportWidth()
const { appFormErrors, appApiErrorMsgs, parseAppApiErrors, parseAppZodErrors } = useAppErrors()

const route = useRoute()
const config = useRuntimeConfig()
const { $toast } = useNuxtApp()
const loading = ref(true)

const product = ref<IMedia>({} as IMedia)

const passwordRecoverySent = ref(false)
const submitted = ref<boolean>(false)
const apiErrorCode = ref()

const { authUser } = useAuthStore()

// const products = ref()
const formData = ref()

appApiErrorMsgs.value = []

// console.log(useRoute().params._id)
const _id = useRoute().params._id ? useRoute().params._id : '_'

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

const response = await appFetch({
  route: `products/${useRoute().params._id}`,
  method: 'GET',
  params: {
    resource: 'products',
    lookup: JSON.stringify({
      media: 'gallery',
      categories: 'categories',
    }),
  },
})

console.log(response)
loading.value = false

// const found = ((response as IAppData)?.docs as Array<IProduct>).find((p: IProduct) => p._id == useRoute().params._id)
if ((response as IProduct)?._id !== null) {
  formData.value = response
  formData.value.dateCreated = new Date(formData.value.dateCreated).toISOString().substring(0, 10)
  formData.value.salePriceStartDate = new Date(formData.value.salePriceStartDate as string)
    .toISOString()
    .substring(0, 10)
  formData.value.salePriceEndDate = new Date(formData.value.salePriceEndDate as string).toISOString().substring(0, 10)
} else {
  formData.value = {
    name: 'Abbas',
    displayName: 'Hello Lamp',
    sku: '',
    description: 'Some description',
    excerpt: 'Some excerpt',
    price: 2589,
    salePrice: 2067,
    gallery: [] as Array<IMedia>,
    categories: [] as Array<ICategory>,
    featured: false,
    shippingWeight: 0,
    shippingWidth: 0,
    shippingLength: 0,
    shippingHeight: 0,
    salePriceStartDate: new Date().toISOString().substring(0, 10),
    salePriceEndDate: new Date().toISOString().substring(0, 10),
    upSells: [] as Array<IProduct>,
    crossSells: [] as Array<IProduct>,
    shippingClass: '',
    taxStatus: 'taxable',
    taxClass: 'standard',
    status: 'public',
    dateCreated: new Date().toISOString().substring(0, 10),
  }
}

const updateProductDetails = (event: any) => {
  formData.value.name = event.name
  formData.value.displayName = event.displayName
  formData.value.sku = event.sku
  formData.value.featured = event.featured
  formData.value.description = event.description
  formData.value.excerpt = event.excerpt
}

const updateProductPrice = (event: any) => {
  // console.log(event)
  formData.value.price = event.price
  formData.value.salePrice = event.salePrice
  formData.value.salePriceStartDate = event.salePriceStartDate
  formData.value.salePriceEndDate = event.salePriceEndDate
}

const updateShippingDetails = (event: any) => {
  formData.value.shippingWeight = event.shippingWeight
  formData.value.shippingClass = event.shippingClass
  formData.value.shippingWidth = event.shippingWidth
  formData.value.shippingLength = event.shippingLength
  formData.value.shippingHeight = event.shippingHeight
}

const updateTaxDetails = (event: any) => {
  formData.value.taxStatus = event.taxStatus
  formData.value.taxClass = event.taxClass
}

// const updateCrossUpSells = (event: IProduct, itemName: string) => {
//   console.log(itemName)
//   console.log(event)
//   if (itemName === 'crossSells') formData.value.crossSells = event
//   if (itemName === 'upells') formData.value.upSells = event
// }

const saveProducts = async () => {
  appFormErrors.value = []
  appApiErrorMsgs.value = []
  apiErrorCode.value = ''
  submitted.value = true
  loading.value = true

  // const newGallery = []
  // for (const image of formData.value.gallery) {
  //   newGallery.push({ ...image, dateCreated: new Date(image.dateCreated) })
  // }
  // formData.value.gallery = newGallery

  // const newCategories = []
  // for (const category of formData.value.categories) {
  //   newCategories.push({ ...category, dateCreated: new Date(category.dateCreated) })
  // }
  // formData.value.categories = newCategories

  formData.value.slug = slugify(formData.value.name, { lower: true })
  formData.value.price = +formData.value.price
  formData.value.salePrice = +formData.value.salePrice
  // formData.value.salePriceStartDate = new Date(formData.value.salePriceStartDate.split('-'))
  // formData.value.salePriceEndDate = new Date(formData.value.salePriceEndDate.split('-'))
  // formData.value.dateCreated = new Date(formData.value.dateCreated)
  // formData.value.salePriceStartDate = new Date(formData.value.salePriceStartDate)
  // formData.value.salePriceEndDate = new Date(formData.value.salePriceEndDate)

  console.log(formData.value)

  // Validate form inputs
  const parsedFormData = zodProductSchema.safeParse(formData.value)

  // console.log('XXXXX', parsedFormData)
  // return
  if (!parsedFormData.success) {
    console.log(parsedFormData.error.issues[0])
    parseAppZodErrors(parsedFormData.error.issues)
    loading.value = false
    return
  }

  const requestMethod = useRoute().params._id === '_' ? 'POST' : 'PUT'

  const results = await appFetch({
    route: `products`,
    method: requestMethod,
    params: {
      resource: 'products',
      // lookup: {
      //   from: 'media',
      //   localField: 'gallery',
      //   foreignField: '_id',
      //   as: 'gallery',
      // },
      // limit: 100,
    },
    body: { ...formData.value },
  })

  console.log(results)

  // const { data, error } = await useFetch(`ecommerce/products`, {
  //   baseURL: config.public.apiUrl,
  //   method: requestMethod,
  //   headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
  //   // body: { ...parsedFormData.data, sessionId: authUser.value.sessionId },
  //   body: { ...formData.value, sessionId: authUser.value.sessionId },
  // })
  loading.value = false

  // if (error.value) {
  //   console.log(error.value.data)
  //   apiErrorCode.value = error.value.data.data.errorCode
  //   appApiErrorMsgs.value = error.value.data.data.messages
  // } else {
  //   console.log(data.value)
  //   return navigateTo({
  //     // path: '/admin/prodcucts/list',
  //   })
  // }
}
</script>

<template>
  <div class="admin-product-edit">
    <div class="container">
      <div
        class="ecommerce admin edit product | flow-xl"
        :class="{
          'break-point-1': viewportWidth <= 1440,
          'break-point-2': viewportWidth <= 1000,
        }"
      >
        <!-- <div class="container | flow-l"> -->
        <NuxtLink class="btn btn-text" :to="{ name: 'admin-products' }">
          <Icon class="icon" name="mdi:arrow-left-thin" aria-hidden="true" focusable="false" />Products
        </NuxtLink>
        <h1>Edit product</h1>
        <form :class="{ submitted }" novalidate>
          <AppErrors />
          <div class="form-inner">
            <div class="left | flow-l">
              <!-- <h1>Edit product</h1> -->
              <div>
                <ul class="flow-2xs" role="list">
                  <li><a href="#details">Details</a></li>
                  <li><a href="#price">Price</a></li>
                  <li><a href="#image-gallery">Image Gallery</a></li>
                  <li><a href="#product-categories">Categories</a></li>
                  <li><a href="#shipping">Shipping Options</a></li>
                  <li><a href="#taxes">Taxes</a></li>
                  <li><a href="#cross-sells">Crosssells</a></li>
                  <li><a href="#up-sells">Upsells</a></li>
                  <li><a href="#seo">SEO</a></li>
                  <li><a href="#misc">Misc</a></li>
                </ul>
              </div>
            </div>
            <div class="middle | flow-xl">
              <AdminEcommerceProductsDetails :formData="formData" @updateFormData="updateProductDetails" />
              <AdminEcommerceProductsPrice :formData="formData" @updateFormData="updateProductPrice" />
              <AdminImageGallery :gallery="formData.gallery" @updateGallery="formData.gallery = $event" />
              <LazyAdminEcommerceProductsCategories
                :productCategories="formData.categories"
                @updateProductCategories="formData.categories = $event"
              />
              <AdminEcommerceProductsShipping :formData="formData" @updateFormData="updateShippingDetails" />
              <AdminEcommerceProductsTaxes :formData="formData" @updateFormData="updateTaxDetails" />
              <LazyAdminEcommerceProductsCrossUpSells
                :items="formData.crossSells"
                itemsTitle="Cross sells"
                @updateItems="formData.crossSells = $event"
              />
              <LazyAdminEcommerceProductsCrossUpSells
                :items="formData.upSells"
                itemsTitle="Up sells"
                @updateItems="formData.upSells = $event"
              />
            </div>
            <div class="right">
              <Icon class="icon" name="svg-spinners:270-ring" aria-hidden="true" focusable="false" v-if="loading" />
              <button type="button" class="btn btn-filled" @click="saveProducts" v-else>Save Product</button>
            </div>
          </div>
        </form>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-product-edit {
  flex: 1;
  display: flex;
  margin-block-end: var(--size-7xl);
}
</style>
