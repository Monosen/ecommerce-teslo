import { FC } from 'react'
import {
	Box,
	Card,
	CardContent,
	Chip,
	Divider,
	Grid,
	Typography
} from '@mui/material'
import { CartList, OrderSummary } from '../../../components/cart'
import { AdminLayout } from '../../../components/layouts'
import {
	AirplaneTicketOutlined,
	CreditCardOffOutlined
} from '@mui/icons-material'

import { GetServerSideProps } from 'next'
import { dbOrders } from '../../../database'
import { IOrder } from '../../../interface'

interface Props {
	order: IOrder
}

const OrderPage: FC<Props> = ({ order }) => {
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

	return (
		<AdminLayout
			title='Resumen de la orden 3242123123'
			icon={<AirplaneTicketOutlined />}
			subTitle={`Order Id: ${_id}`}
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
								<Box sx={{ display: 'flex' }} flexDirection='column'>
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
								</Box>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</AdminLayout>
	)
}

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query
}) => {
	const { id = '' } = query

	const order = await dbOrders.getOrderById(id.toString())

	if (!order) {
		return {
			redirect: {
				destination: `/admin/orders`,
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
