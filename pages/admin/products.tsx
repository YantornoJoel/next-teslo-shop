import NextLink from 'next/link';
import useSWR from 'swr';

import { AdminLayout } from '../../components/layouts/AdminLayout';
import { AddOutlined, CategoryOutlined, Edit, EditAttributesOutlined } from '@mui/icons-material';
import { Box, Button, CardMedia, Chip, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { IProduct } from '../../interfaces';



const columns: GridColDef[] = [
    {
        field: 'img',
        headerName: 'Foto',
        headerAlign: 'center',
        align: 'center',
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <a href={`/product/${row.slug}`} target="_blank" rel='noreferrer'>
                    <CardMedia
                        component="img"
                        alt={row.title}
                        className="fadeIn"
                        image={row.img}
                    />
                </a>
            )
        }
    },
    {
        field: 'title',
        headerName: 'Título',
        width: 250,
        headerAlign: 'center',
        align: 'center',
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <NextLink href={`/admin/products/${row.slug}`} passHref>
                    <Link underline='always'>{row.title}</Link>
                </NextLink>
            )
        }
    },
    { field: 'gender', headerName: 'Género', headerAlign: 'center', align: 'center' },
    { field: 'type', headerName: 'Tipo', headerAlign: 'center', align: 'center' },
    { field: 'inStock', headerName: 'Inventario', headerAlign: 'center', align: 'center' },
    { field: 'price', headerName: 'Precio', headerAlign: 'center', align: 'center' },
    { field: 'sizes', headerName: 'Talles', width: 250, headerAlign: 'center', align: 'center' },
    {
        field: 'check',
        headerName: 'Editar',
        width: 150,
        headerAlign: 'center',
        align: 'center',
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <NextLink href={`/admin/products/${row.slug}`} passHref >
                    <Link style={{ color: '#27929F' }}><Edit /></Link>
                </NextLink>
            )
        }
    },
]

const ProductsPage = () => {

    const { data, error } = useSWR<IProduct[]>("/api/admin/products");

    if (!data && !error) return (<></>);

    const rows = data.map(product => ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(' - '),
        slug: product.slug
    }));


    return (
        <AdminLayout
            title={`Productos (${data.length})`}
            subTitle={'Mantenimiento de productos'}
            icon={<CategoryOutlined />}
        >

            <Box display="flex" justifyContent="end" sx={{ mb: 2 }}>
                <Button
                    startIcon={<AddOutlined />}
                    color="secondary"
                    href="/admin/products/new"
                    className='circular-btn-primary'
                >
                    Crear producto
                </Button>
            </Box>

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

export default ProductsPage