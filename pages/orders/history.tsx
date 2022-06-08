import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

import { Typography, Grid, Chip, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { ShopLayout } from '../../components/layouts';
import { dbOrders } from '../../database';
import { IOrder, IUser } from '../../interfaces';



const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100, headerAlign: 'center', align: 'center' },
    { field: 'fullname', headerName: 'Nombre Completo', width: 300, headerAlign: 'center', align: 'center' },

    {
        field: 'paid',
        headerName: 'Estado',
        description: 'Muestra información si está pagada la orden o no',
        width: 250,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params: GridValueGetterParams) => {
            return (
                params.row.paid
                    ? <Chip color="success" label="Pago realizado" variant='outlined' />
                    : <Chip color="error" label="Pendiente de pago" variant='outlined' />
            )
        }
    },
    { field: 'products', headerName: 'Nro Productos', width: 200, headerAlign: 'center', align: 'center' },
    { field: 'total', headerName: 'Total', width: 250, headerAlign: 'center', align: 'center' },
    {
        field: 'orden',
        headerName: 'Detalle',
        width: 200,
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        renderCell: (params: GridValueGetterParams) => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref>
                    <Link underline='always'>
                        Ver orden
                    </Link>
                </NextLink>
            )
        }
    }
];


interface Props {
    orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

    const rows = orders.map((order, indice) => ({
        id: indice + 1,
        paid: order.isPaid,
        fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        products: order.numberOfItems,
        total: `$${order.total}`,
        orderId: order._id
    }));

    return (
        <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes del cliente'}>
            <Typography variant='h1' component='h1'>Historial de ordenes</Typography>


            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />

                </Grid>
            </Grid>

        </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const session = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false
            }
        }
    }

    const orders = await dbOrders.getOrderByUser((session.user as IUser)._id);

    return {
        props: {
            orders
        }
    }
}


export default HistoryPage