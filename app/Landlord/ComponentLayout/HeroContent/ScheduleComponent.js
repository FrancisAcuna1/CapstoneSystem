'use client'
import React, { useState } from 'react';
import { Grid, Box, Paper, Typography, Button, Fade,   Link, Breadcrumbs, TextField, FormControl, InputLabel, Select, MenuItem, Divider, } from '@mui/material';
import SuccessSnackbar from '../Labraries/snackbar';
import { SnackbarProvider } from 'notistack';
import ErrorSnackbar from '../Labraries/ErrorSnackbar'
import AddScheduleModal from '../ModalComponent/AddMaintenanceSchedule';
import dynamic from 'next/dynamic';
const Fullcalendar = dynamic(() => import('../Labraries/CalendarComponent'), {
  ssr: false
}) 




export default function ScheduleComponent ({loading, setLoading}) {
  const [open, setOpen] = useState(false);
  const [successful, setSuccessful] = useState(null);
  const [error, setError] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false)

  const handleEventClick = (clickInfo) => {
    const scheduleId = clickInfo.event.id;
    setSelectedScheduleId(scheduleId);
    setIsEditMode(true);
    handleOpen();
  };

  console.log(selectedScheduleId)
  console.log(isEditMode)


    return (
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
                      <Typography variant="h6" letterSpacing={1} gutterBottom sx={{fontWeight:550, marginLeft: '5px', mt:1, mb:1}} >
                          Maintenance Calendar
                      </Typography>
                    </Grid>
                    <Grid item>
                      {/* modal dini */}
                      <AddScheduleModal
                        handleOpen={handleOpen}
                        open={open}
                        handleClose={handleClose}
                        setSuccessful={setSuccessful}
                        setError={setError}
                        setLoading={setLoading}
                        loading={loading}
                        setSelectedScheduleId={setSelectedScheduleId}
                        selectedScheduleId={selectedScheduleId}
                      />
                    </Grid>
                  </Grid>
                  <Divider sx={{mb:2,}}/>
                  <Fullcalendar
                    handleOpen={handleOpen}
                    handleClose={handleClose}
                    open={open}
                    setSuccessful={setSuccessful}
                    setError={setError}
                    setLoading={setLoading}
                    loading={loading}
                    handleEventClick={handleEventClick}
                    
                  />
                 
                </Paper>
                    
                </Grid>
            </Grid>
        </Box>
    )
}