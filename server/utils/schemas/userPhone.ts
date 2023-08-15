import { z } from 'zod'

export const mongoUserPhoneObj = {
  phoneType: {
    bsonType: 'string',
    enum: ['Cell', 'Home', 'Work'],
    description: 'User [phone type]',
    maxLength: 5,
  },
  phoneCountryCode: {
    bsonType: 'number',
    description: 'phone country code is required and 200 characters max',
  },
  phoneNumber: {
    bsonType: 'string',
    description: 'User phone number is required and 200 characters max',
    maxLength: 20,
  },
  isDefault: {
    bsonType: 'bool',
    description: 'Default phone number',
  },
}

export const zodUserPhoneSchema = z.object({
  phoneType: z.enum(['Cell', 'Home', 'Work']),
  phoneCountryCode: z.string(),
  phoneNumber: z.string(),
  isDefault: z.boolean(),
})
export type IUserPhone = z.infer<typeof zodUserPhoneSchema>
