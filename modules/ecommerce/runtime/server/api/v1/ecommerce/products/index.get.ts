// import { fetchProducts } from '#commerce'
// import { productRepository, EntityId } from '~/server/redisSchemas/product'
// import { fetchAllProducts } from '#commerce'
// import AppError from '~/utils/AppError'
// import { protect } from '#auth'
// import errorHandler from '~/utils/errorHandler'
import mongoClientPromise from '~/server/utils/mongoDbClient'
// import { aggregateFetch } from '~/server/controllers/v1/factory'

// export default defineEventHandler(async (event) => {
//   // try {
//   //   return await fetchAllProducts(event)
//   // } catch (err) {
//   //   return errorHandler(event, err)
//   // }
// })

export default defineEventHandler(async (event) => {
  try {
    // console.log(
    //   'EVENT CONTEXT',
    //   event.context.user,
    //   event.context.headerCsrf,
    //   event.context.paramsCsrf,
    //   event.context.bodyCsrf
    // )
    const mongoDbClient = await mongoClientPromise

    const pipeline = [
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories',
        },
      },
      { $limit: 1000 },
    ]

    const cursor = mongoDbClient.db().collection('products').aggregate(pipeline)
    const docs = await cursor.toArray()
    if (!docs)
      throw new AppError({
        errorCode: 'UnableToFetchProducts',
        message: 'We were not able to fetch products',
        statusCode: 400,
      })
    return docs

    // const cursor = mongoDbClient.db().collection('products').find()
    // return await cursor.toArray()
  } catch (error) {
    return errorHandler(event, error)
  }
  // console.log('YYYYYYY', event.context.auth)
  // const lookup = [
  //   {
  //     $lookup: {
  //       from: 'eligibilities',
  //       localField: 'eligibilities',
  //       foreignField: '_id',
  //       as: 'eligibilities',
  //     },
  //   },

  //   {
  //     $lookup: {
  //       from: 'nexthigherassemblies',
  //       localField: 'nextHigherAssemblies',
  //       foreignField: '_id',
  //       as: 'nextHigherAssemblies',
  //     },
  //   },
  // ]

  // return await fetchProducts(event, 'products')
})
