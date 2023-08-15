import { MongoClient } from 'mongodb'

// const config = useRuntimeConfig()
// export const buildMongoClient = () => {
//   const mongoDbClient = new MongoClient(config.mongoDbUrl)
//   return mongoDbClient
// }

const client = new MongoClient(process.env.NUXT_MONGO_DB_URL as string, {})
const mongoClientPromise = client.connect()
console.log(`Database connection succesfull`)

export default mongoClientPromise
