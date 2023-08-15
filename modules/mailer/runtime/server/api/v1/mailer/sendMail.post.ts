import { sendMail } from '#mailer'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const { name, email, subject, message } = await readBody(event)
    const emailBody = `
		Name: ${name}<br>
		Email: ${email}<br>
		Subject: ${subject}<br>
		Message: ${message}<br>
		<p>---</p>
		Date: ${new Date(Date.now()).toDateString()}<br>
		Time: ${new Date(Date.now()).getUTCHours()}: ${new Date(Date.now()).getUTCMinutes()}<br>
	`

    const info = await sendMail(
      config.mailer.contactFormEmailRecipients.split(',').map((r: string) => r.trim()),
      config.mailer.contactFormEmailSubject,
      emailBody
    )
    if (info && Array.isArray(info) && info.length && info[0].statusCode === 202)
      return { statusCode: info[0].statusCode }
    return { statusCode: null }
  } catch (error) {
    console.log(error)
    return error
  }
})
