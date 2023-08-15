import { hashPassword, hashToken } from '#auth'
// import AppError from '~/utils/AppError'
import { ObjectId } from 'mongodb'
// import errorHandler from '~/utils/errorHandler'
import mongoClientPromise from '~/server/utils/mongoDbClient'
// import { UserByTokenNotFound, UserPasswordUpdateError } from '~/utils/errorCodes'
import { sendMail } from '#mailer'

export default defineEventHandler(async (event) => {
  try {
    const { password } = await readBody(event)
    // if (!email || !password) throw new AppError(EmailAndOrPasswordMissing)
    const { passwordResetToken } = getQuery(event)
    const mongoDbClient = await mongoClientPromise
    const hashedToken = hashToken(passwordResetToken as string)

    // console.log(hashedToken)
    const user = await mongoDbClient
      .db()
      .collection('users')
      .findOne({
        // email,
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date(Date.now()) },
        verified: true,
      })

    if (!user) throw new AppError(UserByTokenNotFound)
    user.password = await hashPassword(password)
    user.passwordChangeDate = new Date(Date.now())
    delete user.passwordResetToken
    delete user.passwordResetExpires
    const updatedUser = await mongoDbClient
      .db()
      .collection('users')
      .replaceOne({ _id: new ObjectId(user._id) }, user)
    if (!updatedUser) throw new AppError(UserPasswordUpdateError)
    return true

    //   const url = event.node.req.headers.origin
    //   const emailSubject = 'Your password has been reset'
    //   const emailBody = `
    //     <p>Hello ${user.name},</p>
    //     <p>your pasword was reset succesfully.</p>
    //     <a href="${url}/auth/signin" target="_blank">Login</a>
    //     <p></p>
    //     <p>Sincerely,<br>
    //     The YRL Consulting Team.</p>
    //     <p>You’re receiving this email because you recently created a new account with YRL Consulting. If this wasn’t you, please ignore this email.</p>
    // `
    //   return await sendMail([email], emailSubject, emailBody)
  } catch (err) {
    return errorHandler(event, err)
  }
})
