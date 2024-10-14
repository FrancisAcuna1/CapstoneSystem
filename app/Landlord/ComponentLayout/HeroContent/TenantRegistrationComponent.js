'use client'

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Box, Paper, Typography, Button, Divider, Link, Skeleton, Breadcrumbs, CardMedia, Card, CardContent, CardActions} from '@mui/material';
import RegisterComponent from '../FormsComponent/TenantRegistrationForm';
import Image from 'next/image';
import BedroomChildOutlinedIcon from '@mui/icons-material/BedroomChildOutlined';

export default function TenantRegistrationForm({propsId, apartmentId, loading, setLoading}){
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
    }, [])
    
    
    




    return(
        <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
            <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '5px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
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
                        List of Properties
                    </Link>
                    <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Apartment Details</Typography>
                </Breadcrumbs>
            </Grid>
            <Box sx={{mt:'4rem'}}>

            </Box>

            <Grid  container spacing={1} sx={{maxWidth: 1400, mt: '10rem', display:'flex', justifyContent:' center',  margin: 'auto'}}>
                <Grid item xs={12} md={5} lg={5}>
                    <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '8px'}}>  
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
                        <CardMedia
                            sx={{ height: 150 }}
                            image={details.apartment && details.apartment.image ? `http://127.0.0.1:8000/ApartmentImage/${details.apartment.image}` : ''}
                            title={details.apartment && details.apartment.apartment_name && details.apartment.apartment_name.caption || 'Image'}
                            // style={{ width: '100%', height: 'auto', objectFit: 'contain',  }}
                        />
                        {details && details.apartment && (
                            <>
                            <Typography variant='h6' letterSpacing={1.2} gutterBottom sx={{textTransform: 'uppercase', fontWeight: 550, mt: 2}}>
                            {details.apartment.apartment_name}
                            </Typography>
                            <Typography variant='body2' letterSpacing={1.2} gutterBottom sx={{textTransform: 'uppercase', fontWeight: 500, }}>
                            Bdlg no.{details.apartment.building_no}.  {details.apartment.street}.st.,  Brgy.{details.apartment.barangay},  {details.apartment.municipality}.
                            </Typography>
                            <Typography variant='body2' letterSpacing={1.2} gutterBottom sx={{ fontWeight: 500, }}>
                            <strong>Rental Fee:</strong> {details.apartment.rental_fee}
                            </Typography>
                            <Typography variant='body2' letterSpacing={1.2} gutterBottom sx={{ fontWeight: 500, }}>
                            <strong>Rooms: </strong> {details.apartment.number_of_rooms}
                            </Typography>
                            <Typography variant='body2' color={'green'} letterSpacing={1.2} gutterBottom sx={{ fontWeight: 500, }}>
                            <strong style={{color:'black'}}>Status:</strong> {details.apartment.status}
                            </Typography>
                            <Typography variant='body2' letterSpacing={1.2} gutterBottom sx={{ fontWeight: 500, }}>
                            <strong>Capacity:</strong> {details.apartment.capacity}
                            </Typography> 
                            <Typography variant='body2' letterSpacing={1.2} gutterBottom sx={{ fontWeight: 500, }}>
                            <strong>Inclusions -</strong>
                            </Typography>
                            {details.apartment.inclusions && details.apartment.inclusions.length > 0 ? (
                            details.apartment.inclusions.map((item, index) => (
                                <Typography key={item.index} variant='body2' letterSpacing={2} gutterBottom sx={{ fontWeight: 500, }}>
                                    {item.inclusion.name}: {item.quantity}
                                </Typography>
                            ))
                            ):(
                            <>
                            <Typography variant='body2' letterSpacing={2} gutterBottom sx={{ fontWeight: 500, }}>
                                No Included Inclusion 
                            </Typography>
                            </>
                            )}

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
                        <RegisterComponent
                            details={details}
                            setDetails={setDetails}
                            loading={loading}
                            setLoading={setLoading}
                            error={error}
                            setError={setError}
                            successful={successful}
                            setSuccessful={setSuccessful}
                        />
                    </Paper>
                </Grid>
                

            </Grid>
        </Box>
    )
}