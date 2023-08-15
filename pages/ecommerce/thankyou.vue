<script lang="ts" setup>
import omit from 'lodash.omit'
// import { storeToRefs } from 'pinia'
// import Stripe from 'stripe'
// import { useCartStore } from '~~/stores/useCartStorexxexx'
definePageMeta({
  title: 'users',
  description: 'ACS users',
  layout: 'checkout',
})

const route = useRoute()
console.log('RQ', route.query)
const { cart } = useCartStore()
const config = useRuntimeConfig()
const clientSecret = ref()
const buttonRef = ref()
const errorMsg = ref()

// console.log('CART ID', useCookie('cartId').value)

// const { data, error } = await useFetch('stripe/intent', {
//   method: 'POST',
//   body: { cartId: useCookie('cartId').value },
//   baseURL: config.apiUrl,
// })
// if (error.value) throw createError(error.value)
// clientSecret.value = data.value
// console.log('Client Secret', clientSecret.value)

onMounted(async () => {
  // if (route.query.redirect_status !== 'succeeded') return
  // const stripe = Stripe(config.stripePk)
  // console.log(stripe)
  // const { paymentIntent } = await stripe.retrievePaymentIntent(route.query.payment_intent_client_secret)
  // console.log('PI', paymentIntent)
  // const xx = await stripe.retrievePaymentIntent(route.query.payment_intent_client_secret)
  // console.log(xx)
  // const options = {
  //   clientSecret: clientSecret.value,
  //   layout: {
  //     type: 'accordion',
  //     defaultCollapsed: false,
  //   },
  //   // Fully customizable with appearance API.
  //   appearance: {
  //     theme: 'none',
  //     variables: {
  //       colorPrimary: 'blue',
  //       colorBackground: 'pink',
  //       colorText: 'green',
  //       colorDanger: '#df1b41',
  //       fontFamily: 'Ideal Sans, system-ui, sans-serif',
  //       spacingUnit: '5px',
  //       borderRadius: '4px',
  //     },
  //   },
  // }
  // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 3
  // const elements = stripe.elements(options)
  // // Create and mount the Payment Element
  // const paymentElement = elements.create('payment')
  // paymentElement.mount('#payment-element')
  // buttonRef.value.addEventListener('click', async (event) => {
  //   event.preventDefault()
  //   console.log('HELLO')
  //   const { error } = await stripe.confirmPayment({
  //     //`Elements` instance that was used to create the Payment Element
  //     elements,
  //     confirmParams: {
  //       return_url: 'http://localhost:3000/checkout/thankyou',
  //       // return_url: window.location.href.split('?')[0] + 'thankyou',
  //     },
  //   })
  //   if (error) {
  //     console.log(error.message)
  //     errorMsg.value = error.message
  //   } else {
  //     // Your customer will be redirected to your `return_url`. For some payment
  //     // methods like iDEAL, your customer will be redirected to an intermediate
  //     // site first to authorize the payment, then redirected to the `return_url`.
  //   }
  // })
})

const submitPayment = async () => {}
</script>

<template>
  <div class="p-l">
    <div class="container flow-l">
      <!-- <CheckoutProgress /> -->
      <h1>Success</h1>
      <pre id="payment-intent"></pre>
      <!-- <div class="" v-if="clientSecret">
        <form class="flow-s" id="payment-form">
          <div id="error-message" v-if="errorMsg">
            {{ errorMsg }}
          </div>
          <div id="payment-element"></div>
          <button class="btn btn-primary" id="submit" ref="buttonRef">Submit</button>
        </form>
      </div>

      <div v-else>
        <div class="spinner | place-center" ref="containerRef"><BaseSpinner /></div>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
