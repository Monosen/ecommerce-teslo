import { CustomState } from './'

type CustomActionType = { type: 'CUSTOM_ToggleMenu' }

export const customReducer = (
	state: CustomState,
	action: CustomActionType
): CustomState => {
	switch (action.type) {
		case 'CUSTOM_ToggleMenu':
			return {
				...state,
				isMenuOpen: !state.isMenuOpen
			}

		default:
			return state
	}
}
