import type { NextApiRequest, NextApiResponse } from 'next'
import { IResMessage } from '../../../interface'
import { User } from '../../../models'
import { db } from '../../../database'
import { jwt } from '../../../utils'

type Data =
	| IResMessage
	| {
			status: 'success'
			data: {
				token: string
				user: { name: string; role: string; email: string }
			}
	  }

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'GET':
			return checkToken(req, res)

		default:
			return res
				.status(400)
				.json({ status: 'fail', message: 'Method not allowed' })
	}
}
const checkToken = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { token = '' } = req.cookies

	let userId = ''

	try {
		userId = await jwt.isValidToken(token)
	} catch (error) {
		return res.status(401).json({ status: 'fail', message: 'Invalid token' })
	}

	db.connect()
	const user = await User.findById(userId).lean()
	db.disconnect()

	if (!user) {
		return res
			.status(400)
			.json({ status: 'fail', message: 'User not found - email' })
	}

	const { name, role, _id, email } = user

	const newToken = jwt.signToken(_id, email)

	res.status(200).json({
		status: 'success',
		data: { token: newToken, user: { name, role, email } }
	})
}
