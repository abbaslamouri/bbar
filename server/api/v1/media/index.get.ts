import { fetchAll } from '~/server/utils/controllers'

export default defineEventHandler(async (event) => {
  try {
    return await fetchAll(event)
  } catch (error) {
    return errorHandler(event, error)
  }
})
