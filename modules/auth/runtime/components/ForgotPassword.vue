<script lang="ts" setup>
// import { useToast } from 'vue-toastification'
import { zodForgotPasswordFormSchema } from '~/server/utils/schemas/auth'

const { appFormErrors, appApiErrorMsgs, parseAppZodErrors } = useAppErrors()
const config = useRuntimeConfig()

const passwordRecoverySent = ref(false)
const submitted = ref<boolean>(false)
const loading = ref<boolean>(false)
const apiErrorCode = ref()

const formInputs = ref({
  email: 'abbaslamouri@yrlus.com',
})

onMounted(() => {
  appFormErrors.value = []
  appApiErrorMsgs.value = []
})

const recoverPassword = async () => {
  appFormErrors.value = []
  appApiErrorMsgs.value = []
  apiErrorCode.value = ''
  submitted.value = true
  loading.value = true

  // Validate form inputs
  const parsedFormInputs = zodForgotPasswordFormSchema.safeParse(formInputs.value)
  if (!parsedFormInputs.success) {
    parseAppZodErrors(parsedFormInputs.error.issues)
    loading.value = false
    return
  }

  const { data, error } = await useFetch(`auth/forgot-password`, {
    baseURL: config.public.apiUrl,
    method: 'POST',
    body: { ...parsedFormInputs.data },
    params: { passwordResetToken: useRoute().query.passwordResetToken || '' },
  })
  loading.value = false

  if (error.value && error.value.data.data.errorCode !== 'emailDeliveryError') {
    console.log(error.value.data)
    apiErrorCode.value = error.value.data.data.errorCode
    appApiErrorMsgs.value = error.value.data.data.messages
  } else {
    console.log(data.value)
    passwordRecoverySent.value = true
  }
}
</script>

<template>
  <div class="forgot-password">
    <div class="password-recovery-sent | flow-l" v-if="passwordRecoverySent">
      <Icon class="icon" name="ri:mail-line" aria-hidden="true" focusable="false" />
      <h1>Check your email</h1>
      <p>Please check your email for instructions to reset your passwpord</p>
      <!-- <p>We've sent a link to reset your password, provided that email address exists.</p> -->
    </div>
    <div v-else>
      <div class="flow-l">
        <div class="heading | flow-xs">
          <h1>Reset your password</h1>
        </div>
        <p class="notice">
          Please enter your email address. We will send you an email with instructions to reset your [assword.
        </p>
        <form class="flow-2xs" :class="{ submitted }" @submit.prevent="recoverPassword" novalidate>
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
            required
          />
          <button class="btn btn-filled">
            Continue
            <Spinner class="spinner" v-if="loading" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
