'use client'

import * as React from 'react';
import { useState } from 'react';
import { Grid, Box, Paper, Typography, Button, Divider, Link, Fade, Breadcrumbs, TextField, FormControl, InputLabel, Select, MenuItem, Menu} from '@mui/material';
// import RequestMaintenanceTable from '../TableComponent/RequestMaintenanceTable';
import TenantInformationTable from '../TableComponent/TenantInformationTable';

export default function TenantInformationComponent(){
    return(
        <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
            <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '1px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
              Tenant Information
            </Typography>
            <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                    {/* <Typography color="inherit">Navigation</Typography> */}
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Home">
                        Home
                    </Link>
                    <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>List of Tenant</Typography>
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
                                marginTop: '2rem',
                                height: 'auto'
                            }}
                        >
                         

                            <TenantInformationTable/> 
                        </Paper>
                    {/* <Paper elevation={3} style={{ maxWidth: { xs: 300, sm: 740,  md: 940, lg: 1400 }, padding: '0px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h6" letterSpacing={2} sx={{marginLeft: '20px', mt:2}} >
                                    List of Maintenance Request
                                </Typography>
                            </Grid>
                        
                        </Grid>
                        <RequestMaintenanceTable/>
                    </Paper> */}
                </Grid>
                

            </Grid>
        </Box>
    )
}