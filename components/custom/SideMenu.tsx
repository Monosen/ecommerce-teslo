import {
	Box,
	Divider,
	Drawer,
	IconButton,
	Input,
	InputAdornment,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListSubheader
} from '@mui/material'
import {
	AccountCircleOutlined,
	AdminPanelSettings,
	CategoryOutlined,
	ConfirmationNumberOutlined,
	DashboardOutlined,
	EscalatorWarningOutlined,
	FemaleOutlined,
	LoginOutlined,
	MaleOutlined,
	SearchOutlined,
	VpnKeyOutlined
} from '@mui/icons-material'
import { AuthContext, CustomContext } from '../../context'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'

export const SideMenu = () => {
	const router = useRouter()
	const { isLoggedIn, user, logoutUser } = useContext(AuthContext)
	const { isMenuOpen, toggleSideMenu } = useContext(CustomContext)
	const [searchTerm, setSearchTerm] = useState('')

	const onSearchTerm = () => {
		if (searchTerm.trim().length === 0) return

		navigateTo(`/search/${searchTerm}`)
	}

	const navigateTo = (url: string) => {
		toggleSideMenu()
		router.push(url)
	}

	const onLogout = () => {
		toggleSideMenu()
		logoutUser()
		navigateTo('/')
	}

	return (
		<Drawer
			open={isMenuOpen}
			anchor='right'
			sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
			onClose={toggleSideMenu}
		>
			<Box sx={{ width: 250, paddingTop: 5 }}>
				<List>
					<ListItem>
						<Input
							autoFocus
							type='text'
							placeholder='Buscar...'
							onChange={e => setSearchTerm(e.target.value)}
							onKeyPress={e => e.key === 'Enter' && onSearchTerm()}
							value={searchTerm}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton onClick={onSearchTerm}>
										<SearchOutlined />
									</IconButton>
								</InputAdornment>
							}
						/>
					</ListItem>

					{isLoggedIn && (
						<>
							<ListItem button>
								<ListItemIcon>
									<AccountCircleOutlined />
								</ListItemIcon>
								<ListItemText primary={'Perfil'} />
							</ListItem>

							<ListItem button onClick={() => navigateTo('/orders/history')}>
								<ListItemIcon>
									<ConfirmationNumberOutlined />
								</ListItemIcon>
								<ListItemText primary={'Mis Ordenes'} />
							</ListItem>
						</>
					)}

					<ListItem
						button
						onClick={() => navigateTo('/category/men')}
						sx={{ display: { xs: '', sm: 'none' } }}
					>
						<ListItemIcon>
							<MaleOutlined />
						</ListItemIcon>
						<ListItemText primary={'Hombres'} />
					</ListItem>

					<ListItem
						button
						onClick={() => navigateTo('/category/women')}
						sx={{ display: { xs: '', sm: 'none' } }}
					>
						<ListItemIcon>
							<FemaleOutlined />
						</ListItemIcon>
						<ListItemText primary={'Mujeres'} />
					</ListItem>

					<ListItem
						button
						onClick={() => navigateTo('/category/kid')}
						sx={{ display: { xs: '', sm: 'none' } }}
					>
						<ListItemIcon>
							<EscalatorWarningOutlined />
						</ListItemIcon>
						<ListItemText primary={'Niños'} />
					</ListItem>

					{isLoggedIn ? (
						<ListItem button onClick={onLogout}>
							<ListItemIcon>
								<LoginOutlined />
							</ListItemIcon>
							<ListItemText primary={'Salir'} />
						</ListItem>
					) : (
						<ListItem
							button
							onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}
						>
							<ListItemIcon>
								<VpnKeyOutlined />
							</ListItemIcon>
							<ListItemText primary={'Ingresar'} />
						</ListItem>
					)}

					{/* Admin */}
					{user?.role === 'admin' && (
						<>
							<Divider />
							<ListSubheader>Admin Panel</ListSubheader>

							<ListItem button onClick={() => navigateTo(`/admin`)}>
								<ListItemIcon>
									<DashboardOutlined />
								</ListItemIcon>
								<ListItemText primary={'Dashboard'} />
							</ListItem>

							<ListItem button onClick={() => navigateTo(`/admin/products`)}>
								<ListItemIcon>
									<CategoryOutlined />
								</ListItemIcon>
								<ListItemText primary={'Productos'} />
							</ListItem>

							<ListItem button onClick={() => navigateTo(`/admin/orders`)}>
								<ListItemIcon>
									<ConfirmationNumberOutlined />
								</ListItemIcon>
								<ListItemText primary={'Ordenes'} />
							</ListItem>

							<ListItem button onClick={() => navigateTo(`/admin/users`)}>
								<ListItemIcon>
									<AdminPanelSettings />
								</ListItemIcon>
								<ListItemText primary={'Usuarios'} />
							</ListItem>
						</>
					)}
				</List>
			</Box>
		</Drawer>
	)
}
