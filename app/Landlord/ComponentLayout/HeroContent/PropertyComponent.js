'use client'
import * as React from 'react';
import { useState, useEffect} from 'react';
import { Grid, Box, Paper, Typography, Button, Divider, Link, Breadcrumbs, CardContent, Skeleton, Card, CardActions, CardMedia} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Modal as BaseModal } from '@mui/base/Modal';
import PropTypes from 'prop-types';
import { styled, css, } from '@mui/system';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Image from 'next/image';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import AddApartmentModal from '../ModalComponent/AddEstateModal';
import SuccessSnackbar from '../Labraries/snackbar';
import ErrorSnackbar from '../Labraries/ErrorSnackbar'
import { SnackbarProvider } from 'notistack';
import { useRouter } from 'next/navigation';


export default function PropertyComponent ({loading, setLoading}){
    const router = useRouter();
    const [property, setProperty] = useState([]);
    const [editproperty, setEditProperty] = useState(null);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [successful, setSuccessful] = useState(false);
    const [error, setError] = useState(null);
    // const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    console.log(editproperty)
    

    useEffect(() => {
        const fetchedData = async () => {
            const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
            console.log(userDataString)
            const userData = JSON.parse(userDataString); // parse the datastring into json 
            const accessToken = userData.accessToken;
            if (accessToken){
                console.log('Access Token Found', accessToken)

                try{
                    setLoading(true);
                    const response = await fetch("http://127.0.0.1:8000/api/property_list",{
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                            "Accept": "application/json",
                        }
                
                    })

                    const data = await response.json();

                    if(response.ok){
                        console.log('Data:', data)
                        setProperty(data);
                    }
                    else{
                        console.log('Error:', response.status)
                    }

                }catch (error) {
                    console.error("Error fetching data:", error);
                    setError(error);

                } finally {
                    setLoading(false); // Set loading to false regardless of success or failure
                }
            }
            
        }
        fetchedData();
        
    }, [])

    const handleEdit = (id) => {
        console.log('Edit Property:', id)
        setEditProperty(id);
        setOpen(true);
    }

    const handleClick = (id) => {
        setLoading(true);
        try {
            router.push(`/Landlord/Property/${id}`);
        }catch (error) {
            console.error(error);
        } finally {
        setLoading(false);
        }
    }


  

    return (
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
            
             <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '5px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
                List  of Estate Property
            </Typography>
            <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                    {/* <Typography color="inherit">Navigation</Typography> */}
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Home">
                        Home
                    </Link>
                    <Typography letterSpacing={2} color="text.primary" sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Property</Typography>
                </Breadcrumbs>
            </Grid>
            {/* <hr style={{ width: '100%', backgroundColor: '#ecebee', height: '1px', marginTop: '10px',}} /> */}

            <Grid container sx={{justifyContent:{xs:'start', lg:'space-between',},  mt:4}}>
                <Grid item>

                </Grid>
                <Grid item>
                    <AddApartmentModal
                        open={open}
                        handleOpen={handleOpen}
                        handleClose={handleClose}
                        setSuccessful={setSuccessful}
                        successful={successful}
                        error={error}
                        setError={setError}
                        editproperty={editproperty}
                        setEditProperty={setEditProperty}

                    />
                </Grid>
            </Grid>

            
           
           <Grid container spacing={2} sx={{mt:-1}}>
            {loading ? (
                // Display 6 skeleton loaders
                <Grid container spacing={2}>
                {Array.from(new Array(8)).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card sx={{ maxWidth: 345 }}>
                        <Skeleton variant="rectangular" height={140} />
                        <CardContent>
                        <Skeleton width="80%" />
                        <Skeleton width="60%" />
                        <Skeleton width="40%" />
                        </CardContent>
                        <CardActions>
                        <Skeleton width={100} height={30} />
                        <Skeleton width={100} height={30} />
                        </CardActions>
                    </Card>
                    </Grid>
                ))}
                </Grid>
                  
              
            ):(
                property.map((item, index) => {
                    return (
                    <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                        <Paper elevation={3} style={{ maxWidth: { xs: 320, sm: 520,  md: 820, lg: 890 }, height:434,   padding: '25px', marginTop: '15px', borderRadius: '10px'}}>  
                            <CardMedia
                                sx={{ height: 150 }}
                                image={`http://127.0.0.1:8000/ApartmentImage/${item.image}`} // Use the URL of the first image
                                title={item.propertyname[0].caption || 'Image'}
                               
                                // style={{ width: '100%', height: 'auto', objectFit: 'contain',  }}
                                
                            />
                            
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
                            <Box height={95} sx={{mt:2, }}>
                                <Typography gutterBottom variant="h5" component="div" sx={{fontSize: {xs: '22px', sm: '24px', md: '22px', lg: '24px'}, fontWeight: 540,}} letterSpacing={2}>
                                    {item.propertyname}
                                </Typography>
                                <Typography variant="body1" color={'#424242'} sx={{fontSize: {xs: '13px', sm: '14px', md: '13px' ,lg:'14px'}}} letterSpacing={1} gutterBottom>
                                    {/* Magsaysay st. Brgy Cogon, Sorsogon City */}
                                    Brgy {item.barangay}, {item.municipality}
                                </Typography>
                              

                            </Box>
                            
                            
                            <Box sx={{display: 'flex', justifyContent: {xs:'flex-start', lg:'space-between'}, alignItems: {xs: 'flex-start', lg: 'center'}, gap:1}}>
                                <Box>
                                    <Button 
                                        onClick={() => handleClick(item.id)} 
                                        variant="contained" 
                                        sx={{     
                                            background: '#8785d0', 
                                            '&:hover':{background: '#b6bdf1'}, 
                                            mt: '1.9rem', 
                                            fontSize: {xs: '16px', sm: '16px', md: '15px', lg:'16px'},  
                                            borderRadius: '8px'
                                        }} 
                                    >        
                                        <Box
                                        component="span"
                                        sx={{ display: { xs: 'inline', lg: 'none' } }}
                                        >
                                             View Property Type
                                        </Box>
                                        <Box
                                        component="span"
                                        sx={{ display: { xs: 'none', lg: 'inline' },}} // Hide text on mobile
                                        >
                                            <VisibilityOutlinedIcon sx={{mr:{xs:'0', lg:'0.3rem'}, mb: '-0.4rem' }}/> 
                                             View Property Type
                                        </Box> 
                                    </Button>
                                </Box>
                                <Box>
                                    <Button 
                                        variant='outlined' 
                                        onClick={() => handleEdit(item.id)}
                                        sx={{
                                            background: '', 
                                            '&:hover':{background: '#b6bdf1'}, 
                                            mt: '1.9rem', 
                                            fontSize: {xs: '12px', sm: '16px', md: '15px', lg:'16px'}, 
                                            borderRadius: '8px'
                                        }}>
                                        <Box
                                        component="span"
                                        sx={{
                                             display: { xs: 'inline', lg: 'none' },
                                             height: 28
                                            
                                        }}
                                        >
                                            <DriveFileRenameOutlineOutlinedIcon
                                            sx={{ mr: { xs: 0, lg: '0.2rem' } }}
                                            />
                                        </Box>
                                        <Box
                                        component="span"
                                        sx={{ display: { xs: 'none', lg: 'inline' } }} // Hide text on mobile
                                        >
                                           
                                            Edit
                                        </Box>  
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    )
                })
                

            )}
                
                
           </Grid>
           
        </Box>
       


    )
}