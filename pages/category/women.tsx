import { NextPage } from 'next'
import React from 'react'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { useProducts } from '../../hooks'
import { Typography } from '@mui/material';
import { FullScreenLoading } from '../../components/ui'

const WomenPage: NextPage = () => {

    const { products, isLoading } = useProducts('/products?gender=women')

    return (
        <ShopLayout title={'Teslo-Shop - Women'} pageDescription={'Encuentra los mejores productos para ellas'}>
            <Typography variant='h1' component='h1'>Mujeres</Typography>
            <Typography variant='h2' sx={{ mb: 1 }}>Productos para ellas</Typography>

            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }

        </ShopLayout>
    )
}


export default WomenPage