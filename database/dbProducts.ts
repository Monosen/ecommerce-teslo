import { db } from '.'
import { IProduct } from '../interface'
import { Product } from '../models'

export const getProductBySlug = async (
	slug: string
): Promise<IProduct | null> => {
	await db.connect()
	const product = await Product.findOne({ slug }).lean()
	await db.disconnect()

	if (!product) {
		return null
	}

	product.images = product.images.map(image => {
		if (image.includes('http')) {
			return image
		}

		if (!image.includes('http')) {
			if (!image.includes('/products/')) {
				return `/products/${image}`
			}
		}

		return image
	})

	return JSON.parse(JSON.stringify(product))
}

interface ProductSlut {
	slug: string
}

export const getAllProductsSlug = async (): Promise<ProductSlut[]> => {
	await db.connect()
	const slugs = await Product.find().select('slug -_id').lean()
	await db.disconnect()

	return slugs
}

export const getProductsByTerm = async (term: string): Promise<IProduct[]> => {
	term = term.toString().toLowerCase()

	await db.connect()
	const products = await Product.find({ $text: { $search: term } })
		.select('title images price inStock slig -_id')
		.lean()
	await db.disconnect()

	const uploadProducts = products.map(product => {
		product.images = product.images.map(image => {
			return image.includes('http') ? image : `/products/${image}`
		})

		return product
	})

	return uploadProducts
}

export const getAllProducts = async (): Promise<IProduct[]> => {
	await db.connect()
	const products = await Product.find()
		.select('title images price inStock slig -_id')
		.lean()
	await db.disconnect()
	const uploadProducts = products.map(product => {
		product.images = product.images.map(image => {
			return image.includes('http') ? image : `/products/${image}`
		})

		return product
	})

	return JSON.parse(JSON.stringify(uploadProducts))
}
