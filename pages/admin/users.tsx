import { PeopleOutline } from '@mui/icons-material'
import { Box, CircularProgress, Grid, MenuItem, Select } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import useSWR from 'swr'

import { AdminLayout } from '../../components/layouts'
import { IResUsers, IUser } from '../../interface'
import tesloApi from '../../api/tesloApi'
import { useState, useEffect } from 'react'

const UsersPage = () => {
	const { data, error } = useSWR<IResUsers>('/api/admin/users')
	const [users, setUsers] = useState<IUser[]>([])

	useEffect(() => {
		if (data) {
			setUsers(data.data)
		}
	}, [data])

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

	const onRoleUpdated = async (userId: string, role: string) => {
		const updatedUser = users.map(user => ({
			...user,
			role: userId === user._id ? (role as 'client' | 'admin') : user.role
		}))

		try {
			await tesloApi.put(`/admin/users`, { userId, role })
			setUsers(updatedUser)
		} catch (error) {
			console.log(error)
		}
	}

	const columns: GridColDef[] = [
		{ field: 'email', headerName: 'Correo', width: 250 },
		{ field: 'name', headerName: 'Nombre completo', width: 300 },
		{
			field: 'role',
			headerName: 'Rol',
			width: 300,
			renderCell: ({ row }: GridValueGetterParams) => {
				return (
					<Select
						value={row.role}
						onChange={e => onRoleUpdated(row.id, e.target.value)}
						label='rol'
						sx={{ width: '300px' }}
					>
						<MenuItem value='admin'>Administrador</MenuItem>
						<MenuItem value='client'>Client</MenuItem>
					</Select>
				)
			}
		}
	]

	const rows = users.map(user => ({
		id: user._id,
		email: user.email,
		name: user.name,
		role: user.role
	}))

	return (
		<AdminLayout
			title='Usuarios'
			subTitle='Mantenimientos de usuarios'
			icon={<PeopleOutline />}
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

export default UsersPage
