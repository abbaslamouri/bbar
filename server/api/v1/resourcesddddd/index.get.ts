import { ObjectId } from 'mongodb'
import { ResourceMissingError } from '~/server/utils/errorCodes'
import mongoClientPromise from '~/server/utils/mongoDbClient'

export default defineEventHandler(async (event) => {
  try {
    const { resource, match, searchQuery, lookup, page, perPage, sort } = getQuery(event)

    if (!resource) throw new AppError(ResourceMissingError)

    const pipeline = []

    // Match stage
    if (match) {
      pipeline.push({ $match: JSON.parse(match as string) })
    }
    console.log(pipeline)

    // Search stage
    if (searchQuery) {
      const searchQueryObject = JSON.parse(searchQuery as string)
      const regex = new RegExp(searchQueryObject?.text, 'i')
      pipeline.push({ $match: JSON.parse(searchQuery as string) })
    }

    // populate stage
    if (lookup) {
      pipeline.push({
        $lookup: JSON.parse(lookup as string),
      })
    }

    // pagination stage
    const currentPage = page ? +page : 1
    const limit = perPage ? +perPage : 1000
    const skip = (currentPage - 1) * limit ?? 0
    pipeline.push({ $skip: skip })
    pipeline.push({ $limit: limit })

    // Sort stage
    if (sort) pipeline.push({ $sort: JSON.parse(sort as string) })

    console.log('PIPELINE', JSON.stringify(pipeline))

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
    console.log(docs)
    // return []
    return docs
  } catch (error) {
    return errorHandler(event, error)
  }
})
