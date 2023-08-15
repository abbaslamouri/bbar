import mongoClientPromise from '~/server/utils/mongoDbClient'

export default defineEventHandler(async (event) => {
  try {
    const mongoDbClient = await mongoClientPromise
    console.log(getQuery(event))
    const { resource, field, searchText, lookup } = getQuery(event)
    // console.log('SSSSSS', searchText)

    const regex = new RegExp(searchText as string, 'i')
    const pipeline = [
      { $match: { [field as string]: regex } },
      {
        $lookup: JSON.parse(lookup as string),
      },
    ]
    // console.log('PPPPPPP', pipeline)
    const cursor = mongoDbClient
      .db()
      .collection(resource as string)
      .aggregate(pipeline)
    const docs = await cursor.toArray()
    if (!docs)
      throw new AppError({
        errorCode: 'SearchResultsError',
        message: `We are not able to fetch ${resource}`,
        statusCode: 400,
      })

    return docs
  } catch (error) {
    return errorHandler(event, error)
  }
})
