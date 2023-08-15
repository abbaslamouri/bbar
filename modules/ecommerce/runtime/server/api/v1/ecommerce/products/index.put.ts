import { isAuthorized } from '#auth'
import { ObjectId } from 'mongodb'
import slugify from 'slugify'
// import errorHandler from '~/utils/errorHandler'
import mongoClientPromise from '~/server/utils/mongoDbClient'

export default defineEventHandler(async (event) => {
  try {
    const authorized = isAuthorized(event, ['admin'])
    if (authorized instanceof Error) return errorHandler(event, authorized)
    const product = await readBody(event)

    product.dateCreated = new Date(product.dateCreated)
    product.salePriceStartDate = new Date(product.salePriceStartDate)
    product.salePriceEndDate = new Date(product.salePriceEndDate)

    // product.slug = slugify(product.name, { lower: true })
    // product.dateCreated = new Date()
    const galleryIds = []
    for (const image of product.gallery) {
      galleryIds.push(new ObjectId(image._id))
    }
    product.gallery = galleryIds
    const newId = new ObjectId(product._id)
    delete product._id
    delete product?.sessionToken

    const mongoDbClient = await mongoClientPromise
    return await mongoDbClient
      .db()
      .collection('products')
      .updateOne({ _id: newId }, { $set: { ...product } })
  } catch (error) {
    return errorHandler(event, error)
  }
})
