// import { hashPassword } from './../../../../csrf/runtime/server/services/index'
// import { redis } from '~/utils/redisClient'
// import { userRepository, EntityId } from '~/server/redisSchemas/user'

import { createStorage } from 'unstorage'

import mongodbDriver from 'unstorage/drivers/mongodb'
// import { mongoClient, ObjectId } from '~/utils/mongoClient'
// import { mongoDbClient } from '~/server/plugins/mongoDbClient'
import mongoClientPromise from '~/server/utils/mongoDbClient'

import bcrypt from 'bcryptjs'
// import crypto from 'crypto'
import jwt, { JwtPayload } from 'jsonwebtoken'
// import { ObjectId } from 'mongodb'
import { H3Event } from 'h3'
// import { promisify } from 'util'
// import { mongoDbClient } from '~/server/plugins/mongoDbClient'

// import AppError from '~/utils/AppError'
import { ObjectId } from 'mongodb'
import { QueryValue } from 'ufo'
// import errorHandler from '~/utils/errorHandler'
// import sendEmail from '~/utils/Email'
// import { IUser } from '~/utils/types'

// import { getSinedJwtToken } from '~/server/controllers/v1/factory'
// import { setUserSession } from '#session'
// import AppError from '~/utils/AppError'
// import { H3Event } from 'h3'
// import { Ref, ref } from 'vue'
// import memoryDriver from 'unstorage/drivers/memory'
// import redisDriver from 'unstorage/drivers/redis'
// import { nanoid } from 'nanoid'

import { randomUUID, randomBytes, createCipheriv, createDecipheriv } from 'crypto'

// import { ISession, ISignupUser } from '~/utils/schema'
import { ICart } from '~/server/utils/schemas/cart'
import { sendMail } from '#mailer'

// import { findById } from '~/server/controllers/v1/factory'
// import { QueryValue } from 'ufo'
// import { ulid } from 'ulid'
// import appRedis from '~/utils/AppRedis'

const config = useRuntimeConfig()
const secrefBuffer = Buffer.from(config.auth.encryptSecret)

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, await bcrypt.genSalt(12))
}

export const encryptSessionToken = (secret: string): string => {
  const iv = randomBytes(16)
  const cipher = createCipheriv(config.csrf.encryptAlgorithm, secrefBuffer, iv)
  const encrypted = cipher.update(secret, 'utf8', 'base64') + cipher.final('base64')
  return `${iv.toString('base64')}:${encrypted}`
}

export const decryptSessionToken = (secret: string, token: QueryValue) => {
  const [iv, encrypted] = (token as string).split(':')
  if (!iv || !encrypted) {
    return false
  }
  let decrypted
  try {
    const decipher = createDecipheriv(config.csrf.encryptAlgorithm, secrefBuffer, Buffer.from(iv, 'base64'))
    decrypted = decipher.update(encrypted, 'base64', 'utf-8') + decipher.final('utf-8')
    return decrypted === secret
  } catch (error) {
    return false
  }
}

const storage = createStorage({
  driver: mongodbDriver({
    connectionString: config.mongoDbUrl,
    databaseName: 'morelamplight',
    collectionName: 'sessions',
  }),
})

export const getSinedJwtToken = async function (id: any, maxAge: number) {
  return jwt.sign({ id }, config.auth.jwtSecret, { expiresIn: maxAge })
}

