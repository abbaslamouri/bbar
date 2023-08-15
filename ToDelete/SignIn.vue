<script lang="ts" setup>
// import { useToast } from 'vue-toastification'
import { signinFormSchema } from '~/server/schemas/auth'

const { authUser } = useAuthStore()
const appErrorMsgs = useAppErrorMsgs()
const config = useRuntimeConfig()

const formInputs = reactive({
  email: 'abbaslamouri@yrlus.com',
  password: '@FooBar1234#',
  rememberMe: false,
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

const signin = async () => {
  appErrorMsgs.value = []
  formErrors.value = []
  submitted.value = true
  loading.value = true

  // Validate form inputs
  const results = signinFormSchema.safeParse(formInputs)
  if (!results.success) {
    loading.value = false
    for (const err of results.error.issues) {
      console.log(err)
      formErrors.value.push({ field: err.path[0] as string, message: err.message })
      appErrorMsgs.value.push(err.message)
    }
    return
  }

  const { data, pending, error, refresh } = await useFetch('auth/signin', {
    baseURL: config.public.apiUrl,
    method: 'POST',
    body: { ...results.data, csrfToken: useNuxtApp().payload.csrfToken },
    headers: { ...useRequestHeaders(['cookie']), csrfToken: useNuxtApp().payload.csrfToken },
  })

  loading.value = false

  if (error.value) {
    const apiErrorCode = error.value.data?.data?.errorCode
    const apiEerrorMsgs = error.value.data?.data?.messages
    console.log(error.value.data)
    if (
      apiErrorCode === 'email_and_or_password_missing' ||
      apiErrorCode === 'invalid_email' ||
      apiErrorCode === 'invalid_password' ||
      apiErrorCode === 'email_not_verified'
    )
      return (appErrorMsgs.value = apiEerrorMsgs)
    else throw createError(error.value)
  }

  console.log(data.value)

  authUser.value = {
    userName: (data.value as typeof authUser.value).userName,
    authenticated: (data.value as typeof authUser.value).authenticated,
  }

  // useToast().success('You are logged in')

  return navigateTo({
    path: '/',
    query: {
      // success: 'true',
    },
  })
}

const forgotPassword = async () => {
  await navigateTo({ path: '/auth/forgotpassword', query: {} })
}
</script>

<template>
  <div class="auth | flow-l">
    <div class="heading | flow-xs">
      <h1>Signin</h1>
      <p>Please fill in the fields below</p>
    </div>
    <form :class="{ submitted }" @submit.prevent="signin" novalidate>
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
      <div>
        <FormsPasswordInput
          type="password"
          label="Passsword"
          id="password"
          v-model="formInputs.password"
          :data-invalid="checkFieldValidity('password')"
          :errorMsg="fetchFieldHint('password')"
          required
        />
        <div class="forgot-password">
          <NuxtLink class="btn btn-text" :to="{ name: 'auth', query: { page: 'forgot-password' } }">
            Forgot password?
          </NuxtLink>
        </div>
      </div>

      <!-- <FormsBaseCheckbox id="remember-me" label="Remmeber me" v-model="formInputs.rememberMe" /> -->

      <button class="btn btn-filled">
        Signin
        <Spinner class="spinner" v-if="loading" />
      </button>
    </form>
    <div class="new-customer">
      <span class="">New customer? </span>
      <NuxtLink class="btn btn-text" :to="{ name: 'auth', query: { page: 'signup' } }"> Create an account </NuxtLink>
    </div>
  </div>
  <!-- =========== -->
  <!-- <div class="">
    <div class="form auth">
      <form class="" @submit.prevent="signin" novalidate>
        <ErrorMsg />
        <FormsBaseInput type="email" label="Email" id="email" v-model="formInputs.email" required />
        <FormsPasswordInput type="password" label="Passsword" id="password" required v-model="formInputs.password" />
        <div class="">
          <button class="btn btn-accent btn-accent-text" @click.prevent="forgotPassword">Forgot password?</button>
        </div>
        <button class="btn btn-primary">
          <span class="">Signin</span>
          <Spinner class="spinner" v-if="loading" />
        </button>
        <div class="link"></div>
      </form>
    </div>
  </div> -->
</template>

<style labg="scss" scoped>
.forgot-password {
  text-align: end;
}

.new-customer {
  font-size: var(--font-size--1);
  display: flex;
  gap: var(--space-xs);
}
</style>
