import { IUser, ISize } from './'

export interface ShippingAddress {
	firstName: string
	lastName: string
	address: string
	address2?: string
	zip: string
	city: string
	country: string
	phone: string
}

export interface IOrderItems {
	_id: string
	title: string
	size: ISize
	quantity: number
	slug: string
	image: string
	price: number
	gender: string
}

export interface IOrder {
	_id?: string
	user?: IUser | string
	orderItems: IOrderItems[]
	shippingAddress: ShippingAddress
	paymentResult?: string
	numberOfItems: number
	subTotal: number
	tax: number
	total: number
	isPaid: boolean
	paidAt?: string
	transactionId?: string
	createdAt?: string
	updatedAt?: string
}
