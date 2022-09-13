import { FC, PropsWithChildren, useEffect, useReducer } from 'react'
import Cookie from 'js-cookie'
import {
	ICartProduct,
	IOrder,
	IResOrder,
	ShippingAddress
} from '../../interface'
import { CartContext, cartReducer } from './'
import { tesloApi } from '../../api'
import axios from 'axios'

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

	const createOrder = async (): Promise<{
		hasError: boolean
		message: string
	}> => {
		if (!state.shippingAddress) {
			throw new Error('Please select shipping address')
		}

		const body: IOrder = {
			orderItems: state.cart.map(p => ({
				...p,
				size: p.size!
			})),
			shippingAddress: state.shippingAddress,
			numberOfItems: state.numberOfItems,
			subTotal: state.subTotal,
			tax: state.tax,
			total: state.total,
			isPaid: false
		}

		try {
			const { data } = await tesloApi.post<IResOrder>('/order', body)

			dispatch({ type: '[Cart] - Order completed' })
			// console.log({ data })
			return {
				hasError: false,
				message: data.data._id!
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return {
					hasError: true,
					message: (error.response as { data: { message: string } }).data
						.message
				}
			}

			console.log(error)

			return {
				hasError: true,
				message: 'Error no controlado'
			}
		}
	}

	return (
		<CartContext.Provider
			value={{
				...state,
				addProductToCart,
				updateCartQuantity,
				removeCartProduct,
				updateAddress,
				createOrder
			}}
		>
			{children}
		</CartContext.Provider>
	)
}
