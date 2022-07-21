import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { IResMessage } from '../../../interface'
import { User } from '../../../models'
import { db } from '../../../database'
import { jwt, validations } from '../../../utils'

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
			return registerUser(req, res)

		default:
			return res
				.status(400)
				.json({ status: 'fail', message: 'Method not allowed' })
	}
}
const registerUser = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const {
		name = '',
		email = '',
		password = ''
	} = req.body as { name: string; email: string; password: string }

	// TODO: validate email
	if (!validations.isValidEmail(email)) {
		return res.status(400).json({
			status: 'fail',
			message: 'Invalid email'
		})
	}

	if (password.length < 6) {
		return res.status(400).json({
			status: 'fail',
			message: 'Password must be at least 6 characters'
		})
	}

	if (name.length < 1) {
		return res
			.status(400)
			.json({ status: 'fail', message: 'Name must be at least 1 character' })
	}

	db.connect()
	const user = await User.findOne({ email })

	if (user) {
		db.disconnect()
		return res
			.status(400)
			.json({ status: 'fail', message: 'User not found - email' })
	}

	const newUser = new User({
		name,
		email: email.toLowerCase(),
		password: bcrypt.hashSync(password),
		role: 'client'
	})

	try {
		await newUser.save({ validateBeforeSave: true })
	} catch (error) {
		console.log(error)
		return res
			.status(400)
			.json({ status: 'fail', message: "Couldn't save user" })
	}

	const { _id, role } = newUser

	const token = jwt.signToken(_id, email)

	res.status(200).json({
		status: 'success',
		data: { token, user: { name, role, email } }
	})
}
