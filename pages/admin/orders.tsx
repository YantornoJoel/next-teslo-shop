import useSWR from 'swr';

import { AdminLayout } from '../../components/layouts/AdminLayout';
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { IOrder, IUser } from '../../interfaces';


const columns: GridColDef[] = [
    { field: 'id', headerName: 'Orden ID', width: 250, headerAlign: 'center', align: 'center' },
    { field: 'email', headerName: 'Correo', width: 250, headerAlign: 'center', align: 'center' },
    { field: 'name', headerName: 'Nombre Completo', width: 250, headerAlign: 'center', align: 'center' },
    { field: 'total', headerName: 'Precio Total', width: 150, headerAlign: 'center', align: 'center' },
    {
        field: 'isPaid',
        headerName: 'Estado',
        width: 250,
        headerAlign: 'center',
        align: 'center',
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                row.isPaid
                    ? <Chip color="success" label="Pago realizado" variant='outlined' />
                    : <Chip color="error" label="Pendiente de pago" variant='outlined' />
            )
        }
    },
    { field: 'noProducts', headerName: 'Nro. Productos', width: 100, headerAlign: 'center', align: 'center' },
    {
        field: 'check',
        headerName: 'Ver orden',
        width: 150,
        headerAlign: 'center',
        align: 'center',
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <a href={`/admin/orders/${row.id}`} target="_blank" rel='noreferrer'>
                    Ver orden
                </a>
            )
        }
    },
    { field: 'createdAt', headerName: 'Creada en', width: 200, headerAlign: 'center', align: 'center' },
]

const OrdersPage = () => {

    const { data, error } = useSWR<IOrder[]>("/api/admin/orders")

    if (!data && !error) return (<></>);

    const rows = data.map(order => ({
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        total: `$${order.total}`,
        isPaid: order.isPaid,
        noProducts: order.numberOfItems,
        createdAt: order.createdAt
    }));


    return (
        <AdminLayout title={'Ordenes'} subTitle={'Mantenimiento de ordenes'} icon={<ConfirmationNumberOutlined />}>

            <Grid container className="fadeIn">
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>
            </Grid>

        </AdminLayout>
    )
}

export default OrdersPage