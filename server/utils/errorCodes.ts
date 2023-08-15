// Jsonwebtoken
export const RegistrationError = {
  errorCode: 'RegistrationError',
  message: 'Registration failed.  Please try again later or call customer service at 555-555-5555',
  statusCode: 400,
}
export const RegistrationTokenCreationError = {
  errorCode: 'RegistrationTokenCreationError',
  message: 'Registration failed.  Please try again later or call customer service at 555-555-5555',
  statusCode: 400,
}
export const UserEmailVerificationEmailMismatch = {
  errorCode: 'UserEmailVerificationEmailMismatch',
  message: 'Please enter the email you used when you signed up',
  statusCode: 400,
}
export const JwtDecodeError = {
  errorCode: 'JwtDecodeError',
  message: 'Please enter the email you used when you signed up',
  statusCode: 400,
}
export const EmailMissing = {
  errorCode: 'EmailMissing',
  message: 'Email is required',
  statusCode: 400,
}
export const SlugMissingError = {
  errorCode: 'SlugMissingError',
  message: 'slug is required',
  statusCode: 400,
}
export const EmailOrNameOrPasswordMissing = {
  errorCode: 'EmailOrNameOrPasswordMissing',
  message: 'Name, Email abd password are required',
  statusCode: 400,
}
export const JwtDecodedUserNotFound = {
  errorCode: 'JwtDecodedUserNotFound',
  message:
    'We are not able to verify your email at this time. Please try again later or call customer service at 555-555-5555',
  statusCode: 400,
}
export const EmailNotVerified = {
  errorCode: 'EmailNotVerified',
  message: 'You have not verified your email',
  statusCode: 406,
}
export const EmailExistsButNotVerified = {
  errorCode: 'EmailExistsButNotVerified',
  message: 'This email already exists but has not been verified',
  statusCode: 406,
}
export const DuplicateEmailError = {
  errorCode: 'DuplicateEmailError',
  message: 'This email is already regsitered',
  statusCode: 406,
}
export const EmailAlreadyVerified = {
  errorCode: 'EmailAlreadyVerified',
  message: 'This email is verified, please login',
  statusCode: 400,
}
export const EmailVerificationUpdateError = {
  errorCode: 'EmailVerificationUpdateError',
  message: 'This email is verified, please login',
  statusCode: 400,
}
export const EmailAndOrPasswordMissing = {
  errorCode: 'EmailAndOrPasswordMissing',
  message: 'Email and Password are required',
  statusCode: 400,
}
export const UserByEmailNotFound = {
  errorCode: 'UserByEmailNotFound',
  message: 'Invalid login credentials',
  statusCode: 404,
}
export const UserByTokenNotFound = {
  errorCode: 'UserByEmailNotFound',
  message: 'We are not able to process your request at this time.  Please call customer service at 555-555-5555',
  statusCode: 404,
}
export const InvalidPassword = {
  errorCode: 'InvalidPassword',
  message: 'Invalid login credentials',
  statusCode: 400,
}
export const UserUpdateError = {
  errorCode: 'UserUpdateError',
  message: 'We are not able to recover your password at this time.  Please call customer service',
  statusCode: 400,
}
export const sessionTokenCreationError = {
  errorCode: 'CsrfTokenCreationError',
  message: 'We are not able to complete your request at this time.  Please comtact customer servce at 555-555-5555',
  statusCode: 404,
}
export const UserPasswordUpdateError = {
  errorCode: 'UserPasswordUpdateError',
  message: 'We are not able to complete your request at this time.  Please comtact customer servce at 555-555-5555',
  statusCode: 404,
}
export const HedaerCsrfError = {
  errorCode: 'HedaerCsrfError',
  message: 'We are not able to complete your request at this time.  Please try again',
  statusCode: 400,
}
export const UnAuthenticated = {
  errorCode: 'UnAuthenticated',
  message: 'You do not have permission to view these resources.',
  statusCode: 403,
}
export const UnAuthorized = {
  errorCode: 'UnAuthorized',
  message: 'You are not authorized to view these resources.',
  statusCode: 403,
}
export const SessionTokenNotVerified = {
  errorCode: 'SessionTokenNotVerified',
  message: 'You do not have permission to view these resources.',
  statusCode: 403,
}

///// Media  ////////
export const MediaInsertionError = {
  errorCode: 'MediaInsertionError',
  message: 'We are not able to save media',
  statusCode: 400,
}
export const MediaDeletionError = {
  errorCode: 'MediaDeletionError',
  message: 'We are not able to delete media',
  statusCode: 400,
}
export const S3MediaDeletionError = {
  errorCode: 'S3MediaDeletionError',
  message: 'We are not able to delete media on S3 bucket',
  statusCode: 400,
}

// Resources
export const ResourceMissingError = {
  errorCode: 'ResourceMissingError',
  message: `Resource is required`,
  statusCode: 400,
}
export const ContextParamsIdMissing = {
  errorCode: 'ContextParamsIdMissing',
  message: `Context params _id is required`,
  statusCode: 400,
}

// Products
export const ProductDeletionError = {
  errorCode: 'ProductDeletionError',
  message: 'We are not able to delete',
  statusCode: 400,
}

// Resources
export const ResourceDeletionError = {
  errorCode: 'ResourceDeletionError',
  message: 'We are not able to delete',
  statusCode: 400,
}

///// Media  ////////
// export const CategoriesFetchError = {
//   errorCode: 'CategoriesFetchError',
//   message: 'We are not able to fetch categories',
//   statusCode: 400,
// }

////////////

// export const emailDeliveryFailed = {
//   errorCode: 'emailDeliveryFailed',
//   message: '',
//   statusCode: null,
// }

// Mongo server errors
export const E11000 = { errorCode: 'E11000', type: 'MongoServerError', message: 'Duplicate entries', statusCode: 401 }

// export const resourceDeletionError = (item: string) => {
//   return {
//     errorCode: 'ProductDeletionError',
//     message: `We are not able to delete ${item}`,
//     statusCode: 400,
//   }
// }
