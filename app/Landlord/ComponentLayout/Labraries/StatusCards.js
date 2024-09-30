import React from 'react';
import { Card, CardContent, Typography, IconButton, Grid, Box, Paper } from '@mui/material';
import { styled } from '@mui/system';
import Image from 'next/image';
import '/app/style.css';


const ValueTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 'medium-bold',
    color: theme.palette.text.primary,
    fontFamily: 'Poppins, sans-serif',
   
}));

export default function StatusCards() {
    return (
        <Box>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={4}>

                    <Paper 
                        sx={{display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '150px',
                        borderRadius: '12px',
                        padding: '25px',
                        backgroundColor: '#c8e6c9',
                        color: '#1b5e20',
                        }}
                    >
                        
                        <Grid container justifyContent={'space-between'}>
                            <Grid item >
                                <ValueTypography variant='h3' sx={{ml:2,  mt:{xs:'0.1rem', sm:'0.2rem', md: '0.8rem', lg: '0rem'}, fontSize: {xs:'2.8rem', sm: '2.8rem', md: '1.2rem', lg:'3.5rem'}, }}>
                                    20
                                </ValueTypography>
                                <Typography variant='body1' sx={{fontSize:{xs:'20px', sm:'20px', md:'23px', lg:'24px' }, fontWeight: 500, ml: 2}}>
                                  Done
                                </Typography>
                            </Grid>
                            <Grid item >
                                <Image
                                    src={'/doneIcon.png'}
                                     alt="DoneIcon"
                                    // className='DoneIcon'
                                    width={100}  // Replace with your desired width
                                    height={95} // Replace with your desired height
                                />
                            </Grid>
                            

                        </Grid>

                    </Paper>
                    
                </Grid>
                <Grid item xs={12} sm={4}>
                <Paper 
                        sx={{display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '150px',
                        borderRadius: '12px',
                        padding: '25px',
                         backgroundColor: '#fff3e0',
                        color: '#f57f17'
                        // backgroundColor: '#e3f2fd',
                        // color: '#0d47a1',
                        }}
                    >
                        
                        <Grid container justifyContent={'space-between'}>
                            <Grid item >
                                <ValueTypography variant='h3' sx={{ml:2,  mt:{xs:'0.1rem', sm:'0.2rem', md: '0.8rem', lg: '0rem'}, fontSize: {xs:'2.8rem', sm: '2.8rem', md: '1.2rem', lg:'3.5rem'}, }}>
                                    20
                                </ValueTypography>
                                <Typography variant='body1' sx={{fontSize:{xs:'20px', sm:'20px', md:'23px', lg:'24px' }, fontWeight: 500, ml: 2}}>
                                  Todo
                                </Typography>
                            </Grid>
                            <Grid item >
                                <Image
                                    src={'/TodoIcon.png'}
                                    className='StatsIcon'
                                     alt="TodoIcon"
                                    width={100}  // Replace with your desired width
                                    height={95} // Replace with your desired height
                                />
                            </Grid>
                            

                        </Grid>


                    </Paper>
                    
                </Grid>
                <Grid item xs={12} sm={4}>
                <Paper 
                        sx={{display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '150px',
                        borderRadius: '12px',
                        padding: '25px',
                       
                        backgroundColor: '#ede7f6',
                        color: '#512da8',
                        }}
                    >
                        
                        <Grid container justifyContent={'space-between'}>
                            <Grid item >
                                <ValueTypography variant='h3' sx={{ml:2,  mt:{xs:'0.1rem', sm:'0.2rem', md: '0.8rem', lg: '0rem'}, fontSize: {xs:'2.8rem', sm: '2.8rem', md: '1.2rem', lg:'3.5rem'}, }}>
                                    20
                                </ValueTypography>
                                <Typography variant='body1' sx={{fontSize:{xs:'20px', sm:'20px', md:'23px', lg:'24px' }, fontWeight: 500, ml: 2}}>
                                  Ongoing
                                </Typography>
                            </Grid>
                            <Grid item >
                                <Image
                                    src={'/3D rep.png'}
                                     alt="3Drep logo"
                                    // className='DoneIcon'
                                    width={90}  // Replace with your desired width
                                    height={95} // Replace with your desired height
                                />
                            </Grid>
                            

                        </Grid>


                    </Paper>
                   
                </Grid>
            </Grid>
        </Box>
    )
  
};

