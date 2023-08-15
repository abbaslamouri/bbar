import { updateById } from '~/server/utils/controllers'
// import errorHandler from '~/utils/errorHandler'

export default defineEventHandler(async (event) => {
  try {
    return await updateById(event)
  } catch (error) {
    return errorHandler(event, error)
  }
})