// export const sendRegistrationToken = async (event: H3Event, name: string, email: string, insertedId: ObjectId) => {
//   try {
//     const token = await getSinedJwtToken(insertedId, Number(config.auth.jwtMaxAge))
//     if (!token)
//       throw new AppError(
//         'Registration failed.  Please try again later or call customer service at 555-555-5555',
//         'token_creation_failed',
//         400
//       )
//     const url = event.node.req.headers.origin
//     const emailSubject = 'Please confirm your email address'
//     const emailBody = `
//       <p>Hello ${name},</p>
//       <p>Thank you for creating an account with My Light, LLC.</p>
//       <p>Please click the link below to verify your account.</p>
//       <a href="${url}/auth?page=verify&signupToken=${token}" target="_blank">Click to confirm your email</a>
//       <p></p>
//       <p>Can’t click the link? Copy and paste this link in your browser:</p>
//       <p>${url}/auth?page=verify&signupToken=${token}</p>
//       <p>Sincerely,<br>
//       The My Light, LLC Team.</p>
//       <p>You’re receiving this email because you recently created a new account with YRL Consulting. If this wasn’t you, please ignore this email.</p>
// 	`
//     return await sendMail([email], emailSubject, emailBody)
//   } catch (error) {
//     return errorHandler(event, error)
//   }
// }

// export const sendEmailVerified = async (event: H3Event, name: string, email: string) => {
//   try {
//     // const url = event.node.req.headers.origin
//     const emailSubject = 'Thank you for confirming your email'
//     const emailBody = `
//       <p>Hello ${name},</p>
//       <p>Thank you for verifying your registration email with My Light, LLC</p>
//       <p>Our team will notify you when your account is activated</p>
//       <p></p>
//       <p>Sincerely,<br>
//       The YRL Consulting Team.</p>
//       <p>You’re receiving this email because you recently created a new account with YRL Consulting. If this wasn’t you, please ignore this email.</p>
//     `
//     return await sendMail([email], emailSubject, emailBody)
//   } catch (error) {
//     return errorHandler(event, error)
//   }
// }

// export const sendForgotPasswordToken = async (event: H3Event, name: string, email: string) => {
//   try {
//     const url = event.node.req.headers.origin
//     const emailSubject = 'Your password reset token (valid for 1 hour)'
//     const emailBody = `
//     <p>Hello ${name},</p>
// 		<p>Please click the link below to reset your password.</p>
// 		<a href="${url}/auth?page=reset-password&passwordResetToken=${config.auth.passwordResetToken}" target="_blank">Click to reset password</a>
// 		<p></p>
// 		<p>Can’t click the link? Copy and paste this link in your browser:</p>
// 		<p>${url}/auth?page=reset-password&passwordResetToken=${config.auth.passwordResetToken}</p>
// 		<p>Sincerely,<br>
// 		The YRL Consulting Team.</p>
// 		<p>You’re receiving this email because you recently created a new account with YRL Consulting. If this wasn’t you, please ignore this email.</p>
// 	`
//     return await sendMail([email], emailSubject, emailBody)
//   } catch (error) {
//     return errorHandler(event, error)
//   }
// }

export const sendPasswordReset = async (event: H3Event, name: string, email: string) => {
  try {
    const url = event.node.req.headers.origin
    const emailSubject = 'Your password has been reset'
    const emailBody = `
      <p>Hello ${name},</p>
      <p>your pasword was reset succesfully.</p>
      <a href="${url}/auth?page=signin" target="_blank">Login</a>
      <p></p>
      <p>Sincerely,<br>
      The YRL Consulting Team.</p>
      <p>You’re receiving this email because you recently created a new account with YRL Consulting. If this wasn’t you, please ignore this email.</p>
	`

    return await sendMail([email], emailSubject, emailBody)
  } catch (error) {
    return errorHandler(event, error)
  }
}

export const fetchCartSession = async (event: H3Event) => {
  const secret = parseCookies(event)[config.ecommerce.cookieName]
  if (!secret) return null
  return (await storage.hasItem(secret)) ? await storage.getItem(secret) : null
  // const decrypted = decryptSessionToken(cartSessionKey, (cartSession as Storage).encryptedSecret)
  // if (!decrypted) return null
  // return await findUserById((cartSession as Storage).userId)
}

