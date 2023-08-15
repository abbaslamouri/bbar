<script lang="ts" setup>
// import { useToast } from 'vue-toastification'
// import { emailSchema } from '~/server/schemas/email'
import {
  zodSignupFormSchema,
  zodSigninFormSchema,
  zodResetPasswordFormSchema,
  zodNewTokenFormSchema,
  zodForgotPasswordFormSchema,
} from '~/server/utils/schemas/auth'
// import { emailSchema } from '~/server/schemas/email'

const props = defineProps({
  routePage: {
    type: String,
    required: true,
  },
})

const { authUser } = useAuthStore()
const { csrfToken, csrfFetch } = useCsrfStore()
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
const apiErrorCode = ref()

onMounted(() => {
  appErrorMsgs.value = []
})

const formBtnLabel = computed(() => {
  switch (props.routePage) {
    case 'signup':
      return 'Create your account'

    case 'signup-token':
      return 'Obtain new token'

    case 'signin':
      return 'Sign in'

    case 'verify':
      return 'Verify your email'

    case 'forgot-password':
      return 'Recover password'

    case 'reset-password':
      return 'Reset password'

    default:
      return
  }
})

const checkFieldValidity = (fieldName: string) => {
  return !!formErrors.value.find((e) => e.field == fieldName)
}

const setFError = (fieldName: string) => {
  return formErrors.value.find((e) => e.field == fieldName)
    ? formErrors.value.find((e) => e.field == fieldName)?.message
    : ''
}

const doAuth = async () => {
  appErrorMsgs.value = []
  formErrors.value = []
  submitted.value = true
  loading.value = true

  // const results = authFormSchema.safeParse(formInputs)

  let results
  switch (props.routePage) {
    case 'signup':
      results = zodSignupFormSchema.safeParse(formInputs)
      break

    case 'signup-token':
      results = zodNewTokenFormSchema.safeParse(formInputs)
      break

    case 'signin':
      results = zodSigninFormSchema.safeParse(formInputs)
      break

    case 'verify':
      console.log(formInputs)
      results = zodSignupFormSchema.safeParse(formInputs)
      console.log(results)
      break

    case 'forgot-password':
      results = zodForgotPasswordFormSchema.safeParse(formInputs)
      break

    case 'reset-password':
      results = zodResetPasswordFormSchema.safeParse(formInputs)
      break

    default:
      return
  }

  // Validate form inputs
  console.log(results)
  if (!results.success) {
    for (const err of results.error.issues) {
      console.log(err)
      formErrors.value.push({ field: err.path[0] as string, message: err.message })
      appErrorMsgs.value.push(err.message)
    }
    console.log(formErrors.value)
    loading.value = false
    return
  }

  const { data, error } = await csrfFetch(
    `auth/${props.routePage}`,
    'POST',
    { ...(results.data as typeof formInputs) },
    {
      signupToken: useRoute().query.signupToken || '',
      passwordResetToken: useRoute().query.passwordResetToken || '',
    }
  )
  // const { data, pending, error, refresh } = await useFetch(`auth/${props.routePage}`, {
  //   baseURL: config.public.apiUrl,
  //   method: 'POST',
  //   body: { ...(results.data as typeof formInputs), csrfToken: useNuxtApp().payload.csrfToken },
  //   params: {
  //     signupToken: useRoute().query.signupToken || '',
  //     passwordResetToken: useRoute().query.passwordResetToken || '',
  //   },
  //   headers: { ...useRequestHeaders(['cookie']), csrfToken: useNuxtApp().payload.csrfToken },
  // })
  loading.value = false
  // console.log(data.value)
  // console.log(error.value)

  if (error.value && error.value.data.data.name !== 'SendgridError') {
    console.log(error.value?.data)
    apiErrorCode.value = error.value.data.data.errorCode
    const apiEerrorMsgs = error.value.data.data.messages
    appErrorMsgs.value = apiEerrorMsgs
  } else {
    console.log(data.value)
    switch (props.routePage) {
      case 'signup':
        return navigateTo({
          path: '/auth',
          query: {
            page: 'signup-request-sent',
          },
        })

      case 'verify':
        // useToast().success('Thank you for verifying your email')
        return navigateTo({
          path: '/auth',
          query: {
            page: 'signin',
          },
        })

      case 'signin':
        // useToast().success('You are logged in')
        authUser.value = {
          userName: (data.value as typeof authUser.value).userName,
          authenticated: (data.value as typeof authUser.value).authenticated,
          sessionToken: (data.value as typeof authUser.value).sessionToken,
        }
        return navigateTo({
          path: '/',
          query: {
            success: 'true',
          },
        })

      case 'forgot-password':
        return navigateTo({
          path: '/auth',
          query: {
            page: 'password-recovery-sent',
          },
        })

      case 'reset-password':
        // useToast().success('Password reset succesful')
        return navigateTo({
          path: '/auth',
          query: {
            page: 'signin',
          },
        })

      default:
        return
    }
  }
}

