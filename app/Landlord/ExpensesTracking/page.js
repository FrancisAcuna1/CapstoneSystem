"use client"
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import {Box, LinearProgress} from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Navigator from '../DashboardLayout/navigator';
import Header from '../DashboardLayout/header';
import { Divider } from '@mui/material';
// import ExpensesComponent from '../ComponentLayout/HeroContent/ExpensesComponent';
import dynamic from 'next/dynamic';
const ExpensesComponent = dynamic(() => import('../ComponentLayout/HeroContent/ExpensesComponent'), {
  ssr: false
  }) 
// import { UserButton } from '@clerk/nextjs'
// const PaymentTransactionComponent = dynamic(() => import('../../ComponentLayout/HeroContent/PaymentTransactionComponent'), {
//   ssr: false
//   }) 

// const LoadingState = dynamic(() => import('../ComponentLayout/Labraries/LoadingState'), {
//   ssr: false
// }) 


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

let theme = createTheme({
    palette: {
      primary: {
        light: '#b6bdf1',  // Accent Color
        main: '#8785d0',    // Primary Color
        dark: '#6f6ab2',    // Darker Shade of Primary Color
      },
      secondary: {
        main: '#f78028',    // Secondary Color
      },
      warning: {
        main: '#a55555',    // Alert/Warn Color
      },
      background: {
        default: '#eaeff1', // Neutral Color for backgrounds
      },
    },
    typography: {
      fontFamily: [
        'Montserrat',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'Arial',
        'sans-serif',
      ].join(','),
      h5: {
        fontWeight: 500,
        fontSize: 26,
        letterSpacing: 0.5,
        color:'#212121',
      },
      h4: {
        fontWeight: 550,
        fontSize: 26,
        letterSpacing: 0.5,
        color:'#212121'
       
      },
      body1: {
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 500,
        color:'#263238'
      },
      body2: {
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 400,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiTab: {
        defaultProps: {
          disableRipple: true,
        },
      },
    },
    mixins: {
      toolbar: {
        minHeight: 48,
      },
    },
  });
  
  theme = {
    ...theme,
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#ffffff', // Neutral Color
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
          contained: {
            boxShadow: 'none',
            '&:active': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            marginLeft: theme.spacing(1),
          },
          indicator: {
            height: 3,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            backgroundColor: theme.palette.common.white,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            margin: '0 16px',
            minWidth: 0,
            padding: 0,
            [theme.breakpoints.up('md')]: {
              padding: 0,
              minWidth: 0,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: theme.spacing(1),
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 4,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgb(255,255,255,0.15)',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              color: '#f78028',  // Secondary Color for selected items
            },
            '&:hover': {
              backgroundColor: '#b6bdf1',  // Accent Color on hover
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontSize: 14,
            fontWeight: theme.typography.fontWeightMedium,
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: 'inherit',
            minWidth: 'auto',
            marginRight: theme.spacing(2),
            '& svg': {
              fontSize: 20,
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            width: 32,
            height: 32,
          },
        },
      },
    },
  };

  
const drawerWidth = 278;


export default function PaymentTransactionPage (){
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  // console.log("Session: ", session);
  // console.log("Status: ", status);
  const [mobileOpen, setMobileOpen] = React.useState(false);
 // this code 'isSmUp is Enable the Burger Icon for mobile view
  const isSmUp = useMediaQuery(theme.breakpoints.up( 'lg',));

  const handleDrawerToggle = () => {
  setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log('anauthenticated')
      router.replace('/'); // Redirect to login if not authenticated
    }
  }, [status, router]);

  if (status === "loading") {
    // return <>
    //   {/* <LoadingState/> */}
    // </>
    return <p>Loading...</p>; // You can add a loading spinner here if needed
  }

  if (status === "authenticated"){
    return (
      <>
        <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            <Box
            component="nav"
            sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 1 } }}
            >
            {isSmUp ? null : (
                <Navigator
                PaperProps={{ style: { width: drawerWidth } }}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                
                />
            )}
                <Navigator
                  PaperProps={{ style: { width: drawerWidth } }}
                  sx={{ display: { sm: 'none', xs: 'none', lg:'block' } }}
                  
                />
            </Box>
            <Divider />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Header onDrawerToggle={handleDrawerToggle} />
            {loading && <LinearProgress color='primary' sx={{ position: 'fixed',  zIndex: 2100, top: 0, left: 0, right: 0, height: 4.99, borderRadius: '4px 4px 0 0' }} />}
            <Box component="main" sx={{ flex: 1, py: 2, px: 3, bgcolor: '#eaeff1' }}>
              <ExpensesComponent
                setLoading={setLoading}
                loading={loading}
              />
                {/* <Content/> */}
                
            </Box>
            <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
                {/* <Copyright/> */}
            </Box>
            </Box>
        </Box>
        </ThemeProvider>
      
      </>
    )

  }

  return null;

  

  
}