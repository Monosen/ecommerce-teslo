import { useContext, useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import {
	Box,
	Button,
	Chip,
	Grid,
	Link,
	TextField,
	Typography
} from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'
import { getSession, signIn } from 'next-auth/react'

import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils'

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from 'next'
import { AuthContext } from '../../context'

type FormData = {
	name: string
	email: string
	password: string
}

const RegisterPage = () => {
	const router = useRouter()
	const { registerUser } = useContext(AuthContext)
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>()
	const [showError, setShowError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const onRegisterForm = async ({ name, email, password }: FormData) => {
		setShowError(false)

		const { hasError, message } = await registerUser(name, email, password)

		if (hasError) {
			setShowError(true)
			setErrorMessage(message!)
			setTimeout(() => setShowError(false), 3000)
		}
		// const destination = router.query.p?.toString() || '/'

		// router.replace(destination)

		await signIn('credentials', { email, password })
	}

	return (
		<AuthLayout title='Register'>
			<form onSubmit={handleSubmit(onRegisterForm)} noValidate>
				<Box sx={{ width: 350, padding: '10px 20px' }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography variant='h1' component='h1'>
								Create Account
							</Typography>
							{showError && (
								<Chip
									label='No pudo crearse el usuario'
									color='error'
									icon={<ErrorOutline />}
									className='fadeIn'
								/>
							)}
						</Grid>
						<Grid item xs={12}>
							<TextField
								{...register('name', {
									required: 'name is required',
									minLength: { value: 1, message: 'minimum length is 1' }
								})}
								label='Name'
								variant='filled'
								fullWidth
								error={!!errors.name}
								helperText={errors.name?.message}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								type='email'
								{...register('email', {
									required: 'email is required',
									validate: validations.isEmail
								})}
								label='E-mail'
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
								label='Password'
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
								Registrarse
							</Button>
						</Grid>

						<Grid item xs={12} display='flex' justifyContent='end'>
							<NextLink
								href={
									router.query.p
										? `/auth/login?p=${router.query.p}`
										: '/auth/login'
								}
								passHref
							>
								<Link underline='always'>¿Ya tienes una cuenta?</Link>
							</NextLink>
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

export default RegisterPage
