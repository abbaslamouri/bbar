import mongoClientPromise from '../utils/mongoDbClient'
import productSchema from '../utils/schemas/product'
import categorySchema from '../utils/schemas/category'
import userSchema from '../utils/schemas/user'
import errorLogsSchema from '../utils/schemas/errorLogs'
import mediaSchema from '../utils/schemas/media'

const config = useRuntimeConfig()

export default defineNitroPlugin(async (nitroApp) => {
  try {
    const mongoDbClient = await mongoClientPromise
    const collections = await mongoDbClient.db().listCollections().toArray()
    mongoDbClient.db('admin').command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!')

    const newCollections = [
      { name: 'categories', schema: categorySchema, indexes: [{ field: 'name', unique: true }] },
      { name: 'products', schema: productSchema, indexes: [{ field: 'name', unique: true }], unique: true },
      { name: 'users', schema: userSchema, indexes: [{ field: 'email', unique: true }], unique: true },
      { name: 'media', schema: mediaSchema, indexes: [{ field: 'originalName', unique: true }] },
      { name: 'error_logs', schema: errorLogsSchema, indexes: [{ field: 'name', unique: false }] },
    ]

    for (const newCollection of newCollections) {
      if (collections.find((c) => c.name == newCollection.name)) continue
      await mongoDbClient.db().createCollection(newCollection.name, newCollection.schema)
      if (!newCollection.indexes || !newCollection.indexes.length) continue
      for (const index of newCollection.indexes) {
        await mongoDbClient
          .db()
          .collection(newCollection.name)
          .createIndex({ [index.field]: 1 }, { unique: index.unique })
      }
      console.log(`${newCollection.name} database creation succesfull`)
    }

    // // create categories collection if it does not exists
    // if (!collections.find((p) => p.name === 'categories')) {
    //   await mongoDbClient.db().createCollection('categories', productSchema)
    //   await mongoDbClient.db().collection('categories').createIndex({ name: 1 }, { unique: true })
    //   console.log(`Products database creation succesfull`)
    // }

    // // create products collection if it does not exists
    // if (!collections.find((p) => p.name === 'products')) {
    //   await mongoDbClient.db().createCollection('products', productSchema)
    //   await mongoDbClient.db().collection('products').createIndex({ name: 1 }, { unique: true })
    //   console.log(`Products database creation succesfull`)
    // }

    // // Create users collection if it does not exist
    // if (!collections.find((c) => c.name === 'users')) {
    //   await mongoDbClient.db().createCollection('users', userSchema)
    //   await mongoDbClient.db().collection('users').createIndex({ email: 1 }, { unique: true })
    //   console.log(`Users database creation succesfull`)
    // }
  } catch (error) {
    console.log('ERRRRRRRRRR', error)
  }
})
