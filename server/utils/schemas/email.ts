import { z } from 'zod'

export const zodEmailSchema = z
  .string({
    invalid_type_error: 'Email must be a string',
  })
  .email({ message: 'Please enter a valid email' })
