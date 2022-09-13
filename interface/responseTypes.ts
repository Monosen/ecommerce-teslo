import { IProduct, IOrder } from './'

type ResStatus = 'success' | 'error' | 'fail'

export interface IRes {
	status: ResStatus
}

export interface IResProduct extends IRes {
	data: IProduct
}

export interface IResProducts extends IRes {
	data: IProduct[]
}

export interface IResMessage extends IRes {
	message: string
}

export interface IResOrder extends IRes {
	data: IOrder
}

export interface IResOrders extends IRes {
	data: IOrder[]
}
