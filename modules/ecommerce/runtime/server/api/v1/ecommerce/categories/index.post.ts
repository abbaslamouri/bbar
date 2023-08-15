// import { fetchProducts } from '#commerce'
// import { productRepository, EntityId } from '~/server/redisSchemas/product'
// import { fetchAllProducts } from '#commerce'
// import AppError from '~/utils/AppError'
// import { protect } from '#auth'
// import errorHandler from '~/utils/errorHandler'
import mongoClientPromise from '~/server/utils/mongoDbClient'
import slugify from 'slugify'
// import { aggregateFetch } from '~/server/controllers/v1/factory'

// export default defineEventHandler(async (event) => {
//   // try {
//   //   return await fetchAllProducts(event)
//   // } catch (err) {
//   //   return errorHandler(event, err)
//   // }
// })
import { readFiles } from 'h3-formidable'
import fs from 'fs'
import path from 'path'
import { isAuthorized } from '#auth'
import { ObjectId } from 'mongodb'
// import slugify from 'slugify'
// import errorHandler from '~/utils/errorHandler'

// import mongoClientPromise from '~/server/utils/mongoDbClient'

export default defineEventHandler(async (event) => {
  try {
    const authorized = isAuthorized(event, ['admin'])
    if (authorized instanceof Error) return errorHandler(event, authorized)
    const category = await readBody(event)
    category.slug = slugify(category.name, { lower: true })
    category.dateCreated = new Date()
    const galleryIds = []
    for (const image of category.gallery) {
      galleryIds.push(new ObjectId(image._id))
    }
    category.gallery = galleryIds
    delete category?.sessionToken
    delete category?.csrfToken

    const mongoDbClient = await mongoClientPromise
    return await mongoDbClient
      .db()
      .collection('categories')
      .insertOne({ ...category })
  } catch (error) {
    return errorHandler(event, error)
  }
})
