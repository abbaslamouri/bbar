<script lang="ts" setup>
// import { useToast } from 'vue-toastification'
import { zodNewTokenFormSchema } from '~/server/utils/schemas/auth'

const { appFormErrors, appApiErrorMsgs, parseAppZodErrors } = useAppErrors()
const config = useRuntimeConfig()

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

const verifyEmail = async () => {
  appFormErrors.value = []
  appApiErrorMsgs.value = []
  apiErrorCode.value = ''
  submitted.value = true
  loading.value = true

  // Validate form inputs
  const parsedFormInputs = zodNewTokenFormSchema.safeParse(formInputs.value)
  if (!parsedFormInputs.success) {
    parseAppZodErrors(parsedFormInputs.error.issues)
    loading.value = false
    return
  }
  const { data, error } = await useFetch(`auth/verify-email`, {
    baseURL: config.public.apiUrl,
    method: 'POST',
    body: { ...parsedFormInputs.data },
    params: {
      signupToken: useRoute().query.signupToken || '',
    },
  })
  loading.value = false

  if (error.value && error.value.data.data.errorCode !== 'emailDeliveryError') {
    console.log(error.value.data)
    apiErrorCode.value = error.value.data.data.errorCode
    appApiErrorMsgs.value = error.value.data.data.messages
  } else {
    console.log(data.value)
    // useToast().success('Thank you for verifying your email')
    return navigateTo({
      path: '/auth/signin',
    })
  }
}
</script>

<template>
  <div class="verify-email">
    <div class="flow-l">
      <div class="heading | flow-xs">
        <h1>Verify your email</h1>
      </div>
      <form class="flow-2xs" :class="{ submitted }" @submit.prevent="verifyEmail" novalidate>
        <div class="form-errors | flow-2xs" v-if="appFormErrors.length">
          <p>Please correct the following errors</p>
        </div>
        <div class="api-errors | flow-2xs" v-if="appApiErrorMsgs.length">
          <ApiErrorMsgs />
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
          Verify your email
          <Spinner class="spinner" v-if="loading" />
        </button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
