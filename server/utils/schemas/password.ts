import { z } from 'zod'
import { passwordPattern } from '../../utils/patterns'

export const passwordSchema = z
  .string({
    invalid_type_error: 'Password must be a string',
  })
  .regex(new RegExp(passwordPattern, 'i'), { message: 'Please enter a valid password' })
