'use client'

import React, { useState, useEffect } from "react";
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

const fetcher = async([url, token, selectedMonth, selectedYear]) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      month: selectedMonth,
      year: selectedYear,
    }),
  })
  if(!response.ok){
    throw new Error(response.statusText);
  }
  return response.json();
}

export default function ExpensesCard({ loading, setLoading, selectedMonth, selectedYear }) {
  const [totalExpenses, setTotalExpenses] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const theme = useTheme();


  const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
  ]

  const getUserToken = () => {
    const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json
    const accessToken = userData.accessToken;
    return accessToken;
  }
  const token = getUserToken();
  const {data: response, error, isLoading} = useSWR(
    token && selectedMonth && selectedYear ? [`http://127.0.0.1:8000/api/calculate_expenses`, token, selectedMonth, selectedYear] : null,
    fetcher, {
      refreshInterval: 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  )
  console.log(error);
  useEffect(() => {
    if(response?.data){
      setTotalExpenses(response?.data);
      setLoading(false)
    }else if(isLoading){
      setLoading(true)
    }
  }, [response, isLoading, setLoading, setTotalExpenses])
  

  console.log(totalExpenses)
 

  const formatCurrency = (value) => {
    if (!value) return '0.00';
    return Number(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const cards = [
    {
      title: 'Total Expenses',
      value: totalExpenses?.total_expenses,
      icon: AccountBalanceWalletOutlined,
      color: theme.palette.primary.main,
      tooltip: 'Sum of all expenses for the selected period',
      change:  selectedMonth !== "all" ? totalExpenses.monthly_change_type === 'Increase' ? `+${totalExpenses?.monthly_percentage_change}%` : `${totalExpenses?.monthly_percentage_change}%` 
      : totalExpenses.yearly_change_type === 'Increase'
      ? `+${totalExpenses.total_expense_percentage_yearly}%`
      : `${totalExpenses.total_expense_percentage_yearly}%`,
      positive: totalExpenses.yearly_change_type === 'Increase' ? false : true,
      subtitle1: selectedMonth === 'all' ? `vs last year` : 'vs last month',
    },
    {
      title: 'Highest Expenses',
      value: totalExpenses?.max_expenses,
      icon: TrendingUpOutlined,
      color: theme.palette.error.main,
      tooltip: 'Highest spending recorded in the selected period',
      change: totalExpenses.highest_expense_change_type === 'Increase' 
      ? `+${totalExpenses?.highest_expense_percentage}%`
      : `${totalExpenses?.highest_expense_percentage}%`,
      positive: totalExpenses.highest_expense_change_type === 'Increase' ? false : true,
      subtitle1: selectedMonth === 'all' ? `vs last year` : 'vs last month',
    },
    {
      title: 'Lowest Expenses',
      value: totalExpenses?.min_expense_amount,
      icon: TrendingDownOutlined,
      color: theme.palette.success.main,
      tooltip: 'Lowest spending recorded in the selected period',
      subtitle: totalExpenses?.min_expense_month,
      change: totalExpenses.lowest_expense_change_type === 'Increase'
      ? `+${totalExpenses.lowest_expense_percentage}%`
      : `${totalExpenses.lowest_expense_percentage}%`,
      positive: totalExpenses.lowest_expense_change_type === 'Increase'  ? false : true,
      subtitle1: selectedMonth === 'all' ? `vs last year` : 'vs last month',
    },
  ];

  return (
    <Box sx={{ width: '100%', py: 2 }}>
      <Grid container spacing={3}>
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
                            {card.subtitle1}
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
  );
}