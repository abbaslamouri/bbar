<script setup lang="ts">
// import { useToast } from 'vue-toastification'
import { ICategory } from '~/server/utils/schemas/category'
import { zodCategorySchema } from '~/server/utils/schemas/category'
import { IMedia } from '~/server/utils/schemas/media'

const { appFormErrors, appApiErrorMsgs, parseAppApiErrors, parseAppZodErrors } = useAppErrors()
const { authUser } = useAuthStore()
const viewportWidth = useViewportWidth()
const config = useRuntimeConfig()

const submitted = ref<boolean>(false)
const loading = ref<boolean>(false)
const apiErrorCode = ref()
const formInputs = ref()

const _id = useRoute().params._id

const { data, error, pending } = await useFetch(`ecommerce/fetchById`, {
  baseURL: config.public.apiUrl,
  method: 'GET',
  headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
  params: {
    _id,
    resource: 'categories',
    lookup: {
      from: 'media',
      localField: 'gallery',
      foreignField: '_id',
      as: 'gallery',
    },
  },
})
if (error.value) {
  console.log(error.value.data)
  appApiErrorMsgs.value = error.value.data.data.messages
  // useToast().error(parseAppApiErrors(), { timeout: 10000 })
} else {
  console.log(data.value)
  if (Object.values(data.value as ICategory).length) formInputs.value = data.value as ICategory
  else
    formInputs.value = {
      name: 'Hello',
      description: 'Some description',
      gallery: [] as Array<IMedia>,
    }
}

const saveCategories = async () => {
  appFormErrors.value = []
  appApiErrorMsgs.value = []
  apiErrorCode.value = ''
  submitted.value = true
  loading.value = true

  for (const prop in formInputs.value.gallery) {
    formInputs.value.gallery[prop].dateAdded = new Date(formInputs.value.gallery[prop].dateAdded)
  }

  // Validate form inputs
  const parsedFormInputs = zodCategorySchema.safeParse(formInputs.value)
  if (!parsedFormInputs.success) {
    parseAppZodErrors(parsedFormInputs.error.issues)
    loading.value = false
    return
  }

  const requestMethod = useRoute().params._id === '_' ? 'POST' : 'PUT'

  const { data, error } = await useFetch(`ecommerce/categories`, {
    baseURL: config.public.apiUrl,
    method: requestMethod,
    headers: { ...useRequestHeaders(['cookie']), sessionId: authUser.value.sessionId },
    body: { ...parsedFormInputs.data, sessionId: authUser.value.sessionId },
  })
  loading.value = false

  if (error.value && error.value.data.data.errorCode !== 'emailDeliveryError') {
    console.log(error.value.data)
    apiErrorCode.value = error.value.data.data.errorCode
    appApiErrorMsgs.value = error.value.data.data.messages
  } else {
    console.log(data.value)
    return navigateTo({
      path: '/admin/categories/list',
    })
  }
}
</script>

<template>
  <div
    class="ecommerce admin edit category"
    :class="{
      'break-point-1': viewportWidth <= 1000,
      'break-point-2': viewportWidth <= 800,
    }"
  >
    <div class="container | flow-l">
      <!-- <div class="heading"> -->
      <NuxtLink class="btn btn-text" :to="{ name: 'admin-categories-list' }">
        <Icon class="icon" name="mdi:arrow-left-thin" aria-hidden="true" focusable="false" />Categories
      </NuxtLink>
      <h1>Edit category</h1>
      <!-- </div> -->

      <form :class="{ submitted }" @submit.prevent="saveCategories" novalidate>
        <div class="form-errors | flow-2xs" v-if="appFormErrors.length">
          <p>Please correct the following errors</p>
        </div>
        <div class="api-errors | flow-2xs" v-if="appApiErrorMsgs.length">
          <ApiErrorMsgs />
          <div class="new-token | flow-2xs" v-if="apiErrorCode === 'EmailNotVerified'">
            <p>Please click this link to obatin a new registration token</p>
            <NuxtLink class="btn btn-text" :to="{ name: 'auth-refresh-token' }">Obtain new Token</NuxtLink>
          </div>
        </div>
        <div class="form-inner">
          <!-- <div class="left | flow-l">
            <ul class="flow-2xs" role="list">
              <li><a href="#details">Details</a></li>
              <li><a href="#price">Price</a></li>
              <li><a href="#product-categories">Categories</a></li>
              <li><a href="#image-gallery">Image Gallery</a></li>
              <li><a href="#shipping">Shipping Options</a></li>
              <li><a href="#taxes">Taxes</a></li>
              <li><a href="#cross-sells">Crosssells</a></li>
              <li><a href="#up-sells">Upsells</a></li>
              <li><a href="#seo">SEO</a></li>
              <li><a href="#misc">Misc</a></li>
            </ul>
          </div> -->
          <div class="middle | flow-xl">
            <AdminCategoryDetails v-model="formInputs" />
            <AdminImageGallery v-model="formInputs.gallery" />
          </div>
          <div class="right">
            <Icon class="icon" name="svg-spinners:270-ring" aria-hidden="true" focusable="false" v-if="loading" />
            <button class="btn btn-filled" v-else>Save Categories</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
