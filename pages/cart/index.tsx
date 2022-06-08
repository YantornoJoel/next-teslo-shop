import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { CartContext } from '../../context';
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { CartList, OrderSummary } from '../../components/cart';

const CartPage = () => {

    const { isLoaded, cart, numberOfItems } = useContext(CartContext);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && cart.length === 0) {
            router.replace('/cart/empty')
        }
    }, [isLoaded, cart, router])

    if (!isLoaded || cart.length === 0) {
        return (<></>);
    }


    return (
        <ShopLayout title={`Carrito - ${numberOfItems}`} pageDescription={'Carrito de compras de la tienda'}>
            <Typography variant='h1' component='h1'>Carrito</Typography>

            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList editable={true} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Orden</Typography>
                            <Divider sx={{ my: 1 }} />

                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                <Button
                                    color="secondary"
                                    className='circular-btn-primary'
                                    fullWidth
                                    href='/checkout/address'
                                >
                                    Verificar
                                </Button>
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


        </ShopLayout>
    )
}

export default CartPage;