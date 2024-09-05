'use client'

import * as React from 'react';
import { useState } from 'react';
import { Grid, Box, Paper, Typography, Button,  Link, Breadcrumbs, TextField, FormControl, InputLabel, Select, MenuItem, } from '@mui/material';
import dayjs from 'dayjs';
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function MaintenaceRequestComponent(){
    const [value, setValue] = useState(dayjs('2022-04-17'));


    return(
        <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
            <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '5px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
                Maintenance Request
            </Typography>
            <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                    {/* <Typography color="inherit">Navigation</Typography> */}
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Home">
                        Home
                    </Link>
                    <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Maintenace Request</Typography>
                </Breadcrumbs>
            </Grid>
            <Box sx={{mt:'4rem'}}>
            </Box>

            <Grid  container spacing={1} sx={{ mt: '-0.9rem', display:'flex', justifyContent:' center',  }}>
                <Grid item xs={11} >
                    <Paper elevation={3} style={{'@media (max-width: 100px)' : {width: 'auto'}, marginTop: '15px', borderRadius: '15px',  justifyContent: "center", alignItems: "center",}}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography variant="h6" letterSpacing={2} sx={{marginLeft: '36px', mt:3}} >
                                    List of Maintenance Request
                                </Typography>
                            </Grid>
                        
                        </Grid>
                        <Grid container spacing={3} sx={{padding: '30px', marginTop: "-2.6em"}}>
                            <Grid item xs={12} lg={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel required>Select Apartment</InputLabel>
                                <Select>
                                    <MenuItem value={1}>Apartment no.1</MenuItem>
                                    <MenuItem value={2}>Apartment no.2</MenuItem>
                                    <MenuItem value={3}>Apartment no.3</MenuItem>    
                                    <MenuItem value={4}>Apartment no.4</MenuItem>  
                                    <MenuItem value={5}>Apartment no.5</MenuItem>  
                                    <MenuItem value={6}>Apartment no.6</MenuItem>  
                                    <MenuItem value={7}>Apartment no.7</MenuItem>  
                                    <MenuItem value={8}>Apartment no.8</MenuItem>  
                                </Select>
                            </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel required>Select Room</InputLabel>
                                    <Select>
                                        <MenuItem value={1}>Room no.1</MenuItem>
                                        <MenuItem value={2}>Room no.2</MenuItem>
                                        <MenuItem value={3}>Room no.3</MenuItem>    
                                        <MenuItem value={4}>Room no.4</MenuItem>  
                                        <MenuItem value={5}>Room no.5</MenuItem>  
                                        <MenuItem value={6}>Room no.6</MenuItem>  
                                        <MenuItem value={7}>Room no.7</MenuItem>  
                                        <MenuItem value={8}>Room no.8</MenuItem>  
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={5} sx={{marginTop: '-1rem'}}>
                                <TextField id="taskname" label="Task Name" variant="outlined" fullWidth margin="normal" />
                            </Grid>
                            <Grid item xs={12} lg={5} sx={{marginTop: '-1rem'}}>
                                <TextField id="estimatedamount" label="Estamated Amount" type="number" variant="outlined" fullWidth margin="normal" />
                            </Grid>
                            <Grid item xs={12} lg={2} sx={{marginTop: '-1rem'}}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel required>Status</InputLabel>
                                    <Select>
                                        <MenuItem value={1}>To Do</MenuItem>
                                        {/* <MenuItem value={2}>Room no.2</MenuItem>
                                        <MenuItem value={3}>Room no.3</MenuItem>     */}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} lg={8} sx={{marginTop: '-1rem'}}>
                                <TextField id="description" label="Task Description" variant="outlined" multiline maxRows={5} fullWidth margin="normal" />
                            </Grid>
                            <Grid item xs={12} lg={4} sx={{marginTop: '-0.6rem'}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                                        <DateRangePicker localeText={{ start: 'Check-in', end: 'Check-out' }} />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                            
                            
                            <Grid item xs={12} lg={2}>
                                <Button variant="contained"
                                    sx={{background: '#673ab7', width: '100%', padding: '10px',  fontSize: '18px','&:hover': {backgroundColor: '#9575cd',}, }}
                                    // onClick={() => router.push('/Dashboard/login')}
                                    // href='/Dashboard/login'
                                >
                                    Create
                                </Button>  
                            </Grid>
                            <Grid item xs={12} lg={2}>
                                <Button elevation={3} variant="outlined"
                                    sx={{background: '#ffffff', borderColor: 'black', color: 'black', width: '100%', padding: '10px',  fontSize: '18px','&:hover': {backgroundColor: '#eeeeee', borderColor: 'black'}, }}
                                    // onClick={() => router.push('/Dashboard/login')}
                                    // href='/Dashboard/login'
                                >
                                    Cancel
                                </Button>  
                            </Grid>
                        </Grid>
                    </Paper>

                    
                </Grid>
                

            </Grid>
        </Box>
    )
}