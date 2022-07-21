import useSWR, { SWRConfiguration } from 'swr'
import { IResProducts } from '../interface/responseTypes'

// const fetcher = (...args: [key: string]) =>
// 	fetch(...args).then(res => res.json())

export const useProducts = (url: string, config: SWRConfiguration = {}) => {
	const { data, error } = useSWR<IResProducts>(`/api${url}`, config)

	return {
		products: data?.data || [],
		isLoading: !error && !data,
		isError: error
	}
}
