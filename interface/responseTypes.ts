import { IProduct } from './'

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
