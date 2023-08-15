// import AppError from '~/utils/AppError'
// import errorHandler from '~/utils/errorHandler'
import mongoClientPromise from '~/server/utils/mongoDbClient'
// import { CategoriesFetchError } from '~/utils/errorCodes'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  try {
    const mongoDbClient = await mongoClientPromise
    const { resource, _id, lookup } = getQuery(event)
    if (_id === '_') return {}
    const pipeline = [
      { $match: { _id: new ObjectId(_id as string) } },
      {
        $lookup: JSON.parse(lookup as string),
      },
    ]
    const cursor = mongoDbClient
      .db()
      .collection(resource as string)
      .aggregate(pipeline)
    const docs = await cursor.toArray()
    if (!docs)
      throw new AppError({
        errorCode: 'CategoryFetchError',
        message: `We are not able to fetch categories`,
        statusCode: 400,
      })
    return Array.isArray(docs) ? docs[0] : {}
  } catch (error) {
    return errorHandler(event, error)
  }
})
