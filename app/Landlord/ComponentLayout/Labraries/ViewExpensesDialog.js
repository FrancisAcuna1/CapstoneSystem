'use client';
import React, {useEffect, useState, useCallback} from "react";
import {Box, Paper, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton} from "@mui/material";
import {Home, Category, AttachMoney, CalendarToday} from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import { format, parseISO } from "date-fns";
import Image from "next/image";


export default function ViewExpensesDialog({open, handleClose, viewExpensesId}){
    const [expensesDetails, setExpensesDetails] = useState([]);

    console.log(viewExpensesId);
    console.log(expensesDetails)

    useEffect(() => {
        const fetchExpensesDetails = async () => {
            const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
            const userData = JSON.parse(userDataString); // parse the datastring into json 
            const accessToken = userData.accessToken;
            if(accessToken){
                try{
                    const response = await fetch(`http://127.0.0.1:8000/api/edit/${viewExpensesId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
                    const data = await response.json();
                    if(response.ok){
                        setExpensesDetails(data.data);
                    }else{
                        console.log(data.message);
                    }
                }catch(error){  
                    console.log('error');
                }
            }else{
                console.log('No Access Token Found!');
            }
        }
        fetchExpensesDetails();
    }, [viewExpensesId])

    const formatDate = (dateString) => {
        if (!dateString) {
          return null;
        }
    
        try {
          const parseDate = parseISO(dateString);
          return format(parseDate, "MMMM d, yyyy");
        } catch (error) {
          console.log("Error formating Date:", error);
          return dateString;
        }
      };
    return(
        <React.Fragment>
            <Dialog 
            fullWidth={true}
            maxWidth={'sm'}
            open={open}
            onClose={handleClose}
            >
                <DialogTitle backgroundColor={'#8785d0'} color={'white'}>Expenses Details</DialogTitle>
                <IconButton onClick={handleClose}  sx={{'&:hover':{backgroundColor:'#fefefe'}, position: 'absolute', right: 8, top: 12, height:'35px',width:'35px',}}>
                <CloseIcon sx={{color: '#fefefe', transition: 'transform 0.3s ease-in-out','&:hover': {transform: 'rotate(90deg)', color:'#263238'}, }} />
                </IconButton>
                <DialogContent dividers>
                {expensesDetails && (
                <Box sx={{ p: 1 }}>
                    {/* Basic Information */}
                    <Paper variant="outlined" sx={{p:2, mb:2, backgroundColor: '#e3f2fd'}}>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                        <Home color="action" />
                        <Box>
                            <Typography variant="caption" color="textSecondary">
                            Unit Type
                            </Typography>
                            <Typography variant="body1">
                            {expensesDetails.unit_type}
                            </Typography>
                        </Box>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                        <Category color="action" />
                        <Box>
                            <Typography variant="caption" color="textSecondary">
                            Category
                            </Typography>
                            <Typography variant="body1">
                            {expensesDetails.category}
                            </Typography>
                        </Box>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                        <AttachMoney color="action" />
                        <Box>
                            <Typography variant="caption" color="textSecondary">
                            Amount
                            </Typography>
                            <Typography variant="body1">
                            ${parseFloat(expensesDetails.amount).toFixed(2)}
                            </Typography>
                        </Box>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                        <CalendarToday color="action" />
                        <Box>
                            <Typography variant="caption" color="textSecondary">
                            Date
                            </Typography>
                            <Typography variant="body1">
                            {expensesDetails.expense_date && formatDate(expensesDetails.expense_date)}
                            </Typography>
                        </Box>
                        </Box>
                    </Grid>
                    </Grid>
                    </Paper>

                    {/* Description */}
                    <Paper variant="outlined" sx={{ p: 2, mb: 3, backgroundColor: '#e3f2fd' }}>
                    <Box display="flex" alignItems="flex-start" gap={1}>
                        
                        <Box>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Description:
                        </Typography>
                        <Typography variant="body1">
                            {expensesDetails.description}
                        </Typography>
                        </Box>
                    </Box>
                    </Paper>

                    {/* Images */}
                    {expensesDetails.expenses_images && expensesDetails.expenses_images.length > 0 && (
                    <Box>
                        <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                        Receipts/Images
                        </Typography>
                        <Grid container spacing={2}>
                        {expensesDetails.expenses_images.map((image) => (
                            <Grid item xs={12} sm={6} key={image.id}>
                            <Paper 
                                variant="outlined" 
                                sx={{ 
                                position: 'relative',
                                paddingTop: '56.25%', // 16:9 Aspect Ratio
                                overflow: 'hidden'
                                }}
                            >
                                <Image
                                src={`http://127.0.0.1:8000/MaintenanceImages/${image.image_path}`}
                                alt="Expense receipt"
                                width={300}
                                height={300}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                                />
                            </Paper>
                            </Grid>
                        ))}
                        </Grid>
                    </Box>
                    )}
                </Box>
                )}
                </DialogContent>
                <DialogActions>
                <Button variant="contained" onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}