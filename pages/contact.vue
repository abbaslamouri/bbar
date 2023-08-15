<script setup lang="ts">
import { contactFormSchema } from '~/server/utils/schemas/contactForm'
// import { useToast } from 'vue-toastification'
// import useSendMail from '~~/modules/nuxt-mailer/runtime/composables'

// const { appErrorMsg, resetForm, parseZodError } = useErrorStore()
const appErrorMsg = useAppErrorMsgs()
const config = useRuntimeConfig()

const formInputs = reactive({
  name: 'Abbas Lamouri',
  email: 'abbaslamouri@yrlus.com',
  subject: 'Text from contact page',
  message: 'This is the message text',
})

// type ErrorType={
//   name: string,
//   message:string
// }
// const errorMessages = ref<Array<string>>([])
// const errorFields = ref<Array<string>>([])
const submitted = ref<boolean>(false)
const formErrors = ref<Array<{ field: string; message: string }>>([])
const loading = ref<boolean>(false)
// const errorMsg = ref('')

// console.log(useSendMail(['abbaslamouri@yrlus.com'], 'hhjjkkklllll'))

const checkFieldValidity = (fieldName: string) => {
  return formErrors.value.find((e) => e.field == fieldName)
}

const fetchFieldHint = (fieldName: string) => {
  return formErrors.value.find((e) => e.field == fieldName)
    ? formErrors.value.find((e) => e.field == fieldName)?.message
    : ''
}

const sendMessage = async () => {
  submitted.value = true
  loading.value = true
  // console.log(config)
  // const form = document.querySelector('form')

  // Initialize error message, reset form errors & loading
  // appErrorMsg.value = ''
  // resetForm(form!)

  // Validate form inputs
  const results = contactFormSchema.safeParse(formInputs)
  if (!results.success) {
    loading.value = false
    for (const err of results.error.issues) {
      console.log(err)
      // errorFields.value.push(err.path[0] as string)
      // errorMessages.value.push(err.message)
      formErrors.value.push({ field: err.path[0] as string, message: err.message })
    }
    return
  }

  const { data, pending, error, refresh } = await useFetch('/api/v1/mailer/sendMail', {
    baseURL: config.public.apiUrl,
    method: 'POST',
    body: { ...formInputs },
  })
  console.log(data.value)
  if (error.value) {
    // console.log(error.value.data.statusCode)
    appErrorMsg.value = error.value.data.message
    throw createError({ statusCode: 404, statusMessage: error.value.data.message })
    // throw createError({ statusCode: error.value.data.statusCode, statusMessage: error.value.data.message })
  }
  // useSendMail()

  // const { data, error } = await useFetch('/api/mailer/sendmail', {
  //   method: 'POST',
  //   body: { ...formInputs },
  // })
  loading.value = false
  // if (error.value) {
  //   console.log(error.value.data)
  //   return (appErrorMsg.value = error.value.statusMessage || '')
  // }
  // if (data.value && data.value.statusCode === 202)
  //   useToast().success(config.public.mailer.emailSentMessage, { timeout: 5000 })
}
</script>

<template>
  <div class="contact-us">
    <!-- {{ errorMessages }}
    {{ errorFields }} -->
    {{ formErrors }}

    <!-- <Hero class="hero" bgImage="/assets/home-page-hero.jpg">
      <template #heading>
        <h1>Contact</h1>
      </template>
    </Hero> -->
    <!-- <article class="container-wrapper"> -->
    <div class="container | flow">
      <div class="form-wrapper">
        <form :class="{ submitted }" @submit.prevent="sendMessage" novalidate>
          <!-- <p class="form-error">{{ errorMsg }}</p> -->

          <ErrorMsg />
          <FormsBaseInput
            type="text"
            label="Name"
            id="name"
            v-model="formInputs.name"
            required
            :invalid="checkFieldValidity('name')"
            :hint="fetchFieldHint('name')"
          />
          <FormsBaseInput
            type="email"
            label="Email"
            id="email"
            v-model="formInputs.email"
            required
            :invalid="checkFieldValidity('email')"
            :hint="fetchFieldHint('email')"
          />
          <FormsBaseInput
            type="text"
            label="Subject"
            id="subject"
            v-model="formInputs.subject"
            :invalid="checkFieldValidity('subject')"
            :hint="fetchFieldHint('subject')"
          />
          <FormsBaseTextarea
            label="Mesage"
            id="message"
            placeholder="enter your messsage"
            v-model="formInputs.message"
            rows="5"
            required
            :invalid="checkFieldValidity('message')"
            :hint="fetchFieldHint('message')"
          />
          <button class="btn btn-filled">
            <span class="">Send</span>
            <Spinner class="" v-if="loading" />
          </button>
        </form>
      </div>
    </div>
    <!-- </article> -->
  </div>
</template>

<style lang="scss" scoped>
.form-wrapper {
  max-width: var(--size-12xl);
  margin-inline: auto;
  /* border: 1px solid red; */
  box-shadow: var(--shadow-3);
  background-color: var(--card-bg);
  padding: var(--size-3xl);
}
</style>
