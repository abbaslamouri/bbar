import { z } from 'zod'
import { zodCategorySchema } from './category'
import { zodMediaSchema } from './media'

export const mongoProductObj = {
	name: {
		bsonType: 'string',
		description: 'Product name is required and 100 characters max',
		maxLength: 100,
	},
	displayName: {
		bsonType: 'string',
		description: 'Product display name 100 characters max',
		maxLength: 100,
	},
	slug: {
		bsonType: 'string',
		description: 'Product slug is required and 100 characters max',
		maxLength: 200,
	},
	description: {
		bsonType: 'string',
		description: 'Description',
	},
	excerpt: {
		bsonType: 'string',
		description: 'Product short decsription',
	},
	sku: {
		bsonType: 'string',
		description: 'Product sku',
	},
	price: {
		bsonType: 'number',
		description: 'Product price',
		maxLength: 500,
	},
	salePrice: {
		bsonType: 'number',
		description: 'Product sale price',
	},
	salePriceStartDate: {
		bsonType: 'date',
		description: 'Sale price start date',
	},
	salePriceEndDate: {
		bsonType: 'date',
		description: 'Sale price end date',
	},
	// manageInventory: {
	//   bsonType: 'bool',
	//   description: 'Whether to manage inventory or not',
	// },
	// inStock: {
	//   bsonType: 'bool',
	//   description: 'True if product is in stock',
	// },
	// stockQty: {
	//   bsonType: 'int',
	//   description: 'Stock quantity',
	// },
	// qtySold: {
	//   bsonType: 'int',
	//   description: 'Quantity sold',
	// },
	gallery: {
		bsonType: 'array',
		description: 'Product images',
		uniqueItems: true,
		items: {
			bsonType: 'objectId',
		},
	},
	categories: {
		bsonType: 'array',
		description: 'Product categories',
		uniqueItems: true,
		items: {
			bsonType: 'objectId',
		},
	},
	// sortOrder: {
	//   bsonType: 'int',
	//   description: 'Used to sort products',
	// },
	featured: {
		bsonType: 'bool',
		description: 'True if product is featured',
	},
	shippingWeight: {
		bsonType: 'number',
		description: 'Product packaged weight',
	},
	shippingWidth: {
		bsonType: 'number',
		description: 'Product packaged width',
	},
	shippingLength: {
		bsonType: 'number',
		description: 'Product packaged legth',
	},
	shippingHeight: {
		bsonType: 'number',
		description: 'Product packaged height',
	},
	upSells: {
		bsonType: 'array',
		description: 'Upsell products',
		uniqueItems: true,
		items: {
			bsonType: 'objectId',
		},
	},
	crossSells: {
		bsonType: 'array',
		description: 'Cpsell products',
		uniqueItems: true,
		items: {
			bsonType: 'objectId',
		},
	},
	shippingClass: {
		bsonType: 'string',
		description: 'shipping class',
	},
	TaxStatus: {
		bsonType: 'string',
		description: 'Tax status is either taxable or 1 or non-taxable or 0',
	},
	TaxClass: {
		bsonType: 'string',
		description: 'Tax class id either standard or other',
	},
	dateCreated: {
		bsonType: 'date',
		description: 'Date created',
	},
	status: {
		enum: ['public', 'private', 'draft', 'archived'],
		description: 'Status is required and can only be one of the following: Draft, Archived, Published or Private.',
	},
}

const zodBaseProductSchema = z.object({
	_id: z.string().optional(),
	name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
	displayName: z.string(),
	slug: z.string(),
	description: z.string(),
	excerpt: z.string(),
	sku: z.string(),
	price: z.number({ required_error: 'Price is required', invalid_type_error: 'Price must be a number' }).positive(),
	salePrice: z.number({ invalid_type_error: 'Price must be a number' }).positive().optional(),
	salePriceStartDate: z.string().optional(),
	salePriceEndDate: z.string().optional(),
	// manageInventory: z.boolean(),
	// inStock: z.boolean(),
	// stockQty: z.number(),
	// qtySold: z.number(),
	gallery: z.array(zodMediaSchema),
	// gallery: z.array(z.string()),
	categories: z.array(zodCategorySchema).optional(),
	// categories: z.array(z.string()),
	// sortOrder: z.number(),
	featured: z.boolean(),
	shippingWeight: z.number(),
	shippingWidth: z.number(),
	shippingLength: z.number(),
	shippingHeight: z.number(),
	// upSells: z.array(z.string()),
	// crossSells: z.array(z.string()),
	shippingClass: z.string(),
	taxStatus: z.string(),
	taxClass: z.string(),
	dateCreated: z.string(),
	status: z.enum(['public', 'private', 'draft', 'archived']),
})

export const zodProductSchema = zodBaseProductSchema.extend({
	upSells: z.array(zodBaseProductSchema).optional(),
	crossSells: z.array(zodBaseProductSchema).optional(),
})
export type IProduct = z.infer<typeof zodProductSchema>

export default {
	validator: {
		$jsonSchema: {
			required: ['name', 'slug', 'price'],
			properties: mongoProductObj,
		},
	},
}
