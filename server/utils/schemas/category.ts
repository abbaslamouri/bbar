import { z } from 'zod'
import { zodMediaSchema } from './media'

const mongoCategoryObj = {
  name: {
    bsonType: 'string',
    description: 'Category name is required and 100 characters max',
    maxLength: 100,
  },
  slug: {
    bsonType: 'string',
    description: 'Category slug is required and 200 characters max',
    maxLength: 200,
  },
  description: {
    bsonType: 'string',
    description: 'Category description and 100 characters max',
    maxLength: 200,
  },
  gallery: {
    bsonType: 'array',
    description: 'Category images',
    uniqueItems: true,
    items: {
      bsonType: 'objectId',
    },
  },
  dateCreated: {
    bsonType: 'date',
    description: 'Date created',
  },
}

export const zodCategorySchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  gallery: z.array(zodMediaSchema).optional(),
  dateCreated: z.string(),
})
export type ICategory = z.infer<typeof zodCategorySchema>

export default {
  validator: {
    $jsonSchema: {
      required: ['name', 'slug'],
      properties: mongoCategoryObj,
    },
  },
}
