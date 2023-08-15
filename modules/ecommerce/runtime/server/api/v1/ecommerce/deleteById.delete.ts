import { ObjectId } from 'mongodb'
import { isAuthorized } from '#auth'
import mongoClientPromise from '~/server/utils/mongoDbClient'

export default defineEventHandler(async (event) => {
  try {
    const authorized = isAuthorized(event, ['admin'])
    if (authorized instanceof Error) return errorHandler(event, authorized)
    const { resource, _id } = getQuery(event)
    const mongoDbClient = await mongoClientPromise
    const { deletedCount } = await mongoDbClient
      .db()
      .collection(resource as string)
      .deleteOne({ _id: new ObjectId(_id?.toString()) })
    if (deletedCount) return true
    return false
  } catch (error) {
    return errorHandler(event, error)
  }
})
