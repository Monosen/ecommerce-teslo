import { FC, useState } from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { OrderResponseBody } from '@paypal/paypal-js/types'
import {
	Box,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Divider,
	Grid,
	Typography
} from '@mui/material'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { CreditCardOffOutlined } from '@mui/icons-material'

import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { dbOrders } from '../../database'
import { IOrder } from '../../interface'
import { tesloApi } from '../../api'
import { useRouter } from 'next/router'

interface Props {
	order: IOrder
}

const OrderPage: FC<Props> = ({ order }) => {
	const router = useRouter()
	const {
		isPaid,
		_id,
		numberOfItems,
		shippingAddress,
		orderItems,
		subTotal,
		tax,
		total
	} = order
	const [isPaying, setIsPaying] = useState(false)

	const onOrderCompleted = async (details: OrderResponseBody) => {
		if (details.status !== 'COMPLETED') {
			return alert('Payment failed')
		}
		setIsPaying(true)

		try {
			await tesloApi.post(`/order/pay`, {
				transactionId: details.id,
				orderId: _id
			})

			router.reload()
		} catch (error) {
			setIsPaying(false)
			console.log(error)
		}
	}

	return (
		<ShopLayout
			title='Resumen de la orden 3242123123'
			pageDescription={'Resumen de la orden'}
		>
			<Typography variant='h1' component='h1'>
				Order: {_id}
			</Typography>

			{isPaid ? (
				<Chip
					sx={{ my: 2 }}
					label='Orden ya fue pagada'
					variant='outlined'
					color='success'
					icon={<CreditCardOffOutlined />}
				/>
			) : (
				<Chip
					sx={{ my: 2 }}
					label='Pendiente de pago'
					variant='outlined'
					color='error'
					icon={<CreditCardOffOutlined />}
				/>
			)}

			<Grid container className='fadeIn'>
				<Grid item xs={12} sm={7}>
					<CartList editable={false} products={orderItems} />
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
							</Box>

							<Typography>
								{shippingAddress.firstName} {shippingAddress.lastName}
							</Typography>
							<Typography>Direccion de entrega</Typography>
							<Typography>
								{shippingAddress.address}{' '}
								{shippingAddress?.address2 ? shippingAddress?.address2 : ''}
							</Typography>
							<Typography>
								{shippingAddress.city}, {shippingAddress.zip}
							</Typography>
							<Typography>{shippingAddress.country}</Typography>
							<Typography>{shippingAddress.phone}</Typography>

							<Divider sx={{ my: 1 }} />

							<OrderSummary
								orderValues={{ numberOfItems, subTotal, tax, total }}
							/>

							<Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
								{isPaying && (
									<Box
										display='flex'
										justifyContent='center'
										className='fadeIn'
									>
										<CircularProgress />
									</Box>
								)}

								<Box
									sx={{ display: isPaying ? 'none' : 'flex' }}
									flexDirection='column'
								>
									{isPaid ? (
										<Chip
											sx={{ my: 2 }}
											label='Orden ya fue pagada'
											variant='outlined'
											color='success'
											icon={<CreditCardOffOutlined />}
										/>
									) : (
										<PayPalButtons
											createOrder={(data, actions) => {
												return actions.order.create({
													purchase_units: [
														{
															amount: {
																value: `${total}`
															}
														}
													]
												})
											}}
											onApprove={(data, actions) => {
												return actions.order!.capture().then(details => {
													onOrderCompleted(details)
												})
											}}
										/>
									)}
								</Box>
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
