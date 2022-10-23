import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { dbUser } from '../../../database'

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: {
					label: 'Email',
					type: 'email',
					placeholder: 'email@email.com'
				},
				password: {
					label: 'Password',
					type: 'password',
					placeholder: 'Password'
				}
			},
			async authorize(credentials, req) {
				return await dbUser.CheckUserEmailPassword(
					credentials?.email,
					credentials?.password
				)
			}
		})
		// ...add more providers here
	],

	// Custom Pages
	pages: {
		signIn: '/auth/login',
		newUser: '/auth/register'
	},

	secret: process.env.JWT_SECRET as string,

	session: {
		maxAge: 2592000,
		strategy: 'jwt',
		updateAge: 86400
	},

	callbacks: {
		async jwt({ token, account, user }) {
			if (account) {
				token.accessToken = account.access_token

				switch (account.type) {
					case 'credentials':
						token.user = user
						break
					case 'oauth':
						token.user = await dbUser.oAUthToDbUser(
							user?.email || '',
							user?.name || '',
							account?.provider || ''
						)
						break

					default:
						break
				}
			}
			return token
		},
		async session({ session, user, token }) {
			// console.log({ session, user, token })
			session.accessToken = token.accessToken
			session.user = token.user as any

			return session
		}
	}
})
