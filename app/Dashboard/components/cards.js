"use client"
import { Container, Paper, Typography,Box, Grid} from '@mui/material';
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
import RoomTable from './rooms';
import TenantList from './tenantlist';


const IncomeChartHeader = dynamic(() => import('./income'), {
ssr: false
}) 
const ExpensesChartHeader = dynamic(() => import('./expenses'), {
    ssr: false
}) 


export default function CardContent (){
    return (
        <>
            <Box sx={{ maxWidth: 1390,  margin: 'auto', }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Paper elevation={2} style={{maxWidth: 490, padding: '25px', borderRadius: '15px', }}>
                            <Grid container justifyContent={'space-between'}>  
                                <Grid item>
                                <Typography variant="body1" sx={{mt: '0.5rem',fontSize:'28px', fontWeight: 550}}>5000</Typography>
                                <Typography variant="h5" color={'black'} sx={{fontSize: '20px', marginTop: '0.6rem', mb: '1rem'}} letterSpacing={2} gutterBottom>Tenants</Typography>
                                </Grid>
                                <Grid item>
                                <Box   sx={{  justifyContent: 'center', marginTop: '0.7rem' }}>
                                {/* <GroupOutlinedIcon fontSize="medium" sx={{color: 'white', fontSize: '30px'}}/> */}
                                <img
                                    src="/tenanticon.png" 
                                    className='tenantIcon'
                                    alt="proptrack logo" 
                                />
                                </Box>
                                </Grid>
                            </Grid>
                            
                            <Box sx={{ borderRadius: '5px', display:'flex', justifyContent: 'space-between', width: '95px', padding: '2px', marginTop: '1px'}}>
                                {/* <TrendingUpOutlinedIcon fontSize="small" sx={{color: 'white', marginLeft: '8px', marginTop: '2px'}}/>
                                <Typography sx={{fontSize: '15px', marginRight: '10px', color: 'white'}}>50.5%</Typography> */}
                            </Box>
                        </Paper>
                    </Grid> 
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Paper elevation={2} style={{maxWidth: 490, padding: '25px', borderRadius: '15px'}}>
                            <Grid container justifyContent={'space-between'}>  
                                <Grid item>
                                <Typography variant="body1" sx={{mt: '0.5rem',fontSize:'28px', fontWeight: 550}}>10</Typography>
                                <Typography variant="h5" color={'black'} sx={{fontSize: '20px', marginTop: '0.6rem', mb: '1rem'}} letterSpacing={2} gutterBottom>Apartments</Typography>
                                </Grid>
                                <Grid item>
                                <Box   sx={{  justifyContent: 'center', marginTop: '0.7rem'  }}>
                                {/* <GroupOutlinedIcon fontSize="medium" sx={{color: 'white', fontSize: '30px'}}/> */}
                                <img
                                    src="/apartment.png" 
                                    className='apartmentIcon'
                                    alt="proptrack logo" 
                                />
                                </Box>
                                </Grid>
                            </Grid>
                            <Box sx={{ borderRadius: '5px', display:'flex', justifyContent: 'space-between', width: '95px', padding: '2px', marginTop: '2px'}}>
                                {/* <TrendingUpOutlinedIcon fontSize="small" sx={{color: 'white', marginLeft: '8px', marginTop: '2px'}}/>
                                <Typography sx={{fontSize: '15px', marginRight: '10px', color: 'white'}}>50.5%</Typography> */}
                            </Box>
                        </Paper>
                    </Grid>  
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Paper elevation={2} style={{maxWidth: 490, padding: '25px', borderRadius: '15px'}}>
                            <Grid container justifyContent={'space-between'}>  
                                <Grid item>
                                <Typography variant="body1" sx={{mt: '0.5rem',fontSize:'28px', fontWeight: 550}}>500</Typography>
                                <Typography variant="h5" color={'black'} sx={{fontSize: '20px', marginTop: '0.6rem', mb: '1rem'}} letterSpacing={2} gutterBottom>Rooms</Typography>
                                </Grid>
                                <Grid item>
                                <Box   sx={{  justifyContent: 'center', marginTop: '0.7rem' }}>
                                {/* <GroupOutlinedIcon fontSize="medium" sx={{color: 'white', fontSize: '30px'}}/> */}
                                <img
                                    src="/roomicon.png" 
                                    className='roomIcon'
                                    alt="proptrack logo" 
                                />
                                </Box>
                                </Grid>
                            </Grid>
                            <Box sx={{ borderRadius: '5px', display:'flex', justifyContent: 'space-between', width: '95px', padding: '2px', marginTop: '2px'}}>
                                {/* <TrendingUpOutlinedIcon fontSize="small" sx={{color: 'white', marginLeft: '8px', marginTop: '2px'}}/>
                                <Typography sx={{fontSize: '15px', marginRight: '10px', color: 'white'}}>50.5%</Typography> */}
                            </Box>
                        </Paper>    
                    </Grid> 
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Paper elevation={2} style={{maxWidth: 490, padding: "25px", borderRadius: "15px"}}>
                            <Grid container justifyContent={"space-between"}>  
                                <Grid item>
                                <Typography variant="body1" sx={{ fontSize:'28px', fontWeight: 550}}>₱1,000,000.00</Typography>
                                <Typography variant="h5" color={'black'} sx={{fontSize: '20px', marginTop: '0.6rem',}} letterSpacing={2} gutterBottom>Income</Typography>
                                </Grid>
                                <Grid item>
                                <Box   sx={{  justifyContent: 'center',  marginTop: '0.5rem', mr: '-0.4rem'}}>
                                {/* <GroupOutlinedIcon fontSize="medium" sx={{color: 'white', fontSize: '30px'}}/> */}
                                <img
                                    src="/income.png" 
                                    className='incomeIcon'
                                    alt="proptrack logo" 
                                />
                                </Box>
                                </Grid>
                            </Grid>
                            <Box sx={{bgcolor: '#f78028', borderRadius: '5px', display:'flex', justifyContent: 'space-between', width: '95px', padding: '1px', marginTop: '1px'}}>
                                <TrendingUpOutlinedIcon fontSize="small" sx={{color: 'white', marginLeft: '8px', marginTop: '2px'}}/>
                                <Typography sx={{fontSize: '15px', marginRight: '10px', color: 'white'}}>50.5%</Typography>
                            </Box>
                        </Paper> 
                    </Grid>
                </Grid>


                <Grid container spacing={2}>
                    <Grid item xs={12} lg={7}>
                        <Paper elevation={2} sx={{maxWidth: {xs: 800, lg: 800},  height: { xs: '50vh', lg: '64vh' }, marginTop: '2rem', padding: "1.8rem 1rem 4rem 1rem", borderRadius: "15px",  justifyContent: 'center', alignItems: 'center',}}>
                        <Typography variant="h5" color={'black'} sx={{fontSize: '20px', marginTop: '0.6rem', ml: '1rem'}} letterSpacing={2} gutterBottom>Monthly Income</Typography>
                            <IncomeChartHeader/>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} lg={5} >
                        <Grid container direction={'column'} height={'100%'}>
                            <Grid item>
                                <Paper elevation={2} sx={{overflowX: 'none', maxWidth: {xs: 800 , lg: 800},  height: { xs: '50vh', lg: '38vh' }, padding: "1.8rem 1rem 3.5rem 1rem", marginTop: '2rem', borderRadius: "15px",  justifyContent: 'center', alignItems: 'center',}}>
                                <Typography variant="h5" color={'black'} sx={{fontSize: '20px', marginTop: '0.6rem', ml: '1rem'}} letterSpacing={2} gutterBottom>Monthly Expenses</Typography>
                                <ExpensesChartHeader/>
                                </Paper>
                            </Grid>
                            <Grid container spacing={3} justifyContent="space-between" alignItems="stretch" sx={{ marginTop: '0.4rem' }}>
                                <Grid item xs={12} sm={6}>
                                    <Paper elevation={2} sx={{maxWidth: { xs: 'auto', lg: 1000 }, height: { xs: '22vh', lg: '22.5vh' }, padding: "1rem 0.9rem 3.5rem 0.9rem", borderRadius: "15px",  justifyContent: 'center', alignItems: 'center',}}>
                                        <Grid container justifyContent={'space-between'}>
                                            <Grid item>
                                                <Typography variant="h3" color="black" sx={{ml: '1rem', mt:'1rem' }} letterSpacing={2} gutterBottom>
                                                    20
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Box sx={{mr:'1rem', mt:'0.4rem', color: 'secondary'}}>
                                                    {/* <TurnedInOutlinedIcon sx={{fontSize: '3.3rem', color:'#f78028'}} /> */}
                                                    <img
                                                    src="/3D home.png" 
                                                    className='home3dIcon'
                                                    alt="proptrack logo" 
                                                    />
                                                </Box>
                                                
                                            </Grid>
                                        </Grid>
                                       
                                        <Typography variant="h5" color="black" sx={{ fontSize: '20px', mt: {xs: '0rem', xl: '0.6rem'}, ml: '1rem' }} letterSpacing={2} gutterBottom>
                                            Available Rooms
                                        </Typography>
                                        <Typography variant="body1" color="#a55555" sx={{ fontSize: '13px', marginTop: '0.1rem', ml: '1rem' }} letterSpacing={2} gutterBottom>
                                            100 Not Available Rooms
                                        </Typography>
                                        
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Paper elevation={2} sx={{ maxWidth: { xs: 'auto', lg: 800 },  height: { xs: '22vh', lg: '22.5vh' },  padding: "1rem 0.9rem 3.5rem 0.9rem",  borderRadius: "15px",  justifyContent: 'center',  lignItems: 'center',}}
                                    >
                                        <Grid container justifyContent={'space-between'}>
                                            <Grid item>
                                                <Typography variant="h3" color="black" sx={{ml: '1rem', mt:'1rem' }} letterSpacing={2} gutterBottom>
                                                    20
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Box sx={{mr:'1rem', mt:'0.4rem', color: 'secondary'}}>
                                                    {/* <EngineeringIcon sx={{fontSize: '3.3rem', color:'green'}} /> */}
                                                    <img
                                                    src="/3D rep.png" 
                                                    className='repairIcon'
                                                    alt="proptrack logo" 
                                                    />
                                                </Box>
                                                
                                            </Grid>
                                        </Grid>
                                       
                                        <Typography variant="h5" color="black" sx={{ fontSize: '20px', ml: '1rem' }} letterSpacing={2} gutterBottom>
                                            Upcoming Maintenance
                                        </Typography>
                                        <Typography variant="body1" color="#a55555" sx={{ fontSize: '13px', marginTop: '0.1rem', ml: '1rem' }} letterSpacing={2} gutterBottom>
                                            100 Finished Maintenance
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                

                <Grid container spacing={3}>
                    <Grid item xs={12} lg={5}>
                        <Paper
                            elevation={2}
                            sx={{
                                maxWidth: { xs: 420, lg: 800 }, 
                                height: { xs: '50vh', lg: '64vh' },
                                padding: "1rem 0rem 2.7rem 0rem",
                                borderRadius: '15px',
                                marginTop: '2rem',
                            }}
                        >
                            <Typography variant="h5" color={'black'} sx={{ fontSize: '20px', marginTop: '0.6rem', ml: '1rem' }} letterSpacing={2} gutterBottom>
                                List Of Tenants
                            </Typography>

                            <TenantList />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} lg={7}>
                        <Paper
                            elevation={2}
                            sx={{
                                maxWidth: { xs: 420, lg: 800 }, 
                                height: { xs: '50vh', lg: '64vh' },
                                padding: "1rem 0rem 2.7rem 0rem",
                                borderRadius: '15px',
                                marginTop: '2rem',
                            }}
                        >
                            <Typography variant="h5" color={'black'} sx={{ fontSize: '20px', marginTop: '0.6rem', ml: '1rem' }} letterSpacing={2} gutterBottom>
                                Rooms
                            </Typography>
                            <RoomTable />
                        </Paper>
                    </Grid>
                </Grid>


            </Box>
        
        </>
    )
}