"use client"
import * as React from 'react';
import { useEffect, useState, useCallback} from 'react';
import { Container, Paper, Typography,Box, Grid, Button, Link, Breadcrumbs, Divider, Skeleton, Avatar} from '@mui/material';
import AssesmentFeeTable from '../TableComponent/AssessmentTable';
import '/app/style.css';
import { format, parseISO } from 'date-fns';


export default function AssessmentFeeComponent({setLoading, loading}){
    const [tenantInformation, setTenantInformation] = useState([]);
    const [paymentInfo, setPaymentInfo] = useState([]);
    const [lastPayment, setLastPayment] = useState(null);

    console.log(paymentInfo);
    

    useEffect(() => {
        const fetchedData = async () => {
          setLoading(true); // Start loading
          const userDataString = localStorage.getItem('userDetails');
    
          if (userDataString) {
            try {
              const userData = JSON.parse(userDataString); // Parse JSON
              const accessToken = userData.accessToken; // Access token
              const userId = userData.user.id; // User ID
              
              if (accessToken) {
                console.log('User ID:', userId); // Debugging line
                const response = await fetch(`http://127.0.0.1:8000/api/tenant_assessment_fee/${userId}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                  }
                });
    
                const data = await response.json();
    
                console.log('API Response:', data); // Debugging line
    
                if(response.ok){
                    console.log(data)
                    setTenantInformation(data.data)
                    setLoading(false)
                }else{
                    console.log('Error:', response.status)
                    setLoading(false)
                }
              }
            } catch (error) {
              console.error('Error fetching payment details:', error); // Error logging
            }
          } else {
            console.error('No user data found in local storage.'); // Handling missing user data
          }
          setLoading(false); // Stop loading
        };
        
        fetchedData();
      }, [setLoading]);

      console.log(tenantInformation)

    useEffect(() => {
        const fethcedPaymentData = async() => {
            setLoading(true);
            const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
            const userData = JSON.parse(userDataString); // parse the datastring into json 
            const accessToken = userData.accessToken;
            const userId = userData.user.id; 
            if(accessToken){
                try{
                    const response = await fetch(`http://127.0.0.1:8000/api/tenant_payment/${userId}`,{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
                    const data = await response.json();
                    if(response.ok){
                        console.log('Data:', data.data);
                        setPaymentInfo(data.data)
                    }else{
                        console.log('Error:', response.status)
                    }
                }catch(error){
                    console.log('Error:', error)
                }
            }else{
                console.log('Error: Access token is not available')
            }
        }

        fethcedPaymentData();
    }, [setLoading])

    const formatDate = (dateString) => {
        if(!dateString){
            return null;
        }
    
        try{
            const parseDate = parseISO(dateString);
            return format(parseDate, 'MMM d, yyyy');
        }catch(error){
            console.log('Error formating Date:', error);
            return dateString;
        }
    }
    
    const calculateBalance = () => {
        if (!tenantInformation || !tenantInformation[0] || !paymentInfo) {
            return '0.00';
        }
    
        const info = tenantInformation[0]; // Assuming there's only one tenant information object
    
        const totalPayment = paymentInfo.reduce((total, payment) => {
            return total + Number(payment.amount);
        }, 0);
        
        console.log('total:', totalPayment)
    
        // const leaseStartDate = new Date(info.lease_start_date);
        // const currentDate = new Date();
        
        // Calculate the number of months from lease start to current date
        const currentDate = new Date('2025-01-20'); 
        const leaseStartDate = new Date('2024-11-11');
        const monthsRented = (currentDate.getFullYear() - leaseStartDate.getFullYear()) * 12 + (currentDate.getMonth() - leaseStartDate.getMonth());
        console.log('months:',monthsRented);
        
        
    
        // Calculate the total rental fee due
        const totalRentalFee = monthsRented  * Number(info.rental_fee);
    
        const balance = totalRentalFee - totalPayment;
        return balance.toFixed(2);
    };
    const totalBalanced = tenantInformation ? calculateBalance() : '0.00';
    console.log(totalBalanced);

    const getLastPayment = (payments) => {
        if (!payments || payments.length === 0) return null;
        
        const sortedPayments = [...payments].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        return sortedPayments[0];
    }; // Empty dependency array since this function doesn't depend on any external values

    useEffect(() => {
     
        if (paymentInfo) {
            const lastPayment = getLastPayment(paymentInfo);
            setLastPayment(lastPayment);
        }
   
    }, [paymentInfo]);
    
   console.log(lastPayment);
   
    
    

    return (
        <>
            <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
                <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '1px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
                    Tenant Information
                </Typography>
                <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                    <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                        {/* <Typography color="inherit">Navigation</Typography> */}
                        <Link letterSpacing={2} underline="hover" color="inherit" href="/User/Home">
                            Home
                        </Link>
                        <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Assesment of Fees</Typography>
                    </Breadcrumbs>
                </Grid>
                <Box sx={{mt:'4rem'}}>
                </Box>

                <Grid  container spacing={1} sx={{ mt: '-0.9rem', display:'flex', justifyContent:' center',  }}>
                    <Grid xs={12} sm={12} md={7} lg={7}>
                        <Paper
                            elevation={2}
                            sx={{
                                maxWidth: { xs: 312, sm: 741,  md: 940, lg: 1400 }, 
                                padding: "25px",
                                borderRadius: '8px',
                                marginTop: '2rem',
                                height: 'auto'
                            }}
                        >   {loading ? (
                            <>
                                <Box>
                                {/* <Skeleton variant="rectangular" height={140} /> */}
                                <Skeleton width="100%" />
                                <Skeleton width="90%" />
                                <Skeleton width="40%" />
                                <Skeleton width={100} height={30} />
                                <Skeleton width={100} height={30} />
                                </Box> 
                            </>
                            ):(
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                {tenantInformation.map((info, index) => (
                                    <React.Fragment key={index}>
                                    
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant='h6' gutterBottom sx={{ fontWeight: 550, letterSpacing: 1, }}>
                                        {info.tenant.firstname} {info.tenant.middlename} {info.tenant.lastname}
                                        </Typography>
                                        <Typography variant='body1' sx={{}}>
                                        {info.rented_unit.apartment_name} {info.rented_unit.boarding_house_name}
                                        </Typography>
                                        <Typography variant='body1' sx={{}}>
                                        Lease start date: {formatDate(info.lease_start_date)}
                                        </Typography>
                                        <Typography variant='body1' sx={{}}>
                                        {info.tenant.street} st. {info.tenant.barangay}, {info.tenant.municipality}, Sorsogon
                                        </Typography>
                                    </Box>
                                
                                    
                                    </React.Fragment>
                                ))}
                                </Box>
                            )}

                            
                            
                            
                            <Box sx={{mt:4}} >
                            <Divider/>
                                <AssesmentFeeTable
                                    setLoading={setLoading}
                                    loading={loading}
                                />
                            </Box>
                               
                        </Paper>

                    </Grid>
               
                    <Grid item xs={12} sm={12} md={5} lg={5}>
                        <Paper
                            sx={{
                                padding: "25px",
                                borderRadius: '8px',
                                marginTop: '1.5rem',
                                height: 'auto'
                            }}
                        >
                            {loading ? (
                                <Box>
                                {/* <Skeleton variant="rectangular" height={140} /> */}
                                <Skeleton width="100%" height={40}/>
                                <Skeleton width="100%" height={50}/>
                                <Skeleton width="100%" height={50}/>
                                
                                </Box> 
                            ):(
                               <>
                                    {tenantInformation.map((item, index ) => {
                                        return (
                                            <>
                                            <Grid container justifyContent="start" key={index.id}  sx={{alig: 'center', }}>
                                            <Grid container justifyContent="start" sx={{ mb: 1 }}>
                                                <Box>
                                                <Typography variant="h5" color={'#757575'} sx={{fontSize: {xs: '21px', sm: '23px', md: '22px', lg: '23px'} }} letterSpacing={2} gutterBottom>
                                                Rental Fee
                                                </Typography>
                                                </Box>
                                                
                                            </Grid>  
                                            <Grid item xs='12' >
                                                <Box  bgcolor={'#eeeeee'} display='flex' alignItems='center'> 
                                                    <Grid container justifyContent='space-between'>
                                                        <Grid item>
                                                            <Typography variant="body1" color={'black'} sx={{color:'#3e3e3e', fontWeight:'550', fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'},  ml: '1.2rem', mt: 1,  }} letterSpacing={2} gutterBottom>
                                                            Total Amount:
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography variant="body1" sx={{fontWeight:'550', color:'#3e3e3e', fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'}, mr: 1,  mt: 1,  }} letterSpacing={2} gutterBottom>
                                                            {item.rental_fee}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Grid>
                                            </Grid> 
        
                                            <Grid container justifyContent="start" sx={{ mb: 1 }}>
                                                <Box>
                                                <Typography variant="h5" color={'gray'} sx={{fontSize: {xs: '21px', sm: '23px', md: '22px', lg: '23px'}, marginTop: '1rem', mb: 2 }} letterSpacing={2} gutterBottom>
                                                    Payment
                                                </Typography>
                                                </Box>
                                                
                                            </Grid>  
                                            <Grid container justifyContent="start"  sx={{ mb: 2, alig: 'center'}}>
                                                <Grid item xs='12' >
                                                    <Box  bgcolor={'#eeeeee'} display='flex' alignItems='center' mt={'-0.9rem'}> 
                                                        <Grid container justifyContent='space-between'>
                                                            <Grid item>
                                                                <Typography variant="body1" sx={{color:'#3e3e3e', fontWeight:'550', fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'},  ml: '1.2rem', mt: 1,  }} letterSpacing={2} gutterBottom>
                                                                Total Amount:
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <Typography variant="body1" color={'#2e7d32'} sx={{fontWeight:'550', fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'}, mr: 1,  mt: 1,  }} letterSpacing={2} gutterBottom>
                                                                {lastPayment?.amount}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                    <Box sx={{display:'flex', justifyContent:'space-between'}}>
                                                        <Box></Box>
                                                        <Typography variant='body1' sx={{mr:'0.5rem', mt:'0.1rem', fontWeight:'550', fontSize:'0.8rem', color:'#757575'}}>
                                                        {formatDate(lastPayment?.date)}
                                                        </Typography>
                                                    </Box>
                                                    {/* <Typography variant="body1" color={'gray'} sx={{display:'flex', justifyContent:'start', fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '14px'},  ml: '1.2rem', mt: 1,  }} letterSpacing={2} gutterBottom>
                                                    Payment Summary: 1000
                                                    </Typography> */}
                                                </Grid>
                                            </Grid> 
        
                                            <Grid container justifyContent="start" sx={{ mb: 1 }}>
                                                <Box>
                                                <Typography variant="h5" color={'gray'} sx={{fontSize: {xs: '21px', sm: '23px', md: '22px', lg: '23px'}, marginTop: '0.1rem', mb: 2 }} letterSpacing={2} gutterBottom>
                                                Balance
                                                </Typography>
                                                </Box>
                                                
                                            </Grid>  
                                            <Grid container justifyContent="start"  sx={{ mb: 2, alig: 'center'}}>
                                                <Grid item xs='12' >
                                                    <Box  bgcolor={'#eeeeee'} display='flex' alignItems='center' mt={'-0.9rem'}> 
                                                        <Grid container justifyContent='space-between'>
                                                            <Grid item>
                                                                <Typography variant="body1" sx={{color:'#3e3e3e', fontWeight:'550', fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'},  ml: '1.2rem', mt: 1,  }} letterSpacing={2} gutterBottom>
                                                                Total Amount:
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <Typography variant="body1" color={'#c62828'} sx={{fontWeight:'550', fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'}, mr: 1,  mt: 1,  }} letterSpacing={2} gutterBottom>
                                                                {/* {totalBalanced} */}
                                                                {totalBalanced}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </Grid>
                                            </Grid> 
                                            
                                            </>
                                        )
                                    })}
                                   </>
                               
                            )}

                            
                            
                        </Paper>
                    </Grid>
                </Grid>


                
            </Box>
        
        </>
    )
}