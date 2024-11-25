'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Skeleton, Grid, Chip, Card, CardMedia, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import LocalPostOfficeOutlinedIcon from '@mui/icons-material/LocalPostOfficeOutlined';
import { format, parseISO } from 'date-fns';

const MaintenanceRequestDialog = ({ open, handleClose, scroll = 'paper', setSuccessful, setError, loading, setLoading, viewRequest}) => {
    const itemId = viewRequest.id;

    const handleAcceptMaitenance = async () => {
        const userDataString = localStorage.getItem('userDetails');
        const userData = JSON.parse(userDataString); // Parse JSON
        const accessToken = userData.accessToken; // 

        if(accessToken){
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/accept_maintenance/${itemId}`,{
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    }
                })
                const data = await response.json()

                if(response.ok){
                    localStorage.setItem('successMessage', data.message || 'Operation Sucess!');
                    window.location.reload();
                }else{
                    if(data.error){
                        handleClose()
                        console.log(data.error)
                        localStorage.setItem('errorMessage', data.message || 'Operation Error!');
                        window.location.reload();
                        setLoading(false)
                    }else{
                        handleClose()
                        console.log(data.message);
                        localStorage.setItem('errorMessage', data.message || 'Operation Error!');
                        window.location.reload();
                        setLoading(false)
                    }
                }
            }catch(error){
                console.error('Error fetching user data:', error);
                setLoading(false)
                handleClose()
            }
        }else{
            console.log('No user Found')
            setLoading(false)
            handleClose()
        }
       
    }

    const handleReject = async() => {
        const userDataString = localStorage.getItem('userDetails');
        const userData = JSON.parse(userDataString); // Parse JSON
        const accessToken = userData.accessToken; // 
        setLoading(true)
        if(accessToken){
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/rejected_maintenance/${itemId}`,{
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    }
                })
                const data = await response.json()
                if(response.ok){
                    localStorage.setItem('successMessage', data.message || 'Operation Sucess!');
                    window.location.reload();
                    handleClose()
                    setLoading(false)
                }else{
                    localStorage.setItem('errorMessage', error.message || 'Operation Sucess!');
                    window.location.reload();
                    handleClose()
                    setLoading(false)
                }


            }catch(error){
                console.error('Error fetching user data:', error.message);
                handleClose()
                setLoading(false)
            }
        }else{
            console.log('No user Found')
        }
        
    }

    useEffect(() => {
        const successMessage = localStorage.getItem('successMessage');
        const errorMessage = localStorage.getItem('errorMessage')
        if (successMessage) {
          setSuccessful(successMessage);
          setTimeout(() => {
            localStorage.removeItem('successMessage');
          }, 3000);
        }
    
        if(errorMessage){
          setError(errorMessage);
          setTimeout(() => {
            localStorage.removeItem('errorMessage');
          }, 3000);
        }
    
      
    }, [setError, setSuccessful]);

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
    console.log('Images:',  viewRequest?.maintenance_images);

    

    const images = viewRequest?.maintenance_images && viewRequest?.maintenance_images || []; 
    console.log('images:', images);
    const imageBaseUrl = 'http://127.0.0.1:8000/MaintenanceImages/';// Adjust this based on your API endpoint

    return (
        <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        maxWidth="md"
        fullWidth
        aria-labelledby="maintenance-request-dialog"
        >
        <DialogTitle className="bg-blue-50">
            <div className="flex justify-between items-center">
            <Box sx={{display:'flex', justifyContent:'space-between'}}>
            <Typography variant="h6" component="div" letterSpacing={1} sx={{color:'#263238', fontSize:'22px', fontWeight:'500'}}>
                Maintenance Request Details
            </Typography>
            <IconButton onClick={handleClose}  sx={{'&:hover':{backgroundColor:'#263238'}, height:'35px',width:'35px',}}>
                <CloseIcon sx={{transition: 'transform 0.3s ease-in-out','&:hover': {transform: 'rotate(90deg)', color:'#fefefe'}, }} />
            </IconButton>
            </Box>
            <Chip 
                label={viewRequest?.status?.toUpperCase()} 
                color={viewRequest?.status === 'pending' ? 'warning' : 'success'}
                size="small"
            />
            </div>
        </DialogTitle>

        <DialogContent dividers={scroll === 'paper'}>
            {loading ? (
            <Box className="space-y-4">
                <Skeleton animation="wave" height={60} />
                <Skeleton animation="wave" height={40} />
                <Skeleton animation="wave" height={100} />
                <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Skeleton animation="wave" height={200} />
                </Grid>
                <Grid item xs={6}>
                    <Skeleton animation="wave" height={200} />
                </Grid>
                </Grid>
            </Box>
            ) : (
            <Box className="space-y-6">
                {/* Tenant Information */}
           
                    <Box sx={{display:'flex', justifyContent:'space-between'}}>
                        <Typography variant="body1" gutterBottom sx={{color:'#263238', fontSize:'22px', fontWeight:'550'}}>
                            {viewRequest?.tenant?.firstname} {viewRequest?.tenant?.lastname}
                        </Typography>
                        <Box>
                        <Typography variant="body2" color="text.secondary" fontSize={{xs:'0.6rem', lg:'0.8rem'}}>
                            Date Reported
                        </Typography>
                        <Typography variant="body1" className="font-medium"  fontSize={{xs:'0.8rem', lg:'0.99rem'}}>
                            {formatDate(viewRequest?.date_reported)}
                        </Typography>
                        </Box>
                    </Box>
               
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PhoneInTalkOutlinedIcon sx={{ color: '#263238', fontSize: '1.2rem' }} />
                  <Typography variant="body2" sx={{ color: '#263238', fontSize: '1rem' }}>
                    : {viewRequest?.tenant?.contact}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LocalPostOfficeOutlinedIcon sx={{ color: '#263238', fontSize: '1.2rem' }} />
                  <Typography variant="body2" sx={{ color: '#263238', fontSize: '1rem' }}>
                    : {viewRequest?.tenant?.email}
                  </Typography>
                </Box>
           

                {/* Maintenance Details */}
                <Box>
                <Typography variant="body2" color="#424242" sx={{mt:5, fontWeight:'550', fontSize:'0.9rem'}} gutterBottom>
                    MAINTENANCE DETAILS:
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                    <Typography variant="body1" color="#424242" gutterBottom sx={{ fontSize:'0.99rem'}}>
                        Reported Issue:  {viewRequest?.item_name}
                    </Typography>
                    </Grid>
                </Grid>
                </Box>

                {/* Description */}
                <Box>
                <Typography variant="subtitle1" color="#424242" sx={{mt:3, fontWeight:'550', fontSize:'0.9rem'}} gutterBottom>
                    DESCRIPTION:
                </Typography>
                <Typography variant="body1" className="bg-gray-50 p-4 rounded-lg">
                    {viewRequest?.issue_description}
                </Typography>
                </Box>

                {/* Images */}
                {viewRequest?.maintenance_images && viewRequest.maintenance_images.length > 0 && (
                <Box sx={{mb:3}}>
                    <Typography variant="subtitle2" color="#424242" sx={{mt:5, fontWeight:'550', fontSize:'0.9rem'}} gutterBottom>
                    ATTACHED IMAGES
                    </Typography>
                    <Grid container spacing={2}>
                    {viewRequest.maintenance_images.map((image, index) => (
                        <Grid item xs={12} sm={6} key={image.id}>
                        <Card className="relative">
                            <CardMedia
                            component="img"
                            height="300"
                            image={`${imageBaseUrl}${image.image_path}`}
                            alt={`Maintenance Image ${index + 1}`}
                            className="object-cover h-48 w-full"
                           
                            />
                        </Card>
                        </Grid>
                    ))}
                    </Grid>
                </Box>
                )}
            </Box>
            )}
        </DialogContent>

        <DialogActions className="bg-gray-50">
            <Button 
            color="error"
            variant='outlined'
            onClick={() => handleReject()} 
            >
            Reject
            </Button>
            <Button 
            onClick={() => handleAcceptMaitenance()} 
            variant="contained" 
            sx={{
                backgroundColor:"#4caf50",
                '&:hover':{backgroundColor: '#66bb6a'}
            }}
            >
            Accept Request
            </Button>
        </DialogActions>
        </Dialog>
    );
};

export default MaintenanceRequestDialog;