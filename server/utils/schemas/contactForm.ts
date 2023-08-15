import { z } from 'zod'
import { userNameSchema } from './userName'
import { zodEmailSchema } from './email'

export const contactFormSchema = z.object({
  name: userNameSchema,
  email: zodEmailSchema,
  // phone: z.string().regex(new RegExp(phonePattern, 'i'), { message: 'Please enter a valid phone number' }).optional(),
  subject: z
    .string({
      invalid_type_error: 'Message must be a string',
    })
    .max(50, { message: 'Message must be 50 or fewer characters' }),
  message: z
    .string({
      invalid_type_error: 'Message must be a string',
    })
    .nonempty({ message: 'Message is required' })
    .max(500, { message: 'Message must be 500 or fewer characters' }),
})
