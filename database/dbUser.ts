import bcrypt from 'bcryptjs'

import { User } from '../models'
import { db } from './'

export const CheckUserEmailPassword = async (
	email: string = '',
	password: string = ''
) => {
	await db.connect()
	const user = await User.findOne({ email })
	await db.disconnect()

	if (!user) {
		return null
	}

	if (!bcrypt.compareSync(password, user.password!)) {
		return null
	}

	const { _id, role, name } = user

	return { _id, role, name, email: email.toLowerCase() }
}

export const oAUthToDbUser = async (
	oAuthEmail: string = '',
	oAuthName: string = '',
	accountProvider: string = ''
) => {
	const emailTemp = `${oAuthName
		.toLowerCase()
		.split(' ')
		.join('_')}@${accountProvider}.com`

	await db.connect()
	const user = await User.findOne({ email: emailTemp })

	if (user) {
		await db.disconnect()
		const { _id, role, name, email } = user
		return { _id, role, name, email }
	}

	const newUser = new User({
		email: emailTemp,
		name: oAuthName,
		password: '@',
		role: 'client'
	})

	await newUser.save()
	await db.disconnect()

	const { _id, role, name, email } = newUser
	return { _id, role, name, email }
}
