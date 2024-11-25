'use client'

import React, {useState, useEffect} from "react"
import {Card, CardContent, CardHeader, Typography, Box, Alert, AlertTitle, Button, Paper, Grid, Breadcrumbs, Link} from '@mui/material';
import { 
CalendarToday as CalendarIcon,
Info as AlertIcon 
} from '@mui/icons-material';

import SuccessSnackbar from '../Labraries/snackbar';
import { SnackbarProvider } from 'notistack';
import ErrorSnackbar from '../Labraries/ErrorSnackbar'
import RecurringCardComponent from "../Labraries/RecurringCard";
import AddRecurringExpenses from "../ModalComponent/AddRecurringExpensesModal";



export default function RecurringComponent({setLoading, loading}){
    const [successful, setSuccessful] = useState(null);
    const [error, setError] = useState(null);
    const [editPayment, setEditPayment] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
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
            <Typography variant="h5" letterSpacing={3} sx={{color: '#263238', marginLeft: '5px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
               Expenses Tracking
            </Typography>
            <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                    {/* <Typography color="inherit">Navigation</Typography> */}
                    <Link letterSpacing={1} underline="hover" color="inherit" href="/Landlord/Home">
                        Home
                    </Link>
                    <Link letterSpacing={1} underline="hover" color="inherit"  href="/Landlord/ExpensesTracking"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                        Expenses Tracking
                    </Link>
                    <Typography letterSpacing={1} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                        Set up Recurring
                    </Typography>
                </Breadcrumbs>
            </Grid>
            <Box sx={{mt:'4rem'}}>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <AddRecurringExpenses
                        loading={loading}
                        setLoading={setLoading}  
                        setSuccessful={setSuccessful}
                        successful={successful}
                        setError={setError}
                        error={error}
                        editPayment={editPayment}
                        setEditPayment={setEditPayment}
                        open={open}
                        handleOpen={handleOpen}
                        handleClose={handleClose}
                        handleEdit={handleEdit}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        
                    
                    />
                </Grid>
                <Grid item xs={12}>
                    <RecurringCardComponent
                        loading={loading}
                        setLoading={setLoading}  
                        setSuccessful={setSuccessful}
                        successful={successful}
                        setError={setError}
                        error={error}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}
  