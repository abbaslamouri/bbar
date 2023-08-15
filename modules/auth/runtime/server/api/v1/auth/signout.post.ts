// import errorHandler from '~/utils/errorHandler'
import { removeUserSession, isAuthorized } from '#auth'

export default defineEventHandler(async (event) => {
  try {
    // const authorized = isAuthorized(event, ['admin'])
    // if (authorized instanceof Error) return true
    const config = useRuntimeConfig()
    await clearSession(event, {
      name: config.auth.session.name,
      password: config.auth.session.password,
      maxAge: config.auth.session.maxAge,
    })
    return { userName: '', authenticated: false, sessionId: '' }
  } catch (err) {
    return errorHandler(event, err)
  }
})
