// import { buildMongoClient } from './../../../utils/mongoClient';
// import { MongoClient, ServerApiVersion } from 'mongodb'
// import mongoClientPromise from '~/utils/mongoDbClient'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // const mongoDbClient = await mongoClientPromise
  // const mongoClient = new MongoClient(config.dbUrl, {
  //   serverApi: {
  //     version: ServerApiVersion.v1,
  //     strict: true,
  //     deprecationErrors: true,
  //   },
  // })
  const cursor = mongoDbClient.db().collection('products').find()
  return await cursor.toArray()
})
