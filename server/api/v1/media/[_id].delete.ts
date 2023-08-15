import { randomBytes } from 'crypto'
import { ObjectId } from 'mongodb'
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// import errorHandler from '~/utils/errorHandler'
import mongoClientPromise from '~/server/utils/mongoDbClient'
import { SlugMissingError } from '~/server/utils/errorCodes'
import { deleteOne } from '~/server/utils/controllers'
import { isAuthorized } from '#auth'

// import { MediaDeletionError, S3MediaDeletionError } from '~/server/utils/errorCodes'
// import AppError from '~/utils/AppError'

export default defineEventHandler(async (event) => {
  try {
    const authorized = isAuthorized(event, ['admin'])
    if (authorized instanceof Error) return errorHandler(event, authorized)

    const { slug } = getQuery(event)
    if (!slug) throw new AppError(SlugMissingError)

    const config = useRuntimeConfig()
    // return event.context.params?._id

    // const body = await readBody(event)

    // const mongoDbClient = await mongoClientPromise
    // const { deletedCount } = await mongoDbClient
    //   .db()
    //   .collection('media')
    //   .deleteOne({ _id: new ObjectId(event.context.params?._id) })
    // console.log('Deleted', deletedCount)
    const deletedCount = await deleteOne(event)
    if (deletedCount !== 1) throw new AppError(MediaDeletionError)

    const s3Configuration: S3ClientConfig = {
      credentials: {
        accessKeyId: config.bucketAccessKey,
        secretAccessKey: config.bucketSecretAccessKey,
      },
      region: 'us-east-2',
    }
    const s3 = new S3Client(s3Configuration)
    // const Key = randomBytes(16).toString('hex')
    const command = new DeleteObjectCommand({ Bucket: 'morelamplight', Key: `${slug}` })
    const response = await s3.send(command)
    console.log('S3Deeleted: ', response)

    if (response.$metadata.httpStatusCode !== 204) throw new AppError(S3MediaDeletionError)

    return true
  } catch (error) {
    return errorHandler(event, error)
  }
})
