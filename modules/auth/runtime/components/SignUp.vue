<script lang="ts" setup>
import { zodSignupFormSchema } from '~/server/utils/schemas/auth'

const { appFormErrors, appApiErrorMsgs, parseAppZodErrors } = useAppErrors()
const config = useRuntimeConfig()

const submitted = ref<boolean>(false)
const loading = ref<boolean>(false)
const apiErrorCode = ref()
const registrationSuccess = ref(false)
const formInputs = ref({
  // name: 'Abbas Lamouri',
  email: 'abbaslamouri@yrlus.com',
  // password: '@FooBar1234#',
})

onMounted(() => {
  appFormErrors.value = []
  appApiErrorMsgs.value = []
})

const signup = async () => {
  appFormErrors.value = []
  appApiErrorMsgs.value = []
  apiErrorCode.value = ''
  submitted.value = true
  loading.value = true

  // Validate form inputs
  const parsedFormInputs = zodSignupFormSchema.safeParse(formInputs.value)
  if (!parsedFormInputs.success) {
    parseAppZodErrors(parsedFormInputs.error.issues)
    loading.value = false
    return
  }

  const { data, error } = await useFetch(`auth/signup`, {
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
    return navigateTo({
      path: '/auth/signup/password',
      query: {
        email: parsedFormInputs.data.email,
      },
    })
  }
}
</script>

<template>
  <div class="signup">
    <div class="flow-l">
      <div class="heading | flow-xs">
        <h1>Create your account</h1>
      </div>
      <p>
        Note that phone verification may be required for signup. Your number will only be used to verify your identity
        for security purposes.
      </p>
      <div class="api-errors | flow-2xs" v-if="appApiErrorMsgs.length">
        <ApiErrorMsgs />
        <div class="new-token | flow-2xs" v-if="apiErrorCode === 'EmailExistsButNotVerified'">
          <!-- <p>Please click this link to get a new registration token</p> -->
          <NuxtLink class="btn btn-text" :to="{ name: 'auth-refresh-token' }">Get new registration token</NuxtLink>
        </div>
        <div class="new-token" v-if="apiErrorCode === 'DuplicateEmailError'">
          <NuxtLink class="btn btn-text" :to="{ name: 'auth-signin' }">Please Signin</NuxtLink>
        </div>
      </div>
      <form class="flow-2xs" :class="{ submitted }" @submit.prevent="signup" novalidate>
        <div class="form-errors | flow-2xs" v-if="appFormErrors.length">
          <p>Please correct the following errors</p>
        </div>

        <!-- <FormsBaseInput
          type="text"
          label="Name"
          placeholder="Name"
          id="name"
          v-model="formInputs.name"
          :data-invalid="!!appFormErrors.find((e) => e.fieldName == 'name')"
          :errorMsg="appFormErrors.find((e) => e.fieldName == 'name')?.fieldErrorMsg"
          required
        /> -->
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
        <!-- <div> -->
        <!-- <FormsPasswordInput
          type="password"
          label="Passsword"
          placeholder="Password"
          id="password"
          v-model="formInputs.password"
          :showHint="true"
          :data-invalid="!!appFormErrors.find((e) => e.fieldName == 'password')"
          :errorMsg="appFormErrors.find((e) => e.fieldName == 'password')?.fieldErrorMsg"
          required
        /> -->
        <button class="btn btn-filled">
          Continue
          <Spinner class="spinner" v-if="loading" />
        </button>
        <div class="link">
          <span class="">Already have an account? </span>
          <NuxtLink class="btn btn-text" :to="{ name: 'auth-signin' }">Signin</NuxtLink>
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
