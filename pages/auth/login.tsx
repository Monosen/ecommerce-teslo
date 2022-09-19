import { useEffect, useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { getSession, signIn, getProviders } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import {
	Box,
	Button,
	Chip,
	Divider,
	Grid,
	Link,
	TextField,
	Typography
} from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'

import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils'
// import { AuthContext } from '../../context'

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from 'next'

type FormData = {
	email: string
	password: string
}

const LoginPage = () => {
	const router = useRouter()
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>()
	// const { loginUser } = useContext(AuthContext)
	const [showError, setShowError] = useState(false)

	const [providers, setProviders] = useState<any>({})

	useEffect(() => {
		getProviders()
			.then(prov => {
				setProviders(prov)
			})
			.catch(err => {
				console.log(err)
			})
	}, [])

	const onLoginUser = async ({ email, password }: FormData) => {
		setShowError(false)

		// const isValidLogin = await loginUser(email, password)

		// if (!isValidLogin) {
		// 	setShowError(true)
		// 	setTimeout(() => setShowError(false), 3000)
		// 	return
		// }

		// const destination = router.query.p?.toString() || '/'

		// router.replace(destination)
		await signIn('credentials', { email, password })
	}

	return (
		<AuthLayout title='Ingresar'>
			<form onSubmit={handleSubmit(onLoginUser)} noValidate>
				<Box sx={{ width: 350, padding: '10px 20px' }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant='h1' component='h1'>
								Iniciar Sesion
							</Typography>
							{showError && (
								<Chip
									label='No reconocemos ese usuario / contraseña'
									color='error'
									icon={<ErrorOutline />}
									className='fadeIn'
								/>
							)}
						</Grid>
						<Grid item xs={12}>
							<TextField
								type='email'
								{...register('email', {
									required: 'email is required',
									validate: validations.isEmail
								})}
								label='Corrreo'
								variant='filled'
								fullWidth
								error={!!errors.email}
								helperText={errors.email?.message}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								{...register('password', {
									required: 'password is required',
									minLength: { value: 8, message: 'minimo 8 carateres' }
								})}
								label='Contraseña'
								type='password'
								variant='filled'
								fullWidth
								error={!!errors.password}
								helperText={errors.password?.message}
							/>
						</Grid>

						<Grid item xs={12}>
							<Button
								type='submit'
								color='secondary'
								className='circular-btn'
								size='large'
								fullWidth
							>
								Ingresar
							</Button>
						</Grid>

						<Grid item xs={12} display='flex' justifyContent='end'>
							<NextLink
								href={
									router.query.p
										? `/auth/register?p=${router.query.p}`
										: '/auth/register'
								}
								passHref
							>
								<Link underline='always'>¿No tienes cuenta?</Link>
							</NextLink>
						</Grid>

						<Grid
							item
							xs={12}
							flexDirection='column'
							display='flex'
							justifyContent='end'
						>
							<Divider sx={{ width: '100%', mb: 2 }} />

							{Object.values(providers).map((provider: any) => {
								if (provider.type === 'credentials')
									return <div key={provider.id}></div>

								return (
									<Button
										key={provider.id}
										variant='outlined'
										fullWidth
										color='primary'
										sx={{ mb: 1 }}
										onClick={() => signIn(provider.id)}
									>
										{provider?.name}
									</Button>
								)
							})}
						</Grid>
					</Grid>
				</Box>
			</form>
		</AuthLayout>
	)
}

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query
}) => {
	const session = await getSession({ req })
	const { p = '/' } = query

	if (session) {
		return {
			redirect: {
				destination: p.toString(),
				permanent: false
			}
		}
	}

	return {
		props: {}
	}
}

export default LoginPage
