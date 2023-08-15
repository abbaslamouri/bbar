<script lang="ts" setup>
// import { useToast } from 'vue-toastification'
// import { emailSchema } from '~/server/schemas/email'
import { zodNewTokenFormSchema } from '~/server/utils/schemas/auth'
// import { emailSchema } from '~/server/schemas/email'

const { appFormErrors, appApiErrorMsgs, parseAppZodErrors } = useAppErrors()
const { authUser } = useAuthStore()
const { csrfToken, csrfFetch } = useCsrfStore()
const appErrorMsgs = useAppErrorMsgs()
const config = useRuntimeConfig()

const formInputs = reactive({
  // name: 'Abbas Lamouri',
  email: 'abbaslamouri@yrlus.com',
  // password: '@FooBar1234#',
})

const submitted = ref<boolean>(false)
const formErrors = ref<Array<{ field: string; message: string }>>([])
const loading = ref<boolean>(false)
const apiErrorCode = ref()

onMounted(() => {
  appFormErrors.value = []
  appApiErrorMsgs.value = []
})

// onMounted(() => {
//   appErrorMsgs.value = []
// })

const refreshToken = async () => {
  appErrorMsgs.value = []
  formErrors.value = []
  submitted.value = true
  loading.value = true

  // const parsedFormInputs = authFormSchema.safeParse(formInputs)

  const parsedFormInputs = zodNewTokenFormSchema.safeParse(formInputs)

  // Validate form inputs
  console.log(parsedFormInputs)
  if (!parsedFormInputs.success) {
    parseAppZodErrors(parsedFormInputs.error.issues)
    loading.value = false
    return
  }

  const { data, error } = await useFetch(`auth/signup-token`, {
    baseURL: config.public.apiUrl,
    method: 'POST',
    body: { ...parsedFormInputs.data },
  })
  loading.value = false

  if (error.value) {
    console.log(error.value.data)
    apiErrorCode.value = error.value.data.data.errorCode
    appApiErrorMsgs.value = error.value.data.data.messages

    // useToast().error(appErrorMsgs.value, { timeout: 10000 })
  } else {
    console.log(data.value)
  }

  // const { data, error } = await csrfFetch(
  //   `auth/${props.routePage}`,
  //   'POST',
  //   { ...(parsedFormInputs.data as typeof formInputs) },
  //   {
  //     signupToken: useRoute().query.signupToken || '',
  //     passwordResetToken: useRoute().query.passwordResetToken || '',
  //   }
  // )
  // const { data, pending, error, refresh } = await useFetch(`auth/${props.routePage}`, {
  //   baseURL: config.public.apiUrl,
  //   method: 'POST',
  //   body: { ...(parsedFormInputs.data as typeof formInputs), csrfToken: useNuxtApp().payload.csrfToken },
  //   params: {
  //     signupToken: useRoute().query.signupToken || '',
  //     passwordResetToken: useRoute().query.passwordResetToken || '',
  //   },
  //   headers: { ...useRequestHeaders(['cookie']), csrfToken: useNuxtApp().payload.csrfToken },
  // })
  loading.value = false
  // console.log(data.value)
  // console.log(error.value)

  // if (error.value && error.value.data.data.name !== 'SendgridError') {
  //   console.log(error.value?.data)
  //   apiErrorCode.value = error.value.data.data.errorCode
  //   const apiEerrorMsgs = error.value.data.data.messages
  //   appErrorMsgs.value = apiEerrorMsgs
  // }
}
</script>

<template>
  <div class="refresh-token">
    <div class="flow-l">
      <div class="heading | flow-xs">
        <h1>Refresh token</h1>
        <!-- <p>Please fill in the field(s) below</p> -->
      </div>
      <form class="flow-2xs" :class="{ submitted }" @submit.prevent="refreshToken" novalidate>
        <div class="error-msgs | flow-s" v-if="appErrorMsgs.length">
          <!-- <div class="flow-2xs"> -->
          <!-- <p>Please correct the following errors</p> -->
          <ApiErrorMsgs />
          <!-- </div> -->
          <!-- <div class="new-token | flow-2xs" v-if="apiErrorCode === 'EmailNotVerified'">
            <p>Please click this link to obatin a new registration token</p>
            <button @click.prevent="newToken" class="btn btn-text">Obtain new Token</button>
          </div> -->
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
          Send new token
          <Spinner class="spinner" v-if="loading" />
        </button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// .error-msgs {
//   font-size: var(--font-size--1);
//   p {
//     font-size: var(--font-size--1);
//   }
// }
// .forgot-password {
//   text-align: end;
// }
// .link {
//   font-size: var(--font-size--1);
//   display: flex;
//   gap: var(--space-xs);
// }
</style>
