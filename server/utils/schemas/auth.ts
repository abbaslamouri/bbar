import { z } from 'zod'
import { userNameSchema } from './userName'
import { zodEmailSchema } from './email'
import { passwordSchema } from './password'

// export const authFormSchema = z.object({
//   name: userNameSchema,
//   email: emailSchema,
//   password: passwordSchema,
// })
// export type IRegistrationForm = z.infer<typeof signupFormSchema>

// Signup form schema
export const zodSignupFormSchema = z.object({
  // name: userNameSchema,
  email: zodEmailSchema,
  // password: passwordSchema,
})

// SignupPassword form schema
export const zodSignupPasswordFormSchema = z.object({
  name: userNameSchema,
  email: zodEmailSchema,
  password: passwordSchema,
})
// export type IRegistrationForm = z.infer<typeof signupFormSchema>

// Login form schema
export const zodSigninFormSchema = z.object({
  email: zodEmailSchema,
  password: passwordSchema,
})
// export type ISigninUser = z.infer<typeof signinFormSchema>

// Reset password form schema
export const zodResetPasswordFormSchema = z.object({
  // email: zodEmailSchema,
  password: passwordSchema,
})
// export type IResetPassword = z.infer<typeof resetPasswordFormSchema>

// Reset password form schema
export const zodNewTokenFormSchema = z.object({
  email: zodEmailSchema,
})
// export type INewToken = z.infer<typeof newTokenFormSchema>

// Reset password form schema
export const zodForgotPasswordFormSchema = z.object({
  email: zodEmailSchema,
})
// export type IForgotPassword = z.infer<typeof forgotPasswordFormSchema>
