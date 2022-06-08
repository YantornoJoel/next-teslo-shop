import { createContext } from 'react'
import { ICartProduct, ShippingAddress } from '../../interfaces';

interface ContextProps {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    imp: number;
    total: number;

    shippingAddress?: ShippingAddress;

    // Metodos
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeCartProduct: (product: ICartProduct) => void;
    updateAddress: (address: ShippingAddress) => void

    // Ordenes
    createOrder: () => Promise<{ hasError: boolean; message: string }>
}


export const CartContext = createContext({} as ContextProps);