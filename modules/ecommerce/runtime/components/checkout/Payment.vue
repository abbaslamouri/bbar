<script lang="ts" setup>
import { shouldUseClientDB } from '@nuxt/content/dist/runtime/composables/utils'

// import omit from 'lodash.omit'
// import { storeToRefs } from 'pinia'
// import { useCartStore } from '~~/stores/useCartStorexxexx'
// definePageMeta({
//   title: 'users',
//   description: 'ACS users',
//   layout: 'payment',
// })

const route = useRoute()
const { cart } = useCartStore()
const config = useRuntimeConfig()
const clientSecret = ref()
const formRef = ref()
const errorMsg = ref()
const elements = ref()
const cardElement = ref()
const cardNumberElement = ref()
const cardExpiryElement = ref()
const cardCvcElement = ref()
const stripe = ref()

// console.log('CART', cart.value)

const { data, error } = await useFetch('ecommerce/stripe/intent', {
  baseURL: config.public.apiUrl,
  method: 'POST',
  body: { cart: cart.value },
})
if (error.value) console.log('E', error.value)
console.log('D', data.value)
clientSecret.value = data.value.clientSecret
console.log('Client Secret', clientSecret.value)

const appearance = {
  theme: 'flat',
  variables: { colorPrimaryText: '#262626' },
}

const options = {
  // classes: {hello};
  business: {
    name: 'RocketRides',
  },
  layout: {
    type: 'auto',
    // defaultCollapsed: false,
    // radios: true,
    // spacedAccordionItems: false,
  },
  // appearance: {
  // theme: 'none',
  // variables: {
  //   colorPrimary: '#001a47',
  //   colorBackground: '#dbe4ff',
  //   colorText: '#001a47',
  //   colorDanger: '#ba1a1a',
  //   fontFamily: 'proxima-nova, system-ui, sans-serif',
  // spacingUnit: '20px',
  //   borderRadius: '5px',
  // spacingTab: '45px',
  // spacingGridColumn: '45px',
  //   spacingGridRow: '45px',
  // },
  // },
}

const submitPayment = async () => {
  console.log('PPPPPPPP')
  const payment = await stripe.value.confirmCardPayment(clientSecret.value, {
    payment_method: {
      card: cardNumberElement.value,
      billing_details: {
        name: 'Abbas Lamouri',
      },
    },
  })
  console.log('P', payment)
  if (payment.error) {
    console.log(payment.error.message)
    // errorMsg.value = error.message
  } else {
    // Your customer will be redirected to your `return_url`. For some payment
    // methods like iDEAL, your customer will be redirected to an intermediate
    // site first to authorize the payment, then redirected to the `return_url`.
  }
}

onMounted(async () => {
  stripe.value = Stripe(config.public.stripePk)
  elements.value = stripe.value.elements()
  // const paymentElement = elements.value.create('payment', options)
  // paymentElement.mount('#payment-element')

  cardNumberElement.value = elements.value.create('cardNumber', {
    // placeholder: 'number',
    showIcon: true,
    iconStyle: 'solid',

    style: {
      empty: {
        color: 'red',
        iconColor: 'red',
        // backgroundColor: 'red',
        //   // padding: '20px',
        //   iconColor: '#F99A52',
      },
      base: {
        color: 'green',
        iconColor: 'red',
        // backgroundColor: 'red',
        //   // padding: '20px',
        //   iconColor: '#F99A52',
      },
    },
  })
  cardNumberElement.value.mount('#card-number')

  cardExpiryElement.value = elements.value.create('cardExpiry', {})
  cardExpiryElement.value.mount('#card-expiry')

  cardCvcElement.value = elements.value.create('cardCvc', {})
  cardCvcElement.value.mount('#card-cvc')

  // const stripe = Stripe(config.public.stripePk)
  // console.log('SSSS', stripe)
  // if (!clientSecret.value) return
  // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 3
  // const elements = stripe.elements(options)
  // // Create and mount the Payment Element
  // const paymentElement = elements.create('payment')
  // paymentElement.mount('#payment-element')
})
</script>

<template>
  <div class="">
    <form class="form" id="" ref="formRef" @submit.prevent="submitPayment()">
      <FormsBaseInput type="text" label="email" />
      <!-- <div id="error-message" v-if="errorMsg">
        {{ errorMsg }}
      </div> -->
      <div id="card-number" class="stripe-element"></div>
      <div id="card-expiry" class="stripe-element"></div>
      <div id="card-cvc" class="stripe-element"></div>
      <!-- <div id="card"></div -->
      <!-- <div id="card"></div> -->
      <!-- <div id="cardExpiry"></div> -->
      <button class="btn btn-filled" id="submit">Submit</button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.stripe-element {
  // border: 1px solid var(--on-bg);
  border-radius: var(--size-3xs);
  padding: var(--size-s);
  box-shadow: var(--shadow-3);
  background-color: var(--card-bg);
  //   padding: 1rem;
  //   border: 1px solid green;
  //   input {
  //     padding: 1rem !important;
  //   }
}
</style>
