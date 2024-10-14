// DIRE NA GAMIT NA COMPONENT INI PWEDE I DELETE kaupod sini ang [id] sa tenant information na folder

'use client'

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Box, Paper, Typography, Button, Divider, Link, Skeleton, Breadcrumbs, CardMedia, Card, CardContent, CardActions} from '@mui/material';
import RegisterComponent from '../FormsComponent/TenantRegistrationForm';
import Image from 'next/image';
import BedroomChildOutlinedIcon from '@mui/icons-material/BedroomChildOutlined';

export default function EditTenantComponent({propsId, apartmentId, loading, setLoading}){
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
                Edit Tenant Information
            </Typography>
            <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                    {/* <Typography color="inherit">Navigation</Typography> */}
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Home">
                        Home
                    </Link>
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/TenantInformation">
                        Tenant Information
                    </Link>
                    <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Edit Information</Typography>
                </Breadcrumbs>
            </Grid>
            <Box sx={{mt:'4rem'}}>

            </Box>

            <Grid  container spacing={1} sx={{maxWidth: 1400, mt: '10rem', display:'flex', justifyContent:' center',  margin: 'auto'}}>
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