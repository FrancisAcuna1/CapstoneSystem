'use client'

import * as React from 'react';
import { useState } from 'react';
import { Grid, Box, Paper, Typography, Button, Divider, Link, Fade, Breadcrumbs, TextField, FormControl, InputLabel, Select, MenuItem, Menu} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, createTheme } from '@mui/material/styles';
import { Modal as BaseModal } from '@mui/base/Modal';
import PropTypes from 'prop-types';
import { styled, css, } from '@mui/system';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { ThemeProvider } from 'styled-components';
import '/app/style.css';
import Image from 'next/image';

const Backdrop = React.forwardRef((props, ref) => {
    const { open, ...other } = props;
    return (
      <Fade in={open}>
        <div ref={ref} {...other} />
      </Fade>
    );
  });
Backdrop.displayName = 'Backdrop';
//   Backdrop.propTypes = {
//     open: PropTypes.bool,
//   };
  
  const blue = {
    200: '#99CCFF',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0066CC',
  };
  
  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };
  
  const Modal = styled(BaseModal)`
    position: fixed;
    z-index: 1300;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const StyledBackdrop = styled(Backdrop)`
    z-index: -1;
    position: fixed;
    inset: 0;
    background-color: rgb(0 0 0 / 0.5);
    -webkit-tap-highlight-color: transparent;
  `;
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
  };
  
  const ModalContent = styled('div')(
    ({ theme }) => css`
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 500;
      text-align: start;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
      background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      border-radius: 8px;
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      box-shadow: 0 4px 12px
        ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
      padding: 24px;
      color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};
  
      & .modal-title {
        margin: 0;
        line-height: 1.5rem;
        margin-bottom: 8px;
      }
  
      & .modal-description {
        margin: 0;
        line-height: 1.5rem;
        font-weight: 400;
        color: ${theme.palette.mode === 'dark' ? grey[400] : grey[800]};
        margin-bottom: 4px;
      }
    `,
  );
  
  const TriggerButton = styled(Button)(
    ({ theme }) => css`
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1.5;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 150ms ease;
      cursor: pointer;
      background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  
      &:hover {
        background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
        border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
      }
  
      &:active {
        background: ${theme.palette.mode === 'dark' ? grey[700] : grey[100]};
      }
  
      &:focus-visible {
        box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
        outline: none;
      }
    `,
  );

export default function UnitPage(){
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
            <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '5px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
                List of Units
            </Typography>
            <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                    {/* <Typography color="inherit">Navigation</Typography> */}
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Home">
                        Home
                    </Link>
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Apartment">
                        Apartment
                    </Link>
                    <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>List of Units</Typography>
                </Breadcrumbs>
            </Grid>

            <Grid container sx={{justifyContent:{xs:'start', lg:'space-between',}}}>
                <Grid item>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {/* image ini san pic discription */}
                        </Grid>
                        <Grid item xs={12}>
                             {/* image ini san pic discription */}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Box sx={{ display: 'flex', justifySelf: 'end', mt:1.5, ml:'-1rem' }}>
                        <Button variant="contained" onClick={handleOpen} sx={{background: '#f78028','&:hover': {backgroundColor: '#ffab40',}, borderRadius: '15px',fontSize: {xs:'14px', sm: '15px', md:'15px', lg: '15px'}, p:{xs: 1, lg:1.5}, }}>
                        <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
                            Add New Room
                        </Button>
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            open={open}
                            onClose={handleClose}
                            closeAfterTransition
                            slots={{ backdrop: StyledBackdrop }}
                        >
                            <Fade in={open}>
                                <ModalContent sx={style}>
                                <Typography variant="h5" letterSpacing={2} gutterBottom sx={{fontWeight: 500,}}>Add Rooms</Typography>
                                <TextField required label="Room No." fullWidth margin="normal" />
                                <TextField required label="Monthly Rate" type="number" fullWidth margin="normal" />
                                <FormControl fullWidth margin="normal">
                                <InputLabel required>Status</InputLabel>
                                <Select>
                                    <MenuItem value={1}>Avialable</MenuItem>
                                    {/* <MenuItem hidden={true} value={2}>Occupied</MenuItem> */}
                                </Select>
                                </FormControl>
                                <TextField id="outlined-read-only-input" label="Tenant Name" type='text' defaultValue="Tenant Name" InputProps={{readOnly: true,}}/>
                                <TextField  id="contact" label="Tenant Contact No." defaultValue="Tenant Contact No."  variant="outlined" InputProps={{readOnly: true,}} fullWidth margin="normal"/>
                                <Button variant="contained" fullWidth style={{ fontSize: '16px', marginTop: '10px', borderRadius: '20px', padding:'10px', background: '#673ab7','&:hover': {backgroundColor: '#9575cd',}, }}>Submit</Button>
                                </ModalContent>
                            </Fade>
                        </Modal>
                    </Box>
                </Grid>

            </Grid>

            <Grid container spacing={2} sx={{mt: '0.1rem'}}>
                <Grid item xs={12} sm={6} md={4} lg={3} zeroMinWidth>
                    {/* Goods na ang responsive */}
                    <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item sx={{display: 'flex', justifyContent:{ lg:'flex-end'}, alignItems: 'center', mt: {sm: '0.1rem', md:'0.1rem', lg: '0rem'}, ml:{sm:'0.3rem', md:'0.3rem', lg: '0.2rem'}}}>
                                <Image
                                width={350}  // Replace with your desired width
                                height={100}// Replace with your desired height
                                src="/3Dnewbedroom.png"
                                // style={{ width: '120px', height: 'auto', objectFit: 'contain' }}
                                className='hdroomIcon'
                                alt="proptrack logo"
                                />
                            </Grid>
                            <Grid item>
                                <Typography noWrap variant="h5" letterSpacing={2} sx={{fontSize: {xs: '24px', sm: '24px', md: '22px', lg: '24px'}, ml: '0.3rem', mt: '0.5rem',  fontWeight: 540 }}>
                                Unit no. 1
                                </Typography>
                                <Typography variant="body1" letterSpacing={2} color="#f78028" sx={{ maxWidth: { xs: 225, lg: 125 }, ml: '0.3rem', mt: '0.1rem', fontSize: {xs: '14px', sm: '15px', md: '13px' ,lg:'15px'}, fontWeight: 540 }}>
                                Monthly Rate: ₱10,000.00
                                </Typography>
                            </Grid>
                            
                            
                        </Grid>

                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Landlord/Apartment/[id]/RegisterTenant' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '2rem', mb: '-0.1rem', fontSize: {xs: '16px', sm: '15px', md: '15px' ,lg:'16px'}, borderRadius: '12px'}} ><CreateOutlinedIcon sx={{ml: {md: '-0.2rem'}, mr:'0.3rem', fontSize: {xs: '25px', sm: '20px', md: '20px' ,lg:'25px'}, }}/>Register New Tenant</Button>
                        </Box>
                    </Paper>
                </Grid> 

                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: {sm: '0.1rem', md:'0.1rem', lg: '0rem'}, ml:{sm:'0.3rem', md:'0.3rem', lg: '0.2rem'} }}>
                                <Image
                                src="/hdlock.png"
                                className='hdlockIcon'
                                // style={{ width: '90px', height: 'auto', objectFit: 'contain' }}
                                alt="proptrack logo"
                                width={350}  // Replace with your desired width
                                height={100}// Replace with your desired height
                                />
                            </Grid>
                            <Grid item>
                                <Typography noWrap variant="h5" letterSpacing={2} sx={{fontSize: {xs: '24px', sm: '24px', md: '22px', lg: '24px'}, ml: '0.3rem', mt: {xs: '0.7rem', sm:'0.7rem', md:'1rem', lg:'0rem'},  fontWeight: 540 }}>
                                    Unit no. 1
                                </Typography>
                                <Typography variant="body1" letterSpacing={2} color="#f78028" sx={{ maxWidth: { xs: 225, lg: 125 }, ml: '0.3rem', mt: '0.1rem', fontSize: {xs: '14px', sm: '15px', md: '13px' ,lg:'15px'}, fontWeight: 540 }}>
                                Monthly Rate: ₱10,000.00
                                </Typography>
                            </Grid>
                           
                        </Grid>

                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Landlord/Apartment/[id]/OccupiedUnits' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: {xs:'2rem', sm:'2rem',md:'2rem', lg: '2rem'}, mb: '-0.1rem', fontSize: {xs: '16px', sm: '15px', md: '15px' ,lg:'16px'}, borderRadius: '12px'}} ><VisibilityOutlinedIcon sx={{mr:'0.2rem'}}/>View Tenant Info</Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: {sm: '0.1rem', md:'0.1rem', lg: '0rem'}, ml:{sm:'0.3rem', md:'0.3rem', lg: '0.2rem'} }}>
                                <Image
                                src="/hdlock.png"
                                className='hdlockIcon'
                                // style={{ width: '90px', height: 'auto', objectFit: 'contain' }}
                                alt="proptrack logo"
                                width={350}  // Replace with your desired width
                                height={100}// Replace with your desired height
                                />
                            </Grid>
                            <Grid item>
                                <Typography noWrap variant="h5" letterSpacing={2} sx={{fontSize: {xs: '24px', sm: '24px', md: '22px', lg: '24px'}, ml: '0.3rem', mt: {xs: '0.7rem', sm:'0.7rem', md:'1rem', lg:'0rem'},  fontWeight: 540 }}>
                                    Unit no. 1
                                </Typography>
                                <Typography variant="body1" letterSpacing={2} color="#f78028" sx={{ maxWidth: { xs: 225, lg: 125 }, ml: '0.3rem', mt: '0.1rem', fontSize: {xs: '14px', sm: '15px', md: '13px' ,lg:'15px'}, fontWeight: 540 }}>
                                Monthly Rate: ₱10,000.00
                                </Typography>
                            </Grid>
                           
                        </Grid>

                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='#' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: {xs:'2rem', sm:'2rem',md:'2rem', lg: '2rem'}, mb: '-0.1rem', fontSize: {xs: '16px', sm: '15px', md: '15px' ,lg:'16px'}, borderRadius: '12px'}} ><VisibilityOutlinedIcon sx={{mr:'0.2rem'}}/>View Tenant Info</Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item sx={{display: 'flex', justifyContent:{ lg:'flex-end'}, alignItems: 'center', mt: {sm: '0.1rem', md:'0.1rem', lg: '0rem'}, ml:{sm:'0.3rem', md:'0.3rem', lg: '0.2rem'}}}>
                                <Image
                                src="/3Dnewbedroom.png"
                                // style={{ width: '120px', height: 'auto', objectFit: 'contain' }}
                                className='hdroomIcon'
                                alt="proptrack logo"
                                width={350}  // Replace with your desired width
                                height={100}// Replace with your desired height
                                />
                            </Grid>
                            <Grid item>
                                <Typography noWrap variant="h5" letterSpacing={2} sx={{fontSize: {xs: '24px', sm: '24px', md: '22px', lg: '24px'}, ml: '0.3rem', mt: '0.5rem',  fontWeight: 540 }}>
                                Unit no. 1
                                </Typography>
                                <Typography variant="body1" letterSpacing={2} color="#f78028" sx={{ maxWidth: { xs: 225, lg: 125 }, ml: '0.3rem', mt: '0.1rem', fontSize: {xs: '14px', sm: '15px', md: '13px' ,lg:'15px'}, fontWeight: 540 }}>
                                Monthly Rate: ₱10,000.00
                                </Typography>
                            </Grid>
                            
                            
                        </Grid>

                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Landlord/Apartment/[id]/RegisterTenant' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '2rem', mb: '-0.1rem', fontSize: {xs: '16px', sm: '15px', md: '15px' ,lg:'16px'}, borderRadius: '12px'}} ><CreateOutlinedIcon sx={{ml: {md: '-0.2rem'}, mr:'0.3rem', fontSize: {xs: '25px', sm: '20px', md: '20px' ,lg:'25px'}, }}/>Register New Tenant</Button>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item sx={{display: 'flex', justifyContent:{ lg:'flex-end'}, alignItems: 'center', mt: {sm: '0.1rem', md:'0.1rem', lg: '0rem'}, ml:{sm:'0.3rem', md:'0.3rem', lg: '0.2rem'}}}>
                                <Image
                                src="/3Dnewbedroom.png"
                                // style={{ width: '120px', height: 'auto', objectFit: 'contain' }}
                                className='hdroomIcon'
                                alt="proptrack logo"
                                width={350}  // Replace with your desired width
                                height={100}// Replace with your desired height
                                />
                            </Grid>
                            <Grid item>
                                <Typography noWrap variant="h5" letterSpacing={2} sx={{fontSize: {xs: '24px', sm: '24px', md: '22px', lg: '24px'}, ml: '0.3rem', mt: '0.5rem',  fontWeight: 540 }}>
                                Unit no. 1
                                </Typography>
                                <Typography variant="body1" letterSpacing={2} color="#f78028" sx={{ maxWidth: { xs: 225, lg: 125 }, ml: '0.3rem', mt: '0.1rem', fontSize: {xs: '14px', sm: '15px', md: '13px' ,lg:'15px'}, fontWeight: 540 }}>
                                Monthly Rate: ₱10,000.00
                                </Typography>
                            </Grid>
                            
                            
                        </Grid>

                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Landlord/Apartment/[id]/RegisterTenant' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '2rem', mb: '-0.1rem', fontSize: {xs: '16px', sm: '15px', md: '15px' ,lg:'16px'}, borderRadius: '12px'}} ><CreateOutlinedIcon sx={{ml: {md: '-0.2rem'}, mr:'0.3rem', fontSize: {xs: '25px', sm: '20px', md: '20px' ,lg:'25px'}, }}/>Register New Tenant</Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item sx={{display: 'flex', justifyContent:{ lg:'flex-end'}, alignItems: 'center', mt: {sm: '0.1rem', md:'0.1rem', lg: '0rem'}, ml:{sm:'0.3rem', md:'0.3rem', lg: '0.2rem'}}}>
                                <Image
                                src="/3Dnewbedroom.png"
                                // style={{ width: '120px', height: 'auto', objectFit: 'contain' }}
                                className='hdroomIcon'
                                alt="proptrack logo"
                                width={350}  // Replace with your desired width
                                height={100}// Replace with your desired height
                                />
                            </Grid>
                            <Grid item>
                                <Typography noWrap variant="h5" letterSpacing={2} sx={{fontSize: {xs: '24px', sm: '24px', md: '22px', lg: '24px'}, ml: '0.3rem', mt: '0.5rem',  fontWeight: 540 }}>
                                Unit no. 1
                                </Typography>
                                <Typography variant="body1" letterSpacing={2} color="#f78028" sx={{ maxWidth: { xs: 225, lg: 125 }, ml: '0.3rem', mt: '0.1rem', fontSize: {xs: '14px', sm: '15px', md: '13px' ,lg:'15px'}, fontWeight: 540 }}>
                                Monthly Rate: ₱10,000.00
                                </Typography>
                            </Grid>
                            
                            
                        </Grid>

                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Landlord/Apartment/[id]/RegisterTenant' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '2rem', mb: '-0.1rem', fontSize: {xs: '16px', sm: '15px', md: '15px' ,lg:'16px'}, borderRadius: '12px'}} ><CreateOutlinedIcon sx={{ml: {md: '-0.2rem'}, mr:'0.3rem', fontSize: {xs: '25px', sm: '20px', md: '20px' ,lg:'25px'}, }}/>Register New Tenant</Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item sx={{display: 'flex', justifyContent:{ lg:'flex-end'}, alignItems: 'center', mt: {sm: '0.1rem', md:'0.1rem', lg: '0rem'}, ml:{sm:'0.3rem', md:'0.3rem', lg: '0.2rem'}}}>
                                <Image
                                src="/3Dnewbedroom.png"
                                // style={{ width: '120px', height: 'auto', objectFit: 'contain' }}
                                className='hdroomIcon'
                                alt="proptrack logo"
                                width={350}  // Replace with your desired width
                                height={100}// Replace with your desired height
                                />
                            </Grid>
                            <Grid item>
                                <Typography noWrap variant="h5" letterSpacing={2} sx={{fontSize: {xs: '24px', sm: '24px', md: '22px', lg: '24px'}, ml: '0.3rem', mt: '0.5rem',  fontWeight: 540 }}>
                                Unit no. 1
                                </Typography>
                                <Typography variant="body1" letterSpacing={2} color="#f78028" sx={{ maxWidth: { xs: 225, lg: 125 }, ml: '0.3rem', mt: '0.1rem', fontSize: {xs: '14px', sm: '15px', md: '13px' ,lg:'15px'}, fontWeight: 540 }}>
                                Monthly Rate: ₱10,000.00
                                </Typography>
                            </Grid>
                            
                            
                        </Grid>

                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Landlord/Apartment/[id]/RegisterTenant' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '2rem', mb: '-0.1rem', fontSize: {xs: '16px', sm: '15px', md: '15px' ,lg:'16px'}, borderRadius: '12px'}} ><CreateOutlinedIcon sx={{ml: {md: '-0.2rem'}, mr:'0.3rem', fontSize: {xs: '25px', sm: '20px', md: '20px' ,lg:'25px'}, }}/>Register New Tenant</Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: {sm: '0.1rem', md:'0.1rem', lg: '0rem'}, ml:{sm:'0.3rem', md:'0.3rem', lg: '0.2rem'} }}>
                                <Image
                                src="/hdlock.png"
                                className='hdlockIcon'
                                // style={{ width: '90px', height: 'auto', objectFit: 'contain' }}
                                alt="proptrack logo"
                                width={350}  // Replace with your desired width
                                height={100}// Replace with your desired height
                                />
                            </Grid>
                            <Grid item>
                                <Typography noWrap variant="h5" letterSpacing={2} sx={{fontSize: {xs: '24px', sm: '24px', md: '22px', lg: '24px'}, ml: '0.3rem', mt: {xs: '0.7rem', sm:'0.7rem', md:'1rem', lg:'0rem'},  fontWeight: 540 }}>
                                    Unit no. 1
                                </Typography>
                                <Typography variant="body1" letterSpacing={2} color="#f78028" sx={{ maxWidth: { xs: 225, lg: 125 }, ml: '0.3rem', mt: '0.1rem', fontSize: {xs: '14px', sm: '15px', md: '13px' ,lg:'15px'}, fontWeight: 540 }}>
                                Monthly Rate: ₱10,000.00
                                </Typography>
                            </Grid>
                           
                        </Grid>

                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='#' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: {xs:'2rem', sm:'2rem',md:'2rem', lg: '2rem'}, mb: '-0.1rem', fontSize: {xs: '16px', sm: '15px', md: '15px' ,lg:'16px'}, borderRadius: '12px'}} ><VisibilityOutlinedIcon sx={{mr:'0.2rem'}}/>View Tenant Info</Button>
                        </Box>
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    )
}