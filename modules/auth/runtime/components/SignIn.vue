<script lang="ts" setup>
// import { useToast } from 'vue-toastification'
import { zodSigninFormSchema } from '~/server/utils/schemas/auth'
const { $toast } = useNuxtApp()

const { appFormErrors, appApiErrorMsgs, parseAppZodErrors } = useAppErrors()
const { authUser } = useAuthStore()
const config = useRuntimeConfig()
// const { toastMessage, showToastMessage } = useToast()

const submitted = ref<boolean>(false)
const loading = ref<boolean>(false)
const apiErrorCode = ref()
const formInputs = ref({
  email: 'abbaslamouri@yrlus.com',
  password: '@FooBar1234#',
})

onMounted(() => {
  appFormErrors.value = []
  appApiErrorMsgs.value = []
})

const signin = async () => {
  appFormErrors.value = []
  appApiErrorMsgs.value = []
  apiErrorCode.value = ''
  submitted.value = true
  loading.value = true

  // Validate form inputs
  const parsedFormInputs = zodSigninFormSchema.safeParse(formInputs.value)
  if (!parsedFormInputs.success) {
    parseAppZodErrors(parsedFormInputs.error.issues)
    loading.value = false
    return
  }
  const { data, error } = await useFetch(`auth/signin`, {
    baseURL: config.public.apiUrl,
    method: 'POST',
    body: { ...parsedFormInputs.data },
  })
  loading.value = false

  if (error.value) {
    console.log(error.value.data)
    apiErrorCode.value = error.value.data.data.errorCode
    appApiErrorMsgs.value = error.value.data.data.messages
  } else {
    console.log(data.value)
    $toast('You are logged in', { type: 'success' })

    // setTimeout(() => {
    //   $toast('You are logged out', {})
    // }, 1000)
    // toastMessage.value = 'You are logged in'
    // showToastMessage.value = true
    // useToast().success('You are logged in')
    authUser.value = {
      userName: (data.value as typeof authUser.value).userName,
      authenticated: (data.value as typeof authUser.value).authenticated,
      sessionId: (data.value as typeof authUser.value).sessionId,
    }
    return navigateTo({
      // path: '/admin',
    })
  }
}
</script>

<template>
  <div class="signin">
    <div class="flow-l">
      <h1>Welcome back</h1>
      <form class="flow-s" :class="{ submitted }" @submit.prevent="signin" novalidate>
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
        <FormsBaseInput
          type="email"
          label="Email"
          placeholder="Email"
          id="email"
          v-model="formInputs.email"
          :data-invalid="!!appFormErrors.find((e) => e.fieldName == 'email')"
          :errorMsg="appFormErrors.find((e) => e.fieldName == 'email')?.fieldErrorMsg"
          required
        />
        <FormsPasswordInput
          type="password"
          label="Passsword"
          placeholder="Password"
          id="password"
          v-model="formInputs.password"
          :data-invalid="!!appFormErrors.find((e) => e.fieldName == 'password')"
          :errorMsg="appFormErrors.find((e) => e.fieldName == 'password')?.fieldErrorMsg"
          required
        />
        <div class="">
          <NuxtLink class="btn btn-text" :to="{ name: 'auth-forgot-password' }">Forgot password?</NuxtLink>
        </div>
        <button class="btn btn-filled">
          Sign in
          <Spinner class="spinner" v-if="loading" />
        </button>
        <div class="link">
          <span class="">Don't have an account? </span>
          <NuxtLink class="btn btn-text" :to="{ name: 'auth-signup' }">Sign up</NuxtLink>
        </div>
      </form>
      <div class="divider"><span>OR</span></div>
      <div class="social-media-signup | flow-l">
        <button class="btn btn-outlined">
          <Icon class="" name="ri:google-fill" />
          <span> Continue with Google</span>
        </button>
        <button class="btn btn-outlined">
          <Icon class="" name="ri:google-fill" />
          <span> Continue with Microsoft</span>
        </button>
        <button class="btn btn-outlined">
          <Icon class="" name="ri:google-fill" />
          <span> Continue with Apple</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
