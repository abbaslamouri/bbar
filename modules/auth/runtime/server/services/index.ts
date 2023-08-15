import { createStorage } from 'unstorage'
import mongodbDriver from 'unstorage/drivers/mongodb'
import mongoClientPromise from '~/server/utils/mongoDbClient'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { H3Event } from 'h3'
import { ObjectId } from 'mongodb'
import { QueryValue } from 'ufo'
// import errorHandler from '~/utils/errorHandler'
import { randomUUID, randomBytes, createCipheriv, createDecipheriv } from 'crypto'

// import { sendMail } from '#mailer'
// import { IUser } from '~/server/schemas/user'
// import AppError from '~/utils/AppError'

// import { UnAuthenticated, UnAuthorized, SessionTokenNotVerified } from '~/utils/errorCodes'

const config = useRuntimeConfig()
const secrefBuffer = Buffer.from(config.auth.encryptSecret)

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, await bcrypt.genSalt(12))
}

export const hashToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export const getSinedJwtToken = function (payload: object) {
  return jwt.sign({ ...payload }, config.auth.jwtSecret, { expiresIn: config.auth.jwtMaxAge })
}

export const encryptToken = (authCookie: string): string => {
  const iv = randomBytes(16)
  const cipher = createCipheriv(config.auth.encryptAlgorithm, secrefBuffer, iv)
  const encrypted = cipher.update(authCookie, 'utf8', 'base64') + cipher.final('base64')
  return `${iv.toString('base64')}:${encrypted}`
}

export const decryptToken = (event: H3Event, sessionToken: QueryValue) => {
  const authCookie = parseCookies(event)[config.auth.cookieName]
  const [iv, encrypted] = (sessionToken as string).split(':')
  if (!iv || !encrypted) {
    return false
  }
  let decrypted
  try {
    const decipher = createDecipheriv(config.auth.encryptAlgorithm, secrefBuffer, Buffer.from(iv, 'base64'))
    decrypted = decipher.update(encrypted, 'base64', 'utf-8') + decipher.final('utf-8')
    return decrypted === authCookie
  } catch (error) {
    return false
  }
}

export const storage = createStorage({
  driver: mongodbDriver({
    connectionString: config.url,
    databaseName: 'morelamplight',
    collectionName: 'user_sessions',
  }),
})

export const createUserSession = async (event: H3Event, userId: ObjectId) => {
  const authCookie = randomUUID()
  setCookie(event, config.auth.cookieName, authCookie, config.auth.cookieOpts)
  const sessionToken = encryptToken(authCookie)
  await storage.setItem(authCookie, { jwtToken: getSinedJwtToken({ userId }), sessionToken })
  return sessionToken
}

export const fetchUserSession = async (event: H3Event) => {
  try {
    const session = await getSession(event, {
      name: config.auth.session.name,
      password: config.auth.session.password,
      maxAge: config.auth.session.maxAge,
    })
    // console.log('Session', session.id)

    if (!session?.id) return null
    const userSession = (await storage.hasItem(session.id as string))
      ? await storage.getItem(session.id as string)
      : null
    // console.log('UUUU', userSession)
    if (!userSession) return null
    const decodedJwt = jwt.verify((userSession as Storage)?.jwtToken as string, config.auth.jwtSecret, {})
    // console.log('JJJJJJ', decodedJwt)
    const user = await findUserById((decodedJwt as JwtPayload)?.userId)
    // console.log('UUUUU', user)
    if (!user) return null
    return { user, sessionId: (decodedJwt as JwtPayload)?.sessionId }
    // return null

    // const authCookie = parseCookies(event)[config.auth.cookieName]
    // if (!authCookie) return null
    // const userSession = (await storage.hasItem(authCookie)) ? await storage.getItem(authCookie) : null
    // const decodedJwt = jwt.verify((userSession as Storage)?.jwtToken as string, config.auth.jwtSecret, {})
    // const user = await findUserById((decodedJwt as JwtPayload)?.userId)
    // if (user) return { user, sessionToken: (userSession as Storage)?.sessionToken }
    // return null
  } catch (error) {
    return error
  }
}

export const removeUserSession = async (event: H3Event) => {
  const authCookie = parseCookies(event)[config.auth.cookieName]
  console.log('GGGGGGG', authCookie)
  if (!authCookie) return
  setCookie(event, config.auth.cookieName, '', { ...config.auth.cookieOpts, maxAge: 1 })
  if (!(await storage.hasItem(authCookie))) return null
  await storage.removeItem(authCookie)
  return
}

export const findUserById = async (id: string) => {
  const mongoDbClient = await mongoClientPromise
  return await mongoDbClient
    .db()
    .collection('users')
    .findOne({ _id: new ObjectId(id) })
}

export const findUserByEmail = async (email: string) => {
  const mongoDbClient = await mongoClientPromise
  return await mongoDbClient.db().collection('users').findOne({ email })
}

export const findUserByIdAndUpdate = async (id = '', payload: object) => {
  const mongoDbClient = await mongoClientPromise
  return await mongoDbClient
    .db()
    .collection('users')
    .replaceOne({ _id: new ObjectId(id) }, { ...(await findUserById(id)), ...payload })
}

export const isAuthorized = (event: H3Event, roles: string[] = []) => {
  try {
    // console.log(event.context.user)
    // console.log(event.context.sessionToken)
    if (!event.context.user) throw new AppError(UnAuthenticated)
    // if (event.context?.sessionToken !== 'verified') throw new AppError(SessionTokenNotVerified)
    if (!roles.includes(event.context.user.role)) throw new AppError(UnAuthorized)
    return true
  } catch (error) {
    return error
  }
}

// export const sendRegistrationToken = async (email: string, token: string, url: string) => {
//   const emailSubject = 'MyLight - Please verify your email address'
//   const emailBody = verifyEmailTemlate(url, token)
//   return await sendMail([email], emailSubject, emailBody)
// }
