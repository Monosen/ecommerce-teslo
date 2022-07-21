import { NextPage, GetStaticPaths, GetStaticProps } from 'next'
import { Box, Button, Chip, Grid, Typography } from '@mui/material'
import { ShopLayout } from '../../components/layouts'
import { dbProducts } from '../../database'
import { ProductSlideshow, SizeSelector } from '../../components/products'
import { ItemCounter } from '../../components/custom'
import { ICartProduct, IProduct, ISize } from '../../interface'
import { useState, useContext } from 'react'

import { CartContext } from '../../context'

interface Props {
	product: IProduct
}

/* eslint-disable react/prop-types */
const ProductPage: NextPage<Props> = ({ product }) => {
	const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
		_id: product._id,
		image: product.images[0],
		inStock: product.inStock,
		price: product.price,
		size: undefined,
		slug: product.slug,
		title: product.title,
		gender: product.gender,
		quantity: 1
	})

	const { addProductToCart } = useContext(CartContext)

	const selectedSize = (size: ISize) => {
		setTempCartProduct(prev => ({ ...prev, size }))
	}

	const onUpdatedQuantity = (quantity: number) => {
		setTempCartProduct(prev => ({ ...prev, quantity }))
	}

	const onAddProduct = () => {
		if (!tempCartProduct.size) {
			return
		}

		addProductToCart(tempCartProduct)
		// router.push('/cart')
	}

	return (
		<ShopLayout title={product.title} pageDescription={product.description}>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={7}>
					<ProductSlideshow images={product.images} />
				</Grid>

				<Grid item xs={12} sm={5}>
					<Box display='flex' flexDirection='column'>
						{/* titles */}
						<Typography variant='h1' component='h1'>
							{product.title}
						</Typography>
						<Typography variant='subtitle1' component='h2'>
							${product.price}
						</Typography>

						{/* quantity */}
						<Box sx={{ my: 2 }}>
							<Typography variant='subtitle1'>Cantidad</Typography>
							{/* item counter */}
							<ItemCounter
								currentValue={tempCartProduct.quantity}
								updatedQuantity={onUpdatedQuantity}
								maxValue={
									tempCartProduct.inStock > 10 ? 10 : tempCartProduct.inStock
								}
							/>

							<SizeSelector
								// selectedSize={product.sizes[0]}
								sizes={product.sizes}
								selectedSize={tempCartProduct.size}
								onSelectedSize={selectedSize}
							/>
						</Box>

						{product.inStock > 0 ? (
							<Button
								color='secondary'
								className='circular-btn'
								onClick={onAddProduct}
							>
								{tempCartProduct
									? 'Agregar al Carrito'
									: 'Seleccione una talla'}
							</Button>
						) : (
							<Chip
								color='error'
								label='No hay disponible'
								variant='outlined'
							/>
						)}

						{/* description */}
						<Box sx={{ mt: 3 }}>
							<Typography variant='subtitle2'>Descripción</Typography>
							<Typography variant='body2'>{product.description}</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ShopLayout>
	)
}

export const getStaticPaths: GetStaticPaths = async ctx => {
	const productSlugs = await dbProducts.getAllProductsSlug()
	return {
		paths: productSlugs.map(({ slug }) => ({
			params: {
				slug
			}
		})),
		fallback: 'blocking'
	}
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug = '' } = params as { slug: string }

	const product = await dbProducts.getProductBySlug(slug)

	if (!product) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		}
	}

	return {
		props: {
			product
		},
		revalidate: 86400 // 60 * 60 * 24
	}
}

export default ProductPage
