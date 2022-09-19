import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { Box, Chip, CircularProgress, Grid } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import useSWR from 'swr'
import { AdminLayout } from '../../../components/layouts'
import { IResOrders, IUser } from '../../../interface'

const columns: GridColDef[] = [
	{ field: 'id', headerName: 'orderId', width: 250 },
	{ field: 'email', headerName: 'correo', width: 250 },
	{ field: 'name', headerName: 'Nombre Completo', width: 300 },
	{ field: 'total', headerName: 'Monto total', width: 250 },
	{
		field: 'isPaid',
		headerName: 'Pagada',
		renderCell: ({ row }: GridValueGetterParams) => {
			return row.isPaid ? (
				<Chip variant='outlined' label='Pagada' color='success' />
			) : (
				<Chip variant='outlined' label='Pendiente' color='error' />
			)
		}
	},
	{ field: 'noProducts', headerName: 'No.Productos', align: 'center' },
	{
		field: 'check',
		headerName: 'Ver orden',
		renderCell: ({ row }: GridValueGetterParams) => {
			return (
				<a href={`/admin/orders/${row.id}`} target='_blank' rel='noreferrer'>
					Ver order
				</a>
			)
		}
	},
	{ field: 'createdAt', headerName: 'Creada en', width: 300 }
]

const ordersPage = () => {
	const { data, error } = useSWR<IResOrders>('/api/admin/orders')

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

	const rows = data!.data.map(order => ({
		id: order._id,
		email: (order.user as IUser).email,
		name: (order.user as IUser).name,
		total: order.total,
		isPaid: order.isPaid,
		noProducts: order.numberOfItems,
		createdAt: order.createdAt
	}))

	return (
		<AdminLayout
			title={'Ordenes'}
			subTitle={'Mantenimiento de ordenes'}
			icon={<ConfirmationNumberOutlined />}
		>
			<Grid container className='fadeIn'>
				<Grid item xs={12} sx={{ height: 650, width: '100%' }}>
					<DataGrid
						rows={rows}
						columns={columns}
						pageSize={10}
						rowsPerPageOptions={[10]}
					/>
				</Grid>
			</Grid>
		</AdminLayout>
	)
}

export default ordersPage
