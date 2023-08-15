import { logError } from '~/server/factory'
// import errorHandler from '~/utils/errorHandler'
export default defineEventHandler(async (event) => {
  try {
    return 'HI'
    return await logError({ ...(await readBody(event)) })
  } catch (err) {
    return errorHandler(event, err)
  }
})
