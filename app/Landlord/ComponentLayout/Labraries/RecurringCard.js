'use client'

import React, {useState, useEffect} from "react"
import {Card, CardContent, CardHeader, Typography, Box, Alert, AlertTitle, Button, Paper, Grid, Skeleton, Chip} from '@mui/material';
import { 
CalendarToday as CalendarIcon,
Info as AlertIcon 
} from '@mui/icons-material';
import {addMonths, subMonths, differenceInMonths, parseISO, format, isBefore, parse} from 'date-fns';

export default function RecurringCardComponent({setLoading, loading, setSuccessful, successful, setError, error}){
    const [recurringExpenses, setRecurringExpenses] = useState([]);
    console.log(recurringExpenses)
    useEffect(() => {
        const fetchRecurringData = async() => {
            const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
            const userData = JSON.parse(userDataString); // parse the datastring into json 
            const accessToken = userData.accessToken;
            setLoading(true)
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/get_recurring_expenses`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                const data = await response.json();
                if(response.ok){
                    setRecurringExpenses(data.data);
                    setLoading(false)
                }else{
                    console.log("Error", data.error)
                    setLoading(false)
                }
            }catch(error){
                console.log(error)
                setLoading(false)
            }
        }
        fetchRecurringData();
    }, [setRecurringExpenses, setLoading])

    const nextGeneratedDate = recurringExpenses.reduce((acc, expenses) => {
        const endDate = parseISO(expenses.endDate);
        const currentDate = new Date(); // Current date
        let nextDate

        if(expenses.last_generated_date){
            const lastGeneratedDate = parseISO(expenses.last_generated_date);
            nextDate = addMonths(lastGeneratedDate, 1);
        }else{
            const startDate = parseISO(expenses.startDate);
            nextDate = startDate;
        }

        if(isBefore(nextDate, endDate) || nextDate.getTime() === endDate.getTime()){
            acc[expenses.id] = format(nextDate, 'MMMM, d, yyyy')
        }else{
            acc[expenses.id] = null; //return null when it is a lastdate
        }
        return acc;
    }, {})


    // const nextDate = addMonths(getLastGeneratedDate, 1)
    // console.log(nextDate)

    return(
    <Box>
        <Card>
            <CardHeader 
            title={
                <Typography variant="h6">
                Recurring Expenses Configuration
                </Typography>
            }
            />
            <CardContent>
            <Alert 
                severity="info" 
                icon={<AlertIcon />}
                sx={{ mb: 3 }}
            >
                <AlertTitle>Automatic Generation</AlertTitle>
                Expenses will be automatically generated based on the frequency settings.
            </Alert>
            {loading ? (
            <Box width="100%">
                <Skeleton animation="wave" variant="rectangular" height={60} />
                <Skeleton animation="wave" width="100%" height={30} />
                <Skeleton animation="wave" width="100%" height={30} />
                <Skeleton animation="wave" width="100%" height={30} />
            </Box>  
            ):(
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recurringExpenses.map((expense, index) => {
                    return(
                    <Paper 
                        key={index} 
                        variant="outlined"
                        sx={{ p: 2 }}
                    >
                        <Grid container justifyContent="space-between" alignItems="flex-start">
                        <Grid item>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500,fontSize:'18px' }}>
                            {expense.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom sx={{fontSize:'15px'}}>
                            {expense.unit.apartment_name || expense.unit.boarding_house_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary"  gutterBottom sx={{fontSize:'15px'}}>
                                {expense.category}
                            </Typography>
                        </Grid>
                        <Grid item textAlign="right">
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, fontSize:'19px' }}>
                            ₱ {expense.amount}
                            </Typography>
                            {/* <Typography variant="body2" color="text.secondary" gutterBottom sx={{fontSize:'15px'}}>
                            {expense.frequency}
                            </Typography> */}
                            <Chip
                            label={expense.frequency}
                            variant="contained"
                            sx={{
                                backgroundColor: expense.frequency === 'monthly' ? '#fff3e0' : expense.frequency === 'daily' ? '#fbe9e7' : expense.frequency === 'weekly' ? '#e3f2fd' : expense.frequency === 'quarterly' ? '#fff8e1' : expense.frequency === 'yearly' ? '#e8eaf6' : '',
                                color: expense.frequency === 'monthly' ? '#ffa726' : expense.frequency === 'daily' ? '#ff7043' : expense.frequency === 'weekly' ? '#1e88e5' : expense.frequency === 'quarterly' ? '#ffca28' : expense.frequency === 'yearly' ? '#3f51b5' : '',
                            }}
                            />
                        </Grid>
                        </Grid>
    
                        <Box 
                        sx={{ 
                            mt: 2, 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                        >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarIcon 
                            sx={{ 
                                fontSize: 18, 
                                mr: 1, 
                                color: 'text.secondary' 
                            }} 
                            />
                            {nextGeneratedDate[expense.id] ? (
                                <Typography variant="body2" color="success">
                                Next generation: {nextGeneratedDate[expense.id]}
                                </Typography>
                            ):(
                                <Typography variant="body2" color="error">
                                Recurring Expenses Ended
                                </Typography>
                            )}
                       </Box>
                        <Button 
                            variant="outlined" 
                            size="small"
                            sx={{ 
                            textTransform: 'none',
                            backgroundColor: '#263238', 
                            letterSpacing: 0.2,
                            color: 'white', 
                            // minWidth: 100,
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', // Added shadow
                            '&:hover': {
                            backgroundColor: '#37474f', // Slight color change on hover
                            boxShadow: '0 6px 8px rgba(0,0,0,0.15)' // Slightly enhanced shadow on hover
                            }
                            }}
                        >
                            Edit
                        </Button>
                        </Box>

                        
                    </Paper>
                    )
                })}
            </Box>
            )}

            
            </CardContent>
        </Card>
    </Box>
    )
}