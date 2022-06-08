import { useContext, FC } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { Grid, Typography } from "@mui/material"
import { currency } from '../../utils';


interface Props {
    orderValues?: {
        numberOfItems: number,
        subTotal: number,
        imp: number,
        total: number
    }
}

export const OrderSummary: FC<Props> = ({ orderValues }) => {

    const { numberOfItems, subTotal, imp, total } = useContext(CartContext)

    const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, imp, total }

    return (
        <Grid container>

            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{summaryValues.numberOfItems} {summaryValues.numberOfItems > 1 ? 'productos' : 'producto'}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>SubTotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.format(summaryValues.subTotal)}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_IMPUESTO) * 100}%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.format(summaryValues.imp)}</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Total:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'>
                <Typography variant="subtitle1">{currency.format(summaryValues.total)}</Typography>
            </Grid>

        </Grid>
    )
}
