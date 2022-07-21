import jwt from 'jsonwebtoken'

export const signToken = (_id: string, email: string) => {
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined')
	}

	const token = jwt.sign(
		{
			_id,
			email
		},
		process.env.JWT_SECRET,
		{
			expiresIn: '3h'
		}
	)

	return token
}

export const isValidToken = (token: string): Promise<string> => {
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined')
	}

	return new Promise((resolve, reject) => {
		try {
			jwt.verify(token, process.env.JWT_SECRET || '', (err, decoded) => {
				if (err) return reject(new Error('Invalid token'))

				const { _id } = decoded as { _id: string; email: string }
				return resolve(_id)
			})
		} catch (error) {
			reject(new Error('Invalid token'))
		}
	})
}
