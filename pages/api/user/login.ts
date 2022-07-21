import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
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
		case 'POST':
			return loginUser(req, res)

		default:
			return res
				.status(400)
				.json({ status: 'fail', message: 'Method not allowed' })
	}
}
const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { email = '', password = '' } = req.body
	db.connect()
	const user = await User.findOne({ email })
	db.disconnect()

	if (!user) {
		return res
			.status(400)
			.json({ status: 'fail', message: 'User not found - email' })
	}

	if (!bcrypt.compareSync(password as string, user.password!)) {
		return res
			.status(400)
			.json({ status: 'fail', message: 'User not found - password' })
	}

	const { name, role, _id } = user

	const token = jwt.signToken(_id, email)

	res.status(200).json({
		status: 'success',
		data: { token, user: { name, role, email } }
	})
}
