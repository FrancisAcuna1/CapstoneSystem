'use client'

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Box, Paper, Typography, Button, Divider, Link, Skeleton, Breadcrumbs, CardMedia, Card, CardContent, CardActions} from '@mui/material';
import TenantRegistrationForm from '../FormsComponent/TenantRegistrationForm';
import Image from 'next/image';
import Slider from "react-slick"; // Import the slider
import styles from '../../../gallery.module.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ErrorSnackbar from '../Labraries/ErrorSnackbar'
import { SnackbarProvider } from 'notistack';


function srcset(image, width, height, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format&dpr=2 2x`,
    };
  }


export default function TenantRegistrationComponent({propsId, apartmentId, loading, setLoading}){
    const apartmentID = apartmentId; // apartment ID
    const propsID = propsId; // property ID
    const [details, setDetails] = useState([]);
    const [successful, setSuccessful] = useState(null);
    const [error, setError] = useState(null);



    console.log('Apartment ID:', apartmentID);
    console.log('Property ID:', propsID);
    console.log('Details:', details);
    console.log('Inclusions:', details.apartment?.inclusions);

    
    useEffect(() => {
        const fetchedData = async () => {
            const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
            const userData = JSON.parse(userDataString); // parse the datastring into json 
            const accessToken = userData.accessToken;
            if (accessToken){
                console.log('Access Token Found', accessToken)

                try{
                    setLoading(true);
                    const response = await fetch(`http://127.0.0.1:8000/api/property/${propsID}/details/${apartmentID}`,{
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
                        console.log('images:', data.apartment.images);
                        
                        setDetails(data);
                    
                        // setInclusions(data);
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
    }, [apartmentID, propsID, setLoading])

    const images = details?.apartment?.images && details?.apartment?.images || []; 
    console.log('images:', images);
    
    const CustomNextArrow = ({ className, onClick }) => (
    <div
        className={`${className} custom-arrow next-arrow`}
        onClick={onClick}
        style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        width: "35px",
        height: "35px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "50%",
        cursor: "pointer"
        }}
    >
        <ArrowForwardIosIcon fontSize='small' style={{ color: "#fff" }} />
    </div>
    );
      
    const CustomPrevArrow = ({ className, onClick }) => (
    <div
        className={`${className} custom-arrow prev-arrow`}
        onClick={onClick}
        style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        left: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        width: "35px",
        height: "35px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "50%",
        cursor: "pointer"
        }}
    >
        <ArrowBackIosIcon  fontSize='small' style={{ color: "#fff", marginLeft: "8px" }} />
    </div>
    );

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
        autoplay: true,
        autoplaySpeed: 5000,
        cssEase: "linear",
        dotsClass: "slick-dots custom-dots", 
    };
    

    return(
        <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
            {/* <SnackbarProvider maxSnack={3}>
                <ErrorSnackbar
                    error={error}
                    setError={setError}          
                />
            </SnackbarProvider> */}
            <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '5px', fontSize: {xs:'18px', sm:'18px', md:'24px', lg:'24px'}, fontWeight: 'bold',  mt:5}}>
                Details -  {details.apartment && details.apartment.apartment_name}
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
                    <Link letterSpacing={2} underline="hover" color="inherit" href={`/Landlord/Property/${propsID}`}>
                        List of Rental Units
                    </Link>
                    <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Apartment Details</Typography>
                </Breadcrumbs>
            </Grid>
            <Box sx={{mt:'4rem'}}>

            </Box>

            <Grid  container spacing={1} sx={{maxWidth: 1400, mt: '10rem', display:'flex', justifyContent:' center',  margin: 'auto'}}>
                <Grid item xs={12} md={5} lg={5} sx={{ }}>
                    <Paper elevation={3}
                        sx={{
                            padding: '25px',
                            marginTop: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                          }}
                    >  
                    {loading ?
                    (
                        <Box>
                        <Skeleton variant="rectangular" height={140} />
                            <Skeleton width="100%" />
                            <Skeleton width="90%" />
                            <Skeleton width="40%" />
                            <Skeleton width={100} height={30} />
                            <Skeleton width={100} height={30} />
                        </Box>   
                        ):(
                        <>
                        <Box 
                            className={styles.gallerySlider}
                            sx={{
                                position: 'relative',
                                maxWidth:{xs:285, lg:1400},
                                mb: 4,
                                gap: 2,
                                '& .slick-slider, & .slick-list, & .slick-track': {
                                height: '100%',
                                overflow: 'hidden',
                                },
                                '& .slick-slide': {
                                '& > div': {
                                    height: '100%',
                                }
                                }
                            }}
                            >
                            <Slider {...sliderSettings}>
                                {images.map((image, index) => (
                                <div key={image.id}>
                                    <Box
                                    sx={{
                                        height: { xs: '300px', sm: '300px', md: '300px' },
                                        width: '100%',
                                        position: 'relative',
                                        
                                    }}
                                    >
                                    <Image
                                        src={`http://127.0.0.1:8000/ApartmentImage/${image.image_path}`}
                                        alt={`Apartment image ${index + 1}`}
                                        layout="fill"
                                        objectFit="cover"
                                        style={{ borderRadius: '10px'}}
                                    />
                                    </Box>
                                </div>
                                ))}
                            </Slider>
                        </Box>
                        {details && details.apartment && (
                            <>
                            <Typography
                                variant="h5"
                                letterSpacing={1.5}
                                gutterBottom
                                sx={{
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                color: '#333',
                                mt: 6,
                                }}
                            >
                                {details.apartment.apartment_name}
                            </Typography>
                            <Typography
                                variant="body1"
                                letterSpacing={1.2}
                                gutterBottom
                                sx={{ color: '#555', mb: 2 }}
                            >
                                Bldg No. {details.apartment.building_no}, {details.apartment.street} St., 
                                Brgy. {details.apartment.barangay}, {details.apartment.municipality}.
                            </Typography>

                            <Typography
                                variant="body2"
                                gutterBottom
                                sx={{ fontWeight: 500, color: '#757575' }}
                            >
                                <strong>Rental Fee:</strong> {details.apartment.rental_fee}
                            </Typography>
                            <Typography
                                variant="body2"
                                gutterBottom
                                sx={{ fontWeight: 500, color: '#757575' }}
                            >
                                <strong>Rooms:</strong> {details.apartment.number_of_rooms}
                            </Typography>
                            <Typography
                                variant="body2"
                                gutterBottom
                                sx={{ fontWeight: 500, color: 'green' }}
                            >
                                <strong style={{ color: '#000' }}>Status:</strong>{' '}
                                {details.apartment.status}
                            </Typography>
                            <Typography
                                variant="body2"
                                gutterBottom
                                sx={{ fontWeight: 500, color: '#757575' }}
                            >
                                <strong>Capacity:</strong> {details.apartment.capacity}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'start', mt: 3 }}>
                                <Typography
                                variant="body2"
                                gutterBottom
                                sx={{ fontWeight: 600, color: '#333', mr: 1 }}
                                >
                                <strong>Inclusions:</strong>
                                </Typography>

                                <Grid container spacing={1}>
                                {details.apartment.inclusions &&
                                details.apartment.inclusions.length > 0 ? (
                                    details.apartment.inclusions.map((item, index) => (
                                    <Grid item key={index} xs="auto">
                                        <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 500,
                                            color: '#555',
                                            backgroundColor: '#e8f0fe',
                                            padding: '4px 8px',
                                            borderRadius: '8px',
                                        }}
                                        >
                                        {item.equipment?.name || ''} - {item?.quantity || ''}
                                        </Typography>
                                    </Grid>
                                    ))
                                ) : (
                                    <Grid item>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 500, color: '#757575' }}
                                    >
                                        No Included Inclusions
                                    </Typography>
                                    </Grid>
                                )}
                                </Grid>
                            </Box>
                            </>
                        )}
                        
                        </>
                        )
                    
                
                    }

                        {/* <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Dashboard/apartment/[id]/RegisterTenant' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '2rem', mb: '-0.1rem', fontSize: 16, borderRadius: '12px'}} ><CreateOutlinedIcon sx={{mr:'0.2rem'}}/>Register New Tenant</Button>
                        </Box> */}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={7} lg={7}>
                    <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '8px'}}>  
                        <SnackbarProvider maxSnack={3}>
                        <TenantRegistrationForm
                            details={details}
                            setDetails={setDetails}
                            loading={loading}
                            setLoading={setLoading}
                            error={error}
                            setError={setError}
                            successful={successful}
                            setSuccessful={setSuccessful}
                        />
                        </SnackbarProvider>
                    </Paper>
                </Grid>
                

            </Grid>
        </Box>
    )
}