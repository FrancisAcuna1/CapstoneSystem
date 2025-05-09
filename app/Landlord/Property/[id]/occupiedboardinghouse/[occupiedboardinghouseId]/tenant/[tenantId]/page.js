"use client"
import * as React  from 'react';
import useClient from 'next/client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import {Box, LinearProgress} from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Navigator from '../../../../../../DashboardLayout/navigator';
import Header from '../../../../../../DashboardLayout/header';
import { Divider } from '@mui/material';
import dynamic from 'next/dynamic';
import OccupiedBoardingHouseTenantInformation from '@/app/Landlord/ComponentLayout/HeroContent/OccupiedBhTenantInfo';
import { teal } from '@mui/material/colors';
// const CardContentHeader = dynamic(() => import('../ComponentLayout/cards'), {
//   ssr: false
//   }) 


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
      h5: {
        fontWeight: 500,
        fontSize: 26,
        letterSpacing: 0.5,
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

  
  const drawerWidth = 278

export default function OccupiedBoardingHousePage (){
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession();
  const boardinghouseId = params?.occupiedboardinghouseId;
  const propsId = params.id;
  const tenantId = params.tenantId

  console.log('Boarding House ID:', boardinghouseId);
  console.log('PropertyID:', propsId);
  console.log('Tenant ID:', tenantId);

  const [mobileOpen, setMobileOpen] = React.useState(false);
   // this code 'isSmUp is Enable the Burger Icon for mobile view
   const isSmUp = useMediaQuery(theme.breakpoints.up( 'lg',));

  const handleDrawerToggle = () => {
  setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log('anauthenticated')
      router.push('/'); // Redirect to login if not authenticated
    }
  }, [status, router]);

  if (status === "loading") {
    // return <>
    //   <LoadingState/>
    // </>
    // You can add a loading spinner here if needed
  }

  if (status == "authenticated"){

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
                sx={{ display: { sm: 'none', xs: 'none', lg: 'block' } }}
                
              />
          </Box>
          <Divider />
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {loading && <LinearProgress color='primary' sx={{ position: 'fixed',  zIndex: 2100, top: 0, left: 0, right: 0, height: 4.99, borderRadius: '4px 4px 0 0' }} />}
          <Header onDrawerToggle={handleDrawerToggle} />
          <Box component="main" sx={{ flex: 1, py: 2, px: 3, bgcolor: '#eaeff1' }}>
              {/* <h1>Boarding House Details page</h1> */}
              <OccupiedBoardingHouseTenantInformation
                loading={loading}
                setLoading={setLoading}
                boardinghouseId={boardinghouseId} 
                propsId={propsId}
                tenantId={tenantId}
              />
             
              {/* <OccupiedBoardinghouse 
                boardinghouseId={boardinghouseId} 
                propsId={propsId}
                loading={loading}
                setLoading={setLoading}
              /> */}
              
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
  null;
}