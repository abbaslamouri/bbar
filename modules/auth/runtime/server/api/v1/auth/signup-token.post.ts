import { findUserByEmail, getSinedJwtToken } from '#auth'
import { sendMail } from '#mailer'
import verifyEmailTemlate from '../../../../components/email-templates/verify-email'
// import AppError from '~/utils/AppError'
// import errorHandler from '~/utils/errorHandler'
// import { EmailMissing, UserByEmailNotFound } from '~/utils/errorCodes'

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event)
    if (!email) throw new AppError(EmailMissing)
    const user = await findUserByEmail(email)
    if (!user) throw new AppError(UserByEmailNotFound)
    const token = getSinedJwtToken({ userId: user._id })
    if (!token) throw new AppError(RegistrationTokenCreationError)
    const url = event.node.req.headers.origin

    const emailSubject = 'MyLight - Please verify your email address'
    const emailBody = verifyEmailTemlate(url, token)
    return await sendMail([email], emailSubject, emailBody)
    // return sendRegistrationToken(event, user.name, user.email, user._id)
    // return sendRegistrationToken(user.name, user.email, token, url as string)
  } catch (error) {
    return errorHandler(event, error)
  }
})
