import bcrypt from 'bcryptjs'
import { updateCartSession } from '#ecommerce'
// import AppError from '~/utils/AppError'
// import errorHandler from '~/utils/errorHandler'

export default defineEventHandler(async (event) => {
  try {
    const cart = await readBody(event)
    // if (!cart.items.length) throw new AppError('There are no items in your cart', 'no_items_in_cart', 400)
    return await updateCartSession(event, cart)
  } catch (err) {
    return errorHandler(event, err)
  }
})
