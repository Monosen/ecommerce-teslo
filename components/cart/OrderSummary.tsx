import { Grid, Typography } from '@mui/material'
import { FC, useContext } from 'react'
import { CartContext } from '../../context'
import { currency } from '../../utils'

interface Props {
	orderValues?: {
		numberOfItems: number
		subTotal: number
		tax: number
		total: number
	}
}

export const OrderSummary: FC<Props> = ({ orderValues }) => {
	const cart = useContext(CartContext)

	const { numberOfItems, subTotal, tax, total } = orderValues || cart
	return (
		<Grid container>
			<Grid item xs={6}>
				<Typography>No. Products</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent='end'>
				<Typography>
					{numberOfItems} producto{numberOfItems > 1 && 's'}
				</Typography>
			</Grid>

			<Grid item xs={6}>
				<Typography>SubTotal</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent='end'>
				<Typography>{currency.format(subTotal)}</Typography>
			</Grid>

			<Grid item xs={6}>
				<Typography>
					Impuestos ({+(process.env.NEXT_PUBLIC_TAX_RATE || 0) * 100}%)
				</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent='end'>
				<Typography>{currency.format(tax)}</Typography>
			</Grid>

			<Grid item xs={6} sx={{ mt: 2 }}>
				<Typography variant='subtitle1'>Total:</Typography>
			</Grid>
			<Grid item xs={6} display='flex' justifyContent='end' sx={{ mt: 2 }}>
				<Typography variant='subtitle1'>{currency.format(total)}</Typography>
			</Grid>
		</Grid>
	)
}
