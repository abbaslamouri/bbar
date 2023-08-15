<script lang="ts" setup>
import { zodEmailSchema } from '~/server/utils/schemas/email'

// import { useToast } from 'vue-toastification'

const appErrorMsgs = useAppErrorMsgs()
const route = useRoute()

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

const resetPassword = async () => {
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

  const { data, pending, error, refresh } = await useFetch('auth/forgot-password', {
    baseURL: config.public.apiUrl,
    method: 'POST',
    body: { ...results.data, csrfToken: useNuxtApp().payload.csrfToken },
    headers: { ...useRequestHeaders(['cookie']), csrfToken: useNuxtApp().payload.csrfToken },
  })
  loading.value = false

  if (error.value) {
    if (error.value.data.data.errorCode === 'email_not_verified') appErrorMsgs.value = error.value.data.data.messages
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

  // if (error.value) {
  //   console.log(error.value.data.errorCode)
  //   if (error.value.data.data.errorCode === 'email_not_verified') return (emailNotVerified.value = true)
  //   else return (appErrorMsg.value = error.value.statusMessage || '')
  // }
  // return navigateTo({
  //   path: '/auth/forgotpassword',
  //   query: {
  //     success: 'true',
  //   },
  // })
  // setAuthUser(data.value as IAuthenticatedData)

  // useToast().success('Thank you for verifying your email')
  // return navigateTo({
  //   path: '/products',
  // })
}
</script>

<template>
  <div class="auth | flow-l">
    <div class="heading | flow-xs">
      <h1>Reset pasword</h1>
      <p>Please fill in the fields below</p>
    </div>
    <div class="success" v-if="route.query.success">
      <p>Please check your email for instructions to reset your passwpord</p>
    </div>
    <form :class="{ submitted }" @submit.prevent="resetPassword" novalidate>
      <div class="notice">
        <p>
          We will send you an email with a link to assist you with resetting your password. Check your spam folder for
          an email from: support@acs-parts.com.
        </p>
      </div>
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
        Signin
        <Spinner class="spinner" v-if="loading" />
      </button>
    </form>
    <div class="new-customer">
      <span class="">New customer? </span>
      <NuxtLink class="btn btn-text" :to="{ name: 'auth', query: { page: 'signup' } }"> Create an account </NuxtLink>
    </div>
  </div>
  <div class="content-wrapper">
    <article class="container-wrapper">
      <div class="container | flow">
        <div class="form auth">
          <form @submit.prevent="resetPassword" novalidate>
            <ErrorMsg />
            <div class="error-msg" v-if="true">
              <p>You have not verified your email</p>
              <div class="flex gap-s">
                <span class="">Clich here to get a new verification token </span>
                <button class="tn btn-accent btn-accent-text">Signin</button>
              </div>
            </div>
            <FormsBaseInput type="email" label="Email" id="email" v-model="formInputs.email" required />
            <button class="btn btn-primary">
              <span class="">Reset password</span>
              <Spinner class="spinner" v-if="loading" />
            </button>
          </form>
        </div>
      </div>
    </article>
  </div>
</template>

<style lang="scss" scoped>
// .notice {
//   font-size: var(--font-size-0);
//   box-shadow: var(--shadow-lg);
//   padding: var(--size-l);
//   min-width: var(--sizing-15);
//   max-width: var(--sizing-16);
//   background-color: var(--color-primary-99);
// }
</style>
