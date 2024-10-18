"use client"
import { Container, Paper, Typography,Box, Grid, Button, Link} from '@mui/material';
import * as React from 'react';
import '/app/style.css';
import GroupOutlinedIcon from "@mui/icons-material/Group";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import NightShelterOutlinedIcon from "@mui/icons-material/NightShelterOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import TurnedInOutlinedIcon from '@mui/icons-material/TurnedInOutlined';
import EngineeringIcon from '@mui/icons-material/Engineering';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import dynamic from 'next/dynamic';
import Image from 'next/image';



// const IncomeChartHeader = dynamic(() => import('../ChartComponent/incomechart'), {
// ssr: false
// }) 
// const ExpensesChartHeader = dynamic(() => import('../ChartComponent/expenseschart.js'), {
//     ssr: false
// }) 

// const RoomTable = dynamic(() => import('../RoomsTableComponent/page'), {
//     ssr: false
// }) 
// const TenantList = dynamic(() => import('../TableComponent/TenantInformationTable'), {
//     ssr: false
// })
// const TenantCardInfor = dynamic(() => import('../Labraries/TenantCardInfo'), {
//     ssr: false
// })



export default function CardContent (){
    return (
        <>
            <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
            <Typography variant="h5" gutterBottom letterSpacing={3} sx={{marginLeft: '5px', fontSize: '22px', fontWeight:'bold',   mt:5, mb:'2.5rem'}}>
                Dashboard
            </Typography>
                <Grid container spacing={2} sx={{alignItems: 'center', }}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Paper elevation={2} style={{ padding: '25px', borderRadius: '10px', }}>
                            <Grid container justifyContent={'space-between'}>  
                                <Grid item>
                                <Typography variant="body1" sx={{mt: '0.5rem', fontSize: { xs: '26px', sm: '22px', md: '24px', lg:'24px' }, fontWeight: 550}}>Request Maintenance</Typography>
                                <Typography variant="h5" color={'gray'} sx={{fontSize: {xs: '14px' ,sm: '14px', md: '14px' , lg: '15px' ,},  marginTop: '0.6rem', mb: '1rem'}} letterSpacing={2} gutterBottom>View your Accepted Maintenance</Typography>
                                </Grid>
                                <Grid item>
                                <Box   sx={{  justifyContent: 'center', marginTop: '0.5rem' }}>
                                {/* <GroupOutlinedIcon fontSize="medium" sx={{color: 'white', fontSize: '30px'}}/> */}
                                <Image
                                    src="/schedule.png" 
                                    className='schedule'
                                    alt="proptrack logo" 
                                    width={90}  // Replace with your desired width
                                    height={80} // Replace with your desired height
                                />
                                </Box>
                                </Grid>
                            </Grid>
                            
                            <Box sx={{ borderRadius: '5px', display:'flex', justifyContent: 'space-between', width: '95px', padding: '2px', marginTop: '1px'}}>
                                <Link href="/User/RequestMaintenance" style={{textDecoration: 'none', color: 'black', fontSize:'14px'}}>
                                    More info
                                </Link>
                            </Box>
                        </Paper>
                    </Grid> 
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Paper elevation={2} style={{ padding: '25px', borderRadius: '10px'}}>
                            <Grid container justifyContent={'space-between'}>  
                                <Grid item>
                                <Typography variant="body1" sx={{mt: '0.5rem', fontSize: { xs: '26px', sm: '22px', md: '24px', lg:'24px' }, fontWeight: 550}}>Assessment of Fees</Typography>
                                <Typography variant="h5" color={'gray'} sx={{fontSize: {xs: '14px' ,sm: '14px', md: '14px' , lg: '15px' ,},  marginTop: '0.6rem', mb: '1rem'}} letterSpacing={2} gutterBottom>View your Assessment fee</Typography>
                                </Grid>
                                <Grid item>
                                <Box   sx={{  justifyContent: 'center', marginTop: '0rem'  }}>
                                {/* <GroupOutlinedIcon fontSize="medium" sx={{color: 'white', fontSize: '30px'}}/> */}
                                <Image
                                    src="/credit-card.png" 
                                    className='credit-card'
                                    alt="proptrack logo" 
                                    width={90}  // Replace with your desired width
                                    height={90}// Replace with your desired height
                                />
                                </Box>
                                </Grid>
                            </Grid>
                            <Box sx={{ borderRadius: '5px', display:'flex', justifyContent: 'space-between', width: '95px', padding: '2px', marginTop: '1px'}}>
                                <Link href="/User/AssessmentFee" style={{textDecoration: 'none', color: 'black', fontSize:'14px'}}>
                                    More info
                                </Link>
                            </Box>
                           
                        </Paper>
                    </Grid>  
                </Grid>


                
            </Box>
        
        </>
    )
}