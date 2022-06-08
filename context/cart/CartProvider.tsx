import { FC, useEffect, useReducer } from 'react'
import axios from 'axios';
import Cookie from 'js-cookie';

import { cartReducer, CartContext } from './'
import { tesloApi } from '../../api';
import { ICartProduct, ShippingAddress, IOrder } from '../../interfaces';



export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    imp: number;
    total: number;

    shippingAddress?: ShippingAddress;
}


const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    imp: 0,
    total: 0,

    shippingAddress: undefined
}

interface Props {
    children?: React.ReactNode;
}

export const CartProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    useEffect(() => {
        try {
            const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')) : []
            dispatch({ type: '[CART] - LoadCart from cookies | storage', payload: cookieProducts })
        } catch (error) {
            dispatch({ type: '[CART] - LoadCart from cookies | storage', payload: [] })
        }
    }, [])


    useEffect(() => {

        if (Cookie.get('firstName')) {
            const shippingAddress = {
                firstName: Cookie.get('firstName') || '',
                lastName: Cookie.get('lastName') || '',
                province: Cookie.get('province') || '',
                city: Cookie.get('city') || '',
                zip: Cookie.get('zip') || '',
                phone: Cookie.get('phone') || '',
                address: Cookie.get('address') || '',
                address2: Cookie.get('address2') || '',
            }

            dispatch({ type: '[CART] - LoadAddress from Cookies', payload: shippingAddress });
        }
    }, [])


    useEffect(() => {
        Cookie.set('cart', JSON.stringify(state.cart))
    }, [state.cart])


    useEffect(() => {

        const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
        const subTotal = state.cart.reduce((prev, current) => (current.price * current.quantity) + prev, 0)
        const impuesto = Number(process.env.NEXT_PUBLIC_IMPUESTO || 0)

        const orderSummary = {
            numberOfItems,
            subTotal,
            imp: subTotal * impuesto,
            total: subTotal * (impuesto + 1)
        }

        dispatch({ type: '[CART] - Update cart summary', payload: orderSummary })

    }, [state.cart])



    const addProductToCart = (product: ICartProduct) => {

        const productInCart = state.cart.some(p => p._id === product._id);
        if (!productInCart) return dispatch({ type: '[CART] - Update products in cart', payload: [...state.cart, product] })

        const productInCartButDifferentSize = state.cart.some(p => p._id === product._id && p.size === product.size);
        if (!productInCartButDifferentSize) return dispatch({ type: '[CART] - Update products in cart', payload: [...state.cart, product] })

        // Acumular, si el producto ya existe con ese id y talle
        const updatedProducts = state.cart.map(p => {
            if (p._id !== product._id) return p;
            if (p.size !== product.size) return p;

            // Actualizar la cantidad
            p.quantity += product.quantity;
            return p
        });

        dispatch({ type: '[CART] - Update products in cart', payload: updatedProducts })
    }

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({ type: '[CART] - Change cart quantity', payload: product })
    }

    const removeCartProduct = (product: ICartProduct) => {
        dispatch({ type: '[CART] - Remove product in cart', payload: product })
    }

    const updateAddress = (address: ShippingAddress) => {
        Cookie.set('firstName', address.firstName);
        Cookie.set('lastName', address.lastName);
        Cookie.set('province', address.province);
        Cookie.set('city', address.city);
        Cookie.set('zip', address.zip);
        Cookie.set('phone', address.phone);
        Cookie.set('address', address.address);
        Cookie.set('address2', address.address2 || '');

        dispatch({ type: '[CART] - Update Address', payload: address })
    }

    const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {

        if (!state.shippingAddress) {
            throw new Error("No hay dirección de entrega");
        }

        const body: IOrder = {
            orderItems: state.cart.map(product => ({
                ...product,
                size: product.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            imp: state.imp,
            total: state.total,
            isPaid: false
        }


        try {

            const { data } = await tesloApi.post<IOrder>('/orders', body);

            dispatch({ type: '[CART] - Order complete' });

            return {
                hasError: false,
                message: data._id
            }


        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.message
                }
            }
            return {
                hasError: true,
                message: 'Error no controlado, hable con el administrador'
            }
        }
    }


    return (
        <CartContext.Provider value={{
            ...state,


            // Metodos
            addProductToCart,
            updateCartQuantity,
            removeCartProduct,
            updateAddress,

            // Ordenes
            createOrder
        }}>
            {children}
        </CartContext.Provider>
    )

}