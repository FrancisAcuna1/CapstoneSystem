'use client';

import React, {useState, useEffect, useCallback} from "react";
import { Box, Grid, Card, Typography, CardContent, CardHeader, CardActionArea, CardActions } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';


export default function IncomeCards({selectedMonth, selectedYear, setLoading}){
    const [income, setIncome] = useState([])
    const [IncomeStats, setIncomeStats] = useState([]);

    console.log(selectedMonth);
    console.log(selectedYear);
    console.log(income);
    console.log(IncomeStats);
    // Sample data - replace with your actual data


    const fetchIncome = useCallback( async (selectedMonth, selectedYear) => {
        const userDataString = localStorage.getItem('userDetails');
        const userData = JSON.parse(userDataString);
        const accessToken = userData.accessToken;

        if(accessToken){
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/calculate_income`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept' : 'application/json',
                    }, 
                    body: JSON.stringify({
                        month: selectedMonth,
                        year: selectedYear
                    })
                })
                const data = await response.json();
                console.log(data.year)
                console.log(data.month)
                console.log(data)
                if(response.ok){
                    setIncome(data)
                }else{
                    console.log('Error', data.error)
                    console.log('Error', data.message)
                }
            }catch(error){
                console.log(error)
            }
        }else{
            console.log('No access token found!')
        }

    }, [])

    useEffect(() => {
        fetchIncome(selectedMonth, selectedYear);
    }, [fetchIncome, selectedMonth, selectedYear]);

    const fetchData = useCallback(async(selectedYear) => {
        const userDataString = localStorage.getItem('userDetails');
        const userData = JSON.parse(userDataString);
        const accessToken = userData.accessToken;

        if(accessToken){
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/income_statistic`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept' : 'application/json',
                    }, 
                    body: JSON.stringify({
                        year: selectedYear
                    })
                })
                const data = await response.json();
                console.log(data.year)
                console.log(data.month)
                console.log(data)
                if(response.ok){
                    setIncomeStats(data.data)
                }else{
                    console.log('Error', data.error)
                    console.log('Error', data.message)
                }
            }catch(error){
                console.log(error)
            }
        }else{
            console.log('No access token found!')
        }
    }, [])

    useEffect(() => {
        fetchData(selectedYear);
    }, [fetchData, selectedYear])




    const formatCurrency = (value) => {
        if (!value) return '0.00';
        return Number(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };



    return(
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card  sx={{display: 'flex', flexDirection: 'column', padding: 0, backgroundColor:'#ECFDF5' }} elevation={2}>
                        <CardContent sx={{ padding: '22px', flexGrow: 1 }}>
                           <Box sx={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                                <Typography variant="body1" letterSpacing={1} component={'div'}  sx={{color:'#424242', alignItems: 'center',}} gutterBottom>
                                    Total Income
                                </Typography>
                                <PaidOutlinedIcon fontSize="large" sx={{color:'#10B981'}}/>
                           </Box>
                            <Typography variant="h5" component={'div'}>
                                {selectedMonth 
                                ? <> ₱ {formatCurrency(income?.total_income_by_month || '0.00')}</>
                                : <> ₱ {formatCurrency(income?.total_income_by_year || '0.00')}</>
                                }
                            </Typography>
                        </CardContent>
                        <CardActions
                            sx={{
                            backgroundColor: '#10B981', // Adjust this color to match your design
                            color: '#fff', // Text color inside the footer
                            textAlign: 'center',
                            padding: '4px',
                            width: '100%',
                            height: '100%'
                          // Ensures full width of the card
                            }}
                        >
                            
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card sx={{display: 'flex', flexDirection: 'column', padding: 0 }} elevation={2}>
                        <CardContent sx={{ padding: '22px', flexGrow: 1, backgroundColor:'#FFFBEB'}}>
                            <Box sx={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                                <Typography variant="body1" letterSpacing={1} component={'div'} sx={{color:'#424242'}} gutterBottom>
                                    Average Monthly
                                </Typography>
                                <AccountBalanceWalletOutlinedIcon fontSize="large" sx={{color:'#F59E0B'}}/>
                           </Box>
                            <Typography variant="h5" letterSpacing={1} component={'div'}>
                                ₱ {formatCurrency(IncomeStats?.averageIncome || '0.00')}
                            </Typography>
                        </CardContent>
                        <CardActions
                            sx={{
                            backgroundColor: '#F59E0B', // Adjust this color to match your design
                            color: '#fff', // Text color inside the footer
                            textAlign: 'center',
                            padding: '4px',
                            width: '100%',
                            height: '100%'
                          // Ensures full width of the card
                            }}
                        >
                            
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card sx={{display: 'flex', flexDirection: 'column', padding: 0, backgroundColor:'#EFF6FF'}} elevation={2}>
                        <CardContent sx={{ padding: '22px', flexGrow: 1 }}>
                            <Box sx={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                                <Typography variant="body1" letterSpacing={1} component={'div'} sx={{color:'#424242'}} gutterBottom>
                                    Highest Month
                                </Typography>
                                <InsightsOutlinedIcon fontSize="large" sx={{color:'#3B82F6'}}/>
                           </Box>
                            <Typography variant="h5" component={'div'}>
                                ₱ {formatCurrency(IncomeStats?.highestIncome || '0.00')}
                            </Typography>
                        </CardContent>
                        <CardActions
                            sx={{
                            backgroundColor: '#3B82F6', // Adjust this color to match your design
                            color: '#fff', // Text color inside the footer
                            textAlign: 'center',
                            padding: '4px',
                            width: '100%',
                            height: '100%'
                          // Ensures full width of the card
                            }}
                        >
                            
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card sx={{display: 'flex', flexDirection: 'column', padding: 0 }} elevation={2}>
                        <CardContent sx={{ padding: '22px', flexGrow: 1, backgroundColor:'#FEF2F2' }}>
                            <Box sx={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                                <Typography variant="body1" letterSpacing={1} component={'div'} sx={{color:'#424242'}} gutterBottom>
                                    Lowest Month
                                </Typography>
                                <TrendingDownOutlinedIcon color="error" fontSize="large"/> 
                           </Box>
                            <Typography variant="h5" component={'div'}>
                            ₱ {formatCurrency(IncomeStats?.lowestIncome || '0.00')}
                            </Typography>
                        </CardContent>
                        <CardActions
                            sx={{
                            backgroundColor: '#EF4444', // Adjust this color to match your design
                            color: '#fff', // Text color inside the footer
                            textAlign: 'center',
                            padding: '4px',
                            width: '100%',
                            height: '100%'
                          // Ensures full width of the card
                            }}
                        >
                            
                        </CardActions>
                    </Card>
                  
                </Grid>
            </Grid>

        
        </Box>
    )
}