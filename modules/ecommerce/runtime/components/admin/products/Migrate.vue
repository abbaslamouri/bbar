<script setup lang="ts">
const { csrfFetch } = useCsrfStore()
const { authUser } = useAuthStore()
console.log('YYYYYY', authUser.value)

const appErrorMsgs = useAppErrorMsgs()
const uploadedProducts = ref([])
const relevantSheet = 'products.csv'

const loading = ref<boolean>(false)

const totalCount = ref()

const migrate = async () => {
  loading.value = true
  appErrorMsgs.value = []

  const { data: csvData } = await useAsyncData('products', () => queryContent('/').find())
  if (csvData.value && csvData.value.length > 0) {
    const sheet = csvData.value.find((row) => row._file === relevantSheet)
    if (!sheet) throw createError(`can't find sheet ${relevantSheet}`)
    if (!sheet.body || !sheet.body.length) throw createError(`File ${relevantSheet} does not contain any data`)

    const { data, error } = await csrfFetch('ecommerce/products/migrate', 'POST', {
      productsObj: sheet.body,
      sessionToken: authUser.value.sessionToken,
    })
    loading.value = false
    console.log(data.value)
    console.log(error.value)

    if (error.value) {
      console.log(error.value.data)
      const apiEerrorMsgs = error.value.data?.data?.messages
      return (appErrorMsgs.value = apiEerrorMsgs)
    }
  }
}
</script>

<template>
  <div class="flow-s p-l">
    {{ authUser.sessionToken }}
    <Spinner class="spinner" v-if="loading" />
    <button class="btn btn-filled" @click="migrate">Migrate products</button>
    <div class="progress-bar-wrapper">
      <div
        class="progress-bar"
        :style="{ width: !totalCount ? 0 : (uploadedProducts.length / totalCount) * 100 + '%' }"
      >
        <div class="error-msgs | flow-s" v-if="appErrorMsgs.length">
          <div class="flow-2xs">
            <p>Please correct the following errors</p>
            <ErrorMsg />
          </div>
        </div>
        <div v-if="uploadedProducts.length">
          {{ Math.floor((uploadedProducts.length / totalCount) * 100) + '%' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.spinner {
  width: 5rem;
}
.products {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.image {
  width: 4rem;
}

.progress-barwrapper {
  border: 1px solid red;
}

.progress-bar {
  background-color: green;
}
</style>
