import { isAuthorized } from '#auth'
import { ObjectId } from 'mongodb'
import slugify from 'slugify'
// import errorHandler from '~/utils/errorHandler'
import mongoClientPromise from '~/server/utils/mongoDbClient'

export default defineEventHandler(async (event) => {
  try {
    const authorized = isAuthorized(event, ['admin'])
    if (authorized instanceof Error) return errorHandler(event, authorized)
    const body = await readBody(event)
    // return body
    const { resource } = getQuery(event)

    const newId = new ObjectId(event.context.params?._id)
    delete body?.sessionId
    delete body?._id
    delete body?.dateCreated

    const mongoDbClient = await mongoClientPromise
    return await mongoDbClient
      .db()
      .collection(resource as string)
      .updateOne({ _id: newId }, { $set: { ...body } })
  } catch (error) {
    return errorHandler(event, error)
  }
})
