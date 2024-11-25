"use client"

import * as React from 'react';
import { useState, useEffect} from 'react';
import '/app/style.css';
import { Container, Paper, Typography, Box, Grid, Divider, Skeleton} from '@mui/material';
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



const IncomeChartHeader = dynamic(() => import('../ChartComponent/incomechart'), {
ssr: false
}) 
const ExpensesChartHeader = dynamic(() => import('../ChartComponent/expenseschart.js'), {
    ssr: false
}) 

const RoomTable = dynamic(() => import('../RoomsTableComponent/page'), {
    ssr: false
}) 
const TenantList = dynamic(() => import('../TableComponent/TenantInformationTable'), {
    ssr: false
})
const TenantCardInfor = dynamic(() => import('../Labraries/TenantCardInfo'), {
    ssr: false
})



export default function CardContent ({setLoading, loading}){
    const [tenantlist, setTenantList] = useState([]);
    const [countTenant, setCountTenant] = useState([]);
    const [countProperty, setCountProperty] = useState([]);
    const [countBed, setCountBed] = useState([]);

    console.log(tenantlist);
    console.log(countProperty);
    console.log(countTenant);
    console.log(countBed);
    
    


    useEffect(() => {
        const fetchedData = async() => {
            setLoading(true)
            const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
            const userData = JSON.parse(userDataString); // parse the datastring into json 
            const accessToken = userData.accessToken;

            try{
                if(accessToken){
                    const response = await fetch('http://127.0.0.1:8000/api/all_property',{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
                    const data = await response.json();
                    console.log(data);
                    if(response.ok){
                        setCountProperty(data.data)
                        setCountTenant(data?.[0])
                        setCountBed(data?.[1]);
                        setLoading(false)
                    }else{
                        console.log('error', response.status)
                        setLoading(false)
                    }
                }
            }catch(error){
                console.log(error);
                setLoading(false)
            }
        }
        fetchedData();
    }, [setLoading])

    

    
    

    



    return (
        <>
            <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
            <Typography variant="h5" gutterBottom letterSpacing={3} sx={{marginLeft: '5px', fontSize: '22px', fontWeight:'bold',   mt:5, mb:'2.5rem'}}>
                Dashboard
            </Typography>
                <Grid container spacing={2} sx={{alignItems: 'center', }}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Paper elevation={2} style={{maxWidth: '590px', padding: '25px', borderRadius: '10px', }}> 
                            {loading ? (
                                <>
                                <Box>
                                    <Skeleton variant="rectangular" height={55} />
                                    <Skeleton width={100} height={30} />
                                    <Skeleton width={100} height={30} />
                                </Box>  
                                </>
                            ) : (
                                <>
                                <Grid container justifyContent={'space-between'}>  
                                    <Grid item>
                                        <Typography variant="body1" sx={{mt: '0.5rem', fontSize: { xs: '26px', sm: '22px', md: '24px', lg:'26px' }, fontWeight: 550}}>
                                            {countTenant.tenant}
                                        </Typography>
                                
                                        <Typography variant="h5" color={'black'} sx={{fontSize: {xs: '20px' ,sm: '16px', md: '18px' , lg: '20px' ,},  marginTop: '0.6rem', mb: '1rem'}} letterSpacing={2} gutterBottom>{countTenant.user}</Typography>
                                    </Grid>
                                    <Grid item>
                                    <Box   sx={{  justifyContent: 'center', marginTop: '0.7rem' }}>
                                    {/* <GroupOutlinedIcon fontSize="medium" sx={{color: 'white', fontSize: '30px'}}/> */}
                                    <Image
                                        src="/tenanticon.png" 
                                        className='tenantIcon'
                                        alt="proptrack logo" 
                                        width={50}  // Replace with your desired width
                                        height={70} // Replace with your desired height
                                    />
                                    </Box>
                                    </Grid>
                                </Grid>
                                </>
                            )}
                         
                            
                            <Box sx={{ borderRadius: '5px', display:'flex', justifyContent: 'space-between', width: '95px', padding: '2px', marginTop: '1px'}}>
                                {/* <TrendingUpOutlinedIcon fontSize="small" sx={{color: 'white', marginLeft: '8px', marginTop: '2px'}}/>
                                <Typography sx={{fontSize: '15px', marginRight: '10px', color: 'white'}}>50.5%</Typography> */}
                            </Box>
                        </Paper>
                    </Grid> 
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Paper elevation={2} style={{maxWidth: '590px', padding: '25px', borderRadius: '10px'}}>
                            {loading ? (
                                <>
                                <Box>
                                    <Skeleton variant="rectangular" height={55} />
                                    <Skeleton width={100} height={30} />
                                    <Skeleton width={100} height={30} />
                                </Box> 
                                </>
                            ):(
                                <>
                                <Grid container justifyContent={'space-between'}>  
                                <Grid item>
                                    <Typography variant="body1" sx={{mt: '0.5rem', fontSize: { xs: '26px', sm: '22px', md: '24px', lg:'26px' }, fontWeight: 550}}>{countProperty.apartment}</Typography>
                                    <Typography variant="h5" color={'black'} sx={{fontSize: {xs: '20px' ,sm: '16px', md: '18px' , lg: '20px' ,},  marginTop: '0.6rem', mb: '1rem'}} letterSpacing={2} gutterBottom>{countProperty.type2}</Typography>
                                </Grid>
                                <Grid item>
                                <Box   sx={{  justifyContent: 'center', marginTop: '0.7rem'  }}>
                                {/* <GroupOutlinedIcon fontSize="medium" sx={{color: 'white', fontSize: '30px'}}/> */}
                                <Image
                                    src="/apartment.png" 
                                    className='apartmentIcon'
                                    alt="proptrack logo" 
                                    width={50}  // Replace with your desired width
                                    height={70}// Replace with your desired height
                                />
                                </Box>
                                </Grid>
                                </Grid>
                                </>
                            )}
                          
                           
                        </Paper>
                    </Grid>  
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Paper elevation={2} style={{maxWidth: '590px', padding: '25px', borderRadius: '10px'}}>
                            {loading ? (
                                <>
                                <Box>
                                    <Skeleton variant="rectangular" height={55} />
                                    <Skeleton width={100} height={30} />
                                    <Skeleton width={100} height={30} />
                                </Box>
                                </>
                                ):(
                                <>
                                <Grid container justifyContent={'space-between'}>  
                                    <Grid item>
                                        <Typography variant="body1" sx={{mt: '0.5rem', fontSize: { xs: '26px', sm: '22px', md: '24px', lg:'26px' }, fontWeight: 550}}>{countProperty.boardingHouse}
                                        </Typography>
                                        <Typography variant="h5" color={'black'} sx={{fontSize: {xs: '20px' ,sm: '16px', md: '18px' , lg: '20px' ,}, marginTop: '0.6rem', mb: '1rem'}} letterSpacing={2} gutterBottom>
                                            {countProperty.type1}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                    <Box   sx={{  justifyContent: 'center', marginTop: '0.7rem' }}>
                                    {/* <GroupOutlinedIcon fontSize="medium" sx={{color: 'white', fontSize: '30px'}}/> */}
                                    <Image
                                        src="/roomicon.png" 
                                        className='roomIcon'
                                        alt="proptrack logo" 
                                        width={50}  // Replace with your desired width
                                        height={70}// Replace with your desired height
                                    />
                                    </Box>
                                    </Grid>
                                </Grid>
                                </>
                            )}
                            
                            <Box sx={{ borderRadius: '5px', display:'flex', justifyContent: 'space-between', width: '95px', padding: '2px', marginTop: '2px'}}>
                                {/* <TrendingUpOutlinedIcon fontSize="small" sx={{color: 'white', marginLeft: '8px', marginTop: '2px'}}/>
                                <Typography sx={{fontSize: '15px', marginRight: '10px', color: 'white'}}>50.5%</Typography> */}
                            </Box>
                        </Paper>    
                    </Grid> 
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Paper elevation={2} style={{maxWidth: '590px', padding: "25px", borderRadius: "10px",}}>
                            <Grid container justifyContent={"space-between"}>  
                                <Grid item>
                                <Typography variant="body1" sx={{mt:'0.1rem', fontSize: { xs: '24px', sm: '21px', md: '22px', lg:'26px' }, fontWeight: 550}}>₱1,000,000.00</Typography>
                                <Typography variant="h5" color={'black'} sx={{fontSize: {xs: '20px' ,sm: '16px', md: '18px' , lg: '20px' ,}, marginTop: '0.6rem',}} letterSpacing={2} gutterBottom>Income</Typography>
                                </Grid>
                                <Grid item>
                                <Box   sx={{maxWidth: {xs: 200, lg: 'auto'},  justifyContent: 'center',  marginTop: '0.1rem', mr: '-0.4rem'}}>
                                {/* <GroupOutlinedIcon fontSize="medium" sx={{color: 'white', fontSize: '30px'}}/> */}
                                <Image
                                    src="/income.png" 
                                    className='incomeIcon'
                                    alt="proptrack logo" 
                                    width={50}  // Replace with your desired width
                                    height={70}// Replace with your desired height
                                />
                                </Box>
                                </Grid>
                            </Grid>
                            <Box sx={{bgcolor: '#f78028', borderRadius: '5px', display:'flex', justifyContent: 'space-between', width: '95px', padding: '1px', mt: {sm: '0rem', md: '0.1rem', lg:'-0.1rem'}}}>
                                <TrendingUpOutlinedIcon fontSize="small" sx={{color: 'white', marginLeft: '8px', marginTop: '2px'}}/>
                                <Typography sx={{fontSize: '15px', marginRight: '10px', color: 'white'}}>50.5%</Typography>
                            </Box>
                        </Paper> 
                    </Grid>
                </Grid>


                <Grid container spacing={2}>
                    <Grid item xs={12} lg={7}>
                        <Paper elevation={2} sx={{maxWidth: {xs: 800, md: 940, lg: 890},  height: { xs: '50vh', lg: '64vh' }, marginTop: '2rem', padding: "1.8rem 1rem 4rem 1rem", borderRadius: "10px",  justifyContent: 'center', alignItems: 'center',}}>
                        <Typography variant="h5" color={'black'} sx={{fontSize: '20px', marginTop: '0.6rem', ml: '1rem'}} letterSpacing={2} gutterBottom>Monthly Income</Typography>
                            <IncomeChartHeader/>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} lg={5} >
                        <Grid container direction={'column'} height={'100%'}>
                            <Grid item>
                                <Paper elevation={2} sx={{overflowX: 'none', maxWidth: {xs: 800 , md: 940, lg: 890},  height: { xs: '50vh', lg: '38vh' }, padding: "1.8rem 1rem 3.5rem 1rem", marginTop: '2rem', borderRadius: "10px",  justifyContent: 'center', alignItems: 'center',}}>
                                <Typography variant="h5" color={'black'} sx={{fontSize: '20px', marginTop: '0.6rem', ml: '1rem'}} letterSpacing={2} gutterBottom>Monthly Expenses</Typography>
                                <ExpensesChartHeader/>
                                </Paper>
                            </Grid>
                            <Grid container spacing={2} justifyContent="space-between" alignItems="stretch" sx={{ marginTop: '0.4rem' }}>
                                <Grid item xs={12} sm={6}>
                                    <Paper elevation={2} sx={{maxWidth: { xs: 'auto', lg: 800 }, height: { xs: '24vh', sm: '16vh', md: '14vh', lg: '22.5vh' }, padding: "1rem 0.9rem 3.5rem 0.9rem", borderRadius: "10px",  justifyContent: 'center', alignItems: 'center',}}>
                                        {loading ? (
                                             <>
                                             <Box>
                                                 <Skeleton variant="rectangular" height={100} />
                                                 <Skeleton width={100} height={30} />
                                                 <Skeleton width={100} height={30} />
                                             </Box>  
                                             </>
                                        ):(
                                            <>
                                            <Grid container justifyContent={'space-between'}>
                                                <Grid item>
                                            
                                                    <Typography variant="h3" color="black" sx={{ml: '1rem', mt:'1.5rem' }} letterSpacing={2} gutterBottom>
                                                        {countBed.Availablebed}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Box sx={{mr:'1rem', mt:'0.4rem', color: 'secondary'}}>
                                                        {/* <TurnedInOutlinedIcon sx={{fontSize: '3.3rem', color:'#f78028'}} /> */}
                                                        
                                                        <Image
                                                            src="/3D home.png"
                                                            className='home3dIcon'
                                                            alt="proptrack logo"
                                                            width={59}
                                                            height={72}
                                                        />
                                                    </Box> 
                                                </Grid>
                                            </Grid>
                                            <Typography variant="h5" color="black" sx={{fontSize: {xs: '20px' ,sm: '18px', md: '18px' , lg: '20px' ,}, mt: {xs: '0rem',  md:'0.1rem', xl: '0.6rem'}, ml: '1rem' }} letterSpacing={2} gutterBottom>
                                            {countBed.status1}
                                            </Typography>
                                            <Typography variant="body1" color="#a55555" sx={{fontSize: {xs: '13px' ,sm: '12px', md: '12px' , lg: '13px' ,}, marginTop: '0.1rem', ml: '1rem' }} letterSpacing={2} gutterBottom>
                                            {countBed.occupiedbed} {countBed.status2}
                                             </Typography>
                                            </>
                                        )}
                                        
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Paper elevation={2} sx={{ maxWidth: { xs: 'auto',  lg: 800 },  height: { xs: '24vh', sm:'16vh', md:'14vh', lg: '22.5vh' },  padding: "1rem 0.9rem 3.5rem 0.9rem",  borderRadius: "10px",  justifyContent: 'center',  lignItems: 'center',}}
                                    >
                                        <Grid container justifyContent={'space-between'}>
                                            <Grid item>
                                                <Typography variant="h3" color="black" sx={{ ml: '1rem', mt:'1rem', }} letterSpacing={2} gutterBottom>
                                                    20
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Box sx={{mr:'1rem', mt:'0.4rem', color: 'secondary'}}>
                                                    {/* <EngineeringIcon sx={{fontSize: '3.3rem', color:'green'}} /> */}
                                                    <Image
                                                    src="/3D rep.png" 
                                                    className='repairIcon'
                                                    alt="proptrack logo" 
                                                    width={60}  // Replace with your desired width
                                                    height={72} // Replace with your desired height
                                                    />
                                                </Box>
                                                
                                            </Grid>
                                        </Grid>
                                       
                                        <Typography variant="h5" color="black" sx={{fontSize: {xs: '20px' ,sm: '18px', md: '18px' , lg: '20px' ,}, ml: '1rem' }} letterSpacing={2} gutterBottom>
                                            Upcoming Maintenance
                                        </Typography>
                                        <Typography variant="body1" color="#a55555" sx={{fontSize: {xs: '13px' ,sm: '12px', md: '12px' , lg: '13px' ,}, marginTop: '0.1rem', ml: '1rem' }} letterSpacing={2} gutterBottom>
                                            100 Finished Maintenance
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                

                <Grid container spacing={3}>
                    {/* <Grid item xs={12} lg={12}>
                      <Paper sx={{mt:6}}>
                        <TenantList
                            sx={{
                            maxWidth: { xs: 312, sm: 741,  md: 940, lg: 1400 }, 
                            height: { xs: '50vh', md:'43vh', lg: '64vh' },
                            padding: "1rem 0rem 2.7rem 0rem",
                            borderRadius: '10px',
                            marginTop: '2rem',
                            overflow: 'scroll'
                        }}                            
                        />
                      </Paper>
                           

                          
                        
                    </Grid> */}
                    <Grid item xs={12} lg={8}>
                        <Paper
                            elevation={2}
                            sx={{
                                maxWidth: { xs: 312, sm: 730,  md: 940, lg: 925 }, 
                                height: { xs: '50vh', md: '43vh', lg: '54vh' },
                                padding: "1rem 0rem 2.7rem 0rem",
                                borderRadius: '10px',
                                marginTop: '2rem',
                            }}
                        >
                            <Typography variant="h5" color={'black'} sx={{ fontSize: '20px', marginTop: '0.6rem', ml: '1rem' }} letterSpacing={2} gutterBottom>
                                Rooms
                            </Typography>
                            <RoomTable />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <TenantCardInfor
                        setLoading={setLoading}
                        loading={loading}
                        sx={{
                            maxWidth: { xs: 312, sm: 730,  md: 940, lg: 890 }, 
                            height: { xs: '50vh', md: '43vh', lg: '64vh' },
                            padding: "1rem 0rem 2.7rem 0rem",
                            borderRadius: '10px',
                            marginTop: '10rem',
                        }}
                        
                        />
                        
                    </Grid>
                </Grid>


            </Box>
        
        </>
    )
}