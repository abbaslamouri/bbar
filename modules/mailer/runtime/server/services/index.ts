import sgMail from '@sendgrid/mail'
import nodemailer from 'nodemailer'

const config = useRuntimeConfig()

export const sendMail = async (emailRecipients: string[], subject: string, html: string) => {
  let info
  if (config.mailer.mailTransporter === 'nodemailer') {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort),
      secure: Boolean(true), // use TLS
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    })

    info = await transporter.sendMail({
      from: config.mailer.emailFromEmail,
      to: emailRecipients,
      subject,
      html,
    })
  } else if (config.mailer.mailTransporter === 'sendgrid') {
    sgMail.setApiKey(config.apiKey as string)

    const msg = {
      to: emailRecipients,
      from: {
        email: config.mailer.emailFromEmail,
        name: config.mailer.emailFromName,
      },
      replyTo: {
        email: config.mailer.emailFromEmail,
        name: config.mailer.emailFromName,
      },
      subject,
      // template_id: templateId,
      // dynamic_template_data: { ...this.data, firstname: this.firstname, subject: this.subject },
      // text: ``,
      html,
    }
    info = await sgMail.sendMultiple(msg)

    // const info = await sendMail([email], emailSubject, emailBody)
    if (info && Array.isArray(info) && info.length && info[0].statusCode === 202)
      return { statusCode: info[0].statusCode }
    return { statusCode: null }
  }
  return info
}
