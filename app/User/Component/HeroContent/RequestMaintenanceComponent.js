'use client';
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Paper, Typography,Box, Grid, Button, Link, Breadcrumbs, Divider, Skeleton, Avatar, TextField} from '@mui/material';
import RequestMaintenanceForm from "../FormComponent/RequestMaitenanceForm";
import SuccessSnackbar from '../../../Landlord/ComponentLayout/Labraries/snackbar';
import ErrorSnackbar from '../../../Landlord/ComponentLayout/Labraries/ErrorSnackbar'
import { SnackbarProvider } from 'notistack';


export default function RequestMaintenanceComponent({loading, setLoading}){
    const [error, setError] = useState(false);
    const [successful, setSuccessful] = useState(false)
    return (
        <>
            <Box  sx={{ maxWidth: 1400,  margin: 'auto', }}>
                <SnackbarProvider maxSnack={3}>
                    <SuccessSnackbar
                        setSuccessful={setSuccessful}
                        successful={successful}          
                    />
                    <ErrorSnackbar
                        error={error}
                        setError={setError}          
                    />
                </SnackbarProvider>
                <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '1px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
                    Request Maintenace
                </Typography>
                <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                    <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                        {/* <Typography color="inherit">Navigation</Typography> */}
                        <Link letterSpacing={2} underline="hover" color="inherit" href="/User/Home">
                            Home
                        </Link>
                        <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Request Maintenace</Typography>
                    </Breadcrumbs>
                </Grid>
                <Box sx={{mt:'4rem'}}>
                </Box>
                <Grid container spacing={1} sx={{ mt: '-0.9rem', display:'flex', justifyContent:' center',  }}>
                    <Grid item xs={12} sm={6} md={4} lg={12}>
                        <RequestMaintenanceForm
                            setLoading={setLoading}
                            setError={setError}
                            error={error}
                            setSuccessful={setSuccessful}
                            successful={successful}
                        />
                    </Grid>
                </Grid>



            </Box>
        
        </>
    )
}