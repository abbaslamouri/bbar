import { ObjectId } from 'mongodb'
import { ResourceMissingError, ContextParamsIdMissing } from '~/server/utils/errorCodes'
import mongoClientPromise from '~/server/utils/mongoDbClient'

export default defineEventHandler(async (event) => {
  try {
    const { resource, lookup } = getQuery(event)

    if (!resource) throw new AppError(ResourceMissingError)
    if (!event.context.params?._id) throw new AppError(ContextParamsIdMissing)

    const pipeline = []

    // Match stage
    pipeline.push({ $match: { _id: new ObjectId(event.context.params?._id) } })

    // populate stage
    if (lookup) {
      pipeline.push({
        $lookup: JSON.parse(lookup as string),
      })
    }

    const mongoDbClient = await mongoClientPromise
    const cursor = mongoDbClient
      .db()
      .collection(resource as string)
      .aggregate(pipeline)
    const docs = await cursor.toArray()
    if (!docs)
      throw new AppError({
        errorCode: 'ResourceFetchError',
        message: `We are not able to fetch ${resource}`,
        statusCode: 400,
      })

    return docs
  } catch (error) {
    return errorHandler(event, error)
  }
})
