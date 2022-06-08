import { UiState } from './'


type UiActioType =
    | { type: '[UI] - ToggleMenu' }


export const uiReducer = (state: UiState, action: UiActioType): UiState => {

    switch (action.type) {
        case '[UI] - ToggleMenu':
            return {
                ...state,
                isMenuOpen: !state.isMenuOpen

            }

        default:
            return state;
    }

}
