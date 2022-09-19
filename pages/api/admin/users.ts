import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { IResMessage, IResUsers } from '../../../interface'
import { User } from '../../../models'
import { isValidObjectId } from 'mongoose'

type Data = IResMessage | IResUsers

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'GET':
			return getUsers(req, res)
		case 'PUT':
			return updateUsers(req, res)
		default:
			return res
				.status(400)
				.json({ status: 'fail', message: 'Method not allowed' })
	}
}
const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	await db.connect()
	const users = await User.find().select('-password').lean()

	return res.status(200).json({ status: 'success', data: users })
}
const updateUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { userId = '', role = '' } = req.body
	console.log('🚀 ~ file: users.ts ~ line 32 ~ updateUsers ~ role', role)
	console.log('🚀 ~ file: users.ts ~ line 32 ~ updateUsers ~ userId', userId)

	if (!isValidObjectId(userId)) {
		return res.status(400).json({ status: 'fail', message: 'Invalid user id' })
	}

	if (!(role === 'admin' || role === 'client')) {
		return res.status(400).json({ status: 'fail', message: 'Invalid role' })
	}

	await db.connect()
	const user = await User.findByIdAndUpdate(userId, {
		role: role.toLowerCase()
	}).lean()

	if (!user) {
		return res.status(404).json({ status: 'fail', message: 'User not found' })
	}

	await db.disconnect()

	return res.status(200).json({ status: 'success', message: 'User updated' })
}
