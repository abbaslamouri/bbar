import { fetchById } from '~/server/utils/controllers'
import { ObjectId } from 'mongodb'
import mongoClientPromise from '~/server/utils/mongoDbClient'

export default defineEventHandler(async (event) => {
  try {
    if (event.context.params?._id === '_') return { _id: null }

    // const pipeline = []

    // // Match stage
    // pipeline.push({ $match: { _id: new ObjectId(event.context.params?._id) } })

    // populate stage
    // const lookup = [
    //   {
    //     $lookup: {
    //       from: 'media',
    //       localField: 'gallery',
    //       foreignField: '_id',
    //       as: 'gallery',
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'categories',
    //       localField: 'categories',
    //       foreignField: '_id',
    //       as: 'categories',
    //     },
    //   },
    // ]

    return fetchById(event)
  } catch (error) {
    return errorHandler(event, error)
  }
})
