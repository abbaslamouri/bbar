export default (name: string, email: string | null, subject: string, message: string | null) => {
  return `
		Name: ${name}<br>
		Email: ${email}<br>
		Subject: ${subject}<br>
		Message: ${message}<br>
		<p>---</p>
		Date: ${new Date(Date.now()).toDateString()}<br>
		Time: ${new Date(Date.now()).getUTCHours()}: ${new Date(Date.now()).getUTCMinutes()}<br>
	`
}
