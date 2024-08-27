// 'use client'
// import * as React from 'react';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import CssBaseline from '@mui/material/CssBaseline';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Link from '@mui/material/Link';
// import Navigator from './navigator';
// // import Content from './content';
// import Header from './header';
// import { Divider } from '@mui/material';

// function Copyright() {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center">
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}.
//     </Typography>
//   );
// }

// let theme = createTheme({
//   palette: {
//     primary: {
//       light: '#b6bdf1',  // Accent Color
//       main: '#8785d0',    // Primary Color
//       dark: '#6f6ab2',    // Darker Shade of Primary Color
//     },
//     secondary: {
//       main: '#f78028',    // Secondary Color
//     },
//     warning: {
//       main: '#a55555',    // Alert/Warn Color
//     },
//     background: {
//       default: '#eaeff1', // Neutral Color for backgrounds
//     },
//   },
//   typography: {
//     h5: {
//       fontWeight: 500,
//       fontSize: 26,
//       letterSpacing: 0.5,
//     },
//   },
//   shape: {
//     borderRadius: 8,
//   },
//   components: {
//     MuiTab: {
//       defaultProps: {
//         disableRipple: true,
//       },
//     },
//   },
//   mixins: {
//     toolbar: {
//       minHeight: 48,
//     },
//   },
// });

// theme = {
//   ...theme,
//   components: {
//     MuiDrawer: {
//       styleOverrides: {
//         paper: {
//           backgroundColor: '#eaeff1', // Neutral Color
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none',
//         },
//         contained: {
//           boxShadow: 'none',
//           '&:active': {
//             boxShadow: 'none',
//           },
//         },
//       },
//     },
//     MuiTabs: {
//       styleOverrides: {
//         root: {
//           marginLeft: theme.spacing(1),
//         },
//         indicator: {
//           height: 3,
//           borderTopLeftRadius: 3,
//           borderTopRightRadius: 3,
//           backgroundColor: theme.palette.common.white,
//         },
//       },
//     },
//     MuiTab: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none',
//           margin: '0 16px',
//           minWidth: 0,
//           padding: 0,
//           [theme.breakpoints.up('md')]: {
//             padding: 0,
//             minWidth: 0,
//           },
//         },
//       },
//     },
//     MuiIconButton: {
//       styleOverrides: {
//         root: {
//           padding: theme.spacing(1),
//         },
//       },
//     },
//     MuiTooltip: {
//       styleOverrides: {
//         tooltip: {
//           borderRadius: 4,
//         },
//       },
//     },
//     MuiDivider: {
//       styleOverrides: {
//         root: {
//           backgroundColor: 'rgb(255,255,255,0.15)',
//         },
//       },
//     },
//     MuiListItemButton: {
//       styleOverrides: {
//         root: {
//           '&.Mui-selected': {
//             color: '#f78028',  // Secondary Color for selected items
//           },
//           '&:hover': {
//             backgroundColor: '#b6bdf1',  // Accent Color on hover
//           },
//         },
//       },
//     },
//     MuiListItemText: {
//       styleOverrides: {
//         primary: {
//           fontSize: 14,
//           fontWeight: theme.typography.fontWeightMedium,
//         },
//       },
//     },
//     MuiListItemIcon: {
//       styleOverrides: {
//         root: {
//           color: 'inherit',
//           minWidth: 'auto',
//           marginRight: theme.spacing(2),
//           '& svg': {
//             fontSize: 20,
//           },
//         },
//       },
//     },
//     MuiAvatar: {
//       styleOverrides: {
//         root: {
//           width: 32,
//           height: 32,
//         },
//       },
//     },
//   },
// };

// const drawerWidth = 256;

// export default function Paperbase() {
//   const [mobileOpen, setMobileOpen] = React.useState(false);
//   const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ display: 'flex', minHeight: '100vh' }}>
//         <CssBaseline />
//         <Box
//           component="nav"
//           sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//         >
//           {isSmUp ? null : (
//             <Navigator
//               PaperProps={{ style: { width: drawerWidth } }}
//               variant="temporary"
//               open={mobileOpen}
//               onClose={handleDrawerToggle}
//             />
//           )}
//           <Navigator
//             PaperProps={{ style: { width: drawerWidth } }}
//             sx={{ display: { sm: 'block', xs: 'none' } }}
//           />
//         </Box>
//         <Divider />
//         <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//           <Header onDrawerToggle={handleDrawerToggle} />
//           <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
//             <h3>This is for the Main Content</h3>
//             {/* <Content /> */}
//           </Box>
//           <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
//             <Copyright />
//           </Box>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// }


