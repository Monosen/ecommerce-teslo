import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Product } from '../../../models'
import { IResProducts, IResMessage, SHOP_CONSTANST } from '../../../interface'

type Data = IResProducts | IResMessage

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'GET':
			return getProducts(req, res)

		default:
			return res
				.status(400)
				.json({ status: 'fail', message: 'Method not allowed' })
	}
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { gender = 'all' } = req.query

	let condition = {}

	if (gender !== 'all' && SHOP_CONSTANST.validGender.includes(`${gender}`)) {
		condition = { gender }
	}

	await db.connect()
	const products = await Product.find(condition)
		.select('title images price inStock slug -_id')
		.lean()
	await db.disconnect()

	const uploadProducts = products.map(product => {
		product.images = product.images.map(image => {
			return image.includes('http') ? image : `/products/${image}`
		})
		return product
	})

	res.status(200).json({ status: 'success', data: uploadProducts })
}
