import { FC, useContext } from 'react'
import NextLink from 'next/link'
import {
	Box,
	Button,
	CardActionArea,
	CardMedia,
	Grid,
	Link,
	Typography
} from '@mui/material'
import { ItemCounter } from '../custom'
import { CartContext } from '../../context'
import { ICartProduct, IOrderItems } from '../../interface'

interface Props {
	editable?: boolean
	products?: IOrderItems[]
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
	const { cart, updateCartQuantity, removeCartProduct } =
		useContext(CartContext)

	const onNewCartQuantityValue = (
		product: ICartProduct,
		newQuantityValue: number
	) => {
		product.quantity = newQuantityValue
		updateCartQuantity(product)
	}

	const productsToShow = products || cart

	return (
		<>
			{productsToShow.map(product => (
				<Grid key={product.slug + product.size} container sx={{ mb: 2 }}>
					<Grid item xs={3} sx={{ mr: 2 }}>
						{/* TODO: llevar a la pagina del producto */}
						<NextLink href={`/product/${product.slug}`} passHref>
							<Link>
								<CardActionArea>
									<CardMedia
										image={`${product.image}`}
										component='img'
										sx={{ borderRadius: '5px' }}
									/>
								</CardActionArea>
							</Link>
						</NextLink>
					</Grid>
					<Grid item xs={3}>
						<Box display='flex' flexDirection='column'>
							<Typography variant='body1'>{product.title}</Typography>
							<Typography variant='body1'>
								Talla: <strong>{product.size}</strong>
							</Typography>

							{editable ? (
								<ItemCounter
									currentValue={product.quantity}
									maxValue={10}
									updatedQuantity={newQuantity =>
										onNewCartQuantityValue(product as ICartProduct, newQuantity)
									}
								/>
							) : (
								<Typography variant='h4'>
									{product.quantity} producto{product.quantity > 1 && 's'}
								</Typography>
							)}
						</Box>
					</Grid>
					<Grid
						item
						xs={2}
						display='flex'
						flexDirection='column'
						alignItems='center'
					>
						<Typography variant='subtitle1'>${product.price}</Typography>

						{editable && (
							<Button
								variant='text'
								color='secondary'
								onClick={() => removeCartProduct(product as ICartProduct)}
							>
								Remover
							</Button>
						)}
					</Grid>
				</Grid>
			))}
		</>
	)
}
