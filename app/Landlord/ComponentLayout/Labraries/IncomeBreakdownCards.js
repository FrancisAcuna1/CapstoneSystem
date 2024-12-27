'use client';
import React, {useState, useEffect, useCallback} from "react";
import { Box, Card, Paper, Grid, Divider, useTheme, Typography } from "@mui/material";
import {
    Home as HomeIcon,
    AccountBalance as WalletIcon,
    Add as PlusIcon,
    ArrowForward as ArrowForwardIcon, SaveAlt as DepositIcon,
  } from '@mui/icons-material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import useSWR from "swr";

const fetcher = async ([url, token, selectedMonth, selectedYear]) => {
    console.log(url, token, selectedMonth, selectedYear);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': "application/json",
        }, 
        body: JSON.stringify({
            month: selectedMonth,
            year: selectedYear
        })
    })
    if(!response.ok){
        throw new Error(response.statusText);
    }

    return response.json();
}



export default function IncomeBreackdownComponent({selectedMonth, selectedYear, setLoading, loading}){
    const [income, setIncome] = useState([])


    console.log(selectedMonth);
    console.log(selectedYear);
    console.log(income)
    // Sample data - replace with your actual data

    const getUserToken = () => {
        const userDataString = localStorage.getItem('userDetails');
        const userData = JSON.parse(userDataString);
        const accessToken = userData.accessToken;
        return accessToken;
    }

    const token = getUserToken();
    console.log(token);
    const endpoint = `http://127.0.0.1:8000/api/calculate_income`;
    const {data: response, error, isLoading} = useSWR(
        token && selectedMonth && selectedYear ? [endpoint, token, selectedMonth, selectedYear] : null,
        fetcher, {
            refreshInterval: 1000,
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            errorRetryCount: 3,
            onLoadingSlow: () => setLoading(true),
        }
    );

    console.log(error)
    console.log(response || '')

    useEffect(() => {
        if (response){
            const incomeDetails = response || '';
            console.log(response);
            setIncome(response);
            setLoading(false);
        }else if(isLoading){
            setLoading(true);
        }
    }, [response, isLoading, setLoading])
   

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
                        <AttachMoneyIcon sx={{ color: '#10B981', fontSize: 24 }} />
                        </Box>
                        <Box>
                        <Typography color="text.secondary" variant="body2">
                            Initial Payment
                        </Typography>
                        <Typography variant="h6" fontWeight="600">
                            ₱ {formatCurrency(income?.total_income?.initial_payment || '0.00')}
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
                            backgroundColor: '#f1f8e9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        >
                        <HomeIcon sx={{ color: '#8bc34a', fontSize: 24 }} />
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
                        Initial Payment
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                        ₱ {formatCurrency(income?.total_income?.initial_payment || '0.00')}
                        </Typography>
                    </Box>
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
                        ₱ {formatCurrency(income?.totalIncome || '0.00')}
                           
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 1, pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ArrowForwardIcon
                            sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }}
                            />
                            <Typography fontWeight="600">Total Expenses</Typography>
                        </Box>
                        <Typography
                            variant="h6"
                            fontWeight="700"
                            sx={{ color: '#059669' }}
                        >   
                        ₱ {formatCurrency(income?.totalExpenses || '0.00')}
                        {/* {selectedMonth 
                        ? <>₱ {formatCurrency(income?.total_income_by_month || '0.00')}</>
                        : <>₱ {formatCurrency(income?.total_income_by_year || '0.00')}</>
                         
                        } */}
                           
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 2, p:1, display: 'flex', justifyContent: 'space-between', borderRadius:1,  borderTop: '1px solid', borderColor: 'divider', alignItems: 'center', backgroundColor: '#E3F9F1' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccountBalanceWalletOutlinedIcon fontSize="medium" sx={{color:'#2196f3', mr:1}}/>
                            <Typography fontWeight="600">Net Income</Typography>
                        </Box>
                        <Typography
                            variant="h6"
                            fontWeight="700"
                            sx={{ color: '#059669' }}
                        >   
                         ₱ {formatCurrency(income?.total || '0.00')}
                           
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    )
}