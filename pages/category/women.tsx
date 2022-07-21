import { Typography } from '@mui/material'
import { FullScreenLoading } from '../../components/custom'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { useProducts } from '../../hooks'

const WomanPage = () => {
	const { products, isLoading } = useProducts('/products?gender=women')

	return (
		<ShopLayout
			title='Teslo-Shop - Women'
			pageDescription='Encuentra los mejores productos de Tesla para ellas'
		>
			<Typography variant='h1' component='h1'>
				TMujeres
			</Typography>
			<Typography variant='h2' sx={{ mb: 1 }}>
				productos para ellas
			</Typography>

			{isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
		</ShopLayout>
	)
}

export default WomanPage
