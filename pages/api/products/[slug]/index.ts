import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../../database'
import { Product } from '../../../../models'
import { IResMessage, IResProduct } from '../../../../interface'

type Data = IResProduct | IResMessage

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'GET':
			return getProductBySlug(req, res)

		default:
			return res
				.status(400)
				.json({ status: 'fail', message: 'Method not allowed' })
	}
}

const getProductBySlug = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	try {
		const { slug } = req.query

		db.connect()
		const product = await Product.findOne({ slug }).lean()
		db.disconnect()

		if (!product) {
			return res
				.status(404)
				.json({ status: 'fail', message: 'Product not found' })
		}

		product.images = product.images.map(image => {
			return image.includes('http') ? image : `/products/${image}`
		})

		res.status(200).json({ status: 'success', data: product })
		console.log({ hola: 'hola' })
	} catch (error) {
		db.disconnect()
		console.log({ error })
		res.status(500).json({ status: 'fail', message: 'Internal server error' })
	}
}
