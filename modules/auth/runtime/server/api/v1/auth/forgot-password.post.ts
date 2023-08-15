import { randomBytes } from 'crypto'
import { findUserByEmail, findUserByIdAndUpdate, hashToken } from '#auth'
import { sendMail } from '#mailer'
import passwordResetTemplate from '../../../../components/email-templates/password-reset'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const { email } = await readBody(event)
    if (!email) throw new AppError(EmailMissing)
    const user = await findUserByEmail(email)
    if (!user) throw new AppError(UserByEmailNotFound)
    if (!user.verified) throw new AppError(EmailNotVerified)
    const passwordResetToken = randomBytes(22).toString('base64')
    user.passwordResetToken = hashToken(passwordResetToken)
    user.passwordResetExpires = new Date(Date.now() + Number(config.auth.passwordResetExpires))
    const { modifiedCount } = await findUserByIdAndUpdate(user._id.toString(), user)
    if (modifiedCount !== 1) throw new AppError(UserUpdateError)
    const url = event.node.req.headers.origin
    const emailSubject = 'MyLight - Your password reset token (valid for 5 days)'
    //   const emailBody = `
    //   <p>Hello ${user.name},</p>
    // 	<p>Please click the link below to reset your password.</p>
    // 	<a href="${url}/auth/reset-password?passwordResetToken=${passwordResetToken}" target="_blank">Click to reset password</a>
    // 	<p></p>
    // 	<p>Can’t click the link? Copy and paste this link in your browser:</p>
    // 	<p>${url}/auth/reset-password?passwordResetToken=${passwordResetToken}</p>
    // 	<p>Sincerely,<br>
    // 	The YRL Consulting Team.</p>
    // 	<p>You’re receiving this email because you recently created a new account with YRL Consulting. If this wasn’t you, please ignore this email.</p>
    // `
    const emailBody = passwordResetTemplate(url, passwordResetToken)
    return await sendMail([email], emailSubject, emailBody)
  } catch (err) {
    return errorHandler(event, err)
  }
})
