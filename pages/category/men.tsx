import { Typography } from '@mui/material'
import { FullScreenLoading } from '../../components/custom'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { useProducts } from '../../hooks'

const MenPage = () => {
	const { products, isLoading } = useProducts('/products?gender=men')

	return (
		<ShopLayout
			title='Teslo-Shop - Men'
			pageDescription='Encuentra los mejores productos de Tesla para ellos'
		>
			<Typography variant='h1' component='h1'>
				Hombres
			</Typography>
			<Typography variant='h2' sx={{ mb: 1 }}>
				productos para ellos
			</Typography>

			{isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
		</ShopLayout>
	)
}

export default MenPage
