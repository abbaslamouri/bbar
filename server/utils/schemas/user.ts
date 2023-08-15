import { z } from 'zod'
import { zodEmailSchema } from './email'
import { passwordSchema } from './password'
import { userNameSchema } from './userName'

const mongoUserAddressObj = {
  salutation: {
    bsonType: 'string',
    description: 'User address title is required and 200 characters max',
    maxLength: 5,
  },
  addressType: {
    type: 'string',
    enum: ['Residential', 'Commercial'],
    description: 'Address type and is required',
  },
  name: {
    bsonType: 'string',
    description: 'User address name is required and 200 characters max',
    maxLength: 50,
  },
  company: {
    bsonType: 'string',
    description: 'User address company is required and 200 characters max',
    maxLength: 50,
  },
  country: {
    bsonType: 'string',
    description: 'User address country is required and 200 characters max',
  },
  street: {
    bsonType: 'string',
    description: 'User address line 1 is required and 200 characters max',
    maxLength: 100,
  },
  street2: {
    bsonType: 'string',
    description: 'User address line 2 is required and 200 characters max',
    maxLength: 100,
  },
  city: {
    bsonType: 'string',
    description: 'User address city is required and 200 characters max',
    maxLength: 100,
  },
  provence: {
    bsonType: 'string',
    description: 'User address state is required and 200 characters max',
  },
  postalCode: {
    bsonType: 'string',
    description: 'User address postal code is required and 200 characters max',
    maxLength: 100,
  },
}

export const zodUserAddressSchema = z.object({
  salutation: z.string(),
  addressType: z.enum(['Residential', 'Commercial']),
  name: userNameSchema,
  company: z.string(),
  country: z.string(),
  street: z.string(),
  street2: z.string(),
  city: z.string(),
  provence: z.string(),
  postalCode: z.string(),
})
export type IUserAddress = z.infer<typeof zodUserAddressSchema>

export const mongoUserObj = {
  name: {
    bsonType: 'string',
    description: 'User name is required. 1 character min and 200 characters max',
    maxLength: 100,
    minLength: 1,
  },
  email: {
    bsonType: 'string',
    description: 'User email is required. 3 character min and 200 characters max',
    maxLength: 100,
    minLength: 3,
    // pattern: emailPattern,
  },
  password: {
    bsonType: 'string',
    description: 'User password is required',
    // pattern: passwordPattern,
  },
  avatar: {
    bsonType: 'string',
    description: 'User Avatar',
  },
  role: {
    type: 'string',
    enum: ['admin', 'editor', 'guest'],
    description: 'User role is required',
  },
  active: {
    bsonType: 'bool',
    description: 'Whether the user is active',
  },
  verified: {
    bsonType: 'bool',
    description: 'Whether the user is verified',
  },
  shippingAddress: {
    bsonType: 'object',
    description: 'User shipping address',
    properties: mongoUserAddressObj,
  },
  billingAddress: {
    bsonType: 'object',
    description: 'User billing address',
    properties: mongoUserAddressObj,
  },
  registrationDate: {
    bsonType: 'date',
    description: 'Last time user logged in',
  },
  lastLoginDate: {
    bsonType: 'date',
    description: 'Last time user logged in',
  },
  passwordChangeDate: {
    bsonType: 'date',
    description: 'Password change date',
  },
  passwordResetToken: {
    bsonType: 'string',
    description: 'Password reset token',
  },
  passwordResetExpiryDate: {
    bsonType: ['date', 'null'],
    description: 'Password reset token expiry',
  },
}

export const zodUserSchema = z.object({
  _id: z.string(),
  name: userNameSchema,
  email: zodEmailSchema,
  password: passwordSchema,
  avatar: z.string(),
  role: z.string(),
  active: z.boolean(),
  verified: z.boolean(),
  registrationDate: z.date(),
  lastLoginDate: z.date(),
  passwordChangeDate: z.date(),
  passwordResetToken: z.string(),
  passwordResetExpiryDate: z.date(),
})
export type IUser = z.infer<typeof zodUserSchema>

export default {
  validator: {
    $jsonSchema: {
      required: ['name', 'email', 'role', 'password', 'verified', 'active', 'signupDate', 'passwordChangeDate'],
      properties: mongoUserObj,
    },
  },
}

// export const zodPublicUserSchema = zodUserSchema.pick({
//   _id: true,
//   name: true,
//   email: true,
//   avatar: true,
//   role: true,
// })
// export type IPublicUser = z.infer<typeof zodPublicUserSchema>
