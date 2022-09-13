import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { db } from '../../../database'
import { IOrder, IResMessage } from '../../../interface'
import { Order, Product } from '../../../models'

type Data =
	| {
			name: string
	  }
	| IResMessage
	| { status: 'success' | 'fail'; data: IOrder }

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'POST':
			return createOrder(req, res)

		default:
			return res
				.status(400)
				.json({ status: 'fail', message: 'Method not allowed' })
	}
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { orderItems, total } = req.body as IOrder

	const session: any = await getSession({ req })

	if (!session) {
		return res.status(401).json({ status: 'fail', message: 'Unauthorized' })
	}

	const productsIds = orderItems.map(p => p._id)

	db.connect()
	const dbProducts = await Product.find({ _id: { $in: productsIds } })

	try {
		const subTotal = orderItems.reduce((acc, product) => {
			const currentPrice = dbProducts.find(
				p => p.id.toString() === product._id.toString()
			)!.price

			if (!currentPrice) {
				throw new Error('verify product price')
			}

			return acc + currentPrice * product.quantity
		}, 0)

		const taxRate = +(process.env.NEXT_PUBLIC_TAX_RATE || 0)
		const backendTotal = subTotal * (taxRate + 1)

		if (total !== backendTotal) {
			return res
				.status(400)
				.json({ status: 'fail', message: 'Total is not correct' })
		}

		const userId = session.user._id
		const newOrder = new Order({ ...req.body, isPaid: false, user: userId })
		await newOrder.save()
		db.disconnect()

		return res.status(201).json({ status: 'success', data: newOrder })
	} catch (error) {
		db.disconnect()
		console.log(error)
		res
			.status(400)
			.json({ status: 'fail', message: 'Revise logs del servidor' })
	}
}