export const updateCartSession = async (event: H3Event, cart: ICart) => {
  const secret = parseCookies(event)[config.ecommerce.cookieName]
  // const session = await fetchCartSession(event)
  if (!secret) {
    const secret = randomUUID()
    setCookie(event, config.ecommerce.cookieName, secret, config.ecommerce.cookieOpts)
  }
  await storage.setItem(secret, cart)
  // const encryptedSecret = encryptSessionToken(secret)

  return true
}

export const removeUserSession = async (event: H3Event) => {
  const sessionKey = parseCookies(event)[config.auth.cookieName]
  if (!sessionKey) return null
  setCookie(event, config.auth.cookieName, sessionKey, { ...config.auth.cookieOpts, maxAge: 1 })
  // setCookie(event, config.auth.cookieName, sessionKey, {
  //   expires: new Date(Date.now()),
  //   secure: config.auth.session.cookieSecure,
  //   httpOnly: config.auth.session.cookieHttpOnly,
  // })
  if (!(await storage.hasItem(sessionKey))) return null
  await storage.removeItem(sessionKey)
  return true
}

export const findUserById = async (id: string) => {
  const mongoDbClient = await mongoClientPromise
  return await mongoDbClient
    .db()
    .collection('users')
    .findOne({ _id: new ObjectId(id) })
  // try {
  //   // await redis.connect()
  //   const results = await redis.ft.search('idx:User', `@id:${id}`)
  //   // await redis.disconnect()
  //   // console.log(results)
  //   if (results && results.total > 0) return { id: results.documents[0].id, ...results.documents[0].value }
  //   return {}
  // } catch (err) {
  //   return errorHandler(event, err)
  // }
}

export const findUserByEmail = async (email: string) => {
  // throw new AppError('We cannot find a user with this email in our database', 'user_not_found', 404)
  // try {
  // console.log('XXXXXXXX', email)
  const mongoDbClient = await mongoClientPromise
  return await mongoDbClient.db().collection('users').findOne({ email })
  // // await appRedis.connect()
  // const results = await appRedis.client.ft.search('idx:User', `@email:{${email.replace(/[.@\\]/g, '\\$&')}}`)
  // // await appRedis.disconnect()
  // console.log(results.total)
  // if (results && results.total > 0) return { id: results.documents[0].id, ...results.documents[0].value }
  // return {}
  // } catch (err) {
  //   return errorHandler(event, err)
  // }
}

export const findUserByIdAndUpdate = async (id = '', payload: object) => {
  // if (!id) throw new AppError('id is required', 'user_id_missing', 404)
  // try {
  // let newEntity
  // const found = await findUserById(id)
  // console.log('F', found)
  // if (!found || Object.values(found).length == 0)
  // throw new AppError('We cannot find any records associated with this ID', 'user_by_id_not_found', 404)
  const mongoDbClient = await mongoClientPromise
  return await mongoDbClient
    .db()
    .collection('users')
    .replaceOne({ _id: new ObjectId(id) }, { ...(await findUserById(id)), ...payload })
  // await redis.connect()
  // const result = await redis.json.set(`User:${id}`, '$', { ...found, ...payload })
  // if (found) newEntity = await repository.save({ ...found, ...payload })
  // await redis.disconnect()
  // return // Return userId and Token
  // if (!verified)
  //   throw new AppError(
  //     'We are not able to update your records,  Please call customer service',
  //     'user_by_id_not_found',
  //     404
  //   )
  // return verified

  // return newEntity as IUser
  // } catch (err) {
  // return errorHandler(event, err)
  // }
}

// const nuxtApp = useNuxtApp()
// console.log(nuxtApp)

// const storage = createStorage({
//   driver: memoryDriver(),
// })

// const storage = createStorage({
//   driver: redisDriver({
//     base: config.nuxtAuth.session.userSessionId,
//     host: config.redisHost,
//     port: Number(config.redisPort),
//     password: config.redisPassword,
//     // tls: true as any,
//   }),
// })

