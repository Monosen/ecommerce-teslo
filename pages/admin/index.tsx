import {
	AttachMoneyOutlined,
	CreditCardOutlined,
	DashboardOutlined,
	CreditCardOffOutlined,
	CategoryOutlined,
	CancelPresentationOutlined,
	ProductionQuantityLimitsOutlined,
	TimerOutlined
} from '@mui/icons-material'
import { Box, CircularProgress, Grid } from '@mui/material'
import useSWR from 'swr'
import { SummaryTile } from '../../components/admin'
import { AdminLayout } from '../../components/layouts'
import { DashboardSummaryResponse } from '../../interface'
import { useState, useEffect } from 'react'

const DashboardPage = () => {
	const [refreshIn, setRefreshIn] = useState(30)

	const { data, error } = useSWR<DashboardSummaryResponse>(
		'/api/admin/dashboard',
		{
			refreshInterval: 30 * 1000
		}
	)

	useEffect(() => {
		const interval = setInterval(() => {
			setRefreshIn(prev => (prev > 0 ? prev - 1 : 30))
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	const {
		lowInventory,
		notPaidOrders,
		numberOfClients,
		numberOfOrders,
		numberOfProducts,
		paidOrders,
		productsWithNoInventory
	} = data! || {}

	if (!error && !data) {
		return (
			<Box
				display='flex'
				justifyContent='center'
				className='fadeIn'
				alignItems='center'
				sx={{ minHeight: '100vh', width: '100%' }}
			>
				<CircularProgress />
			</Box>
		)
	}

	if (error) {
		console.log(error)

		return (
			<Box display='flex' justifyContent='center' className='fadeIn'>
				<h1>Hubo un error</h1>
			</Box>
		)
	}

	return (
		<AdminLayout
			title='Dashboard'
			subTitle='Estadisticas generales'
			icon={<DashboardOutlined />}
		>
			<Grid container spacing={2}>
				<SummaryTile
					title={numberOfOrders}
					subTitle='Ordenes Totales'
					icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTile
					title={paidOrders}
					subTitle='Ordenes Pagadas'
					icon={<AttachMoneyOutlined color='primary' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTile
					title={notPaidOrders}
					subTitle='Ordenes Pendientes'
					icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTile
					title={numberOfClients}
					subTitle='Clientes'
					icon={<CreditCardOffOutlined color='primary' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTile
					title={numberOfProducts}
					subTitle='Productos'
					icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTile
					title={productsWithNoInventory}
					subTitle='Sin Existencias'
					icon={
						<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />
					}
				/>

				<SummaryTile
					title={lowInventory}
					subTitle='Bajo Inventario'
					icon={
						<ProductionQuantityLimitsOutlined
							color='warning'
							sx={{ fontSize: 40 }}
						/>
					}
				/>

				<SummaryTile
					title={refreshIn}
					subTitle='Actualizacion en:'
					icon={<TimerOutlined color='error' sx={{ fontSize: 40 }} />}
				/>
			</Grid>
		</AdminLayout>
	)
}

export default DashboardPage
