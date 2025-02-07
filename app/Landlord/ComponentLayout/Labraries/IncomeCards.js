'use client'
import React, { useState, useEffect, useCallback} from "react";
import { 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Fade,
  useTheme
} from "@mui/material";
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined';
import TrendingDownOutlined from '@mui/icons-material/TrendingDownOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { styled } from '@mui/material/styles';
import useSWR from "swr";

// Custom styled components
const StyledCard = styled(Card)(({ theme, color }) => ({
  height: '100%',
  background: `linear-gradient(135deg, ${color}08 0%, ${theme.palette.background.paper} 100%)`,
  transition: 'all 0.3s ease-in-out',
  border: '1px solid',
  borderColor: `${color}20`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px ${color}20`,
    borderColor: `${color}40`,
  },
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  backgroundColor: `${color}15`,
  borderRadius: '12px',
  padding: theme.spacing(1.5),
  height: '46px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: `${color}25`,
  },
}));

const ValueChangeIndicator = styled(Box)(({ theme, positive }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 8px',
  borderRadius: '6px',
  backgroundColor: positive ? theme.palette.success.light + '20' : theme.palette.error.light + '20',
  color: positive ? theme.palette.success.main : theme.palette.error.main,
  fontSize: '0.75rem',
  fontWeight: 600,
  marginLeft: theme.spacing(1),
}));


const fetcherIncome = async ([url, token, selectedMonth, selectedYear]) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            month: selectedMonth,
            year: selectedYear
        })
    })
    if(!response.ok){
        throw new Error(response.statusText)
    }
    return response.json();
}

const fetcherIncomeStats = async ([url, token, selectedYear]) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            year: selectedYear
        })
    })
    if(!response.ok){
        throw new Error(response.statusText)
    }
    return response.json();
}

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable


export default function IncomeCards({selectedMonth, selectedYear, setLoading, loading}){
    const [income, setIncome] = useState([])
    const [IncomeStats, setIncomeStats] = useState([]);
    const [hoveredCard, setHoveredCard] = useState(null);
    const theme = useTheme();

    console.log(selectedMonth);
    console.log(selectedYear);
    console.log(income);
    console.log(IncomeStats);
    console.log(loading)
    // Sample data - replace with your actual data
    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

    const highestMonthValue = IncomeStats.months?.highestMonths;
    const lowestMonthValue = IncomeStats.months?.lowestMonths;

    const highestMonthLabel = months.find(month => month.value === highestMonthValue)?.label;
    const lowestMonthLabel = months.find(month => month.value === lowestMonthValue)?.label;

    console.log(highestMonthLabel)
    
    const getUserToken = () => {
        const userDataString = localStorage.getItem('userDetails');
        const userData = JSON.parse(userDataString);
        const accessToken = userData.accessToken;
        return accessToken;
    }

    const token = getUserToken();
    const {data: incomeResponse, error: incomeError, isLoading: incomeLoading} = useSWR(
        token && selectedMonth && selectedYear ? [`${API_URL}/calculate_income`, token, selectedMonth, selectedYear] : null,
        fetcherIncome, {
            refreshInterval: 60000,
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            errorRetryCount: 3,
            onLoadingSlow: () => setLoading(true),
        }
    )
    console.log(incomeError);

    useEffect(() => {
        if(incomeResponse){
            setIncome(incomeResponse);
            setLoading(false);
        }else if(incomeLoading){
            setLoading(true);
        }
    }, [incomeResponse, incomeLoading, setLoading]);

    const {data: statsResponse, error: statsErros, isLoading: statsloading} = useSWR(
        token && selectedMonth && selectedYear ? [`${API_URL}/income_statistic`, token, selectedYear] : null,
        fetcherIncomeStats, {
            refreshInterval: 5000,
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            errorRetryCount: 3,
            onLoadingSlow: () => setLoading(true),
        }
    )

    console.log(statsErros);
    useEffect(() => {
        if(statsResponse?.data){
            setIncomeStats(statsResponse?.data);
            setLoading(false);
        }else if(statsloading){
            setLoading(true);
        }
    }, [statsResponse, statsloading, setLoading])

    const formatCurrency = (value) => {
        if (!value) return '0.00';
        return Number(value).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const cards = [
        {
            title: 'Highest Income Month',
            value: IncomeStats.currentYear?.highestIncome,
            icon: TrendingUpOutlined,
            color: theme.palette.success.main,
            tooltip: 'Highest income record in the selected period',
            subtitle: highestMonthLabel,
            change: IncomeStats.highestIncomeChange?.type === 'Increase' 
            ? `+${IncomeStats.highestIncomeChange?.percentage}%`
            : `${IncomeStats.highestIncomeChange?.percentage}%`,
            positive: IncomeStats.highestIncomeChange?.type === 'Increase' ? true : false,
        },
        {
            title: 'Lowest Income Month',
            value: IncomeStats.currentYear?.lowestIncome,
            icon: TrendingDownOutlined,
            color: theme.palette.error.main,
            tooltip: 'Lowest income recorded in the selected period',
            subtitle: lowestMonthLabel,
            change: IncomeStats.lowestIncomeChange?.type === 'Increase'
            ? `+${IncomeStats.lowestIncomeChange?.percentage}%`
            : `${IncomeStats.lowestIncomeChange?.percentage}%`,
            positive: IncomeStats.lowestIncomeChange?.type === 'Increase' ? true : false,
        },
    ];
    const NetCard = [
        {
            title: 'Net Income',
            value: income.total,
            icon: AccountBalanceWalletOutlined,
            color: theme.palette.primary.main,
            tooltip: 'Sum of all income for the selected period',
            change: income.percentageChangeType === 'Increase'
            ? `+${income?.percentage}%`
            : `${income?.percentage}%`,
            positive:  income.percentageChangeType === 'Increase' ? true : false,
            subtitle1: selectedMonth === 'all' ? `vs last year` : 'vs last month',
        },
    ]

    return(
        <Box>
            <Grid container spacing={3}>
         
            {NetCard.map((item, index) => (
                <Grid key={index} item xs={12} sm={4}>
                    <StyledCard 
                    color={item.color}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    >
                    <CardContent sx={{ height: '100%', p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                mr: 1
                                }}
                            >
                            {item.title}
                            </Typography>
                            <Tooltip title={'Sum of all income for the selected period'} arrow>
                                <IconButton size="small" sx={{ opacity: 0.6 }}>
                                <InfoOutlined fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            </Box>
                            {/* {card.subtitle && (
                            <Typography
                                variant="body2"
                                sx={{ color: theme.palette.text.secondary }}
                            >
                                Month of {card.subtitle}
                            </Typography>
                            )} */}
                        </Box>
                        <IconWrapper color={item.color}>
                            <AccountBalanceWalletOutlined sx={{ color: item.color, }} />
                        </IconWrapper>
                        </Box>

                        <Box sx={{ position: 'relative', minHeight: '60px' }}>
                        {loading ? (
                            <CircularProgress size={24} sx={{ position: 'absolute' }} />
                        ) : (
                            <Fade in={!loading}>
                            <Box>
                                <Typography
                                variant="h4"
                                component="div"
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.primary.main,
                                    mb: 1
                                }}
                                >
                                ₱ {formatCurrency(item.value || '0.00')}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography
                                    variant="body2"
                                    sx={{ color: theme.palette.text.secondary }}
                                    >
                                    {item.subtitle1}
                                    </Typography>
                                
                                    <ValueChangeIndicator positive={item.positive}>
                                        {item.change}
                                    </ValueChangeIndicator>
                                </Box>
                            </Box>
                            </Fade>
                        )}
                        </Box>
                    </CardContent>

                    </StyledCard>
                </Grid>
            ))}
          
            {cards.map((card, index) => (
            <Grid item xs={12} sm={4} key={index}>
                <StyledCard 
                color={card.color}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                >
                <CardContent sx={{ height: '100%', p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mr: 1
                            }}
                        >
                            {card.title}
                        </Typography>
                        <Tooltip title={card.tooltip} arrow>
                            <IconButton size="small" sx={{ opacity: 0.6 }}>
                            <InfoOutlined fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        </Box>
                        {card.subtitle && (
                        <Typography
                            variant="body2"
                            sx={{ color: theme.palette.text.secondary }}
                        >
                            Month of {card.subtitle}
                        </Typography>
                        )}
                    </Box>
                    <IconWrapper color={card.color}>
                        <card.icon sx={{ color: card.color }} />
                    </IconWrapper>
                    </Box>

                    <Box sx={{ position: 'relative', minHeight: '60px' }}>
                    {loading ? (
                        <CircularProgress size={24} sx={{ position: 'absolute' }} />
                    ) : (
                        <Fade in={!loading}>
                        <Box>
                            <Typography
                            variant="h4"
                            component="div"
                            sx={{
                                fontWeight: 700,
                                color: card.color,
                                mb: 1
                            }}
                            >
                            ₱ {formatCurrency(card.value || '0.00')}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography
                                variant="body2"
                                sx={{ color: theme.palette.text.secondary }}
                                >
                                vs last year
                                </Typography>
                            
                                <ValueChangeIndicator positive={card.positive}>
                                    {card.change}
                                </ValueChangeIndicator>
                            </Box>
                        </Box>
                        </Fade>
                    )}
                    </Box>
                </CardContent>
                </StyledCard>
            </Grid>
            ))}
        </Grid>

        
        </Box>
    )
}