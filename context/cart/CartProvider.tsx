import { FC, PropsWithChildren, useEffect, useReducer } from 'react'
import Cookie from 'js-cookie'
import { ICartProduct, ShippingAddress } from '../../interface'
import { CartContext, cartReducer } from './'

export interface CartState {
	isLoaded: boolean
	cart: ICartProduct[]
	numberOfItems: number
	subTotal: number
	tax: number
	total: number
	shippingAddress?: ShippingAddress
}

const CART_INITIAL_STATE: CartState = {
	isLoaded: false,
	cart: [],
	numberOfItems: 0,
	subTotal: 0,
	tax: 0,
	total: 0,
	shippingAddress: undefined
}

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

	// Effect
	useEffect(() => {
		try {
			const cookieProducts = Cookie.get('cart')
				? JSON.parse(Cookie.get('cart')!)
				: []
			if (cookieProducts.length > 0) {
				dispatch({
					type: '[Cart] - LoadCart from cookies | storage',
					payload: cookieProducts
				})
			}
		} catch (error) {
			dispatch({
				type: '[Cart] - LoadCart from cookies | storage',
				payload: []
			})
		}
	}, [])

	useEffect(() => {
		if (
			Cookie.get('address') &&
			JSON.parse(Cookie.get('address') as string).firstName
		) {
			dispatch({
				type: '[Cart] - LoadAddress From Cookies | Storage',
				payload: JSON.parse(Cookie.get('address') as string)
			})
		}
	}, [])

	useEffect(() => {
		Cookie.set('cart', JSON.stringify(state.cart))
	}, [state.cart])

	useEffect(() => {
		const numberOfItems = state.cart.reduce(
			(acc, product) => acc + product.quantity,
			0
		)

		const subTotal = state.cart.reduce(
			(acc, product) => acc + product.price * product.quantity,
			0
		)

		const taxRate = +(process.env.NEXT_PUBLIC_TAX_RATE || 0)

		const orderSummary = {
			numberOfItems,
			subTotal,
			tax: subTotal * taxRate,
			total: subTotal * (1 + taxRate)
		}

		dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })
	}, [state.cart])

	const addProductToCart = (product: ICartProduct) => {
		const productInCart = state.cart.some(
			p => p._id === product._id && p.size === product.size
		)

		if (!productInCart) {
			return dispatch({
				type: '[Cart] - Update products in cart',
				payload: [...state.cart, product]
			})
		}

		const updatedProducts = state.cart.map(p => {
			if (p._id === product._id && p.size === product.size) {
				return { ...p, quantity: p.quantity + product.quantity }
			}

			return p
		})
		/*
		const updatedProducts = state.cart.map(p => {
			if (p._id === product._id ) return p
			if (p.size === product.size ) return p

			p.quantity += product.quantity

			return p
		})

		
*/
		return dispatch({
			type: '[Cart] - Update products in cart',
			payload: updatedProducts
		})
	}

	const updateCartQuantity = (product: ICartProduct) => {
		dispatch({ type: '[Cart] - Change cart quantity', payload: product })
	}

	const removeCartProduct = (product: ICartProduct) => {
		dispatch({ type: '[Cart] - Remove product from cart', payload: product })
	}

	const updateAddress = (address: ShippingAddress) => {
		Cookie.set('address', JSON.stringify(address))

		dispatch({ type: '[Cart] - update Address', payload: address })
	}

	return (
		<CartContext.Provider
			value={{
				...state,
				addProductToCart,
				updateCartQuantity,
				removeCartProduct,
				updateAddress
			}}
		>
			{children}
		</CartContext.Provider>
	)
}