// export const createToken = (secret: string): string => {
//   const iv = randomBytes(16)
//   const cipher = createCipheriv(config.nuxtAuth.csrf.encryptAlgorithm, secrefBuffer, iv)
//   const encrypted = cipher.update(secret, 'utf8', 'base64') + cipher.final('base64')
//   return `${iv.toString('base64')}:${encrypted}`
// }

// export const createCsrfCookie = async (event: H3Event, secret: string) => {
//   let ipAddress = ''
//   // const abstractRes: { ip_address: string } = (await $fetch(
//   //   `${config.abstractApiUrl}/?api_key=${config.abstractApiKey}`
//   // )) || { ip_address: '' }
//   // ipAddress = abstractRes.ip_address
//   setCookie(event, config.nuxtAuth.csrfCookieName, secret, {
//     ...(config.nuxtAuth.cookieOpts as CookieSerializeOptions),
//     expires: new Date(Date.now() + config.nuxtAuth.cookieOpts.expiryInSeconds * 1000),
//   })

//   // const session = {
//   //   ipAddress,
//   //   secret,
//   //   // userId: user[EntityId],
//   //   // userName: user.name,
//   //   // isAuthenticated,
//   // }

//   // await storage.setItem(secret, session)
//   // return session
// }

// export const verifyCsrfKey = (secret: string, token: QueryValue) => {
//   // console.log('?????', secret, token)
//   const [iv, encrypted] = (token as string).split(':')
//   if (!iv || !encrypted) {
//     return false
//   }
//   let decrypted
//   try {
//     const decipher = createDecipheriv(config.nuxtAuth.csrf.encryptAlgorithm, secrefBuffer, Buffer.from(iv, 'base64'))
//     decrypted = decipher.update(encrypted, 'base64', 'utf-8') + decipher.final('utf-8')
//     // console.log('!!!!!!!!!', secret, token)

//     return decrypted === secret
//   } catch (error) {
//     return false
//   }
// }

// export const updateUserSession = async (event: H3Event, payload: object) => {
//   const userSessionKey = parseCookies(event)[config.nuxtAuth.sessionCookieName]
//   if (!(await storage.hasItem(userSessionKey))) return false
//   let session = await storage.getItem(userSessionKey)
//   // console.log('IIIIII', session, user)
//   if (!session) session = {}
//   else session = { ...(session as object), ...payload }
//   await storage.setItem(userSessionKey, session, { ttl: config.nuxtAuth.cookieOpts.expiryInSeconds })
//   return true
//   // let ipAddress = ''
//   // const abstractRes: { ip_address: string } = (await $fetch(
//   //   `${config.abstractApiUrl}/?api_key=${config.abstractApiKey}`
//   // )) || { ip_address: '' }
//   // ipAddress = abstractRes.ip_address
//   // setCookie(event, config.nuxtAuth.sessionCookieName, secret, {
//   //   ...(config.nuxtAuth.cookieOpts as CookieSerializeOptions),
//   //   expires: new Date(Date.now() + config.nuxtAuth.cookieOpts.expiryInSeconds * 1000),
//   // })

//   // const session = {
//   //   ipAddress,
//   //   // userId: user[EntityId],
//   //   // userName: user.name,
//   //   // isAuthenticated,
//   // }

//   // await storage.setItem(secret, session, { ttl: config.nuxtAuth.cookieOpts.expiryInSeconds })
// }

// export const hashPassword = async (password: string = '4zE_h2n-mdWaZ9aq&3!G[Y{A,u"_xPvSD"a3q$B') => {
//   const salt = await bcrypt.genSalt(12)
//   return await bcrypt.hash(password as string, salt)
// }

// export const checkPassword = async (password: string, hash: string) => {
//   return await bcrypt.compare(password, hash)
// }

