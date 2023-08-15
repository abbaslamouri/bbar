import mongoClientPromise from '~/server/utils/mongoDbClient'
import { IErrorLog } from '~/server/utils/schemas/errorLogs'

export const logError = async (data: IErrorLog) => {
  const mongoDbClient = await mongoClientPromise
  return await mongoDbClient
    .db()
    .collection('error_logs')
    .insertOne({
      ...data,
    })
}
