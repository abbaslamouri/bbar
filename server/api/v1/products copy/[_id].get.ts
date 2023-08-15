import { fetchById } from '~/server/utils/controllers'

export default defineEventHandler(async (event) => {
  try {
    return await fetchById(event)
  } catch (error) {
    return errorHandler(event, error)
  }
})
