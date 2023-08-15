import bcrypt from 'bcryptjs'
import { storage, findUserByEmail, createUserSession, fetchUserSession } from '#auth'
// import AppError from '~/utils/AppError'
// import errorHandler from '~/utils/errorHandler'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const userSession = await fetchUserSession(event)
    if (userSession && (userSession as Storage)?.sessionId && !(userSession instanceof Error)) return true
    else return false

    // const authCookie = getCookie(event, config.auth.cookieName)
    // const authCookie = parseCookies(event)
    // console.log('AuthCookieooooo', authCookie, config.auth.cookieName)
    // const userSession = await fetchUserSession(event)
    // console.log('UUUUU', userSession)
    // return 'GETTTTTTTT'

    // const { email, password } = await readBody(event)
    // if (!email || !password) throw new AppError('Email and Password are required', 'email_and_or_password_missing', 404)
    // const user = await findUserByEmail(email as string)
    // if (!user) throw new AppError('Invalid login credentials', 'user_by_email_not_found', 401)

    // if (!(await bcrypt.compare(password, user.password)))
    //   throw new AppError('Invalid login credentials', 'invalid_password', 401)
    // if (!user.verified) throw new AppError('You have not verified your email', 'email_not_verified', 401)
    // const csrfToken = await createUserSession(event, user._id)
    // if (!csrfToken)
    //   throw new AppError(
    //     'We are not able to complete your request at this time.  Please comtact customer servce at 555-555-5555',
    //     'email_not_verified',
    //     401
    //   )
    // return { userName: user.name, authenticated: true, csrfToken }
  } catch (err) {
    return errorHandler(event, err)
  }
})
