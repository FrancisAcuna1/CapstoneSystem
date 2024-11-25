'use client'

import * as React from 'react';
import { useState } from 'react';
import { Grid, Box, Paper, Typography, Stack,  Link, Breadcrumbs, InputLabel, FormControl, FormControlLabel, Select, MenuItem} from '@mui/material';
import PaymentTransactionTable from '../TableComponent/PaymentTransactionTable';
import SuccessSnackbar from '../Labraries/snackbar';
import { SnackbarProvider } from 'notistack';
import ErrorSnackbar from '../Labraries/ErrorSnackbar'
import AddPaymentTransaction from '../ModalComponent/AddPaymentModal';
import IncomeCards from '../Labraries/IncomeCards';
import dynamic from 'next/dynamic';
import IncomeBreackdownComponent from '../Labraries/IncomeBreakdownCards';
// import IncomeChart from '../ChartComponent/incomechart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const IncomeChartHeader = dynamic(() => import('../ChartComponent/incomechart'), {
    ssr: false
 }) 

export default function PaymentTransactionComponent({loading, setLoading}){
    const [selectedYear, setSelectedYear] = useState('2024');
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [successful, setSuccessful] = useState(null);
    const [error, setError] = useState(null);
    const [editPayment, setEditPayment] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const handleEdit = (id) => {
        console.log('Edit Property:', id)
        setEditPayment(id);
        setIsEdit(true)
        setOpen(true);
    }

    // const years = ['2024', '2023', '2022'];

    // Months array with names and values
    const months = [
      { value: 'all', label: 'All Months' },
      { value: '01', label: 'January' },
      { value: '02', label: 'February' },
      { value: '03', label: 'March' },
      { value: '04', label: 'April' },
      { value: '05', label: 'May' },
      { value: '06', label: 'June' },
      { value: '07', label: 'July' },
      { value: '08', label: 'August' },
      { value: '09', label: 'September' },
      { value: '10', label: 'October' },
      { value: '11', label: 'November' },
      { value: '12', label: 'December' }
    ];
  
    const handleYearChange = (event) => {
      setSelectedYear(event.target.value);
      // Add your year change logic here
    };
  
    const handleMonthChange = (event) => {
      setSelectedMonth(event.target.value);
      // Add your month change logic here
    };

    const generateYears = (startYear, futureYear) => {
        const years = [];
        const currentYear = new Date().getFullYear();
        for(let year = startYear; year <= currentYear + futureYear; year++){
            years.push(year.toString());
        }
        return years;
    }
    // Example usage
    // const currentYear = new Date().getFullYear();
    const years = generateYears(1999, 20);


    return(
        <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
            <SnackbarProvider maxSnack={3}>
                <SuccessSnackbar
                setSuccessful={setSuccessful}
                successful={successful}          
                />
                <ErrorSnackbar
                error={error}
                setError={setError}          
                />
            </SnackbarProvider>
            <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '1px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
              Income Tracking
            </Typography>
            <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                    {/* <Typography color="inherit">Navigation</Typography> */}
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Home">
                        Home
                    </Link>
                    <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Income Tracking</Typography>
                </Breadcrumbs>
            </Grid>
            <Box sx={{mt:'4rem'}}>
            </Box>

           

            <Grid  container spacing={1} sx={{ mt: '-0.9rem', display:'flex', justifyContent:' center',  }}>
                <Grid item xs={12} sx={{mt:1}}>
                    <AddPaymentTransaction
                    loading={loading}
                    setLoading={setLoading}  
                    setSuccessful={setSuccessful}
                    successful={successful}
                    setError={setError}
                    error={error}
                    editPayment={editPayment}
                    setEditPayment={setEditPayment}
                    open={open}
                    handleOpen={handleOpen}
                    handleClose={handleClose}
                    isEdit={isEdit}
                    />
                </Grid>
                <Grid item xs={12}>
                    {/* Option 2: Styled Version with Icons and Better Visual Hierarchy */}
                    <Box 
                        sx={{ 
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        p: 2,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        }}
                    >
                        <Box sx={{display:'flex', gap:2, alignItems:'center', justifyContent:'center',  }}>
                            <CalendarMonthIcon sx={{ color: 'primary.main',  }} />
                            
                            <FormControl 
                            size="small" 
                            sx={{ 
                                minWidth: 100,
                                '& .MuiOutlinedInput-root': {
                                bgcolor: 'background.paper'
                                }
                            }}
                            >
                            <InputLabel>Year</InputLabel>
                            <Select
                                value={selectedYear}
                                label="Year"
                                onChange={handleYearChange}
                                MenuProps={{
                                PaperProps: {
                                    sx: { maxHeight: 300 }
                                }
                                }}
                            >
                                {years.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                                ))}
                            </Select>
                            </FormControl>

                            <FormControl 
                            size="small" 
                            sx={{ 
                                minWidth: 150,
                                '& .MuiOutlinedInput-root': {
                                bgcolor: 'background.paper'
                                }
                            }}
                            >
                            <InputLabel>Month</InputLabel>
                            <Select
                                value={selectedMonth}
                                label="Month"
                                onChange={handleMonthChange}
                                MenuProps={{
                                PaperProps: {
                                    sx: { maxHeight: 300 }
                                }
                                }}
                            >
                                {months.map((month) => (
                                <MenuItem key={month.value} value={month.value}>
                                    {month.label}
                                </MenuItem>
                                ))}
                            </Select>
                            </FormControl>
                        </Box>
                        
                       
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                                ml: { xs: 0, sm: 'auto', lg:'51rem' }, // Reset margin left on mobile
                                fontSize: { xs: '15px', sm: '14px', lg: 'inherit' },
                                lineHeight: { xs: '1.2', lg:'auto'},
                                overflow: 'hidden',
                                wordWrap: 'break-word', 
                                width: { xs: '100%', sm: 'auto' },
                                textOverflow: 'ellipsis',
                                marginTop: { xs: 1, sm: 1, md: 0, lg: 0},

                            }}
                            >
                            {selectedMonth !== 'all' 
                                ? `Showing data for ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`
                                : `Showing all months for ${selectedYear}`}
                        </Typography>
                    </Box>
                </Grid>



                <Grid item xs={12} sx={{mt:2}}>
                    <IncomeCards
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                        setLoading={setLoading}
                    />
                </Grid>
                <Grid item xs={12}>
                        <Paper elevation={2} sx={{maxWidth: {xs: 800, md: 940, lg: 1400},  height: { xs: '50vh', lg: '64vh' }, marginTop: '2rem', padding: "1.8rem 1rem 4rem 1rem", borderRadius: "10px",  justifyContent: 'center', alignItems: 'center', }}>
                        <Typography variant="h5" color={'black'} sx={{fontSize: '20px', marginTop: '0.6rem', ml: '1rem'}} letterSpacing={2} gutterBottom>Monthly Income</Typography>
                            <IncomeChartHeader
                                selectedMonth={selectedMonth}
                                setSelectedMonth={setSelectedMonth}
                                selectedYear={selectedYear}
                                setSelectedYear={setSelectedYear}
                            />
                        </Paper>
                </Grid>
                
                <Grid item xs={12} sx={{mt:5}}>
                        <Paper
                            elevation={2}
                            sx={{
                                maxWidth: { xs: 320, sm: 741,  md: 940, lg: 1400 }, 
                                padding: "1rem 0rem 0rem 0rem",
                                borderRadius: '8px',
                                height: 'auto'
                            }}
                        >
                         
                            <PaymentTransactionTable
                                setError={setError}
                                setSuccessful={setSuccessful}
                                setLoading={setLoading}
                                handleEdit={handleEdit}
                                selectedMonth={selectedMonth}
                                setSelectedMonth={setSelectedMonth}
                                selectedYear={selectedYear}
                                setSelectedYear={setSelectedYear}
                            />
                           
                        </Paper>
                </Grid>
                {/* <Grid item xs={12} lg={7}>

                </Grid> */}
                <Grid item xs={12} lg={12} sx={{mt:4}}>
                    <IncomeBreackdownComponent
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                        setLoading={setLoading}
                    />
                </Grid>
                

            </Grid>
        </Box>
    )
}