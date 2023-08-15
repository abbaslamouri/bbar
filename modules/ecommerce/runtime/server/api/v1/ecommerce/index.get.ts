import mongoClientPromise from '~/server/utils/mongoDbClient'

export default defineEventHandler(async (event) => {
  try {
    const { resource, lookup } = getQuery(event)
    const mongoDbClient = await mongoClientPromise
    const pipeline = []

    if (lookup)
      pipeline.push({
        $lookup: JSON.parse(lookup as string),
      })

    console.log('PIPELINE', pipeline)

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
