import type { NextPage, GetServerSideProps } from 'next'
import { Box, Typography } from '@mui/material'

import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products/ProductList'
import { dbProducts } from '../../database'
import { IProduct } from '../../interface'

interface Props {
	products: IProduct[]
	foundProducts: boolean
	query: string
}

/* eslint-disable react/prop-types */
const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
	return (
		<ShopLayout
			title='Teslo-Shop - SearchPage'
			pageDescription='Encuentra los mejores productos de Tesla'
		>
			<Typography variant='h1' component='h1'>
				Buscar producto
			</Typography>
			{foundProducts ? (
				<Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>
					Termino: {query}
				</Typography>
			) : (
				<Box display='flex'>
					<Typography variant='h2' sx={{ mb: 1 }}>
						No se encontraron productos
					</Typography>
					<Typography variant='h2' sx={{ ml: 1 }} color='secondary'>
						{query}
					</Typography>
				</Box>
			)}

			<ProductList products={products} />
		</ShopLayout>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const { query = '' } = params as { query: string }

	if (query.length === 0) {
		return { redirect: { destination: '/', permanent: true } }
	}

	let products = await dbProducts.getProductsByTerm(query)
	const foundProducts = products.length > 0

	if (!foundProducts) {
		products = await dbProducts.getAllProducts()
	}

	return {
		props: {
			products,
			foundProducts,
			query
		}
	}
}

export default SearchPage
