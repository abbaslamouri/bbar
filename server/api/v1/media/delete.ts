import { randomBytes } from 'crypto'
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// import errorHandler from '~/utils/errorHandler'
import mongoClientPromise from '~/server/utils/mongoDbClient'

import { ObjectId } from 'mongodb'

// import { MediaDeletionError, S3MediaDeletionError } from '~/server/utils/errorCodes'
// import AppError from '~/utils/AppError'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()

    const body = await readBody(event)

    const mongoDbClient = await mongoClientPromise
    const { deletedCount } = await mongoDbClient
      .db()
      .collection('media')
      .deleteOne({ _id: new ObjectId(body._id) })
    console.log('Deleted', deletedCount)
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
    const command = new DeleteObjectCommand({ Bucket: 'morelamplight', Key: `${body.slug}` })
    const response = await s3.send(command)
    console.log('S3Deeleted: ', response)

    if (response.$metadata.httpStatusCode !== 204) throw new AppError(S3MediaDeletionError)

    return true
  } catch (error) {
    return errorHandler(event, error)
  }
})
