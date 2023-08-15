// import AppError from '~/server/utils/AppError'
// import errorHandler from '~/server/utils/errorHandler'
import mongoClientPromise from '~/server/utils/mongoDbClient'

export default defineEventHandler(async (event) => {
  try {
    const mongoDbClient = await mongoClientPromise
    console.log(getQuery(event))
    const { resource, field, searchText, lookup } = getQuery(event)
    // if (!field || !resource)
    //   throw new AppError({
    //     errorCode: 'SearchParametersError',
    //     message: 'Search resource, search field, and search text are required',
    //     statusCode: 400,
    //   })
    const regex = new RegExp(searchText as string, 'i')
    const pipeline = [
      { $match: { [field as string]: regex } },
      {
        $lookup: JSON.parse(lookup as string),
      },
    ]

    // console.log('PPPPPPP', pipeline)
    // return pipeline
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
    // console.log(docs)
    return docs
  } catch (error) {
    return errorHandler(event, error)
  }
})
