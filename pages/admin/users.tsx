import { useState, useEffect } from 'react';
import useSWR from 'swr';

import { AdminLayout } from '../../components/layouts'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';
import { Grid, MenuItem, Select } from '@mui/material'
import { PeopleOutlined } from '@mui/icons-material'


const UsersPage = () => {

    const { data, error } = useSWR<IUser[]>("/api/admin/users");
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (data) {
            setUsers(data);
        }
    }, [data])


    if (!data && !error) return (<></>);

    const onRoleUpdated = async (userId: string, newRole: string) => {

        const previosUsers = users.map(user => ({ ...user }));
        const updatedUsers = users.map(user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        setUsers(updatedUsers);

        try {
            await tesloApi.put('/admin/users', { userId, role: newRole })
        } catch (error) {
            setUsers(previosUsers);
            console.log(error);
            alert("No se pudo actualizar el rol del usuario.");
        }

    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 350, headerAlign: 'center', align: 'center' },
        { field: 'name', headerName: 'Nombre Completo', width: 350, headerAlign: 'center', align: 'center' },
        {
            field: 'rol',
            headerName: 'Rol',
            width: 300,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }: GridValueGetterParams) => {
                return (
                    <Select
                        value={row.rol}
                        label="Rol"
                        onChange={({ target }) => onRoleUpdated(row.id, target.value)}
                        sx={{ width: '300px', alignContent: 'center', justifyContent: 'center', textAlign: 'center' }}
                    >

                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="client">Cliente</MenuItem>
                        <MenuItem value="super-user">Super Usuario</MenuItem>
                        <MenuItem value="SEO">Seo</MenuItem>
                    </Select>
                )
            }
        },
        { field: 'id', headerName: 'ID', width: 300, headerAlign: 'center', align: 'center' },
    ]

    const rows = users.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        rol: user.role
    }))

    return (
        <AdminLayout
            title='Usuarios'
            subTitle='Mantenimiento de usuarios'
            icon={<PeopleOutlined />}
        >


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

export default UsersPage