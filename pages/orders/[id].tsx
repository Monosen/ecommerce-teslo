import NextLink from 'next/link'
import {
	Box,
	Card,
	CardContent,
	Chip,
	Divider,
	Grid,
	Link,
	Typography
} from '@mui/material'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { CreditCardOffOutlined } from '@mui/icons-material'

import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { dbOrders } from '../../database'
import { IOrder } from '../../interface'

interface Props {
	order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {
	console.log(order)
	return (
		<ShopLayout
			title='Resumen de la orden 3242123123'
			pageDescription={'Resumen de la orden'}
		>
			<Typography variant='h1' component='h1'>
				Order: ABC123
			</Typography>

			{/* <Chip
				sx={{ my: 2 }}
				label='Pendiente de pago'
				variant='outlined'
				color='error'
				icon={<CreditCardOffOutlined />}
    /> */}

			<Chip
				sx={{ my: 2 }}
				label='Orden ya fue pagada'
				variant='outlined'
				color='success'
				icon={<CreditCardOffOutlined />}
			/>

			<Grid container>
				<Grid item xs={12} sm={7}>
					<CartList editable />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className='summary-card'>
						<CardContent>
							<Typography variant='h2'>Resumen (3 productos)</Typography>
							<Divider sx={{ my: 1 }} />

							<Box display='flex' justifyContent='space-between'>
								<Typography variant='subtitle1'>
									Direccion de entrega
								</Typography>
								<NextLink href='/checkout/address' passHref>
									<Link underline='always'>Edit</Link>
								</NextLink>
							</Box>

							<Typography>Edinson Bolaños</Typography>
							<Typography>Direccion de entrega</Typography>
							<Typography>stitsville hYa 23S</Typography>
							<Typography>Costa Rica</Typography>
							<Typography>+1 4122121</Typography>

							<Divider sx={{ my: 1 }} />

							<Box display='flex' justifyContent='end'>
								<NextLink href='/cart' passHref>
									<Link underline='always'>Edit</Link>
								</NextLink>
							</Box>

							<OrderSummary />

							<Box sx={{ mt: 3 }}>
								{/* TODO */}
								<h1>Pagar</h1>
								<Chip
									sx={{ my: 2 }}
									label='Orden ya fue pagada'
									variant='outlined'
									color='success'
									icon={<CreditCardOffOutlined />}
								/>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	)
}

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query
}) => {
	const { id = '' } = query

	const session: any = await getSession({ req })

	if (!session) {
		return {
			redirect: {
				destination: `/auth/login?p=/orders/${id}`,
				permanent: false
			}
		}
	}

	const order = await dbOrders.getOrderById(id.toString())

	if (!order) {
		return {
			redirect: {
				destination: `/orders/history`,
				permanent: false
			}
		}
	}

	if (order.user !== session.user._id) {
		return {
			redirect: {
				destination: `/orders/history`,
				permanent: false
			}
		}
	}

	return {
		props: {
			order
		}
	}
}

export default OrderPage
