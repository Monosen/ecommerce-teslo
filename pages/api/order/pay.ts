import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { IPaypal, IResMessage } from '../../../interface'
import { db } from '../../../database'
import { Order } from '../../../models'

type Data = IResMessage

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
	switch (req.method) {
		case 'POST':
			return payOrder(req, res)

		default:
			return res
				.status(400)
				.json({ status: 'fail', message: 'Method not allowed' })
	}
}

const getPaypalBearerToken = async (): Promise<string | null> => {
	const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
	const PAYPAL_SECRET = process.env.PAYPAL_SECRET

	const body = new URLSearchParams('grant_type=client_credentials')
	const base64Token = Buffer.from(
		`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,
		'utf-8'
	).toString('base64')

	try {
		const { data } = await axios.post(
			process.env.PAYPAL_OAUTH_URL || '',
			body,
			{
				headers: {
					Authorization: `Basic ${base64Token}`,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
		)

		return data.access_token
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const message = (error.response as { data: { message: string } })?.data
				.message
			console.log(message)
			return null
		}

		console.log(error)
		return null
	}
}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const paypalBearerToken = await getPaypalBearerToken()

	if (!paypalBearerToken) {
		return res
			.status(400)
			.json({ status: 'fail', message: 'Paypal token not found' })
	}

	const { orderId = '', transactionId = '' } = req.body

	const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(
		`${process.env.PAYPAL_ORDERS_URL}/${transactionId}` || '',
		{
			headers: {
				Authorization: `Bearer ${paypalBearerToken}`
			}
		}
	)

	if (data.status !== 'COMPLETED') {
		return res
			.status(401)
			.json({ status: 'fail', message: 'Order not completed' })
	}

	await db.connect()
	const dbOrder = await Order.findById(orderId)

	if (!dbOrder) {
		await db.disconnect()
		return res.status(400).json({ status: 'fail', message: 'Order not found' })
	}

	if (dbOrder.total !== +data.purchase_units[0].amount.value) {
		await db.disconnect()
		return res
			.status(400)
			.json({ status: 'fail', message: 'Order total not match' })
	}

	dbOrder.transactionId = transactionId
	dbOrder.isPaid = true
	await dbOrder.save()

	await db.disconnect()

	res.status(200).json({ status: 'success', message: 'Order paid' })
}
