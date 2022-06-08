import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useForm } from "react-hook-form";
import Cookies from 'js-cookie';
import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from "@mui/material"

import { CartContext } from "../../context";
import { ShopLayout } from "../../components/layouts"
import { provinces } from '../../utils/provinces';



type FormData = {
    firstName: string;
    lastName: string;
    province: string;
    city: string;
    zip: string;
    phone: string;
    address: string;
    address2?: string;
}


const getAddressFromCookies = (): FormData => {
    return {
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        province: Cookies.get('province') || '',
        city: Cookies.get('city') || '',
        zip: Cookies.get('zip') || '',
        phone: Cookies.get('phone') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
    }
}


const AddressPage = () => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            province: '',
            city: '',
            zip: '',
            phone: '',
            address: '',
            address2: '',
        }
    });

    useEffect(() => {
        reset(getAddressFromCookies());
    }, [reset])


    const { updateAddress } = useContext(CartContext);

    const router = useRouter();

    const onSubmitAddress = (data: FormData) => {
        updateAddress(data);
        router.push('/checkout/summary');
    }

    return (
        <ShopLayout title="Dirección" pageDescription="Confirmar dirección del destino">
            <form onSubmit={handleSubmit(onSubmitAddress)} noValidate>
                <Typography variant="h1" component='h1'>Dirección</Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Nombre'
                            variant="filled"
                            fullWidth
                            {...register('firstName', {
                                required: 'Este campo es requerido',
                                minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                            })}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Apellido'
                            variant="filled"
                            fullWidth
                            {...register('lastName', {
                                required: 'Este campo es requerido',
                                minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                            })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField
                                // select
                                variant="filled"
                                label="Provincia"
                                fullWidth
                                // defaultValue={Cookies.get('province') || provinces[0].code}
                                {...register('province', {
                                    required: 'Este campo es requerido'
                                })}
                                error={!!errors.province}
                                helperText={errors.province?.message}
                            >
                                {/* {
                                    provinces.map(province => (
                                        <MenuItem
                                            key={province.code}
                                            value={province.code}
                                        >
                                            {province.name}
                                        </MenuItem>
                                    ))
                                } */}
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Ciudad / Barrio'
                            variant="filled"
                            fullWidth
                            {...register('city', {
                                required: 'Este campo es requerido',
                                minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                            })}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Código Postal'
                            variant="filled"
                            fullWidth
                            {...register('zip', {
                                required: 'Este campo es requerido',
                                minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                            })}
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Teléfono'
                            variant="filled"
                            fullWidth
                            {...register('phone', {
                                required: 'Este campo es requerido',
                                minLength: { value: 8, message: 'Mínimo 8 caracteres' }
                            })}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Dirección'
                            variant="filled"
                            fullWidth
                            {...register('address', {
                                required: 'Este campo es requerido',
                                minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                            })}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Dirección 2 (opcional)'
                            variant="filled"
                            fullWidth
                            {...register('address2')}
                        />
                    </Grid>


                </Grid>


                <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
                    <Button color="secondary" className="circular-btn-primary" size="large" type="submit">
                        Revisar pedido
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    )
}


// export const getServerSideProps: GetServerSideProps = async ({req}) => {

//     const {token = ''} = req.cookies;
//     let isValidToken = false;

//     try {
//         await jwt.isValidToken(token);
//         isValidToken = true;
//     } catch (error) {
//         isValidToken = false;
//     }

//     if (!isValidToken) {
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false
//             }
//         }
//     }


//     return {
//         props: {

//         }
//     }
// }



export default AddressPage