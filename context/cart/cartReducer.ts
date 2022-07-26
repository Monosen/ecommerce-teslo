import { CartState } from './'
import { ICartProduct, ShippingAddress } from '../../interface'

type CartActionType =
	| {
			type: '[Cart] - LoadCart from cookies | storage'
			payload: ICartProduct[]
	  }
	| {
			type: '[Cart] - Update products in cart'
			payload: ICartProduct[]
	  }
	| {
			type: '[Cart] - Change cart quantity'
			payload: ICartProduct
	  }
	| {
			type: '[Cart] - Remove product from cart'
			payload: ICartProduct
	  }
	| {
			type: '[Cart] - LoadAddress From Cookies | Storage'
			payload: ShippingAddress
	  }
	| {
			type: '[Cart] - update Address'
			payload: ShippingAddress
	  }
	| {
			type: '[Cart] - Update order summary'
			payload: {
				numberOfItems: number
				subTotal: number
				tax: number
				total: number
			}
	  }
	| {
			type: '[Cart] - Order completed'
	  }

export const cartReducer = (
	state: CartState,
	action: CartActionType
): CartState => {
	switch (action.type) {
		case '[Cart] - LoadCart from cookies | storage':
			return {
				...state,
				isLoaded: true,
				cart: action.payload
			}
		case '[Cart] - Update products in cart':
			return {
				...state,
				cart: [...action.payload]
			}
		case '[Cart] - Change cart quantity':
			return {
				...state,
				cart: state.cart.map(product => {
					if (
						product._id === action.payload._id &&
						product.size === action.payload.size
					) {
						return action.payload
					}
					return product
				})
			}
		case '[Cart] - Remove product from cart':
			return {
				...state,
				cart: state.cart.filter(
					product =>
						!(
							product._id === action.payload._id &&
							product.size === action.payload.size
						)
				)
			}
		case '[Cart] - update Address':
		case '[Cart] - LoadAddress From Cookies | Storage':
			return {
				...state,
				shippingAddress: action.payload
			}
		case '[Cart] - Update order summary':
			return {
				...state,
				...action.payload
			}
		case '[Cart] - Order completed':
			return {
				...state,
				cart: [],
				numberOfItems: 0,
				subTotal: 0,
				tax: 0,
				total: 0
			}
		default:
			return state
	}
}