// export const createUser = async (event: H3Event, body: IUser) => {
//   return await mongoClient
//     .db()
//     .collection('users')
//     .insertOne({
//       name: body.name,
//       email: body.email,
//       userAddresses: body.userAddresses || [],
//       userPhoneNumbers: body.userPhoneNumbers || [],
//       media: [],
//       role: 'customer',
//       password: await hashPassword(body.password),
//       active: false,
//       verified: false,
//       accountNumber: (await mongoClient.db().collection('users').countDocuments()) + 101013,
//       signupDate: new Date(Date.now()),
//       passwordChangeDate: new Date(Date.now()),
//     })
// try {
//   // await redis.connect()

//   // Generate Ulid
//   // const userUlid = ulid()

//   // Get document count
//   // const allDocuments = await redis.ft.search('idx:User', `*`)
//   // const documentCount = allDocuments && allDocuments.total ? allDocuments.total : 0

//   // Set new user object
//   const userObj = {
//     // id: userUlid,
//     name: body.name,
//     email: body.email,
//     userAddresses: body.userAddresses || [],
//     phoneNumber: body.phoneNumber || '',
//     media: [],
//     role: 'customer',
//     password: await hashPassword(body.password),
//     active: false,
//     verified: false,
//     // accountNumber: documentCount + 101013,
//     signupDate: Date.now(),
//     passwordChangeDate: Date.now(),
//   }

//   // Save new user
//   // const result = await redis.json.set(`User:${userUlid}`, '$', userObj)

//   // await redis.disconnect()

//   // Return userId and Token
//   // if (result && result === 'OK') return await getSinedJwtToken(userUlid, Number(config.jwtSignupTokenMaxAge))
//   return null
// } catch (err) {
//   return errorHandler(event, err)
// }
// }

// export const fetcheSessionUser = async (event: H3Event) => {
//   const session = await getUserSession(event)
//   // console.log('SSSS', session)
//   if (!session || !(session as ISession).userId) return {}
//   // const user = await findById(userRepository, (session as ISession).userId)
//   // if (user) return user
//   return {}
// }

// export const protect = async (event: H3Event) => {
//   // console.log('EEEEEE', event.context.user)
//   if (!event.context.user) return false
//   return true
//   // const session = await getUserSession(event)
//   // // console.log('SSSS', session)
//   // if (!session || !(session as ISession).userId) return {}
//   // const user = await findById(userRepository, (session as ISession).userId)
//   // if (user) return user
//   // return {}
// }

// export const isVerified = async (id: string) => {
//   await redis.connect()
//   const found = await userRepository.fetch(id)
//   console.log('FOUND', found)
//   await redis.disconnect()
//   if (found && found.verified) return true
//   return false
// }

// export const fetchAuthUser = async (event: H3Event) => {
//   // await redis.connect()
//   const { email, password } = await readBody(event)
//   if (!email || !password) throw new AppError('Email and Password are required', 'email_and_or_password_missing', 404)
//   const user = await findByEmail(email as string)
//   if (!user) throw new AppError('Invalid login credentials', 'invalid-credentials', 401)
//   // await redis.disconnect()

//   if (!(await checkPassword(password, user.password as string)))
//     throw new AppError('Invalid email or password', 'invalid_password', 401)
//   if (!user.verified) throw new AppError('You have not verified your email', 'email_not_verified', 401)
//   return user

//   // // const cookieMaxAge = Number(config.jwtMaxAge) * 1 * 60 * 60
//   // // const authToken = await getSinedJwtToken(user._id, cookieMaxAge)
//   // // setAuthCookie(event, 'authToken', authToken, cookieMaxAge)
//   // // return authenticatedDataSchema.parse({ authToken, cookieMaxAge, ...user })
//   // // return true
//   // const user = await userRepository.save(userObj)
//   // console.log('E', user[EntityId])
//   // await redis.disconnect()
//   // return { userId: user[EntityId], token: await getSinedJwtToken(user[EntityId], Number(config.jwtSignupTokenMaxAge)) }
// }
