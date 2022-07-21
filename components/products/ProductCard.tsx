import { FC, useMemo, useState } from 'react'
import {
	Box,
	Card,
	CardActionArea,
	CardMedia,
	Chip,
	Grid,
	Link,
	Typography
} from '@mui/material'
import { IProduct } from '../../interface'
import NextLink from 'next/link'

interface Props {
	product: IProduct
}

export const ProductCard: FC<Props> = ({ product }) => {
	const [isHover, setIsHover] = useState(false)
	const [isImageLoaded, setIsImageLoaded] = useState(false)

	const productImage = useMemo(() => {
		return isHover
			? `/products/${product.images[1]}`
			: `/products/${product.images[0]}`
	}, [isHover, product.images])

	return (
		<Grid
			item
			xs={6}
			sm={4}
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
		>
			<Card>
				<NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
					<Link>
						<CardActionArea>
							{product.inStock === 0 && (
								<Chip
									color='primary'
									label='No hay disponible'
									sx={{
										position: 'absolute',
										zIndex: 90,
										top: '10px',
										left: '10px'
									}}
								/>
							)}
							<CardMedia
								component='img'
								image={productImage}
								alt={product.title}
								onLoad={() => setIsImageLoaded(true)}
							/>
						</CardActionArea>
					</Link>
				</NextLink>
			</Card>

			<Box
				sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }}
				className='fadeIn'
			>
				<Typography fontWeight={700} variant='h6'>
					{product.title}
				</Typography>
				<Typography fontWeight={500} variant='h6'>
					${product.price}
				</Typography>
			</Box>
		</Grid>
	)
}
