<script lang="ts" setup>
// import { useToast } from 'vue-toastification'
import { zodEmailSchema } from '~/server/utils/schemas/email'

const route = useRoute()

const appErrorMsgs = useAppErrorMsgs()

const config = useRuntimeConfig()
const formInputs = reactive({
  email: 'abbaslamouri@yrlus.com',
})

const submitted = ref<boolean>(false)
const formErrors = ref<Array<{ field: string; message: string }>>([])
const loading = ref<boolean>(false)

const checkFieldValidity = (fieldName: string) => {
  return !!formErrors.value.find((e) => e.field == fieldName)
}

const fetchFieldHint = (fieldName: string) => {
  return formErrors.value.find((e) => e.field == fieldName)
    ? formErrors.value.find((e) => e.field == fieldName)?.message
    : ''
}

const verify = async () => {
  appErrorMsgs.value = []
  formErrors.value = []
  submitted.value = true
  loading.value = true

  // Validate form inputs
  const results = zodEmailSchema.safeParse(formInputs)
  if (!results.success) {
    loading.value = false
    for (const err of results.error.issues) {
      console.log(err)
      formErrors.value.push({ field: err.path[0] as string, message: err.message })
      appErrorMsgs.value.push(err.message)
    }
    return
  }

  const { data, pending, error, refresh } = await useFetch('auth/verify', {
    baseURL: config.public.apiUrl,
    method: 'POST',
    body: { ...results.data, csrfToken: useNuxtApp().payload.csrfToken },
    params: { signupToken: route.query.signupToken },
    headers: { ...useRequestHeaders(['cookie']), csrfToken: useNuxtApp().payload.csrfToken },
  })

  loading.value = false

  if (error.value) {
    const apiErrorCode = error.value.data?.data?.errorCode
    const apiEerrorMsgs = error.value.data?.data?.messages
    console.log(error.value.data)
    if (apiErrorCode === 'not_unique' || apiErrorCode === 'properties_not_satisfied') appErrorMsgs.value = apiEerrorMsgs
    else throw createError(error.value)
  } else {
    console.log(data.value)

    // useToast().success('Thank you for verifying your email')

    return navigateTo({
      path: '/auth',
      query: {
        page: 'signin',
      },
    })
  }
}
</script>

<template>
  <div class="auth | flow-l">
    <div class="heading">
      <h1>Create your account</h1>
      <p>Please fill in the fields below</p>
    </div>
    <form :class="{ submitted }" @submit.prevent="verify" novalidate>
      <div class="error-msg | flow-2xs" v-if="appErrorMsgs.length">
        <p>Please correct the following errors</p>
        <ErrorMsg />
      </div>
      <FormsBaseInput
        type="email"
        label="Email"
        id="email"
        v-model="formInputs.email"
        :data-invalid="checkFieldValidity('email')"
        :errorMsg="fetchFieldHint('email')"
        required
      />

      <button class="btn btn-filled">
        Verify your email
        <Spinner class="spinner" v-if="loading" />
      </button>
    </form>
  </div>
</template>

<style labg="scss" scoped></style>
