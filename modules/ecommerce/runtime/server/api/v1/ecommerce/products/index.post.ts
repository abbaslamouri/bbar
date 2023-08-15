import { ObjectId } from 'mongodb'
import { isAuthorized } from '#auth'
import mongoClientPromise from '~/server/utils/mongoDbClient'

export default defineEventHandler(async (event) => {
  try {
    const authorized = isAuthorized(event, ['admin'])
    if (authorized instanceof Error) return errorHandler(event, authorized)
    const product = await readBody(event)
    // console.log(new Date(product.dateCreated))
    product.dateCreated = new Date(product.dateCreated)
    product.salePriceStartDate = new Date(product.salePriceStartDate)
    product.salePriceEndDate = new Date(product.salePriceEndDate)

    const galleryIds = []
    for (const image of product.gallery) {
      galleryIds.push(new ObjectId(image._id))
    }
    product.gallery = galleryIds
    delete product?.sessionId

    const mongoDbClient = await mongoClientPromise
    return await mongoDbClient
      .db()
      .collection('products')
      .insertOne({ ...product })
  } catch (error) {
    return errorHandler(event, error)
  }
})
