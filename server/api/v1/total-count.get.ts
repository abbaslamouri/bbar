import { fetchAll } from '~/server/utils/controllers'

export default defineEventHandler(async (event) => {
  try {
    return await totalCount(event)
  } catch (error) {
    return errorHandler(event, error)
  }
})
