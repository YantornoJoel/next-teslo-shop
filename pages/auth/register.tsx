import { useState, useContext } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession, signIn } from 'next-auth/react';
import NextLink from 'next/link';

import { useForm } from 'react-hook-form';
import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';

import { AuthLayout } from '../../components/layouts'
import { validations } from '../../utils';
import { AuthContext } from '../../context/auth/AuthContext';


type FormData = {
    name: string;
    email: string;
    password: string;
}

const RegisterPage = () => {

    const router = useRouter();
    const { registerUser } = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const onRegisterForm = async ({ name, email, password }: FormData) => {

        setShowError(false);
        const { hasError, message } = await registerUser(name, email, password)

        if (hasError) {
            setShowError(true);
            setErrorMessage(message)
            setTimeout(() => setShowError(false), 5000);
            return;
        }

        // TODO: navegar a la pantalla que el usuario estaba
        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);

        await signIn('credentials', { email, password });

    }

    return (
        <AuthLayout title={'Crear cuenta'}>
            <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component="h1" style={{ textAlign: 'center' }}>Crear cuenta</Typography>
                            <Chip
                                label="Error al ingresar usuario / contraseña"
                                color="error"
                                icon={<ErrorOutline />}
                                className="fadeIn"
                                sx={{ display: showError ? 'flex' : 'none', marginTop: '10px', marginBottom: '10px' }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Nombre completo"
                                variant="filled"
                                fullWidth
                                {...register('name', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='email'
                                label="Correo"
                                variant="filled"
                                fullWidth
                                {...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: validations.isEmail
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete='false'
                                label="Contraseña"
                                type='password'
                                variant="filled"
                                fullWidth
                                {...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                color="secondary"
                                className='circular-btn'
                                size='large'
                                fullWidth
                            >
                                Confirmar
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink
                                href={router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login'}
                                passHref
                            >
                                <Link underline='always'>
                                    ¿Ya tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}


// Para que no muestre esta pantalla si ya estoy autenticado
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session = await getSession({ req })

    const { p = '/' } = query // Para mantener la última pagina que se visito antes

    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {

        }
    }
}



export default RegisterPage