import { createContext } from 'react'

interface ContextProps {
	isMenuOpen: boolean
	toggleSideMenu: () => void
}

export const CustomContext = createContext({} as ContextProps)
