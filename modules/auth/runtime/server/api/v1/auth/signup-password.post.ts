import { findUserByEmail, hashPassword, getSinedJwtToken } from '#auth'
import { sendMail } from '#mailer'
import mongoClientPromise from '~/server/utils/mongoDbClient'
import verifyEmailTemlate from '../../../../components/email-templates/verify-email'

export default defineEventHandler(async (event) => {
  try {
    const { name, email, password } = await readBody(event)
    if (!email || !name || !password) throw new AppError(EmailOrNameOrPasswordMissing)
    const user = await findUserByEmail(email)
    if (user) {
      if (user.verified) throw new AppError(DuplicateEmailError)
      else throw new AppError(EmailExistsButNotVerified)
    }
    const mongoDbClient = await mongoClientPromise
    const { insertedId } = await mongoDbClient
      .db()
      .collection('users')
      .insertOne({
        name: name,
        email: email,
        role: 'guest',
        password: await hashPassword(password),
        active: false,
        verified: false,
        signupDate: new Date(Date.now()),
        passwordChangeDate: new Date(Date.now()),
      })
    if (!insertedId) throw new AppError(RegistrationError)
    const token = getSinedJwtToken({ userId: insertedId })
    if (!token) throw new AppError(RegistrationTokenCreationError)
    const url = event.node.req.headers.origin
    const emailSubject = 'MyLight - Please verify your email address'
    const emailBody = verifyEmailTemlate(url, token)
    return await sendMail([email], emailSubject, emailBody)
    // return await sendRegistrationToken(email, token, url as string)
  } catch (error) {
    return errorHandler(event, error)
  }
})
