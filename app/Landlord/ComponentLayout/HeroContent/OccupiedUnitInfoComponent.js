'use client'
import React from 'react';
import { Box, Grid, Typography,  Link, Breadcrumbs, Paper, Card, CardContent, Avatar,  Divider, Button, } from '@mui/material'
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/navigation';
import { Email, Phone } from '@mui/icons-material';
import dynamic from 'next/dynamic';
// import PaymentHistoryTable from '../TableComponent/PaymentHistoryTable';
const PaymentHistory = dynamic(() => import('../TableComponent/paymenthistorytable'), {
ssr: false
}) 

export default function OccupiedTenantInformation() {
    const  router = useRouter();   
    // const johnDoePayments = rows.filter(row => row.col1 === 'John Doe');

  return (
    <>
        <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
            <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '5px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
                Tenant Information
            </Typography>
            <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                    {/* <Typography color="inherit">Navigation</Typography> */}
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Home">
                        Home
                    </Link>
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Property">
                        Property
                    </Link>
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Property/[propsid]">
                        List of Units
                    </Link>
                    <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Tenant Information</Typography>
                </Breadcrumbs>
            </Grid>
            <Box sx={{mt:'4rem'}}>

            </Box>

            <Grid  container spacing={1}>
                <Grid item xs={12} md={5} lg={5}>
                    <Paper elevation={1} style={{width: {xs: 300, lg: 'auto'}, padding: '25px', marginTop: '15px', borderRadius: '8px'}}>  
                        <Grid container justifyContent="center" sx={{ mb: 2 }}>
                        <Avatar  sx={{width: 100, height: 100 , backgroundColor: 'red', fontSize:'2.9rem'}} aria-label="recipe">
                            JD
                        </Avatar>
                        </Grid>  
                        
                        <Typography variant='h5' align={'center'} gutterBottom >
                          John Doe 
                        </Typography>

                        <Grid  container alignItems="center" justifyContent="center">
                           
                            <Grid item>
                            <Email fontSize="small" color="action" sx={{mt:0.7,}}/>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" sx={{ml: 1}}>johndoe@example.com</Typography>
                            </Grid>
                        
                            
                        </Grid>
                        <Grid  container alignItems="center" justifyContent="center" sx={{mt:1}}>
                            <Grid item>
                                <Phone fontSize="small" color="action" />
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" sx={{ml: 1}}>+63 936 9223 915</Typography>
                            </Grid>
                       </Grid>

                       <Divider sx={{ my: 2 }} />

                        {/* Lease Info */}
                        <Typography variant="body1" align="center">
                        <strong>Lease Start Date:</strong> January 1, 2024
                        </Typography>

                        <Typography variant="body1" align="center">
                        <strong>Lease End Date:</strong> December 31, 2024
                        </Typography>


                    </Paper>
                </Grid>
            </Grid>
            <Grid  container spacing={2} >
                <Grid item xs={12} md={5} lg={7}>
                    <Paper elevation={2} style={{height: {xs:'20vh', lg:'20vh'}, marginTop: '15px',  borderRadius: '8px' ,  padding: "1rem 0rem 0rem 0rem",  }}>  
                        <Typography variant="h5" color={'black'} sx={{ fontSize: '20px', marginTop: '0.6rem', ml: '1.2rem', mb: 2 }} letterSpacing={2} gutterBottom>
                           Payment History
                        </Typography>
                        <Grid >
                            <PaymentHistory/>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5} lg={5}>
                    <Paper elevation={3} sx={{ height: {xs:'65vh', lg:'51vh'}, padding: '25px', marginTop: '15px',  borderRadius: '8px'}}>  
                        <Grid container justifyContent="start" sx={{ mb: 1, mt:3 }}>
                            <Box>
                            <Typography variant="h5" color={'#424242'} sx={{fontSize: {xs: '21px', sm: '23px', md: '22px', lg: '23px'}, marginTop: '0.6rem', mb: 2 }} letterSpacing={2} gutterBottom>
                              Rental Fee
                            </Typography>
                            </Box>
                            
                        </Grid>  
                        <Grid container justifyContent="start"  sx={{ mb: 2, alig: 'center'}}>
                            <Grid item xs='12' >
                                <Box  bgcolor={'#eeeeee'} display='flex' alignItems='center' mt={'-0.9rem'}> 
                                    <Grid container justifyContent='space-between'>
                                        <Grid item>
                                            <Typography variant="body1" color={'black'} sx={{ fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'},  ml: '1.2rem', mt: 1,  }} letterSpacing={2} gutterBottom>
                                            Total Amount:
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body1" color={'black'} sx={{ fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'}, mr: 1,  mt: 1,  }} letterSpacing={2} gutterBottom>
                                            ₱100,000.00
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid> 

                        <Grid container justifyContent="start" sx={{ mb: 1 }}>
                            <Box>
                            <Typography variant="h5" color={'gray'} sx={{fontSize: {xs: '21px', sm: '23px', md: '22px', lg: '23px'}, marginTop: '0.6rem', mb: 2 }} letterSpacing={2} gutterBottom>
                              Payment
                            </Typography>
                            </Box>
                            
                        </Grid>  
                        <Grid container justifyContent="start"  sx={{ mb: 2, alig: 'center'}}>
                            <Grid item xs='12' >
                                <Box  bgcolor={'#eeeeee'} display='flex' alignItems='center' mt={'-0.9rem'}> 
                                    <Grid container justifyContent='space-between'>
                                        <Grid item>
                                            <Typography variant="body1" color={'black'} sx={{ fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'},  ml: '1.2rem', mt: 1,  }} letterSpacing={2} gutterBottom>
                                            Total Amount:
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body1" color={'#2e7d32'} sx={{ fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'}, mr: 1,  mt: 1,  }} letterSpacing={2} gutterBottom>
                                            ₱2,500.00
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid> 

                        <Grid container justifyContent="start" sx={{ mb: 1 }}>
                            <Box>
                            <Typography variant="h5" color={'gray'} sx={{fontSize: {xs: '21px', sm: '23px', md: '22px', lg: '23px'}, marginTop: '0.6rem', mb: 2 }} letterSpacing={2} gutterBottom>
                             Balance
                            </Typography>
                            </Box>
                            
                        </Grid>  
                        <Grid container justifyContent="start"  sx={{ mb: 2, alig: 'center'}}>
                            <Grid item xs='12' >
                                <Box  bgcolor={'#eeeeee'} display='flex' alignItems='center' mt={'-0.9rem'}> 
                                    <Grid container justifyContent='space-between'>
                                        <Grid item>
                                            <Typography variant="body1" color={'black'} sx={{fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'},  ml: '1.2rem', mt: 1,  }} letterSpacing={2} gutterBottom>
                                            Total Amount:
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body1" color={'#c62828'} sx={{fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'}, mr: 1,  mt: 1,  }} letterSpacing={2} gutterBottom>
                                            ₱75,000.00
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid> 
                        <Grid item xs={12}>
                            <Typography variant='body1' color={'gray'} sx={{fontSize: '15px', mt:'2.3rem'}}> 
                                Contract Details: Tenant agrees to rent Unit A101 at ₱2,500 per month, with a lease starting January 1, 2024, and ending December 31, 2024.
                            </Typography>
                        </Grid>


                        
                        


                    </Paper>
                </Grid>
            </Grid>
        </Box>
    </>

  );
}