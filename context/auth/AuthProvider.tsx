import axios from 'axios'
import Cookies from 'js-cookie'
import { FC, PropsWithChildren, useReducer, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'

import { tesloApi } from '../../api'
import { IUser } from '../../interface'
import { AuthContext, authReducer } from './'

export interface AuthState {
	isLoggedIn: boolean
	user?: IUser
}

const AUTH_INITIAL_STATE: AuthState = {
	isLoggedIn: false,
	user: undefined
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
	const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)
	// const router = useRouter()
	const { data, status } = useSession()

	useEffect(() => {
		if (status === 'authenticated') {
			dispatch({ type: '[Auth] - Login', payload: data?.user as IUser })
		}
	}, [data, status])

	const loginUser = async (
		email: string,
		password: string
	): Promise<boolean> => {
		try {
			const { data } = await tesloApi.post('/user/login', { email, password })
			const { token, user } = data.data

			Cookies.set('token', token)

			dispatch({ type: '[Auth] - Login', payload: user })
			return true
		} catch (error) {
			console.log(error)
			return false
		}
	}

	const registerUser = async (
		name: string,
		email: string,
		password: string
	): Promise<{ hasError: boolean; message?: string }> => {
		try {
			const { data } = await tesloApi.post('/user/register', {
				name,
				email,
				password
			})
			const { token, user } = data.data

			Cookies.set('token', token)

			dispatch({ type: '[Auth] - Login', payload: user })

			return {
				hasError: false
			}
		} catch (error) {
			console.log(error)
			if (axios.isAxiosError(error)) {
				return {
					hasError: true,
					message: (error.response?.data as { message: string; status: string })
						?.message
				}
			}

			return {
				hasError: true,
				message: 'Something went wrong, please try again'
			}
		}
	}

	const logoutUser = () => {
		// Cookies.remove('token')
		Cookies.remove('cart')
		Cookies.remove('address')
		signOut()
		// router.reload()

		// try {
		// 	dispatch({ type: '[Auth] - Logout' })
		// 	return true
		// } catch (error) {
		// 	console.log(error)
		// 	return false
		// }
	}

	// useEffect(() => {
	// 	checkToken()
	// }, [])

	// const checkToken = async () => {
	// 	if (!Cookies.get('token')) {
	// 		return
	// 	}

	// 	try {
	// 		const { data } = await tesloApi.get('/user/validate-token')
	// 		const { token, user } = data.data

	// 		Cookies.set('token', token)
	// 		dispatch({ type: '[Auth] - Login', payload: user })
	// 	} catch (error) {
	// 		Cookies.remove('token')
	// 		console.log(error)
	// 	}
	// }

	return (
		<AuthContext.Provider
			value={{ ...state, loginUser, registerUser, logoutUser }}
		>
			{children}
		</AuthContext.Provider>
	)
}
