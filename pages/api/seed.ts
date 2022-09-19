import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from '../../database'
import { Product, User } from '../../models'
import { IResMessage } from '../../interface'

type Data = IResMessage

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (process.env.NODE_ENV === 'production') {
		return res
			.status(401)
			.json({ status: 'fail', message: 'no tiene acceso a este servicio' })
	}

	await db.connect()
	await User.deleteMany()
	await User.insertMany(seedDatabase.initialData.users)

	await Product.deleteMany()
	await Product.insertMany(seedDatabase.initialData.products)

	await db.disconnect()

	res.status(200).json({ status: 'success', message: 'seeded' })
}
