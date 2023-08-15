<script lang="ts" setup>
import { signupFormSchema } from '~/server/schemas/auth'

const appErrorMsgs = useAppErrorMsgs()

const config = useRuntimeConfig()
const formInputs = reactive({
  name: 'Abbas Lamouri',
  email: 'abbaslamouri@yrlus.com',
  password: '@FooBar1234#',
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

const signup = async () => {
  appErrorMsgs.value = []
  formErrors.value = []
  submitted.value = true
  loading.value = true

  // Validate form inputs
  const results = signupFormSchema.safeParse(formInputs)
  if (!results.success) {
    loading.value = false
    for (const err of results.error.issues) {
      console.log(err)
      formErrors.value.push({ field: err.path[0] as string, message: err.message })
      appErrorMsgs.value.push(err.message)
    }
    return
  }

  const { data, pending, error, refresh } = await useFetch('auth/signup', {
    baseURL: config.public.apiUrl,
    method: 'POST',
    body: { ...results.data, csrfToken: useNuxtApp().payload.csrfToken },
    headers: { ...useRequestHeaders(['cookie']), csrfToken: useNuxtApp().payload.csrfToken },
  })
  loading.value = false

  if (error.value) {
    if (
      error.value.data.data.errorCode === 'not_unique' ||
      error.value.data.data.errorCode === 'properties_not_satisfied'
    )
      appErrorMsgs.value = error.value.data.data.messages
    else throw createError(error.value)
  } else {
    console.log(data.value)

    return navigateTo({
      path: '/auth',
      query: {
        page: 'signup-success',
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
    <form :class="{ submitted }" @submit.prevent="signup" novalidate>
      <div class="error-msg | flow-2xs" v-if="appErrorMsgs.length">
        <p>Please correct the following errors</p>
        <ErrorMsg />
      </div>
      <FormsBaseInput
        type="text"
        label="Name"
        id="name"
        v-model="formInputs.name"
        :data-invalid="checkFieldValidity('name')"
        :errorMsg="fetchFieldHint('name')"
        required
      />
      <FormsBaseInput
        type="email"
        label="Email"
        id="email"
        v-model="formInputs.email"
        :data-invalid="checkFieldValidity('email')"
        :errorMsg="fetchFieldHint('email')"
        required
      />
      <FormsPasswordInput
        type="password"
        label="Passsword"
        id="password"
        v-model="formInputs.password"
        action="signup"
        :data-invalid="checkFieldValidity('password')"
        :errorMsg="fetchFieldHint('password')"
        required
      />
      <button class="btn btn-filled">
        Create account
        <Spinner class="spinner" v-if="loading" />
      </button>
    </form>
    <div class="link">
      <span class="">Already have an account? </span>
      <NuxtLink class="btn btn-text" :to="{ name: 'auth', query: { page: 'signin' } }"> Signin </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
