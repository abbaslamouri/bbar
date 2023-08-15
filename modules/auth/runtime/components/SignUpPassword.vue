<script lang="ts" setup>
import { zodSignupPasswordFormSchema } from '~/server/utils/schemas/auth'

const { appFormErrors, appApiErrorMsgs, parseAppZodErrors } = useAppErrors()
const config = useRuntimeConfig()

const submitted = ref<boolean>(false)
const loading = ref<boolean>(false)
const apiErrorCode = ref()
const registrationSuccess = ref(false)
const formInputs = ref({
  name: 'Abbas Lamouri',
  email: '',
  password: '@FooBar1234#',
})

onMounted(() => {
  appFormErrors.value = []
  appApiErrorMsgs.value = []
  formInputs.value.email = useRoute().query.email as string
})

const signup = async () => {
  appFormErrors.value = []
  appApiErrorMsgs.value = []
  apiErrorCode.value = ''
  submitted.value = true
  loading.value = true

  // Validate form inputs
  const parsedFormInputs = zodSignupPasswordFormSchema.safeParse(formInputs.value)
  if (!parsedFormInputs.success) {
    parseAppZodErrors(parsedFormInputs.error.issues)
    loading.value = false
    return
  }

  const { data, error } = await useFetch(`auth/signup-password`, {
    baseURL: config.public.apiUrl,
    method: 'POST',
    body: { ...parsedFormInputs.data },
  })
  loading.value = false

  if (error.value && error.value.data.data.errorCode !== 'emailDeliveryError') {
    console.log(error.value.data)
    apiErrorCode.value = error.value.data.data.errorCode
    appApiErrorMsgs.value = error.value.data.data.messages
  } else {
    console.log(data.value)
    registrationSuccess.value = true
  }
}
</script>

<template>
  <div class="signup">
    <div class="registration-success | flow-xs" v-if="registrationSuccess">
      <h1>Verify your email</h1>
      <p>We sent an email to {{ formInputs.email }}</p>
      <p>Click on the link in the email to get started.</p>
      <NuxtLink class="btn btn-text" :to="{ name: 'auth-refresh-token' }">Resend email</NuxtLink>
    </div>
    <div class="flow-l" v-else>
      <div class="heading | flow-xs">
        <h1>Create your account</h1>
        <p>
          Note that phone verification may be required for signup. Your number will only be used to verify your identity
          for security purposes.
        </p>
      </div>
      <form class="flow-2xs" :class="{ submitted }" @submit.prevent="signup" novalidate>
        <div class="form-errors | flow-2xs" v-if="appFormErrors.length">
          <p>Please correct the following errors</p>
        </div>
        <div class="api-errors | flow-2xs" v-if="appApiErrorMsgs.length">
          <ApiErrorMsgs />
          <div class="new-token | flow-2xs" v-if="apiErrorCode === 'EmailExistsButNotVerified'">
            <p>Please click this link to obatin a new registration token</p>
            <NuxtLink class="btn btn-text" :to="{ name: 'auth-refresh-token' }">Obtain new Token</NuxtLink>
          </div>
          <div class="new-token" v-if="apiErrorCode === 'DuplicateEmailError'">
            <NuxtLink class="btn btn-text" :to="{ name: 'auth-signin' }">Please Signin</NuxtLink>
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
          readonly
        />
        <FormsBaseInput
          type="text"
          label="Name"
          placeholder="Name"
          id="name"
          v-model="formInputs.name"
          :data-invalid="!!appFormErrors.find((e) => e.fieldName == 'name')"
          :errorMsg="appFormErrors.find((e) => e.fieldName == 'name')?.fieldErrorMsg"
          required
        />
        <FormsPasswordInput
          type="password"
          label="Passsword"
          placeholder="Password"
          id="password"
          v-model="formInputs.password"
          :showHint="true"
          :data-invalid="!!appFormErrors.find((e) => e.fieldName == 'password')"
          :errorMsg="appFormErrors.find((e) => e.fieldName == 'password')?.fieldErrorMsg"
          required
        />
        <button class="btn btn-filled">
          Sign up
          <Spinner class="spinner" v-if="loading" />
        </button>
        <div class="link">
          <span class="">Already have an account? </span>
          <NuxtLink class="btn btn-text" :to="{ name: 'auth-signin' }">Signin</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
