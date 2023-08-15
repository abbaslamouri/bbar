// import errorHandler from '~/utils/errorHandler'
// import AppError from '~/utils/AppError'
// import { setAuthCookie, findById } from '~/server/controllers/v1/auth'
import Stripe from 'stripe'
// import { mongoClient, ObjectId } from '~/utils/mongoClient'

import { parseCookies, setCookie } from 'h3'

const config = useRuntimeConfig()
const stripe = new Stripe(config.stripeSk, { apiVersion: '2022-11-15' })

export default defineEventHandler(async (event) => {
  try {
    console.log('Hello')
    console.log(await readBody(event))

    return 'Hello'
    // Set your secret key. Remember to switch to your live secret key in production.
    // See your keys here: https://dashboard.stripe.com/apikeys

    // const body = await readBody(event)
    // return 'body'
    // console.log('E', event.context.cartSession)
    // return event.context.cartSession

    // console.log('YYYYY', body)

    // const order = await mongoClient
    //   .db()
    //   .collection('orders')
    //   .findOne({
    //     _id: new ObjectId(body.cartId),
    //   })
    // if (!order) throw new AppError('We are not able to find your cart.', 'cart_not_found', 404)
    // if (!event.context.cartSession || !event.context.cartSession.cart) return ''

    // const { cart } = event.context.cartSession
    // console.log('ORDER', cart)

    // const { client_secret } = await stripe.paymentIntents.create({
    //   amount: cart.total,
    //   // amount: body.amount,
    //   currency: 'usd',
    //   automatic_payment_methods: { enabled: true },
    // })
    // return client_secret
  } catch (err) {
    errorHandler(event, err)
  }
})

// // This is your Stripe CLI webhook secret for testing your endpoint locally.
// const endpointSecret = "";

// app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
//   const sig = request.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntentSucceeded = event.data.object;
//       // Then define and call a function to handle the event payment_intent.succeeded
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });
