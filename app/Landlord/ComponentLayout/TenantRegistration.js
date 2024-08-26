'use client'

import * as React from 'react';
import { useState } from 'react';
import { Grid, Box, Paper, Typography, Button, Divider, Link, Fade, Breadcrumbs, TextField, FormControl, InputLabel, Select, MenuItem, Menu} from '@mui/material';

export default function TenantRegistrationForm(){
    return(
        <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
            <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '5px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
                Tenant Registration Form
            </Typography>
            <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '16px' } }}>
                    {/* <Typography color="inherit">Navigation</Typography> */}
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Dashboard/home">
                        Home
                    </Link>
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Dashboard/apartment">
                        Apartment
                    </Link>
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Dashboard/apartment/[id]">
                        List of Units
                    </Link>
                    <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '16px' } }}>Register Tenant</Typography>
                </Breadcrumbs>
            </Grid>
            <Box sx={{mt:'4rem'}}>

            </Box>

            <Grid  container spacing={1} sx={{maxWidth: 1300, mt: '10rem', display:'flex', justifyContent:' center',  margin: 'auto'}}>
                <Grid item xs={12} lg={5}>
                    <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="h5" letterSpacing={2} sx={{ ml: '0.3rem', mt: '0.1rem', fontSize: '24px', fontWeight: 540 }}>
                                Unit no. 1
                                </Typography>
                                <Typography variant="body1" letterSpacing={2} color="#f78028" sx={{ maxWidth: { xs: 225, lg: 125 }, ml: '0.3rem', mt: '0.1rem', fontSize: '15px', fontWeight: 540 }}>
                                Monthly Rate: ₱10,000.00
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <img
                                src="/3Dnewbedroom.png"
                                style={{ width: '105px', height: 'auto', objectFit: 'contain' }}
                                alt="proptrack logo"
                                />
                            </Grid>
                        </Grid>

                        {/* <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Dashboard/apartment/[id]/RegisterTenant' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '2rem', mb: '-0.1rem', fontSize: 16, borderRadius: '12px'}} ><CreateOutlinedIcon sx={{mr:'0.2rem'}}/>Register New Tenant</Button>
                        </Box> */}
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={7}>
                    <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="h5" letterSpacing={2} sx={{ ml: '0.3rem', mt: '0.1rem', fontSize: '24px', fontWeight: 540 }}>
                                Unit no. 1
                                </Typography>
                                <Typography variant="body1" letterSpacing={2} color="#f78028" sx={{ maxWidth: { xs: 225, lg: 125 }, ml: '0.3rem', mt: '0.1rem', fontSize: '15px', fontWeight: 540 }}>
                                Monthly Rate: ₱10,000.00
                                </Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <img
                                src="/3Dnewbedroom.png"
                                style={{ width: '105px', height: 'auto', objectFit: 'contain' }}
                                alt="proptrack logo"
                                />
                            </Grid>
                        </Grid>

                        {/* <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Dashboard/apartment/[id]/RegisterTenant' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '2rem', mb: '-0.1rem', fontSize: 16, borderRadius: '12px'}} ><CreateOutlinedIcon sx={{mr:'0.2rem'}}/>Register New Tenant</Button>
                        </Box> */}
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    )
}