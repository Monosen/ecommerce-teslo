import { FC } from 'react'
import { Grid } from '@mui/material'

import { IProduct } from '../../interface'
import { ProductCard } from './ProductCard'

interface Props {
	products: IProduct[]
}

export const ProductList: FC<Props> = ({ products }) => {
	return (
		<Grid container spacing={4}>
			{products.map((product, ind) => (
				<ProductCard key={ind} product={product} />
			))}
		</Grid>
	)
}
