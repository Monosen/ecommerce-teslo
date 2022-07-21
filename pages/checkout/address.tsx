import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
import {
	Box,
	Button,
	FormControl,
	Grid,
	MenuItem,
	TextField,
	Typography
} from '@mui/material'

import { ShopLayout } from '../../components/layouts'
import { countries } from '../../utils'
import { useContext, useEffect } from 'react'
import { CartContext } from '../../context'

type FormData = {
	firstName: string
	lastName: string
	address: string
	address2?: string
	zip: string
	city: string
	country: string
	phone: string
}

const getAddressFromCookie = () => {
	if (Cookies.get('address')) {
		return JSON.parse(Cookies.get('address') as string)
	}
	return {
		firstName: '',
		lastName: '',
		address: '',
		address2: '',
		zip: '',
		city: '',
		country: countries[0].code,
		phone: ''
	}
}

const AddressPage = () => {
	const router = useRouter()
	const { updateAddress } = useContext(CartContext)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<FormData>({
		defaultValues: {
			firstName: '',
			lastName: '',
			address: '',
			address2: '',
			zip: '',
			city: '',
			country: countries[0].code,
			phone: ''
		}
	})
	const onSubmit = (data: FormData) => {
		updateAddress(data)

		router.push('/checkout/summary')
	}

	useEffect(() => {
		reset(getAddressFromCookie())
	}, [])

	return (
		<ShopLayout
			title='Dirección'
			pageDescription='Confirmar direccion del destino'
		>
			<Typography variant='h1' component='h1'>
				Dirección
			</Typography>

			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<Grid container spacing={2} sx={{ mt: 2 }}>
					<Grid item xs={12} sm={6}>
						<TextField
							{...register('firstName', {
								required: 'firstName is required'
							})}
							label='Nombre'
							variant='filled'
							fullWidth
							error={!!errors.firstName}
							helperText={errors.firstName?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							{...register('lastName', {
								required: 'lastName is required'
							})}
							label='Apellido'
							variant='filled'
							fullWidth
							error={!!errors.lastName}
							helperText={errors.lastName?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							{...register('address', {
								required: 'address is required'
							})}
							label='Direccion'
							variant='filled'
							fullWidth
							error={!!errors.address}
							helperText={errors.address?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							{...register('address2', {
								required: 'address2 is required'
							})}
							label='Direccion 2 (optional)'
							variant='filled'
							fullWidth
							error={!!errors.address2}
							helperText={errors.address2?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							{...register('zip', {
								required: 'zip is required'
							})}
							label='Codigo Postal'
							variant='filled'
							fullWidth
							error={!!errors.zip}
							helperText={errors.zip?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						{/* <FormControl fullWidth> */}
						<TextField
							// select
							{...register('country', {
								required: 'country is required'
							})}
							fullWidth
							defaultValue={
								Cookies.get('address')
									? JSON.parse(Cookies.get('address') as string).country
									: countries[0].code
							}
							variant='filled'
							label='Country'
							error={!!errors.country}
							helperText={errors.country?.message}
						/>
						{/* {countries.map(country => (
								<MenuItem key={country.code} value={country.code}>
									{country.name}
								</MenuItem>
							))}
						</TextField> */}
						{/* </FormControl> */}
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							{...register('city', {
								required: 'city is required'
							})}
							label='City'
							variant='filled'
							fullWidth
							error={!!errors.city}
							helperText={errors.city?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							{...register('phone', {
								required: 'phone is required'
							})}
							label='Telefono'
							variant='filled'
							fullWidth
							error={!!errors.phone}
							helperText={errors.phone?.message}
						/>
					</Grid>
				</Grid>

				<Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
					<Button
						type='submit'
						color='secondary'
						className='circular-btn'
						size='large'
					>
						Revisar pedido
					</Button>
				</Box>
			</form>
		</ShopLayout>
	)
}

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
// 	const { token = '' } = req.cookies
// 	let isValidToken = false

// 	try {
// 		await jwt.isValidToken(token)
// 		isValidToken = true
// 	} catch (error) {
// 		isValidToken = false
// 	}

// 	if (!isValidToken) {
// 		return {
// 			redirect: {
// 				destination: '/auth/login?p=/checkout/address',
// 				permanent: false
// 			}
// 		}
// 	}

// 	return {
// 		props: {}
// 	}
// }

export default AddressPage
