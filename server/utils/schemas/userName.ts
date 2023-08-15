import { z } from 'zod'

export const userNameSchema = z
  .string({
    invalid_type_error: 'Name must be a string',
  })
  .nonempty({ message: 'Name is required' })
  .min(2, { message: 'Name must be 2 or more characters' })
  .max(40, { message: 'Name must be 40 or fewer characters' })
