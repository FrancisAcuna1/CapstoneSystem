'use client'
import React, { useState } from 'react';
import { Grid, Box, Paper, Typography, Button, Fade,   Link, Breadcrumbs, TextField, FormControl, InputLabel, Select, MenuItem, } from '@mui/material';
import ModalComponent from '../ModalComponent/page';
import dynamic from 'next/dynamic';
const Fullcalendar = dynamic(() => import('../Labraries/CalendarComponent'), {
    ssr: false
    }) 




export default function ApointmentScheduleComponent () {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false)


    return (
        <Box  sx={{ maxWidth: 1400,  margin: 'auto', }}>
            <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '5px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
                Schedule of All Maintenace
            </Typography>
            <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                    {/* <Typography color="inherit">Navigation</Typography> */}
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Home">
                        Home
                    </Link>
                    <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Maintenance Schedule</Typography>
                </Breadcrumbs>
            </Grid>
            <Box sx={{mt:'4rem'}}>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                <Paper elevation={3} style={{'@media (max-width: 100px)' : {width: 'auto'}, padding: '25px', marginTop: '15px', borderRadius: '15px',  justifyContent: "center", alignItems: "center",}}>
                  <Grid container sx={{display: 'flex', justifyContent:{xs:'start', sm: 'space-between', lg:'space-between',}}}>
                    <Grid item>
                      <Typography variant="h6" letterSpacing={2} sx={{marginLeft: '5px', mt:1}} >
                          Shedule of Maintenace
                      </Typography>
                    </Grid>
                    <Grid item>
                      {/* modal dini */}
                      <ModalComponent
                        handleOpen={handleOpen}
                        open={open}
                        handleClose={handleClose}
                        
                      />
                    </Grid>
                  </Grid>
                  <Fullcalendar
                    handleOpen={handleOpen}
                    
                    
                  />
                 
                </Paper>
                    
                </Grid>
            </Grid>
        </Box>
    )
}