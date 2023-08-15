import bcrypt from 'bcryptjs'
import { storage, findUserByEmail, getSinedJwtToken, createUserSession } from '#auth'
// import AppError from '~/utils/AppError'
// import errorHandler from '~/utils/errorHandler'
// import {
//   EmailAndOrPasswordMissing,
//   UserByEmailNotFound,
//   InvalidPassword,
//   sessionTokenCreationError,
//   EmailNotVerified,
// } from '~/utils/errorCodes'

import { randomBytes } from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    // const sessionPassword = '24a75c1d5beafc923827101d58bc4155f2db07a5bef272109b8ccd058267500c'

    // console.log(session, randomBytes(32).toString('hex'))
    // return session
    const { email, password } = await readBody(event)
    if (!email || !password) throw new AppError(EmailAndOrPasswordMissing)
    const user = await findUserByEmail(email as string)
    if (!user) throw new AppError(UserByEmailNotFound)
    if (!user.verified) throw new AppError(EmailNotVerified)
    if (!(await bcrypt.compare(password, user.password))) throw new AppError(InvalidPassword)
    const session = await useSession(event, {
      name: config.auth.session.name,
      password: config.auth.session.password,
      maxAge: config.auth.session.maxAge,
    })
    session.data.user = { _id: user._id }
    await storage.setItem(session.id as string, {
      jwtToken: getSinedJwtToken({ userId: user._id, sessionId: session.id }),
    })
    return { userName: user.name, authenticated: true, sessionId: session.id }
    // const sessionToken = await createUserSession(event, user._id)
    // if (!sessionToken) throw new AppError(sessionTokenCreationError)
    // return { userName: user.name, authenticated: true, sessionToken }
  } catch (err) {
    return errorHandler(event, err)
  }
})