const newToken = () => {
  appErrorMsgs.value = []
  formErrors.value = []
  submitted.value = true
  // loading.value = true
  return navigateTo({
    path: '/auth',
    query: {
      page: 'signup-token',
    },
  })
}

const signin = () => {
  appErrorMsgs.value = []
  formErrors.value = []
  submitted.value = true
  // loading.value = true
  return navigateTo({
    path: '/auth',
    query: {
      page: 'signin',
    },
  })
}

const signup = () => {
  appErrorMsgs.value = []
  formErrors.value = []
  submitted.value = true
  // loading.value = true
  return navigateTo({
    path: '/auth',
    query: {
      page: 'signup',
    },
  })
}

const forgotPassword = () => {
  appErrorMsgs.value = []
  formErrors.value = []
  submitted.value = true
  // loading.value = true
  return navigateTo({
    path: '/auth',
    query: {
      page: 'forgot-password',
    },
  })
}
</script>

<template>
  <div class="auth">
    {{ authUser }}
    {{ csrfToken }}
    <SignupRequestSent v-if="routePage === 'signup-request-sent'" />
    <PasswordRecoverySent v-else-if="routePage === 'password-recovery-sent'" />
    <div class="flow-l" v-else>
      <div class="heading | flow-xs">
        <h1>{{ formBtnLabel }}</h1>
        <p>Please fill in the field(s) below</p>
      </div>
      <p class="notice" v-if="routePage === 'forgot-password'">
        We will send you an email with a link to assist you with resetting your password. Check your spam folder for an
        email from: support@morelamplight.com.
      </p>
      <form class="flow-2xs" :class="{ submitted }" @submit.prevent="doAuth" novalidate>
        <div class="error-msgs | flow-s" v-if="appErrorMsgs.length">
          <div class="flow-2xs">
            <p>Please correct the following errors</p>
            <ErrorMsg />
          </div>
          <div class="new-token | flow-2xs" v-if="apiErrorCode === 'EmailNotVerified'">
            <p>Please click this link to obatin a new registration token</p>
            <button @click.prevent="newToken" class="btn btn-text">Obtain new Token</button>
          </div>
        </div>
        <FormsBaseInput
          type="text"
          label="Name"
          placeholder="Name"
          id="name"
          v-model="formInputs.name"
          :data-invalid="checkFieldValidity('name')"
          :errorMsg="setFError('name')"
          required
          v-if="routePage === 'signup'"
        />
        <FormsBaseInput
          type="email"
          label="Email"
          placeholder="Email"
          id="email"
          v-model="formInputs.email"
          :data-invalid="checkFieldValidity('email')"
          :errorMsg="setFError('email')"
          required
          v-if="
            routePage === 'signup' ||
            routePage === 'signin' ||
            routePage === 'verify' ||
            routePage === 'forgot-password' ||
            routePage === 'reset-password' ||
            routePage === 'signup-token'
          "
        />
        <!-- <div> -->
        <FormsPasswordInput
          type="password"
          label="Passsword"
          placeholder="Password"
          id="password"
          v-model="formInputs.password"
          :data-invalid="checkFieldValidity('password')"
          :errorMsg="setFError('password')"
          required
          :action="routePage === 'signup' || routePage === 'reset-password' ? 'signup' : ''"
          v-if="routePage === 'signup' || routePage === 'signin' || routePage === 'reset-password'"
        />
        <div class="forgot-password" v-if="routePage === 'signin'">
          <button class="btn btn-text" @click.prevent="forgotPassword">Forgot password?</button>
        </div>
        <!-- </div> -->
        <button class="btn btn-filled">
          {{ formBtnLabel }}
          <Spinner class="spinner" v-if="loading" />
        </button>
        <div class="link" v-if="routePage === 'signup'">
          <span class="">Already have an account? </span>
          <button class="btn btn-text" @click.prevent="signin">Signin</button>
        </div>
        <div class="link" v-if="routePage === 'signin'">
          <span class="">New customer? </span>
          <button class="btn btn-text" @click.prevent="signup">Create an account</button>
        </div>
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
