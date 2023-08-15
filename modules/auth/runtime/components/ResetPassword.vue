<script lang="ts" setup>
// import { useToast } from 'vue-toastification'
import { zodResetPasswordFormSchema } from '~/server/utils/schemas/auth'

const { appFormErrors, appApiErrorMsgs, parseAppZodErrors } = useAppErrors()
const config = useRuntimeConfig()

const submitted = ref<boolean>(false)
const loading = ref<boolean>(false)
const apiErrorCode = ref()
const passwordResetSuccess = ref(false)
const formInputs = ref({
  // email: 'abbaslamouri@yrlus.com',
  password: '@FooBar1234#',
})

onMounted(() => {
  appFormErrors.value = []
  appApiErrorMsgs.value = []
})

const resetPassword = async () => {
  appFormErrors.value = []
  appApiErrorMsgs.value = []
  apiErrorCode.value = ''
  submitted.value = true
  loading.value = true

  // Validate form inputs
  const parsedFormInputs = zodResetPasswordFormSchema.safeParse(formInputs.value)
  if (!parsedFormInputs.success) {
    parseAppZodErrors(parsedFormInputs.error.issues)
    loading.value = false
    return
  }

  const { data, error } = await useFetch(`auth/reset-password`, {
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
    passwordResetSuccess.value = true
    // useToast().success('Password reset succesful')
    // return navigateTo({
    //   path: '/auth/signin',
    // })
  }
}
</script>

<template>
  <div class="reset-password">
    <div class="password-recovery-sent | flow-l" v-if="passwordResetSuccess">
      <Icon class="icon" name="ri:check-line" aria-hidden="true" focusable="false" />
      <h1>Password changed</h1>
      <p>Your password has been reset successfully.</p>
      <NuxtLink class="btn btn-filled" :to="{ name: 'auth-signin' }">Continue to login</NuxtLink>
    </div>
    <div class="flow-l" v-else>
      <div class="heading | flow-xs">
        <h1>Reset your password</h1>
      </div>
      <form class="flow-2xs" :class="{ submitted }" @submit.prevent="resetPassword" novalidate>
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
        <!-- <FormsBaseInput
          type="email"
          label="Email"
          placeholder="Email"
          id="email"
          v-model="formInputs.email"
          :data-invalid="!!appFormErrors.find((e) => e.fieldName == 'email')"
          :errorMsg="appFormErrors.find((e) => e.fieldName == 'email')?.fieldErrorMsg"
          required
        /> -->
        <FormsPasswordInput
          type="New password"
          label="New Passsword"
          placeholder="New Password"
          id="new-password"
          v-model="formInputs.password"
          :data-invalid="!!appFormErrors.find((e) => e.fieldName == 'password')"
          :errorMsg="appFormErrors.find((e) => e.fieldName == 'password')?.fieldErrorMsg"
          required
          :showHint="true"
        />
        <button class="btn btn-filled">
          Reset password
          <Spinner class="spinner" v-if="loading" />
        </button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
