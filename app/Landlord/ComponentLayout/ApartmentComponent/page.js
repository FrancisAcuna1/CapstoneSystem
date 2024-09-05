'use client'
import * as React from 'react';
import { useState } from 'react';
import { Grid, Box, Paper, Typography, Button, Divider, Link, Fade, Breadcrumbs, TextField} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Modal as BaseModal } from '@mui/base/Modal';
import PropTypes from 'prop-types';
import { styled, css, } from '@mui/system';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';



const Backdrop = React.forwardRef((props, ref) => {
    const { open, ...other } = props;
    return (
      <Fade in={open}>
        <div ref={ref} {...other} />
      </Fade>
    );
  });
  
  Backdrop.propTypes = {
    open: PropTypes.bool,
  };
  
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

export default function ApartmentContent (){
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
             <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '5px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
                List of Apartment
            </Typography>
            <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                    {/* <Typography color="inherit">Navigation</Typography> */}
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Home">
                        Home
                    </Link>
                    <Typography letterSpacing={2} color="text.primary" sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Apartment</Typography>
                </Breadcrumbs>
            </Grid>
            {/* <hr style={{ width: '100%', backgroundColor: '#ecebee', height: '1px', marginTop: '10px',}} /> */}

            <Grid container sx={{justifyContent:{xs:'start', lg:'space-between',}}}>
                <Grid item>

                </Grid>
                <Grid item>
                    <Box sx={{ display: 'flex', justifySelf: 'end', mt:1.5, }}>
                        <Button variant="contained"  onClick={handleOpen} sx={{background: '#f78028','&:hover': {backgroundColor: '#ffab40',}, borderRadius: '15px', p:1.5, }}>
                            <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
                            Add Apartment
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
                                    <Typography variant='h1' letterSpacing={3} sx={{ fontSize: '20px' }}>ADD APARTMENT</Typography>
                                    <TextField  required id="firstname" label="Apartment Name" variant="outlined" fullWidth margin="normal" />
                                    <TextField  required id="firstname" label="Street" variant="outlined" fullWidth margin="normal" />
                                    <TextField  required id="firstname" label="Barangay" variant="outlined" fullWidth margin="normal" />
                                    <TextField  required id="outlined-read-only-input" label="Municipality" type='text' defaultValue="Sorsogon City" InputProps={{readOnly: true}} fullWidth margin="normal" />
                                    <Button variant='contained' sx={{background: 'primary','&:hover': {backgroundColor: '#b6bdf1',}, padding: '8px', fontSize: '16px' }}>Add </Button>
                                </ModalContent>
                            </Fade>
                        </Modal>
                    </Box>
                </Grid>
            </Grid>

            
           
           <Grid container spacing={2} sx={{mt:0.1}}>
            
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ maxWidth: { xs: 320, sm: 520,  md: 820, lg: 890 },   padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', ml:{xs: '3.5rem', sm: '4.9rem', md: '3rem', lg:'3rem'}, width: { xs: '10rem', sm: '10rem', md:'10rem', lg: '12rem' }, height: { xs: '10rem', sm: '8rem', md: '9rem', lg: 'auto' }}}>
                            {/* <TurnedInOutlinedIcon sx={{fontSize: '3.3rem', color:'#f78028'}} /> */}
                            <img
                            src="/hdpartment.png" 
                            style={{ width: '100%', height: 'auto', objectFit: 'contain',  }}
                            alt="proptrack logo" 
                            />
                        </Box>
                        <Box 
                            sx={(theme) => ({
                                mt: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexShrink: 0,
                                borderRadius: '10px',
                                padding: {xs: '10px', sm: '21px', md: '15px', lg: '10px'},
                                
                                bgcolor:
                                    theme.palette.mode === 'light'
                                    ? 'rgba(255, 255, 255, 0.4)'
                                    : 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(30px)',
                                maxHeight: {xs: 42, sm: 30, md: 35, lg: 37},
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow:
                                    theme.palette.mode === 'light'
                                    ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                                    : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
                            })}
                        >
                        <Grid container justifyContent={'space-between'}  alignItems="center">
                            <Grid item >
                            <Typography variant="body1" color={'primary'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.1rem', sm: '0.1rem', md: '0rem', lg:'0.1rem'},  ml:{xs:'-0.1rem', sm: '-0.5rem', md: '-0.6rem', lg:'0rem'}, }} letterSpacing={1} >Available Units: 10</Typography>
                            </Grid>
                            <Divider orientation="vertical" color='black' variant="middle" flexItem />
                            <Grid item >
                                <Typography variant="body1" color={'#f78028'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.5rem', sm: '0.6rem', md: '0.6rem', lg:'0.6rem'},  ml: {xs:'0rem', sm: '0rem', md:'0rem', lg: '0rem'}, mb: {xs:'0.5rem'}, mr:{xs:'-0.2rem', sm: '-0.4rem', md: '-0.5rem',  lg:'0rem'}}} letterSpacing={1} gutterBottom>Occupied Units: 10</Typography>
                            </Grid>
                        </Grid>
                        </Box>
                        <Typography variant="h5" component="div" sx={{fontSize: {xs: '22px', sm: '24px', md: '22px', lg: '24px'}, fontWeight: 540, mt: 2}} letterSpacing={2} >Apartment no.1 </Typography>
                        <Typography variant="body1" color={'gray'} sx={{fontSize: {xs: '13px', sm: '14px', md: '13px' ,lg:'14px'}}} letterSpacing={1} gutterBottom>Magsaysay st. Brgy Cogon, Sorsogon City</Typography>
                        
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Landlord/Apartment/[id]' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '1.4rem', mb: '-0.1rem', fontSize: {xs: '15px', sm: '16px', md: '15px', lg:'16px'}, borderRadius: '12px'}} ><VisibilityOutlinedIcon sx={{mr:'0.2rem'}}/>View Units</Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ maxWidth: { xs: 320, sm: 520,  md: 820, lg: 890 },   padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', ml:{xs: '3.5rem', sm: '4.9rem', md: '3rem', lg:'3rem'}, width: { xs: '10rem', sm: '10rem', md:'10rem', lg: '12rem' }, height: { xs: '10rem', sm: '8rem', md: '9rem', lg: 'auto' }}}>
                            {/* <TurnedInOutlinedIcon sx={{fontSize: '3.3rem', color:'#f78028'}} /> */}
                            <img
                            src="/hdpartment.png" 
                            style={{ width: '100%', height: 'auto', objectFit: 'contain',  }}
                            alt="proptrack logo" 
                            />
                        </Box>
                        <Box 
                            sx={(theme) => ({
                                mt: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexShrink: 0,
                                borderRadius: '10px',
                                padding: {xs: '10px', sm: '21px', md: '15px', lg: '10px'},
                                
                                bgcolor:
                                    theme.palette.mode === 'light'
                                    ? 'rgba(255, 255, 255, 0.4)'
                                    : 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(30px)',
                                maxHeight: {xs: 42, sm: 30, md: 35, lg: 37},
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow:
                                    theme.palette.mode === 'light'
                                    ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                                    : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
                            })}
                        >
                        <Grid container justifyContent={'space-between'}  alignItems="center">
                            <Grid item >
                            <Typography variant="body1" color={'primary'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.1rem', sm: '0.1rem', md: '0rem', lg:'0.1rem'},  ml:{xs:'-0.1rem', sm: '-0.5rem', md: '-0.6rem', lg:'0rem'}, }} letterSpacing={1} >Available Units: 10</Typography>
                            </Grid>
                            <Divider orientation="vertical" color='black' variant="middle" flexItem />
                            <Grid item >
                                <Typography variant="body1" color={'#f78028'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.5rem', sm: '0.6rem', md: '0.6rem', lg:'0.6rem'},  ml: {xs:'0rem', sm: '0rem', md:'0rem', lg: '0rem'}, mb: {xs:'0.5rem'}, mr:{xs:'-0.2rem', sm: '-0.4rem', md: '-0.5rem',  lg:'0rem'}}} letterSpacing={1} gutterBottom>Occupied Units: 10</Typography>
                            </Grid>
                        </Grid>
                        </Box>
                        <Typography variant="h5" component="div" sx={{fontSize: {xs: '22px', sm: '24px', md: '22px', lg: '24px'}, fontWeight: 540, mt: 2}} letterSpacing={2} >Apartment no.1 </Typography>
                        <Typography variant="body1" color={'gray'} sx={{fontSize: {xs: '13px', sm: '14px', md: '13px' ,lg:'14px'}}} letterSpacing={1} gutterBottom>Magsaysay st. Brgy Cogon, Sorsogon City</Typography>
                        
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Landlord/Apartment/[id]' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '1.4rem', mb: '-0.1rem', fontSize: {xs: '15px', sm: '16px', md: '15px', lg:'16px'}, borderRadius: '12px'}} ><VisibilityOutlinedIcon sx={{mr:'0.2rem'}}/>View Units</Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ maxWidth: { xs: 320, sm: 520,  md: 820, lg: 890 },   padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', ml:{xs: '3.5rem', sm: '4.9rem', md: '3rem', lg:'3rem'}, width: { xs: '10rem', sm: '10rem', md:'10rem', lg: '12rem' }, height: { xs: '10rem', sm: '8rem', md: '9rem', lg: 'auto' }}}>
                            {/* <TurnedInOutlinedIcon sx={{fontSize: '3.3rem', color:'#f78028'}} /> */}
                            <img
                            src="/hdpartment.png" 
                            style={{ width: '100%', height: 'auto', objectFit: 'contain',  }}
                            alt="proptrack logo" 
                            />
                        </Box>
                        <Box 
                            sx={(theme) => ({
                                mt: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexShrink: 0,
                                borderRadius: '10px',
                                padding: {xs: '10px', sm: '21px', md: '15px', lg: '10px'},
                                
                                bgcolor:
                                    theme.palette.mode === 'light'
                                    ? 'rgba(255, 255, 255, 0.4)'
                                    : 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(30px)',
                                maxHeight: {xs: 42, sm: 30, md: 35, lg: 37},
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow:
                                    theme.palette.mode === 'light'
                                    ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                                    : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
                            })}
                        >
                        <Grid container justifyContent={'space-between'}  alignItems="center">
                            <Grid item >
                            <Typography variant="body1" color={'primary'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.1rem', sm: '0.1rem', md: '0rem', lg:'0.1rem'},  ml:{xs:'-0.1rem', sm: '-0.5rem', md: '-0.6rem', lg:'0rem'}, }} letterSpacing={1} >Available Units: 10</Typography>
                            </Grid>
                            <Divider orientation="vertical" color='black' variant="middle" flexItem />
                            <Grid item >
                                <Typography variant="body1" color={'#f78028'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.5rem', sm: '0.6rem', md: '0.6rem', lg:'0.6rem'},  ml: {xs:'0rem', sm: '0rem', md:'0rem', lg: '0rem'}, mb: {xs:'0.5rem'}, mr:{xs:'-0.2rem', sm: '-0.4rem', md: '-0.5rem',  lg:'0rem'}}} letterSpacing={1} gutterBottom>Occupied Units: 10</Typography>
                            </Grid>
                        </Grid>
                        </Box>
                        <Typography variant="h5" component="div" sx={{fontSize: {xs: '22px', sm: '24px', md: '22px', lg: '24px'}, fontWeight: 540, mt: 2}} letterSpacing={2} >Apartment no.1 </Typography>
                        <Typography variant="body1" color={'gray'} sx={{fontSize: {xs: '13px', sm: '14px', md: '13px' ,lg:'14px'}}} letterSpacing={1} gutterBottom>Magsaysay st. Brgy Cogon, Sorsogon City</Typography>
                        
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Landlord/Apartment/[id]' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '1.4rem', mb: '-0.1rem', fontSize: {xs: '15px', sm: '16px', md: '15px', lg:'16px'}, borderRadius: '12px'}} ><VisibilityOutlinedIcon sx={{mr:'0.2rem'}}/>View Units</Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ maxWidth: { xs: 320, sm: 520,  md: 820, lg: 890 },   padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', ml:{xs: '3.5rem', sm: '4.9rem', md: '3rem', lg:'3rem'}, width: { xs: '10rem', sm: '10rem', md:'10rem', lg: '12rem' }, height: { xs: '10rem', sm: '8rem', md: '9rem', lg: 'auto' }}}>
                            {/* <TurnedInOutlinedIcon sx={{fontSize: '3.3rem', color:'#f78028'}} /> */}
                            <img
                            src="/hdpartment.png" 
                            style={{ width: '100%', height: 'auto', objectFit: 'contain',  }}
                            alt="proptrack logo" 
                            />
                        </Box>
                        <Box 
                            sx={(theme) => ({
                                mt: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexShrink: 0,
                                borderRadius: '10px',
                                padding: {xs: '10px', sm: '21px', md: '15px', lg: '10px'},
                                
                                bgcolor:
                                    theme.palette.mode === 'light'
                                    ? 'rgba(255, 255, 255, 0.4)'
                                    : 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(30px)',
                                maxHeight: {xs: 42, sm: 30, md: 35, lg: 37},
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow:
                                    theme.palette.mode === 'light'
                                    ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                                    : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
                            })}
                        >
                        <Grid container justifyContent={'space-between'}  alignItems="center">
                            <Grid item >
                            <Typography variant="body1" color={'primary'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.1rem', sm: '0.1rem', md: '0rem', lg:'0.1rem'},  ml:{xs:'-0.1rem', sm: '-0.5rem', md: '-0.6rem', lg:'0rem'}, }} letterSpacing={1} >Available Units: 10</Typography>
                            </Grid>
                            <Divider orientation="vertical" color='black' variant="middle" flexItem />
                            <Grid item >
                                <Typography variant="body1" color={'#f78028'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.5rem', sm: '0.6rem', md: '0.6rem', lg:'0.6rem'},  ml: {xs:'0rem', sm: '0rem', md:'0rem', lg: '0rem'}, mb: {xs:'0.5rem'}, mr:{xs:'-0.2rem', sm: '-0.4rem', md: '-0.5rem',  lg:'0rem'}}} letterSpacing={1} gutterBottom>Occupied Units: 10</Typography>
                            </Grid>
                        </Grid>
                        </Box>
                        <Typography variant="h5" component="div" sx={{fontSize: {xs: '22px', sm: '24px', md: '22px', lg: '24px'}, fontWeight: 540, mt: 2}} letterSpacing={2} >Apartment no.1 </Typography>
                        <Typography variant="body1" color={'gray'} sx={{fontSize: {xs: '13px', sm: '14px', md: '13px' ,lg:'14px'}}} letterSpacing={1} gutterBottom>Magsaysay st. Brgy Cogon, Sorsogon City</Typography>
                        
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Landlord/Apartment/[id]' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '1.4rem', mb: '-0.1rem', fontSize: {xs: '15px', sm: '16px', md: '15px', lg:'16px'}, borderRadius: '12px'}} ><VisibilityOutlinedIcon sx={{mr:'0.2rem'}}/>View Units</Button>
                        </Box>
                    </Paper>  
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ maxWidth: { xs: 320, sm: 520,  md: 820, lg: 890 },   padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', ml:{xs: '3.5rem', sm: '4.9rem', md: '3rem', lg:'3rem'}, width: { xs: '10rem', sm: '10rem', md:'10rem', lg: '12rem' }, height: { xs: '10rem', sm: '8rem', md: '9rem', lg: 'auto' }}}>
                            {/* <TurnedInOutlinedIcon sx={{fontSize: '3.3rem', color:'#f78028'}} /> */}
                            <img
                            src="/hdpartment.png" 
                            style={{ width: '100%', height: 'auto', objectFit: 'contain',  }}
                            alt="proptrack logo" 
                            />
                        </Box>
                        <Box 
                            sx={(theme) => ({
                                mt: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexShrink: 0,
                                borderRadius: '10px',
                                padding: {xs: '10px', sm: '21px', md: '15px', lg: '10px'},
                                
                                bgcolor:
                                    theme.palette.mode === 'light'
                                    ? 'rgba(255, 255, 255, 0.4)'
                                    : 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(30px)',
                                maxHeight: {xs: 42, sm: 30, md: 35, lg: 37},
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow:
                                    theme.palette.mode === 'light'
                                    ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                                    : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
                            })}
                        >
                        <Grid container justifyContent={'space-between'}  alignItems="center">
                            <Grid item >
                            <Typography variant="body1" color={'primary'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.1rem', sm: '0.1rem', md: '0rem', lg:'0.1rem'},  ml:{xs:'-0.1rem', sm: '-0.5rem', md: '-0.6rem', lg:'0rem'}, }} letterSpacing={1} >Available Units: 10</Typography>
                            </Grid>
                            <Divider orientation="vertical" color='black' variant="middle" flexItem />
                            <Grid item >
                                <Typography variant="body1" color={'#f78028'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.5rem', sm: '0.6rem', md: '0.6rem', lg:'0.6rem'},  ml: {xs:'0rem', sm: '0rem', md:'0rem', lg: '0rem'}, mb: {xs:'0.5rem'}, mr:{xs:'-0.2rem', sm: '-0.4rem', md: '-0.5rem',  lg:'0rem'}}} letterSpacing={1} gutterBottom>Occupied Units: 10</Typography>
                            </Grid>
                        </Grid>
                        </Box>
                        <Typography variant="h5" component="div" sx={{fontSize: {xs: '22px', sm: '24px', md: '22px', lg: '24px'}, fontWeight: 540, mt: 2}} letterSpacing={2} >Apartment no.1 </Typography>
                        <Typography variant="body1" color={'gray'} sx={{fontSize: {xs: '13px', sm: '14px', md: '13px' ,lg:'14px'}}} letterSpacing={1} gutterBottom>Magsaysay st. Brgy Cogon, Sorsogon City</Typography>
                        
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Landlord/Apartment/[id]' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '1.4rem', mb: '-0.1rem', fontSize: {xs: '15px', sm: '16px', md: '15px', lg:'16px'}, borderRadius: '12px'}} ><VisibilityOutlinedIcon sx={{mr:'0.2rem'}}/>View Units</Button>
                        </Box>
                    </Paper> 
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ maxWidth: { xs: 320, sm: 520,  md: 820, lg: 890 },   padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', ml:{xs: '3.5rem', sm: '4.9rem', md: '3rem', lg:'3rem'}, width: { xs: '10rem', sm: '10rem', md:'10rem', lg: '12rem' }, height: { xs: '10rem', sm: '8rem', md: '9rem', lg: 'auto' }}}>
                            {/* <TurnedInOutlinedIcon sx={{fontSize: '3.3rem', color:'#f78028'}} /> */}
                            <img
                            src="/hdpartment.png" 
                            style={{ width: '100%', height: 'auto', objectFit: 'contain',  }}
                            alt="proptrack logo" 
                            />
                        </Box>
                        <Box 
                            sx={(theme) => ({
                                mt: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexShrink: 0,
                                borderRadius: '10px',
                                padding: {xs: '10px', sm: '21px', md: '15px', lg: '10px'},
                                
                                bgcolor:
                                    theme.palette.mode === 'light'
                                    ? 'rgba(255, 255, 255, 0.4)'
                                    : 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(30px)',
                                maxHeight: {xs: 42, sm: 30, md: 35, lg: 37},
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow:
                                    theme.palette.mode === 'light'
                                    ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                                    : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
                            })}
                        >
                        <Grid container justifyContent={'space-between'}  alignItems="center">
                            <Grid item >
                            <Typography variant="body1" color={'primary'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.1rem', sm: '0.1rem', md: '0rem', lg:'0.1rem'},  ml:{xs:'-0.1rem', sm: '-0.5rem', md: '-0.6rem', lg:'0rem'}, }} letterSpacing={1} >Available Units: 10</Typography>
                            </Grid>
                            <Divider orientation="vertical" color='black' variant="middle" flexItem />
                            <Grid item >
                                <Typography variant="body1" color={'#f78028'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.5rem', sm: '0.6rem', md: '0.6rem', lg:'0.6rem'},  ml: {xs:'0rem', sm: '0rem', md:'0rem', lg: '0rem'}, mb: {xs:'0.5rem'}, mr:{xs:'-0.2rem', sm: '-0.4rem', md: '-0.5rem',  lg:'0rem'}}} letterSpacing={1} gutterBottom>Occupied Units: 10</Typography>
                            </Grid>
                        </Grid>
                        </Box>
                        <Typography variant="h5" component="div" sx={{fontSize: {xs: '22px', sm: '24px', md: '22px', lg: '24px'}, fontWeight: 540, mt: 2}} letterSpacing={2} >Apartment no.1 </Typography>
                        <Typography variant="body1" color={'gray'} sx={{fontSize: {xs: '13px', sm: '14px', md: '13px' ,lg:'14px'}}} letterSpacing={1} gutterBottom>Magsaysay st. Brgy Cogon, Sorsogon City</Typography>
                        
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Landlord/Apartment/[id]' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '1.4rem', mb: '-0.1rem', fontSize: {xs: '15px', sm: '16px', md: '15px', lg:'16px'}, borderRadius: '12px'}} ><VisibilityOutlinedIcon sx={{mr:'0.2rem'}}/>View Units</Button>
                        </Box>
                    </Paper> 
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ maxWidth: { xs: 320, sm: 520,  md: 820, lg: 890 },   padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', ml:{xs: '3.5rem', sm: '4.9rem', md: '3rem', lg:'3rem'}, width: { xs: '10rem', sm: '10rem', md:'10rem', lg: '12rem' }, height: { xs: '10rem', sm: '8rem', md: '9rem', lg: 'auto' }}}>
                            {/* <TurnedInOutlinedIcon sx={{fontSize: '3.3rem', color:'#f78028'}} /> */}
                            <img
                            src="/hdpartment.png" 
                            style={{ width: '100%', height: 'auto', objectFit: 'contain',  }}
                            alt="proptrack logo" 
                            />
                        </Box>
                        <Box 
                            sx={(theme) => ({
                                mt: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexShrink: 0,
                                borderRadius: '10px',
                                padding: {xs: '10px', sm: '21px', md: '15px', lg: '10px'},
                                
                                bgcolor:
                                    theme.palette.mode === 'light'
                                    ? 'rgba(255, 255, 255, 0.4)'
                                    : 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(30px)',
                                maxHeight: {xs: 42, sm: 30, md: 35, lg: 37},
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow:
                                    theme.palette.mode === 'light'
                                    ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                                    : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
                            })}
                        >
                        <Grid container justifyContent={'space-between'}  alignItems="center">
                            <Grid item >
                            <Typography variant="body1" color={'primary'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.1rem', sm: '0.1rem', md: '0rem', lg:'0.1rem'},  ml:{xs:'-0.1rem', sm: '-0.5rem', md: '-0.6rem', lg:'0rem'}, }} letterSpacing={1} >Available Units: 10</Typography>
                            </Grid>
                            <Divider orientation="vertical" color='black' variant="middle" flexItem />
                            <Grid item >
                                <Typography variant="body1" color={'#f78028'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.5rem', sm: '0.6rem', md: '0.6rem', lg:'0.6rem'},  ml: {xs:'0rem', sm: '0rem', md:'0rem', lg: '0rem'}, mb: {xs:'0.5rem'}, mr:{xs:'-0.2rem', sm: '-0.4rem', md: '-0.5rem',  lg:'0rem'}}} letterSpacing={1} gutterBottom>Occupied Units: 10</Typography>
                            </Grid>
                        </Grid>
                        </Box>
                        <Typography variant="h5" component="div" sx={{fontSize: {xs: '22px', sm: '24px', md: '22px', lg: '24px'}, fontWeight: 540, mt: 2}} letterSpacing={2} >Apartment no.1 </Typography>
                        <Typography variant="body1" color={'gray'} sx={{fontSize: {xs: '13px', sm: '14px', md: '13px' ,lg:'14px'}}} letterSpacing={1} gutterBottom>Magsaysay st. Brgy Cogon, Sorsogon City</Typography>
                        
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Landlord/Apartment/[id]' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '1.4rem', mb: '-0.1rem', fontSize: {xs: '15px', sm: '16px', md: '15px', lg:'16px'}, borderRadius: '12px'}} ><VisibilityOutlinedIcon sx={{mr:'0.2rem'}}/>View Units</Button>
                        </Box>
                    </Paper> 
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ maxWidth: { xs: 320, sm: 520,  md: 820, lg: 890 },   padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', ml:{xs: '3.5rem', sm: '4.9rem', md: '3rem', lg:'3rem'}, width: { xs: '10rem', sm: '10rem', md:'10rem', lg: '12rem' }, height: { xs: '10rem', sm: '8rem', md: '9rem', lg: 'auto' }}}>
                            {/* <TurnedInOutlinedIcon sx={{fontSize: '3.3rem', color:'#f78028'}} /> */}
                            <img
                            src="/hdpartment.png" 
                            style={{ width: '100%', height: 'auto', objectFit: 'contain',  }}
                            alt="proptrack logo" 
                            />
                        </Box>
                        <Box 
                            sx={(theme) => ({
                                mt: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexShrink: 0,
                                borderRadius: '10px',
                                padding: {xs: '10px', sm: '21px', md: '15px', lg: '10px'},
                                
                                bgcolor:
                                    theme.palette.mode === 'light'
                                    ? 'rgba(255, 255, 255, 0.4)'
                                    : 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(30px)',
                                maxHeight: {xs: 42, sm: 30, md: 35, lg: 37},
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow:
                                    theme.palette.mode === 'light'
                                    ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                                    : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
                            })}
                        >
                        <Grid container justifyContent={'space-between'}  alignItems="center">
                            <Grid item >
                            <Typography variant="body1" color={'primary'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.1rem', sm: '0.1rem', md: '0rem', lg:'0.1rem'},  ml:{xs:'-0.1rem', sm: '-0.5rem', md: '-0.6rem', lg:'0rem'}, }} letterSpacing={1} >Available Units: 10</Typography>
                            </Grid>
                            <Divider orientation="vertical" color='black' variant="middle" flexItem />
                            <Grid item >
                                <Typography variant="body1" color={'#f78028'} sx={{fontSize: {xs: 12, sm: 13, md: 12, lg: 13}, mt:{xs: '0.5rem', sm: '0.6rem', md: '0.6rem', lg:'0.6rem'},  ml: {xs:'0rem', sm: '0rem', md:'0rem', lg: '0rem'}, mb: {xs:'0.5rem'}, mr:{xs:'-0.2rem', sm: '-0.4rem', md: '-0.5rem',  lg:'0rem'}}} letterSpacing={1} gutterBottom>Occupied Units: 10</Typography>
                            </Grid>
                        </Grid>
                        </Box>
                        <Typography variant="h5" component="div" sx={{fontSize: {xs: '22px', sm: '24px', md: '22px', lg: '24px'}, fontWeight: 540, mt: 2}} letterSpacing={2} >Apartment no.1 </Typography>
                        <Typography variant="body1" color={'gray'} sx={{fontSize: {xs: '13px', sm: '14px', md: '13px' ,lg:'14px'}}} letterSpacing={1} gutterBottom>Magsaysay st. Brgy Cogon, Sorsogon City</Typography>
                        
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Landlord/Apartment/[id]' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '1.4rem', mb: '-0.1rem', fontSize: {xs: '15px', sm: '16px', md: '15px', lg:'16px'}, borderRadius: '12px'}} ><VisibilityOutlinedIcon sx={{mr:'0.2rem'}}/>View Units</Button>
                        </Box>
                    </Paper>      
                </Grid>
           </Grid>
        </Box>


    )
}