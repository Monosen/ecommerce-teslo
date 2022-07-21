import { FC, PropsWithChildren, useReducer } from 'react'
import { CustomContext, customReducer } from './'

export interface CustomState {
	isMenuOpen: boolean
}

const CUSTOM_INITIAL_STATE: CustomState = {
	isMenuOpen: false
}

export const CustomProvider: FC<PropsWithChildren> = ({ children }) => {
	const [state, dispatch] = useReducer(customReducer, CUSTOM_INITIAL_STATE)

	const toggleSideMenu = () => {
		dispatch({ type: 'CUSTOM_ToggleMenu' })
	}

	return (
		<CustomContext.Provider value={{ ...state, toggleSideMenu }}>
			{children}
		</CustomContext.Provider>
	)
}
