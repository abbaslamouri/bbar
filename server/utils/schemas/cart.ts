import { z } from 'zod'

import { mongoProductObj, zodProductSchema } from './product'
import { mongoUserObj, zodUserAddressSchema, zodUserSchema } from './user'
import { zodEmailSchema } from './email'

export const mongoCartItemObj = {
  name: {
    bsonType: 'string',
    description: 'Product name is required and 50 characters max',
    maxLength: 50,
  },
  description: {
    bsonType: 'string',
    description: 'Product description is required and 50 characters max',
    maxLength: 200,
  },
  sku: {
    bsonType: 'string',
    description: 'sku',
  },
  price: {
    bsonType: 'number',
    description: 'Product SKU',
  },
  salePrice: {
    bsonType: 'number',
    description: 'Product sale price',
  },
  gallery: {
    bsonType: 'string',
    description: 'Product images',
  },

  quantity: {
    bsonType: 'number',
    description: 'Quantity',
  },
}

export const zodCartItemSchema = zodProductSchema
  .pick({
    _id: true,
    name: true,
    description: true,
    sku: true,
    price: true,
    salePrice: true,
    gallery: true,
    // quantity: z.number().int().positive(),
  })
  .extend({ quantity: z.number().int().positive() })
export type ICartItem = z.infer<typeof zodCartItemSchema>

const mongoCartObj = {
  properties: {
    status: {
      bsonType: 'string',
      enum: ['cart', 'checkout', 'billing', 'shipping', 'payment', 'processing'],
      description: 'Cart status',
    },
    orderDate: {
      bsonType: ['date', 'null'],
      description: 'Order creation date',
    },
    items: {
      bsonType: 'array',
      description: 'Order items',
      required: ['_id', 'name', 'description', 'sku', 'price', 'salePrice', 'quantity', 'gallery'],
      properties: mongoCartItemObj,
    },
    removedItems: {
      bsonType: 'array',
      description: 'order items',
      required: ['_id', 'name', 'description', 'sku', 'price', 'salePrice', 'quantity', 'gallery'],
      properties: mongoCartItemObj,
    },
    customer: mongoUserObj,
    cartTotal: {
      bsonType: 'number',
      description: 'Cart total is required',
    },
    deliveryInstructions: {
      bsonType: 'string',
      description: 'Delivery instructions 2000 characters max',
      maxLength: 2000,
    },
  },
}

export const cartSchema = z.object({
  _id: z.string(),
  status: z.string(),
  orderDate: z.date(),
  items: z.array(zodCartItemSchema),
  removedItems: z.array(zodCartItemSchema),
  // createAccount: z.boolean(),
  customer: zodUserSchema.extend({ createAccount: z.boolean() }),
  total: z.number(),

  deliveryInstructions: z.string(),
})
export type ICart = z.infer<typeof cartSchema>

export default {
  validator: {
    $jsonSchema: {
      required: ['status', 'orderDate', 'items', 'customer', 'cartTotal'],
      properties: mongoCartObj,
    },
  },
}
