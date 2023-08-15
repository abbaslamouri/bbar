// import { S3Client, PutObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3'

import { ObjectId } from 'mongodb'

import { isAuthorized } from '#auth'
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { insertOne } from '~/server/utils/controllers'

export default defineEventHandler(async (event) => {
  try {
    const authorized = isAuthorized(event, ['admin'])
    if (authorized instanceof Error) return errorHandler(event, authorized)

    const config = useRuntimeConfig()
    const body = await readBody(event)
    // delete body.uploading
    // delete body.position

    const newGallery = []
    for (const image of body.gallery) {
      newGallery.push(new ObjectId(image._id))
    }
    body.gallery = newGallery

    const newCategories = []
    for (const category of body.categories) {
      newCategories.push(new ObjectId(category._id))
    }
    body.categories = newCategories

    body.salePriceStartDate = new Date(body.salePriceStartDate)
    body.salePriceEndDate = new Date(body.salePriceEndDate)

    // return body

    const insertedId = await insertOne(event, body)
    if (!insertedId) throw new AppError(MediaInsertionError)
    // const s3Configuration: S3ClientConfig = {
    //   credentials: {
    //     accessKeyId: config.bucketAccessKey,
    //     secretAccessKey: config.bucketSecretAccessKey,
    //   },
    //   region: 'us-east-2',
    // }
    // const s3 = new S3Client(s3Configuration)
    // const command = new PutObjectCommand({ Bucket: 'morelamplight', Key: `${body.slug}` })
    // const url = await getSignedUrl(s3, command, { expiresIn: 10 })
    // console.log('Presigned URL: ', url)
    return insertedId
  } catch (error) {
    return errorHandler(event, error)
  }
})
