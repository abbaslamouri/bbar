<script setup lang="ts">
// import IProduct from '~~/ToDeelete/types/IProduct'
import { zodProductSchema, IProduct } from '~/server/utils/schemas/product'

definePageMeta({
  title: 'Products Migration',
  description: 'MyLight product migration page',
  layout: 'admin',
})

const { searchText, filter, page, perPage, sort, selectedItemsIds, selectedItems, appFetch } = useHttp()

// const { csrfFetch } = useCsrfStore()
// const { authUser } = useAuthStore()
// const { appFetch } = useHttp()
// console.log('YYYYYY', authUser.value)
const { authUser } = useAuthStore()
const { appApiErrorMsgs } = useAppErrors()

const config = useRuntimeConfig()

// const appErrorMsgs = useAppErrorMsgs()
const uploadedProducts = ref([])
const relevantSheet = 'products.csv'

const loading = ref<boolean>(false)

const products = ref<Array<IProduct>>([])
const totalCount = ref()

const files = await appFetch({
  route: `products/csv-files`,
  method: 'GET',
  params: { resource: 'products' },
})

console.log(
  'FILES',
  (files as string[]).filter((f) => !f.startsWith('.'))
)

const migrate = async (fileName: string) => {
  console.log(fileName)

  loading.value = true
  // appErrorMsgs.value = []

  const { data: csvData } = await useAsyncData(fileName, () => queryContent('/').find())
  console.log('CSVDATA', csvData.value)
  if (!csvData.value || !csvData.value.length) return
  console.log(csvData.value[0]?.body)
  const errorMsgs: string[] = []

  // for (const item of csvData.value[0]?.body) {
  //   products.value.push({ ...item, isUploading: true })
  // }
  Promise.all(
    csvData.value[0]?.body.map(async (item: IProduct) => {
      const results = await appFetch({
        route: `products/migrate`,
        method: 'POST',
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
        body: { ...item },
      })

      console.log(results)
    })
  )
  // if (errorMsgs.length) appApiErrorMsgs.value = errorMsgs
  // else $toast(`Selected products deleted succesfully`, { type: 'success', duration: 5 })
  // console.log('FFFFF', selectedProducts.value)
  // refresh()

  // const { data, error } = await csrfFetch('ecommerce/products/migrate', 'POST', {
  // 	productsObj: sheet.body,
  // 	sessionToken: authUser.value.sessionToken,
  // })
  // loading.value = false
  // console.log(data.value)
  // console.log(error.value)

  // if (error.value) {
  // 	console.log(error.value.data)
  // 	const apiEerrorMsgs = error.value.data?.data?.messages
  // 	return (appErrorMsgs.value = apiEerrorMsgs)
  // }
  // }
}
</script>

<template>
  <v-form>
    <v-container fluid>
      <v-row>
        <v-col md="4">
          <v-select
            v-model="filter"
            label="Select File"
            :items="(files as string[]).filter((f) => !f.startsWith('.'))"
            density="compact"
            variant="solo"
            @update:model-value="migrate"
          ></v-select> </v-col
      ></v-row>

      <!-- <button class="btn btn-filled" @click="migrate">Migrate products</button> -->

      <div class="container">
        <!-- <div class="flow-s p-l"> -->
        <!-- {{ authUser.sessionToken }} -->
        <!-- <Spinner class="spinner" v-if="loading" /> -->
        <Icon class="icon" name="svg-spinners:270-ring" aria-hidden="true" focusable="false" v-if="loading" />

        <AppErrors />
        <div class="products-list">
          <ul class="products" role="list">
            <li v-for="(product, index) in (products as Array<IProduct>)" :key="product._id">
              <div class="product"></div>
              <Icon
                class="icon"
                name="svg-spinners:270-ring"
                aria-hidden="true"
                focusable="false"
                v-if="product.isUploading"
              />
              <div v-else>
                <div role="cell" class="image-title" data-cell="">
                  <div class="thumb">
                    <img
                      :src="`${config.public.s3BaseUrl}/${product.gallery?.[0]?.slug}`"
                      :alt="`${product.name}`"
                      v-if="product.gallery?.[0]?.slug && `${config.public.s3BaseUrl}/${product.gallery?.[0]?.slug}`"
                    />
                    <img src="/assets/placeholder.png" alt="Product Image Placeholder" v-else />
                  </div>
                  <p class="title">{{ product.name }}</p>
                </div>
                <div role="cell" data-cell="true" data-name="price">${{ (product.price / 100).toFixed(2) }}</div>
                <div role="cell" data-cell="true" data-name="sale price">
                  ${{ (product?.salePrice! / 100).toFixed(2) }}
                </div>
                <div role="cell" class="icon" data-cell="true" data-name="Featured">
                  <Icon :class="{ featured: product.featured }" v-if="product.featured" name="ri:star-fill" />
                  <Icon name="ri:star-line" v-else />
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="progress-bar-wrapper">
          <div
            class="progress-bar"
            :style="{ width: !totalCount ? 0 : (uploadedProducts.length / totalCount) * 100 + '%' }"
          >
            <div v-if="uploadedProducts.length">
              {{ Math.floor((uploadedProducts.length / totalCount) * 100) + '%' }}
            </div>
          </div>
        </div>
        <!-- </div> -->
      </div>
    </v-container>
  </v-form>
</template>

<style lang="scss" scoped>
// .spinner {
//   width: 5rem;
// }
// ul {
//   display: flex;
//   flex-wrap: wrap;
//   gap: 2rem;

//   li {
//     width: var(--size-7xl);
//     height: var(--size-7xl);
//     border: 1px solid red;

//     display: flex;
//     align-items: center;
//     justify-content: center;

//     .icon {
//       border: 1px solid red;
//       width: 50%;
//       height: 50%;
//     }
//   }
// }

// .image {
//   width: 4rem;
// }

// .progress-barwrapper {
//   border: 1px solid red;
// }

// .progress-bar {
//   background-color: green;
// }
</style>
