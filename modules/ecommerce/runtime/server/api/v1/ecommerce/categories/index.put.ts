import { isAuthorized } from '#auth'
import { ObjectId } from 'mongodb'
import slugify from 'slugify'
// import errorHandler from '~/utils/errorHandler'
import mongoClientPromise from '~/server/utils/mongoDbClient'

export default defineEventHandler(async (event) => {
  try {
    const authorized = isAuthorized(event, ['admin'])
    if (authorized instanceof Error) return errorHandler(event, authorized)
    const category = await readBody(event)
    console.log(category)

    category.slug = slugify(category.name, { lower: true })
    category.dateCreated = new Date()
    const galleryIds = []
    for (const image of category.gallery) {
      galleryIds.push(new ObjectId(image._id))
    }
    category.gallery = galleryIds
    const newId = new ObjectId(category._id)
    delete category._id
    delete category?.sessionToken
    delete category?.csrfToken

    const mongoDbClient = await mongoClientPromise
    return await mongoDbClient
      .db()
      .collection('categories')
      .updateOne({ _id: newId }, { $set: { ...category } })
  } catch (error) {
    return errorHandler(event, error)
  }
})
