'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DialogContent, useMediaQuery, useTheme, Divider, Grid, Button, Box, Paper, Dialog, DialogTitle, Avatar, Typography, Stack, IconButton, CircularProgress} from '@mui/material';
import { format, parseISO, formatDistance } from 'date-fns';



const NotificationsDialog = ({ open}) => {
    const [loading, setLoading] = useState(false);
    const [unreadNotification, setUndreadNotification] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    console.log('Data:', unreadNotification);
    


    const fetchedNotifications = useCallback(async() => {
        const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
        const userData = JSON.parse(userDataString); // parse the datastring into json 
        const accessToken = userData.accessToken;
        setLoading(true);

        if(accessToken){
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/getnotifications`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    }
                })
                const data = await response.json();
                if(response.ok){
                    console.log('Data', data.notifications);
                    setUndreadNotification(data.notifications);
                    setLoading(false);
                }else{
                    console.log('Error', response.statusText);
                    console.log('Error',  error.message);
                    setLoading(false);
                    
                }
            }catch(error){
                console.error('Error', error);
                setLoading(false);
            }
            finally {
                setLoading(false);
            }
        }else{
            console.log('No token found')
            setLoading(false);
        }
    }, [])


       
    const handleMarkAsRead = async(id) => {
        const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
        const userData = JSON.parse(userDataString); // parse the datastring into json 
        const accessToken = userData.accessToken;
        // setLoading(true);
        if(accessToken){
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/notifications/${id}/read`,{
                    method:'POST',
                    headers:{
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    }
                })
                const data = await response.json()
                if(response.ok){
                    console.log('Data', data);
                    // setLoading(false)
                    setUndreadNotification(prevNotifications => 
                        prevNotifications.filter(notification => notification.id !== id)
                    );
                }else{
                    console.log('Error', response.status);
                    console.log('Error', error.message);
                }
            }catch(error){

            }
        }else{
            console.log('No access token found');
            
        }
    }

     // Initial fetch and periodic refresh
    useEffect(() => {
        // Initial fetch
        fetchedNotifications();
        const intervalId = setInterval(fetchedNotifications, 60000); // 1 minute
        return () => clearInterval(intervalId);
    }, [fetchedNotifications]);
    
    console.log(unreadNotification?.notifiable_type);

    const calculateDuration = (created_at) => {
        try{
            return formatDistance(parseISO(created_at), new Date(),{
                addSuffix: true, 
            })
        }catch(error){
            console.error('Error', error);
            return 'Just now';
        }
    }

    

    return (
        <Paper 
        elevation={5} 
        sx={{
          width: '100%',
          maxHeight: isMobile ? 'calc(100vh - 56px)' : '400px',
          overflowY: 'auto',
        }}
        >
        <Typography variant="h6" sx={{ p: 2, fontWeight: 550, color: '#263238' }}>
          Notifications
        </Typography>
        <Divider />
        {loading ? 
            (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
            ) : unreadNotification.length > 0 
            ? ( unreadNotification.map((notification, index) => (
                <Box
                key={index}
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    p: 2,
                    borderBottom: '1px solid #eee',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                }}
                >
                <Avatar
                    sx={{
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    mr: 2,
                    fontSize:'16px'
                    }}
                >
                    {`${notification.data.sender_firstname.charAt(0).toUpperCase()}${
                    notification.data.sender_lastname.charAt(0).toUpperCase()
                    }`}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    {/* <Typography variant="body1" sx={{ fontWeight: 550, color: '#263238' }}>
                    {notification.data.sender_firstname} {notification.data.sender_lastname}
                    </Typography> */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 550, color: '#263238' }}>
                        {notification.data.sender_firstname} {notification.data.sender_lastname}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {calculateDuration(notification.created_at)}
                        </Typography>
                    </Box>
                    <Typography 
                    variant="body2" 
                    sx={{ 
                        color: '#424242', 
                        maxWidth: '300px', 
                        overflow: 'hidden', 
                        display: '-webkit-box', 
                        WebkitBoxOrient: 'vertical', 
                        WebkitLineClamp: 2, // Limit to 2 lines
                      
                    }}
                    >
                    {notification.data.message}
                    </Typography>
                    <Button 
                    onClick={() => handleMarkAsRead(notification.id)}
                    size="small" 
                    sx={{ 
                        mt: 0.4, 
                        color:'#4caf50',
                        ":hover":{background:'#c8e6c9'},
                        ml:'-0.3rem',
                        fontWeight:'500'
                    }}
                    >
                    Mark as read
                    </Button>
                </Box>
                </Box>
            ))
            ) : (
            <Typography sx={{ p: 2, textAlign: 'center' }}>
                No new notifications
            </Typography>
        )}
      </Paper>
    );
};

export default NotificationsDialog;