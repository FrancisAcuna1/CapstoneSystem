'use client'
import * as React from 'react';
import { useState } from 'react';
import { Grid, Box, Paper, Typography, Button, Divider, Link, Fade, Breadcrumbs, TextField, FormControl, InputLabel, Select, MenuItem, Menu} from '@mui/material';
import EquipmentTable from '../TableComponent/EquipmentTable';
import AddEquipmentModal from '../ModalComponent/AddEquipmentModal';
import SuccessSnackbar from '../Labraries/snackbar';
import { SnackbarProvider } from 'notistack';
import ErrorSnackbar from '../Labraries/ErrorSnackbar'


export default function EquipmentComponent({loading, setLoading}){
    const [successful, setSuccessful] = useState(null);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleEdit = (id) => {
        setEditItem(id);
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
                Amenities & Equipment
            </Typography>
            <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                    {/* <Typography color="inherit">Navigation</Typography> */}
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Home">
                        Home
                    </Link>
                    <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Amenities & Equipment</Typography>
                </Breadcrumbs>
            </Grid>
            <Box sx={{mt:'4rem'}}>
            </Box>

            <Grid  container spacing={1} sx={{ mt: '-0.9rem', display:'flex', justifyContent:' center',  }}>

                <Grid item xs={12}>
                    <Grid item>
                        <AddEquipmentModal
                            open={open}
                            handleClose={handleClose}
                            handleOpen={handleOpen}
                            setSuccessful={setSuccessful}
                            setError={setError}
                            error={error}
                            setLoading={setLoading}
                            loading={loading}
                            setEditItem={setEditItem}
                            editItem={editItem}
                      
                        
                        />
                    </Grid>
                    <Grid item>
                        <EquipmentTable
                            setSuccessful={setSuccessful}
                            setError={setError}
                            error={error}
                            setLoading={setLoading}
                            loading={loading}
                            handleEdit={handleEdit}
                            
                        /> 
                    </Grid> 
                </Grid>
                

            </Grid>
        </Box>
    )
}