{/* <Grid container alignItems="center">
                        <Grid item sx={{display: { xs: 'none', xs: 'block' }}}>
                            <IconButton
                        
                                aria-label="open drawer"
                                onClick={onDrawerToggle}
                                edge="start"
                                sx={{ display: { sm: 'none' }, }}
                            >
                                <MenuIcon sx={{backgroundColor: '#8785d0', color: '#ebf2f0', fontSize: '30px', borderRadius: '5px'}}/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={4}>
                            <Search >
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                        </Grid>
                        <Grid item xs={2} lg={3}>

                        </Grid>
                        <Grid item xs={3} sm={4} md={4} lg={5}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: '0.1rem'}}>
                                <Box sx={{mx: '1.4rem', mt:'0.5rem'}}>
                                    <Badge badgeContent={4} color="error">
                                        <MailIcon color='primary' sx={{fontSize: '25px'}}/>
                                    </Badge>
                                </Box>
                                <Box sx={{mr: '0.9rem', mt:'0.5rem'}}>
                                    <Badge badgeContent={17} color="error">
                                        <NotificationsIcon color='primary' sx={{ fontSize: '25px'}}/>
                                    </Badge>
                                </Box>
                                <IconButton size="large" aria-label="show 4 new mails" sx={{mx: '0.4rem', color:"#eaeff1"}}>
                                    <Badge badgeContent={4} color="error">
                                        <MailIcon />
                                    </Badge>
                                </IconButton>
                                <IconButton size="large" aria-label="show 17 new notifications" sx={{color:"#eaeff1"}} >
                                    <Badge badgeContent={17} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                                <Avatar
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                    sx={{ml: '1.2rem', mt:'0.1rem', width: '37px', height: '37px' }}
                                    src="/user.png"
                                >
                                    
                                </Avatar>
                            
                                
                            
                            </Box>
                        </Grid>
                    </Grid>
        
                </Toolbar> */}


{/* <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Paper elevation={3} style={{ maxWidth: { xs: 320, sm: 520,  md: 820, lg: 890 },   padding: '25px', marginTop: '15px', borderRadius: '15px'}}>  
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', ml:{xs: '1rem', sm: '-0.5rem', md: '-1rem', lg:'-0.1rem'}, width: { xs: '18rem', sm: '15rem', md:'16rem', lg: '18rem' }, height: { xs: '10rem', sm: '8rem', md: '9rem', lg: 'auto' }}}>
                            <TurnedInOutlinedIcon sx={{fontSize: '3.3rem', color:'#f78028'}} />
                            <img
                            src="/hdpartment.png" 
                            style={{ width: '65%', height: 'auto', objectFit: 'contain',  }}
                            alt="proptrack logo" 
                            />
                        </Box>
                        <Box 
                            sx={(theme) => ({
                                mt: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexShrink: 0,
                                borderRadius: '10px',
                                padding: {xs: '10px', sm: '23px', md: '23px', lg: '10px'},
                                
                                bgcolor:
                                    theme.palette.mode === 'light'
                                    ? 'rgba(255, 255, 255, 0.4)'
                                    : 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(30px)',
                                maxHeight: 37,
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow:
                                    theme.palette.mode === 'light'
                                    ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                                    : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
                            })}
                        >
                        <Grid container justifyContent={'space-between'}  alignItems="center">
                            <Grid item >
                            <Typography variant="body1" color={'primary'} sx={{fontSize: {xs: 13, sm: 12, md: 12, lg: 13}, mt:{ sm: '0.3rem', md: '0.3rem', lg:'0.1rem'},  ml:{xs:'1rem', sm: '1.4rem', md: '1.5rem', lg:'0rem'}, }} letterSpacing={1} >Available Units: 10</Typography>
                            </Grid>
                            <Divider orientation="vertical" color='black' variant="middle" flexItem />
                            <Grid item >
                                <Typography variant="body1" color={'#f78028'} sx={{fontSize: {xs: 13, sm: 12, md: 12, lg: 13}, mt:{md: '0.2rem', lg:'0.3rem'},  ml: {sm: '1.4rem', md:'1.5rem', lg: '0rem'}, mr:{xs:'1rem', lg:'0rem'}}} letterSpacing={1} gutterBottom>Occupied Units: 10</Typography>
                            </Grid>
                        </Grid>
                        </Box>
                        <Typography variant="h5" component="div" sx={{fontSize: {xs: '24px', sm: '21px', md: '22px', lg: '24px'}, fontWeight: 540, mt: 2}} letterSpacing={2} >Apartment no.1 </Typography>
                        <Typography variant="body1" color={'gray'} sx={{fontSize: {xs: '14px', sm: '12px', md: '13px' ,lg:'14px'}}} letterSpacing={1} gutterBottom>Magsaysay st. Brgy Cogon, Sorsogon City</Typography>
                        
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                            <Button href='/Landlord/Apartment/[id]' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '1.4rem', mb: '-0.1rem', fontSize: {xs: '16px', sm: '15px', md: '15px', lg:'16px'}, borderRadius: '12px'}} ><VisibilityOutlinedIcon sx={{mr:'0.2rem'}}/>View Units</Button>
                        </Box>
                    </Paper>
                </Grid> */}