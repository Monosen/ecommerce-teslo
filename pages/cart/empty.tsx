import NextLink from 'next/link'

import { RemoveShoppingCartOutlined } from '@mui/icons-material'
import { Box, Link, Typography } from '@mui/material'

import { ShopLayout } from '../../components/layouts'

const empty = () => {
	return (
		<ShopLayout
			title='carrito vacio'
			pageDescription='no hay articulos en el carrito de compra'
		>
			<Box
				display='flex'
				alignItems='center'
				justifyContent='center'
				height='calc(100vh - 200px)'
				sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
			>
				<RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
				<Box display='flex' flexDirection='column' alignItems='center'>
					<Typography>su carrito esta vacio</Typography>
					<NextLink href='/' passHref>
						<Link typography='h4' color='secondary'>
							Regresar
						</Link>
					</NextLink>
				</Box>
			</Box>
		</ShopLayout>
	)
}

export default empty
