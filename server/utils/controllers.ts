import { H3Event } from 'h3'
import { ObjectId } from 'mongodb'
import { ResourceMissingError, ResourceDeletionError } from '~/server/utils/errorCodes'
import mongoClientPromise from '~/server/utils/mongoDbClient'

export const fetchAll = async (event: H3Event) => {
  try {
    const { resource, match, lookup, page, perPage, sort, hello } = getQuery(event)

    if (!resource) throw new AppError(ResourceMissingError)

    const pipeline = []

    // Match stage
    if (match) {
      const matchObj = JSON.parse(match.toString())
      const keys = Object.keys(matchObj)
      const values = Object.values(matchObj)
      for (const prop in keys) {
        pipeline.push({ $match: { [keys[prop]]: values[prop] } })
      }
    }

    // populate stage
    if (lookup) {
      const lookupObj = JSON.parse(lookup.toString())
      const keys = Object.keys(lookupObj)
      const values = Object.values(lookupObj)
      for (const prop in keys) {
        pipeline.push({
          $lookup: {
            from: keys[prop],
            localField: values[prop],
            foreignField: '_id',
            as: values[prop],
          },
        })
      }
    }

    // Sort stage
    if (sort) pipeline.push({ $sort: JSON.parse(sort as string) })

    const mongoDbClient = await mongoClientPromise
    const totalCount = await mongoDbClient
      .db()
      .collection(resource as string)
      .aggregate([...pipeline, { $count: 'myCount' }])
      .toArray()

    console.log('COUNT', totalCount[0])

    // // pagination stage

    if (perPage) {
      const currentPage = +page! ?? 1
      const limit = +perPage!
      const skip = (currentPage - 1) * limit
      pipeline.push({ $skip: skip })
      pipeline.push({ $limit: limit })
    }

    // console.log('PerPage', perPage)

    console.log('PIPELINE', JSON.stringify(pipeline))

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

    return { docs, totalCount: totalCount?.[0]?.myCount ?? 0 }
  } catch (error) {
    return errorHandler(event, error)
  }
}

export const fetchById = async (event: H3Event, lookup = []) => {
  try {
    const { resource, lookup } = getQuery(event)
    // console.log(lookup)
    // console.log(JSON.parse(lookup as string))

    // throw new AppError({
    //   errorCode: 'ResourceFetchError',
    //   message: `We are not able to fetch ${resource}`,
    //   statusCode: 400,
    // })

    if (!resource) throw new AppError(ResourceMissingError)
    if (!event.context.params?._id) throw new AppError(ContextParamsIdMissing)

    const pipeline = []

    // Match stage
    pipeline.push({ $match: { _id: new ObjectId(event.context.params?._id) } })

    // populate stage
    if (lookup) {
      const lookupObj = JSON.parse(lookup.toString())
      const keys = Object.keys(lookupObj)
      const values = Object.values(lookupObj)
      for (const prop in keys) {
        pipeline.push({
          $lookup: {
            from: keys[prop],
            localField: values[prop],
            foreignField: '_id',
            as: values[prop],
          },
        })
      }
    }

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

    return docs?.[0]
  } catch (error) {
    return errorHandler(event, error)
  }
}

export const updateById = async (event: H3Event) => {
  try {
    const body = await readBody(event)
    // return body
    const { resource } = getQuery(event)

    if (!resource) throw new AppError(ResourceMissingError)

    const newId = new ObjectId(event.context.params?._id)
    delete body?.sessionId
    delete body?._id
    delete body?.dateCreated

    const mongoDbClient = await mongoClientPromise
    return await mongoDbClient
      .db()
      .collection(resource as string)
      .updateOne({ _id: newId }, { $set: { ...body } })
  } catch (error) {
    return errorHandler(event, error)
  }
}

export const insertOne = async (event: H3Event, document: any) => {
  try {
    const { resource } = getQuery(event)
    if (!resource) throw new AppError(ResourceMissingError)

    const config = useRuntimeConfig()
    const body = await readBody(event)
    // const slug = slugify(body.originalName, { lower: true })
    body.dateCreated = new Date()
    delete body.sessionId
    // delete file.uploading
    // delete file.position
    const mongoDbClient = await mongoClientPromise
    const { insertedId } = await mongoDbClient
      .db()
      .collection(resource as string)
      .insertOne(body)
    if (!insertedId) throw new AppError(MediaInsertionError)
    // const s3Configuration: S3ClientConfig = {
    //   credentials: {
    //     accessKeyId: config.bucketAccessKey,
    //     secretAccessKey: config.bucketSecretAccessKey,
    //   },
    //   region: 'us-east-2',
    // }
    // const s3 = new S3Client(s3Configuration)
    // const command = new PutObjectCommand({ Bucket: 'morelamplight', Key: `${file.slug}` })
    // const url = await getSignedUrl(s3, command, { expiresIn: 10 })
    // console.log('Presigned URL: ', url)
    return insertedId
  } catch (error) {
    return errorHandler(event, error)
  }
}

export const deleteOne = async (event: H3Event) => {
  try {
    // const config = useRuntimeConfig()

    const { resource } = getQuery(event)
    if (!resource) throw new AppError(ResourceMissingError)

    const _id = event.context.params?._id
    if (!_id) throw new AppError(ContextParamsIdMissing)

    const mongoDbClient = await mongoClientPromise
    const { deletedCount } = await mongoDbClient
      .db()
      .collection(resource as string)
      .deleteOne({ _id: new ObjectId(_id) })
    console.log('Deleted', deletedCount)

    if (deletedCount !== 1) throw new AppError(ResourceDeletionError)
    return deletedCount

    // const s3Configuration: S3ClientConfig = {
    //   credentials: {
    //     accessKeyId: config.bucketAccessKey,
    //     secretAccessKey: config.bucketSecretAccessKey,
    //   },
    //   region: 'us-east-2',
    // }
    // const s3 = new S3Client(s3Configuration)
    // // const Key = randomBytes(16).toString('hex')
    // const command = new DeleteObjectCommand({ Bucket: 'morelamplight', Key: `${slug}` })
    // const response = await s3.send(command)
    // console.log('S3Deeleted: ', response)

    // if (response.$metadata.httpStatusCode !== 204) throw new AppError(S3MediaDeletionError)

    // return true
  } catch (error) {
    return errorHandler(event, error)
  }
}
