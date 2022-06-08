import { CartState } from './'
import { ICartProduct, ShippingAddress } from '../../interfaces';



type CartActionType =
    | { type: '[CART] - LoadCart from cookies | storage', payload: ICartProduct[] }
    | { type: '[CART] - Update products in cart', payload: ICartProduct[] }
    | { type: '[CART] - Change cart quantity', payload: ICartProduct }
    | { type: '[CART] - Remove product in cart', payload: ICartProduct }
    | { type: '[CART] - LoadAddress from Cookies', payload: ShippingAddress }
    | { type: '[CART] - Update Address', payload: ShippingAddress }
    | {
        type: '[CART] - Update cart summary',
        payload: {
            numberOfItems: number,
            subTotal: number,
            imp: number,
            total: number
        }
    }
    | { type: '[CART] - Order complete' }


export const cartReducer = (state: CartState, action: CartActionType): CartState => {

    switch (action.type) {
        case '[CART] - LoadCart from cookies | storage':
            return {
                ...state,
                isLoaded: true,
                cart: [...action.payload]
            }

        case '[CART] - Update products in cart':
            return {
                ...state,
                cart: [...action.payload]
            }

        case '[CART] - Change cart quantity':
            return {
                ...state,
                cart: state.cart.map(product => {
                    if (product._id !== action.payload._id) return product;
                    if (product.size !== action.payload.size) return product;
                    return action.payload;
                })
            }

        case '[CART] - Remove product in cart':
            return {
                ...state,
                cart: state.cart.filter(product => !(product._id === action.payload._id && product.size === action.payload.size))
            }

        case '[CART] - Update cart summary':
            return {
                ...state,
                ...action.payload
            }

        case '[CART] - LoadAddress from Cookies':
        case '[CART] - Update Address':
            return {
                ...state,
                shippingAddress: action.payload
            }

        case '[CART] - Order complete':
            return {
                ...state,
                cart: [],
                numberOfItems: 0,
                subTotal: 0,
                imp: 0,
                total: 0
            }

        default:
            return state;
    }

}
