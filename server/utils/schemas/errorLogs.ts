import { z } from 'zod'

export const erroLogObj = {
  name: {
    bsonType: 'string',
    description: 'Error name ',
  },
  code: {
    bsonType: 'number',
    description: 'Error code',
  },
  errorCode: {
    bsonType: 'string',
    description: 'Error errorCode',
  },
  messages: {
    bsonType: 'array',
    description: 'Error messaes',
    // uniqueItems: true,
    items: {
      bsonType: 'string',
    },
  },
  dateCreated: {
    bsonType: 'date',
    description: 'Date created',
  },
}

export const zodErrorLogSchema = z.object({
  name: z.string(),
  code: z.number(),
  errorCode: z.string(),
  messages: z.array(z.string()),
  dateCreated: z.date(),
})
export type IErrorLog = z.infer<typeof zodErrorLogSchema>

export default {
  validator: {
    $jsonSchema: {
      // required: ['status', 'orderDate', 'items', 'customer', 'cartTotal'],
      properties: erroLogObj,
    },
  },
}
