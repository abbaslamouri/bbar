import { z } from 'zod'

// const mediaTypes = ['image/png', 'image/png', 'image/webp', 'text/csv', 'application/pdf']

export const mongoMediaObj = {
  name: {
    bsonType: 'string',
    description: 'Mrdia name',
  },
  originalName: {
    bsonType: 'string',
    description: 'Media original name',
  },
  slug: {
    bsonType: 'string',
    description: 'Media slug',
  },
  altText: {
    bsonType: 'string',
    description: 'Media alt text',
  },
  mediaType: {
    bsonType: 'string',
    enum: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'text/csv', 'application/pdf'],
    description: 'Media file type',
  },
  size: {
    bsonType: 'int',
    description: 'Media file size',
    maximum: 1024 * 1000,
  },
  dateCreated: {
    bsonType: 'date',
    description: 'Date added',
  },
}

export const zodMediaSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  originalName: z.string(),
  slug: z.string(),
  altText: z.string().optional(),
  mediaType: z.enum(['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'text/csv', 'application/pdf']),
  size: z.number(),
  dateCreated: z.string(),
  uploading: z.boolean().optional(),
  position: z.number().optional(),
  // folder: z.string(),
})
export type IMedia = z.infer<typeof zodMediaSchema>

export default {
  validator: {
    $jsonSchema: {
      required: ['name', 'originalName', 'slug', 'mediaType', 'size', 'dateCreated'],
      properties: mongoMediaObj,
    },
  },
}
