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
    const { cart } = await readBody(event)
    console.log(cart)
    // return 'LLLLLL'
    // return cart
    // return 'cart'
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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: cart.total,
      // amount: body.amount,
      currency: 'usd',
      payment_method_types: ['card'],
      // automatic_payment_methods: { enabled: true },
    })
    return { clientSecret: paymentIntent.client_secret, id: paymentIntent.id }
  } catch (err) {
    errorHandler(event, err)
  }
})
