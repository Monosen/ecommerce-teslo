import type { NextPage } from 'next'
import { Typography } from '@mui/material'

import { ShopLayout } from '../components/layouts'
import { ProductList } from '../components/products/ProductList'
import { useProducts } from '../hooks'
import { FullScreenLoading } from '../components/custom'

const Home: NextPage = () => {
	const { products, isLoading } = useProducts('/products')

	return (
		<ShopLayout
			title='Teslo-Shop - Home'
			pageDescription='Encuentra los mejores productos de Tesla'
		>
			<Typography variant='h1' component='h1'>
				Tienda
			</Typography>
			<Typography variant='h2' sx={{ mb: 1 }}>
				Todos los productos
			</Typography>

			{isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
		</ShopLayout>
	)
}

export default Home
