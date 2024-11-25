'use client'
import React, { useEffect } from 'react';
import { Box, Grid, Typography,  Link, Breadcrumbs, Paper, Card, CardContent, Avatar,  Divider, Button, Skeleton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Backdrop, CircularProgress} from '@mui/material'
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/navigation';
import { Email, Phone } from '@mui/icons-material';
import dynamic from 'next/dynamic';
import { format, parseISO } from 'date-fns';
// import PaymentHistoryTable from '../TableComponent/PaymentHistoryTable';
const PaymentHistory = dynamic(() => import('../TableComponent/paymenthistorytable'), {
ssr: false
}) 

export default function OccupiedBoardingHouseTenantInformation({boardinghouseId, propsId, tenantId, loading, setLoading}) {
    const  router = useRouter(); 
    const [open, setOpen] = useState(false);
    const [tenantInformation, setTenantInformation] = useState([]); 
    const [paymentInfo, setPaymentInfo] = useState([]);
    const [selectedDeleteTenant, setSelectedDeleteTenant] = useState({ id: null });
    const [deleting, setDeleting] = useState(false);

    console.log('Tenant:', tenantInformation);
    console.log('Payment:', paymentInfo);
    
    useEffect(() => {
        const fetchedData = async () => {
            setLoading(true);
            const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
            const userData = JSON.parse(userDataString); // parse the datastring into json 
            const accessToken = userData.accessToken;

            if(accessToken){
                try{
                    const response = await fetch(`http://127.0.0.1:8000/api/tenant_occupancy_info/${boardinghouseId}/${tenantId}`,{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
                    
                    const data = await response.json()
                    console.log(data)

                    if(response.ok){
                        console.log(data)
                        setTenantInformation(data.data[0])
                        setLoading(false)
                    }else{
                        console.log('Error:', response.status)
                        setLoading(false)
                    }
                }catch(error){
                    console.log('Error:', error)
                    setLoading(false)
                }finally{
                    console.log('error')
                    setLoading(false)
                }
            }
        }

        fetchedData();
    }, [boardinghouseId, tenantId, setLoading])

    useEffect(() => {
        const fethcedPaymentData = async() => {
            setLoading(true);
            const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
            const userData = JSON.parse(userDataString); // parse the datastring into json 
            const accessToken = userData.accessToken;

            if(accessToken){
                try{
                    const response = await fetch(`http://127.0.0.1:8000/api/tenant_payment/${tenantId}`,{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
                    const data = await response.json();
                    if(response.ok){
                        console.log('Data:', data.data[0]);
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
    }, [tenantId, setLoading])

    //this code is to format the date into months
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


    console.log('id', selectedDeleteTenant)
    const handleClickOpen = (id) => {
        setSelectedDeleteTenant({id});
        setOpen(true);

    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async() => {
        const {id} = selectedDeleteTenant;
        console.log(id);
        
        const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
        const userData = JSON.parse(userDataString); // parse the datastring into json 
        const accessToken = userData.accessToken;

        if(accessToken){
            try{
                setDeleting(true);
                const response = await fetch(`http://127.0.0.1:8000/api/remove_tenant_occupancy/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                })

                const data = await response.json()

                if(response.ok){
                    localStorage.setItem('successMessage', data.message || 'Operation successful!');
                    window.history.back();
                }else{
                    console.log('Error:', response.status)
                    if(data.error)
                    {
                        console.log(data.error) // for empty field
                        setError(data.error)
                        handleClose();
                    }else{
                        localStorage.setItem('errorMessage', data.message || 'Operation Error!');
                        window.location.reload();
                        // console.log(data.message); // for duplicate entry
                        // setError(data.message);
                        handleClose();
                    }
                }

            }catch(error){
                console.log('Error:', error)
            }
        }else{
            localStorage.setItem('errorMessage', 'Please login to perform this action!');
        }
        
       
    }
       // this code is to calculate the balanced.
    
    const calculateBalance = () => {
        // Check if tenantInformation and rental_fee exist
        if (!tenantInformation || !tenantInformation.rental_fee) {
            return '0.00'; // Return default value if rental_fee is not available
        }
    
        // Check if paymentInfo is an array and not empty
    
        const totalPayment = paymentInfo.reduce((total, payment) => {
            return total + Number(payment.amount);
        }, 0); // Added initial value of 0
    
        // Check if lease_start_date exists
        if (!tenantInformation.lease_start_date) {
            return '0.00'; // Return default value if lease_start_date is not available
        }
    
        // Calculate the number of months the tenant has been renting
        // const leaseStartDate = new Date(tenantInformation.lease_start_date);
        // const currentDate = new Date();
        const currentDate = new Date('2025-01-20'); 
        const leaseStartDate = new Date('2024-11-11');
        const monthsRented = (currentDate.getFullYear() - leaseStartDate.getFullYear()) * 12 + (currentDate.getMonth() - leaseStartDate.getMonth());
    
        // Calculate the total rental fee for the months rented
        const totalRentalFee = monthsRented * Number(tenantInformation.rental_fee);
    
        const balance = totalRentalFee - totalPayment;
        return balance.toFixed(2);
    };
    
    // Use the function with error handling
    const totalBalanced = tenantInformation ? calculateBalance() : '0.00';
    
    // const totalBalanced = (tenantInformation.rental_fee - tenantInformation.deposit).toFixed(2) || '';
    console.log(tenantInformation?.tenant?.id);
    const TenantId = tenantInformation?.tenant?.id;
    

  return (
    <>
        <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
            <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '5px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
                Tenant Information
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
                    <Link letterSpacing={2} underline="hover" color="inherit" href={`/Landlord/Property/${propsId}`}>
                        List of Units
                    </Link>
                    <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Tenant Information</Typography>
                </Breadcrumbs>
            </Grid>
            <Box sx={{mt:'4rem'}}>

            </Box>

            <Grid  container spacing={1}>
                <Grid item xs={12} md={5} lg={5}>
                    <Paper elevation={1} sx={{width: {xs: 300, lg: 'auto'}, height: {xs:'65vh', sm:'43vh', md:'43vh', lg:'46vh'}, padding: '25px', marginTop: '15px', borderRadius: '8px'}}>  
                        {loading ? (
                            <>
                            <Box>
                                <Skeleton variant="rectangular" height={140} />
                                <Skeleton width="100%" />
                                <Skeleton width="90%" />
                                <Skeleton width="40%" />
                                <Skeleton width={100} height={30} />
                                <Skeleton width={100} height={30} />
                            </Box>  
                            </>
                        ):(
                            <>
                            <Grid container justifyContent="center" sx={{ mb: 2, mt: 1}}>
                                <Avatar  sx={{width: 100, height: 100 , backgroundColor: 'red', fontSize:'2.9rem'}} aria-label="recipe">
                                    {tenantInformation?.tenant?.firstname?.charAt(0)}{tenantInformation?.tenant?.lastname?.charAt(0)}
                                </Avatar>
                            </Grid>  
                                
                                <Typography variant='h5' align={'center'} gutterBottom >
                                    { tenantInformation?.tenant?.firstname} {tenantInformation?.tenant?.lastname}
                                </Typography>

                                <Grid  container alignItems="center" justifyContent="center">
                                
                                    <Grid item>
                                    <Email fontSize="small" color="action" sx={{mt:0.7,}}/>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1" sx={{ml: 1}}>{tenantInformation?.tenant?.email}</Typography>
                                    </Grid>
                                
                                    
                                </Grid>
                                <Grid  container alignItems="center" justifyContent="center" sx={{mt:1}}>
                                    <Grid item>
                                        <Phone fontSize="small" color="action" />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1" sx={{ml: 1}}>{tenantInformation?.tenant?.contact}</Typography>
                                    </Grid>
                                </Grid>
                                <Box sx={{display:'flex', justifyContent: 'center', alignContent:'center', mt:'0.5rem'}}>
                                    <Button variant='contained' color={'warning'} onClick={() => handleClickOpen(tenantInformation?.tenant?.id)}>
                                        Remove
                                    </Button>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* Lease Info */}
                                <Typography variant="body1" align="center" sx={{mt:'1rem'}}>
                                <strong>Lease Start Date:</strong> {formatDate(tenantInformation?.lease_start_date)}
                                </Typography>

                                {/* <Typography variant="body1" align="center">
                                <strong>Lease End Date:</strong> {tenantInformation?.lease_end_date}
                                </Typography> */}

                                
                            
                            </>
                        )}
                        


                    </Paper>
                </Grid>

                <Grid item xs={12} md={5} lg={7}>
                    <Paper elevation={3} sx={{ height: {xs:'65vh', sm:'43vh', md:'43vh', lg:'46vh'}, padding: '25px', marginTop: '15px',  borderRadius: '8px'}}>  
                        {loading ? (
                            <>
                                <Box>
                                <Skeleton width="100%" height={80} />
                                <Skeleton width="100%" height={80} />
                                <Skeleton width="100%" height={80} />
                                <Skeleton width="100%" height={80} />
                                </Box> 
                            </>
                        ):(
                            <>
                            <Grid container justifyContent="start" sx={{ mb: 1, }}>
                                <Box>
                                <Typography variant="h5" color={'#424242'} sx={{fontSize: {xs: '21px', sm: '23px', md: '22px', lg: '23px'}, marginTop: '0.6rem', mb: 2 }} letterSpacing={2} gutterBottom>
                                Rental Fee
                                </Typography>
                                </Box>
                                
                            </Grid>  
                            <Grid container justifyContent="start"  sx={{ mb: 2, alig: 'center'}}>
                                <Grid item xs='12' >
                                    <Box  bgcolor={'#eeeeee'} display='flex' alignItems='center' mt={'-0.9rem'}> 
                                        <Grid container justifyContent='space-between'>
                                            <Grid item>
                                                <Typography variant="body1" color={'black'} sx={{ fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'},  ml: '1.2rem', mt: 1,  }} letterSpacing={2} gutterBottom>
                                                Total Amount:
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body1" color={'black'} sx={{ fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'}, mr: 1,  mt: 1,  }} letterSpacing={2} gutterBottom>
                                                {tenantInformation.rental_fee}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid> 

                            <Grid container justifyContent="start" sx={{ mb: 1 }}>
                                <Box>
                                <Typography variant="h5" color={'gray'} sx={{fontSize: {xs: '21px', sm: '23px', md: '22px', lg: '23px'}, marginTop: '0.99rem', mb: 2 }} letterSpacing={2} gutterBottom>
                                Payment
                                </Typography>
                                </Box>
                                
                            </Grid>  
                            <Grid container justifyContent="start"  sx={{ mb: 2, alig: 'center'}}>
                                <Grid item xs='12' >
                                    <Box  bgcolor={'#eeeeee'} display='flex' alignItems='center' mt={'-0.9rem'}> 
                                        <Grid container justifyContent='space-between'>
                                            <Grid item>
                                                <Typography variant="body1" color={'black'} sx={{ fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'},  ml: '1.2rem', mt: 1,  }} letterSpacing={2} gutterBottom>
                                                Total Amount:
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body1" color={'#2e7d32'} sx={{ fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'}, mr: 1,  mt: 1,  }} letterSpacing={2} gutterBottom>
                                                {tenantInformation.deposit}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box sx={{display:'flex', justifyContent:'space-between'}}>
                                        <Box></Box>
                                        <Typography variant='body1' sx={{mt:'0.1rem', fontSize:'0.9rem', color:'#424242'}}>
                                            {formatDate(paymentInfo.date)}
                                        </Typography>

                                    </Box>

                                </Grid>
                            </Grid> 

                            <Grid container justifyContent="start" sx={{ mb: 1 }}>
                                <Box>
                                <Typography variant="h5" color={'gray'} sx={{fontSize: {xs: '21px', sm: '23px', md: '22px', lg: '23px'}, marginTop: '0.4rem', mb: 2 }} letterSpacing={2} gutterBottom>
                                Balance
                                </Typography>
                                </Box>
                                
                            </Grid>  
                            <Grid container justifyContent="start"  sx={{ mb: 2, alig: 'center'}}>
                                <Grid item xs='12' >
                                    <Box  bgcolor={'#eeeeee'} display='flex' alignItems='center' mt={'-0.9rem'}> 
                                        <Grid container justifyContent='space-between'>
                                            <Grid item>
                                                <Typography variant="body1" color={'black'} sx={{fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'},  ml: '1.2rem', mt: 1,  }} letterSpacing={2} gutterBottom>
                                                Total Amount:
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body1" color={'#c62828'} sx={{fontSize: {xs: '15px', sm: '18px', md: '15px', lg: '18px'}, mr: 1,  mt: 1,  }} letterSpacing={2} gutterBottom>
                                                {totalBalanced}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid> 
                            {/* <Grid item xs={12}>
                                <Typography variant='body1' color={'gray'} sx={{fontSize: '15px', }}> 
                                    Contract Details: Tenant agrees to rent Unit A101 at ₱2,500 per month, with a lease starting January 1, 2024, and ending December 31, 2024.
                                </Typography>
                            </Grid> */}

                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>
            <Grid  container spacing={2} >
                <Grid item xs={12} md={5} lg={12}>
                    <Paper elevation={2} style={{height: {xs:'20vh', lg:'20vh'}, marginTop: '15px',  borderRadius: '8px' ,  padding: "1rem 0rem 0rem 0rem",  }}>  
                        <Grid >
                            <PaymentHistory 
                                TenantId={TenantId}
                                setLoading={setLoading}
                                loading={loading}
                            />
                        </Grid>
                    </Paper>
                </Grid>
                
            </Grid>

            <React.Fragment>
                <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                >
                <DialogTitle id="delete-dialog-title">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                    Are you sure you want to delete this item? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                    Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                    Delete
                    </Button>
                </DialogActions>
                </Dialog>

                <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={deleting}
                >
                <CircularProgress color="inherit" />
                </Backdrop>
            </React.Fragment>
        </Box>
    </>

  );
}