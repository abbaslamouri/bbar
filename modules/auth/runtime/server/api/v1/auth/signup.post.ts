import { findUserByEmail } from '#auth'

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event)
    if (!email) throw new AppError(EmailMissing)
    const user = await findUserByEmail(email)
    if (user) {
      if (user.verified) throw new AppError(DuplicateEmailError)
      else throw new AppError(EmailExistsButNotVerified)
    }
    return true
  } catch (error) {
    return errorHandler(event, error)
  }
})
