'use client'

import * as React from 'react';
import { useState } from 'react';
import { Grid, Box, Paper, Typography,  Link, Breadcrumbs} from '@mui/material';
import PaymentTransactionTable from '../TableComponent/PaymentTransactionTable';
import SuccessSnackbar from '../Labraries/snackbar';
import { SnackbarProvider } from 'notistack';
import ErrorSnackbar from '../Labraries/ErrorSnackbar'
import CreatePaymentTransaction from '../ModalComponent/AddPaymentModal';
import DepositTransactionTable from '../TableComponent/ExpensesTable';

export default function DepositTransactionComponent({loading, setLoading}){
    const [successful, setSuccessful] = useState(null);
    const [error, setError] = useState(null);
    const [editPayment, setEditPayment] = useState(null);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const handleEdit = (id) => {
        console.log('Edit Property:', id)
        setEditPayment(id);
        setOpen(true);
    }


    return(
        <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
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
              Deposit Transactions
            </Typography>
            <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                    {/* <Typography color="inherit">Navigation</Typography> */}
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Home">
                        Home
                    </Link>
                    <Typography letterSpacing={2} color="inherit"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Revenue Tracking</Typography>
                    <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Deposit Transactions</Typography>
                </Breadcrumbs>
            </Grid>
            <Box sx={{mt:'4rem'}}>
            </Box>

            <Grid  container spacing={1} sx={{ mt: '-0.9rem', display:'flex', justifyContent:' center',  }}>
                <Grid item xs={12} >
                        <Paper
                            elevation={2}
                            sx={{
                                maxWidth: { xs: 312, sm: 741,  md: 940, lg: 1400 }, 
                                padding: "1rem 0rem 0rem 0rem",
                                borderRadius: '8px',
                                height: 'auto'
                            }}
                        >
                         
                            <DepositTransactionTable
                                setError={setError}
                                setSuccessful={setSuccessful}
                                setLoading={setLoading}
                                handleEdit={handleEdit}
                            />
                           
                        </Paper>
                </Grid>
               
                

            </Grid>
        </Box>
    )
}