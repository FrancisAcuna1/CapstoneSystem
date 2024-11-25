'use client';
import React, {useState, useEffect} from "react";
import { Box, Card, Paper, Grid, Divider, useTheme, Typography } from "@mui/material";
import {
    Home as HomeIcon,
    AccountBalance as WalletIcon,
    Add as PlusIcon,
    ArrowForward as ArrowForwardIcon, SaveAlt as DepositIcon,
  } from '@mui/icons-material';
import { useCallback } from "react";



export default function IncomeBreackdownComponent({selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }){
    const theme = useTheme();
    const [income, setIncome] = useState([])


    console.log(selectedMonth);
    console.log(selectedYear);
    console.log(income)
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

    const formatCurrency = (value) => {
        if (!value) return '0.00';
        return Number(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };
    
    // const totalIncome = incomeBreakdown.reduce((sum, item) => sum + item.amount, 0);
    return(
        <Paper
            elevation={2}
            sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            height: '100%'
            }}
        >
            {/* Header */}
            <Box p={3} pb={2}>
            <Typography variant="h6" fontWeight="600">
                Income Breakdown
            </Typography>
            </Box>
    
            {/* Content */}
            <Box px={3} pb={3}>
                {/* Income Categories with Icons */}
                <Box sx={{ mb: 4 }}>
                    <Box
                        // key={index}
                        sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        '&:last-child': { mb: 0 }
                        }}
                    >
                        <Box
                        sx={{
                            mr: 2,
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: '#ECFDF5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        >
                        <HomeIcon sx={{ color: '#10B981', fontSize: 24 }} />
                        </Box>
                        <Box>
                        <Typography color="text.secondary" variant="body2">
                            Rental Fee
                        </Typography>
                        <Typography variant="h6" fontWeight="600">
                            ₱ {formatCurrency(income?.total_income?.rental_fee || '0.00')}
                        </Typography>
                        </Box>
                    </Box>
                    <Box
                        // key={index}
                        sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        '&:last-child': { mb: 0 }
                        }}
                    >
                        <Box
                        sx={{
                            mr: 2,
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: '#FFFBEB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        >
                        <WalletIcon sx={{ color: '#F59E0B', fontSize: 24 }} />
                        </Box>
                        <Box>
                        <Typography color="text.secondary" variant="body2">
                           Advanced Payment
                        </Typography>
                        <Typography variant="h6" fontWeight="600">
                            ₱ {formatCurrency(income?.total_income?.advance_payment || '0.00')}
                        </Typography>
                        </Box>
                    </Box>
                    <Box
                        // key={index}
                        sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        '&:last-child': { mb: 0 }
                        }}
                    >
                        <Box
                        sx={{
                            mr: 2,
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: '#EEF2FF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        >
                        <DepositIcon sx={{ color: '#6366F1', fontSize: 24 }} />
                        </Box>
                        <Box>
                        <Typography color="text.secondary" variant="body2">
                            Security Deposit
                        </Typography>
                        <Typography variant="h6" fontWeight="600">
                            ₱ {formatCurrency(income?.total_income?.securityDeposit || '0.00')}
                        </Typography>
                        </Box>
                    </Box>
                    <Box
                        // key={index}
                        sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        '&:last-child': { mb: 0 }
                        }}
                    >
                        <Box
                        sx={{
                            mr: 2,
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: '#EFF6FF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        >
                        <PlusIcon sx={{ color: '#3B82F6', fontSize: 24 }} />
                        </Box>
                        <Box>
                        <Typography color="text.secondary" variant="body2">
                            Other Income
                        </Typography>
                        <Typography variant="h6" fontWeight="600">
                            ₱ {formatCurrency(income?.total_income?.other_income || '0.00')}
                        </Typography>
                        </Box>
                    </Box>
                </Box>
    
            {/* Calculation Breakdown */}
                <Divider />
                <Box sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                    >
                        <Typography variant="body1" color="text.secondary">
                        Rental Fee
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                        ₱ {formatCurrency(income?.total_income?.rental_fee || '0.00')}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                    >
                        <Typography variant="body1" color="text.secondary">
                        Advance Payment
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                        ₱ {formatCurrency(income?.total_income?.advance_payment || '0.00')}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                    >
                        <Typography variant="body1" color="text.secondary">
                        Security Deposit
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                        ₱ {formatCurrency(income?.total_income?.securityDeposit || '0.00')}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
                    >
                        <Typography variant="body1" color="text.secondary">
                       Other Income
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                        ₱ {formatCurrency(income?.total_income?.other_income || '0.00')}
                        </Typography>
                    </Box>
        
                    {/* Total */}
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ArrowForwardIcon
                            sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }}
                            />
                            <Typography fontWeight="600">Total Income</Typography>
                        </Box>
                        <Typography
                            variant="h6"
                            fontWeight="700"
                            sx={{ color: '#059669' }}
                        >   
                        {selectedMonth 
                        ? <>₱ {formatCurrency(income?.total_income_by_month || '0.00')}</>
                        : <>₱ {formatCurrency(income?.total_income_by_year || '0.00')}</>
                        }
                           
                        </Typography>
                        
                    </Box>
                </Box>
    
                {/* Monthly Comparison */}
                {/* <Divider />
                <Box sx={{ pt: 2 }}>
                    <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                        vs Last Month
                        </Typography>
                        <Typography sx={{ color: '#059669' }} fontWeight="500">
                        +12.5%
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                        YTD Growth
                        </Typography>
                        <Typography sx={{ color: '#059669' }} fontWeight="500">
                        +24.8%
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                        Projection
                        </Typography>
                        <Typography sx={{ color: '#059669' }} fontWeight="500">
                        +8.3%
                        </Typography>
                    </Grid>
                    </Grid>
                </Box> */}
            </Box>
        </Paper>
    )
}