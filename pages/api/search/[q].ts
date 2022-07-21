import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IResMessage, IResProducts } from '../../../interface'
import { Product } from '../../../models'

type Data = IResMessage | IResProducts

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'GET':
			return searchProducts(req, res)

		default:
			return res
				.status(400)
				.json({ status: 'fail', message: 'Method not allowed' })
	}
}

const searchProducts = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	let { q } = req.query

	if (q.length === 0) {
		return res.status(400).json({ status: 'fail', message: 'Query is empty' })
	}

	q = q.toString().toLowerCase()

	await db.connect()
	const products = await Product.find({ $text: { $search: q } })
		.select('title images price inStock slig -_id')
		.lean()
	await db.disconnect()

	res.status(200).json({ status: 'success', data: products })
}
