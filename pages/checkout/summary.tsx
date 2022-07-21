import { useRouter } from 'next/router'
import NextLink from 'next/link'
import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	Grid,
	Link,
	Typography
} from '@mui/material'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { useContext, useEffect } from 'react'
import { CartContext } from '../../context'
import { countries } from '../../utils'
import Cookies from 'js-cookie'

const SummaryPage = () => {
	const router = useRouter()
	const { shippingAddress, numberOfItems } = useContext(CartContext)

	useEffect(() => {
		if (!Cookies.get('address')) {
			router.push('/checkout/address')
		}
	}, [router])

	if (!shippingAddress) {
		return <></>
	}

	const { firstName, lastName, address, address2, zip, city, country, phone } =
		shippingAddress

	return (
		<ShopLayout
			title='Resumen de la orden'
			pageDescription={'Resumen de la orden'}
		>
			<Typography variant='h1' component='h1'>
				Carrito
			</Typography>

			<Grid container>
				<Grid item xs={12} sm={7}>
					<CartList editable />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className='summary-card'>
						<CardContent>
							<Typography variant='h2'>
								Resumen ({numberOfItems} producto{numberOfItems > 1 && 's'})
							</Typography>
							<Divider sx={{ my: 1 }} />

							<Box display='flex' justifyContent='space-between'>
								<Typography variant='subtitle1'>
									Direccion de entrega
								</Typography>
								<NextLink href='/checkout/address' passHref>
									<Link underline='always'>Edit</Link>
								</NextLink>
							</Box>

							<Typography>
								{firstName} {lastName}
							</Typography>
							<Typography>
								{address} {address2 ? `| ${address}` : ''}
							</Typography>
							<Typography>
								{city}, {zip}
							</Typography>
							{/* <Typography>
								{countries.find(c => c.code === country)?.name}
							</Typography> */}
							<Typography>{country}</Typography>
							<Typography>{phone}</Typography>

							<Divider sx={{ my: 1 }} />

							<Box display='flex' justifyContent='end'>
								<NextLink href='/cart' passHref>
									<Link underline='always'>Edit</Link>
								</NextLink>
							</Box>

							<OrderSummary />

							<Box sx={{ mt: 3 }}>
								<Button color='secondary' className='circular-btn' fullWidth>
									Confirmar Orden
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	)
}

export default SummaryPage
