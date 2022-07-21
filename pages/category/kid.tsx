import { Typography } from '@mui/material'
import { FullScreenLoading } from '../../components/custom'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { useProducts } from '../../hooks'

const KidPage = () => {
	const { products, isLoading } = useProducts('/products?gender=kid')

	return (
		<ShopLayout
			title='Teslo-Shop - Kid'
			pageDescription='Encuentra los mejores productos de Tesla para ellos'
		>
			<Typography variant='h1' component='h1'>
				Niños
			</Typography>
			<Typography variant='h2' sx={{ mb: 1 }}>
				productos para niños
			</Typography>

			{isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
		</ShopLayout>
	)
}

export default KidPage
