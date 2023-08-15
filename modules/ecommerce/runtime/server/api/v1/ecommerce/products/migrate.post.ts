import slugify from 'slugify'
// import errorHandler from '~/utils/errorHandler'
// import { IProduct, ICategory } from '~/server/schemas/product'
import { randomBytes } from 'crypto'
import { isAuthorized } from '#auth'

import { ObjectId } from 'mongodb'
// import AppError from '~/utils/AppError'

// import { UnAuthenticated, UnAuthorized, SessionTokenNotVerified } from '~/utils/errorCodes'

import mongoClientPromise from '~/server/utils/mongoDbClient'

export default defineEventHandler(async (event) => {
	try {
		const authorized = isAuthorized(event, ['admin'])
		if (authorized instanceof Error) return errorHandler(event, authorized)

		const { productsObj } = await readBody(event)

		const mongoDbClient = await mongoClientPromise
		const products = []
		for (const product of productsObj) {
			const newProduct = {
				WPId: +product.WPId,
				name: product.name,
				displayName: product.displayName,
				slug: product.slug,
				description: product.description,
				excerpt: product.excerpt,
				sku: randomBytes(8).toString('hex'),
				price: +product.price,
				salePrice: +product.price,
				// stockQty: +product.stockQty,
				// inStock: product.inStock == 'TRUE' ? true : false,
				gallery: [] as string[],
				categories: [] as Array<ObjectId>,
				sortOrder: +product.sortOrder,
				featured: product.featured == 'TRUE' ? true : false,
				shippingWeight: +product.shippingWeight,
				shippingWidth: +product.shippingWidth,
				shippingLength: +product.shippingLength,
				shippingHeight: +product.shippingHeight,
				salePriceStartDate: new Date(),
				salePriceSEndDate: new Date('2024-07-20'),
				crossSells: [],
				upSells: [],
				shippingClass: product.shippingClass,
				taxStatus: product.taxStatus,
				taxClass: product.taxClass,
				status: product.status,
				dateCreated: new Date(),
			}
			// let newProduct = {} as IProduct
			//categroies
			const categoriesArr = product.categories.split(',')
			newProduct.categories = []
			for (const cat of categoriesArr) {
				if (!cat) continue
				const category = await mongoDbClient.db().collection('categories').findOne({ name: cat.trim() })
				if (category) {
					newProduct.categories.push(category._id)
				} else {
					const { insertedId } = await mongoDbClient
						.db()
						.collection('categories')
						.insertOne({
							name: cat.trim(),
							slug: slugify(cat.trim(), { lower: true }),
						})
					if (insertedId) newProduct.categories.push(insertedId)
				}
			}

			//gallery
			const galleryArr = product.gallery.split(',')
			// console.log('G', galleryArr)

			// product.gallery = []
			for (const image of galleryArr) {
				if (!image) continue
				const index = newProduct.gallery.findIndex((img: string) => img === image.trim())
				console.log('I', index)
				if (index === -1) newProduct.gallery.push(image.trim())
			}

			products.push(newProduct)
		}
		// return products
		await mongoDbClient.db().collection('products').deleteMany()
		return await mongoDbClient.db().collection('products').insertMany(products)
	} catch (err) {
		return errorHandler(event, err)
	}
})

// name: 'Hello',
// displayName: 'Hello Lamp',
// sku: '',
// description: 'Some description',
// excerpt: 'Some excerpt',
// price: '2589',
// salePrice: '2067',
// stockQty: 10,
// gallery: [] as string[],
// categories: [] as string[],
// featured: false,
// shippingWeight: 0,
// shippingWidth: 0,
// shippinglength: 0,
// shippingLength: 0,
// shippingHeight: 0,
// salePriceStartDate: '',
// salePriceEndDate: '',
// upSells: [] as string[],
// crosssSells: [] as string[],
// shippingClass: '',
// taxStatus: 'taxable',
// taxClass: 'standard',
// status: 'public',
// dateCreated: '',
