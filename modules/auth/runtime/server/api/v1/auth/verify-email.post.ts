import jwt, { JwtPayload } from 'jsonwebtoken'
import { sendMail } from '#mailer'
import { findUserById, findUserByIdAndUpdate } from '#auth'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const query = getQuery(event)
    const config = useRuntimeConfig()
    const decoded = jwt.verify(query.signupToken as string, config.auth.jwtSecret, {})
    if (!decoded || !(decoded as JwtPayload).userId) throw new AppError(JwtDecodeError)
    const user = await findUserById((decoded as JwtPayload).userId)
    if (!user) throw new AppError(JwtDecodedUserNotFound)
    if (user?.email !== body.email) throw new AppError(UserEmailVerificationEmailMismatch)
    if (user?.verified) throw new AppError(EmailAlreadyVerified)
    const { modifiedCount } = await findUserByIdAndUpdate(user._id.toString(), { verified: true })
    if (modifiedCount !== 1) throw new AppError(EmailVerificationUpdateError)
    return true
    // const emailSubject = 'Thank you for confirming your email'
    // const emailBody = `
    //   <p>Hello ${user.name},</p>
    //   <p>Thank you for verifying your registration email with My Light, LLC</p>
    //   <p>Our team will notify you when your account is activated</p>
    //   <p></p>
    //   <p>Sincerely,<br>
    //   The YRL Consulting Team.</p>
    //   <p>You’re receiving this email because you recently created a new account with YRL Consulting. If this wasn’t you, please ignore this email.</p>
    // `
    // return await sendMail([user.email], emailSubject, emailBody)
  } catch (err) {
    return errorHandler(event, err)
  }
})
