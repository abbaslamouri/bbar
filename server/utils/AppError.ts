class AppError extends Error {
  statusCode: number
  errorCode: string
  name: string
  constructor(public payload: { errorCode: string; statusCode: number; message: string }) {
    super(payload.message)
    this.statusCode = payload.statusCode
    this.errorCode = payload.errorCode
    this.name = 'CustomError'
    this.message = payload.message ? payload.message : 'Something went terribly wrong'
    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
