'use client'

import * as React from 'react';
import { useState } from 'react';
import { Grid, Box, Paper, Typography, Button, Divider, Link, Fade, Breadcrumbs, TextField, FormControl, InputLabel, Select, MenuItem, Menu} from '@mui/material';
import RegisterComponent from '../FormsComponent/TenantRegistrationForm';
import Image from 'next/image';

export default function TenantRegistrationForm({id}){
    return(
        <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
            <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '5px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
                Tenant Registration Form
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
                        List of Properties
                    </Link>
                    <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Apartment Details</Typography>
                </Breadcrumbs>
            </Grid>
            <Box sx={{mt:'4rem'}}>

            </Box>

            <Grid  container spacing={1} sx={{maxWidth: 1300, mt: '10rem', display:'flex', justifyContent:' center',  margin: 'auto'}}>
                <Grid item xs={12} md={5} lg={5}>
                    <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Typography variant="h5" gutterBottom>
                        Apartment Details
                        </Typography>
                        <Divider sx={{ marginBottom: '20px' }} />
                        
                        <Typography variant="body1" gutterBottom>
                        <strong>Name:</strong> Apartment No. 1
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                        <strong>Rental Fee:</strong> ₱5000.00
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                        <strong>Location:</strong> Peralta St., Brgy. Burabod, Sor City
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                        <strong>Inclusions:</strong> Aircon, Kitchen, Stove, Comfort Room
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                        <strong>Rooms:</strong> 3 rooms
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                        <strong>Status:</strong> Available
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                        <strong>Capacity:</strong> 6
                        </Typography>

                        {/* <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Dashboard/apartment/[id]/RegisterTenant' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '2rem', mb: '-0.1rem', fontSize: 16, borderRadius: '12px'}} ><CreateOutlinedIcon sx={{mr:'0.2rem'}}/>Register New Tenant</Button>
                        </Box> */}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={7} lg={7}>
                    <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '8px'}}>  
                        <RegisterComponent/>
                    </Paper>
                </Grid>
                

            </Grid>
        </Box>
    )
}