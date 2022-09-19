import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import {
	IProduct,
	IResMessage,
	IResProduct,
	IResProducts
} from '../../../interface'
import { Product } from '../../../models'
import { isValidObjectId } from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(process.env.CLOUDINARY_URL || '')

type Data = IResMessage | IResProducts | IResProduct

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case 'GET':
			return getProducts(req, res)
		case 'PUT':
			return updateProduct(req, res)
		case 'POST':
			return createProduct(req, res)
		default:
			return res
				.status(400)
				.json({ status: 'error', message: 'Method not allowed' })
	}
}
const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	await db.connect()

	const products = await Product.find().sort({ title: 'asc' }).lean()

	await db.disconnect()

	const uploadProducts = products.map(product => {
		product.images = product.images.map(image => {
			return image.includes('http') ? image : `/products/${image}`
		})

		return product
	})

	res.status(200).json({ status: 'success', data: uploadProducts })
}
const updateProduct = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { _id = '', images = [] } = req.body as IProduct

	if (!isValidObjectId(_id)) {
		return res
			.status(400)
			.json({ status: 'error', message: 'Invalid product id' })
	}

	if (images.length < 2) {
		return res
			.status(400)
			.json({ status: 'error', message: 'Please upload at least 2 images' })
	}
	try {
		await db.connect()
		const product = await Product.findByIdAndUpdate(_id, req.body)

		if (!product) {
			await db.disconnect()
			return res
				.status(400)
				.json({ status: 'error', message: 'Product not found' })
		}

		const products = product.images.map(async image => {
			if (image.includes('https')) {
				// Borrar de cloudinary
				const [fileId, extension] = image
					.substring(image.lastIndexOf('/') + 1)
					.split('.')
				console.log({ image, fileId, extension })
				await cloudinary.uploader.destroy(fileId, {
					resource_type: 'image'
				})
			}
		})

		await Promise.all(products)

		await db.disconnect()

		res.status(200).json({ status: 'success', message: 'Product updated' })
	} catch (error) {
		await db.disconnect()
		console.log(error)
		res.status(400).json({ status: 'error', message: 'check logs' })
	}
}
const createProduct = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { images = [] } = req.body as IProduct

	if (images.length < 2) {
		return res
			.status(400)
			.json({ status: 'error', message: 'Please upload at least 2 images' })
	}

	try {
		await db.connect()

		const productDb = await Product.findOne({ slug: req.body.slug })

		if (productDb) {
			await db.disconnect()
			return res
				.status(400)
				.json({ status: 'error', message: 'Product already exists with slug' })
		}

		const product = new Product(req.body)
		await product.save()

		await db.disconnect()

		res.status(201).json({ status: 'success', data: product })
	} catch (error) {
		await db.disconnect()
		console.log(error)
		res.status(400).json({ status: 'error', message: 'check logs' })
	}
}
