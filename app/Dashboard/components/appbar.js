"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation.js';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, useTheme } from '@mui/material/styles';
import { ThemeProvider } from 'styled-components';

const logoStyle = {
  width: '140px',
  height: 'auto',
  cursor: 'pointer',

};
const logonameStyle = {
  width: '140px',
  height: 'auto',
  cursor: 'pointer',
  marginTop: '0.9rem',
  marginLeft: '-3rem'

};

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  React.useEffect(() => {
    if (isDesktop && open) {
      setOpen(false);
    }
  }, [isDesktop, open]);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };

  const fontstyletheme = createTheme({
    typography: {
        body1: {
            fontFamily: 'Poppins, Arial, sans-serif',
            fontWeight: 500,
            fontSize: '2rem',
        }
    }
  })

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 2,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderRadius: '999px',
              padding: '10px',
              bgcolor:
                theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(24px)',
              maxHeight: 60,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow:
                theme.palette.mode === 'light'
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
            })}
          >
            <ThemeProvider theme={fontstyletheme}>
                <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    ml: '-18px',
                    px: 0,
                }}
                >
                  <img
                     src="/logo1.png" 
                     style={logoStyle}
                     alt="proptrack logo" 
                  />
                  <img
                  src="/logotitle.png" 
                  style={logonameStyle}
                  alt="proptrack logo" 
                  />
                {/* <Typography sx={{ color: '#600baa', letterSpacing: 2, marginLeft: '3rem', marginRight: 5, fontFamily: 'Poppins, Arial, sans-serif', fontWeight: '550', fontSize: '1rem', }}>
                    PropTrack
                </Typography> */}
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <MenuItem onClick={() => scrollToSection('hero')} sx={{ py: '6px', px: '19px', marginLeft: '36rem',  }}>
                    <Typography variant="body2" color="text.primary" sx={{fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1px' }}>
                        Home
                    </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => scrollToSection('about')} sx={{ py: '6px', px: '19px' }}>
                    <Typography variant="body2" color="text.primary" sx={{fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1px' }}>
                        About
                    </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => scrollToSection('service')} sx={{ py: '6px', px: '19px' }}>
                    <Typography variant="body2" color="text.primary" sx={{fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1px' }}>
                        Service
                    </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => scrollToSection('pricing')} sx={{ py: '6px', px: '19px' }}>
                    <Typography variant="body2" color="text.primary" sx={{fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1px' }}>
                        Contact us
                    </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => scrollToSection('faq')} sx={{ py: '6px', px: '19px' }}>
                    <Typography variant="body2" color="text.primary" sx={{fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1px' }}>
                        FAQ
                    </Typography>
                    </MenuItem>
                </Box>
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
                <Button
                    sx={{ color: 'black', fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', }}
                    variant="text"
                    size="small"
                    component="a"
                    target="_blank"
                    onClick={() => router.push('/')}
                >
                    Sign in
                </Button>
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
                <Button
                    sx={{background: 'rgb(142,29,217)', background: 'linear-gradient(0deg, rgba(142,29,217,1) 0%, rgba(200,162,244,1) 100%)', color: 'white', fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem',  }}
                    variant="text"
                    size="small"
                    component="a"
                    target="_blank"
                    onClick={() => router.push('/')}
                >
                    Sign up
                </Button>
                </Box>
                <Box sx={{ display: { xs: '', md: 'none' } }}>
                <Button
                    variant="text"
                    color="primary"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                    sx={{ minWidth: '30px', p: '4px' }}
                >
                
                    <MenuIcon />
                </Button>
                <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                    <Box
                    sx={{
                        minWidth: '60dvw',
                        p: 2,
                        backgroundColor: 'background.paper',
                        flexGrow: 1,
                    }}
                    >
                    <MenuItem onClick={() => scrollToSection('features')} sx={{fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '1rem', }}>
                        Home
                    </MenuItem>
                    <MenuItem onClick={() => scrollToSection('testimonials')} sx={{fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '1rem', }}>
                        Testimonials
                    </MenuItem>
                    <MenuItem onClick={() => scrollToSection('highlights')} sx={{fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '1rem', }}>
                        Highlights
                    </MenuItem>
                    <MenuItem onClick={() => scrollToSection('pricing')} sx={{fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '1rem', }}>
                        Pricing
                    </MenuItem>
                    <MenuItem onClick={() => scrollToSection('faq')} sx={{fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '1rem', }}>
                        FAQ
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                        <Button
                        color="primary"
                        variant="contained"
                        component="a"
                        href="/material-ui/getting-started/templates/sign-up/"
                        target="_blank"
                        sx={{ width: '100%' }}
                        >
                        Sign up
                        </Button>
                    </MenuItem>
                    <MenuItem>
                        <Button
                        color="primary"
                        variant="outlined"
                        component="a"
                        href="/material-ui/getting-started/templates/sign-in/"
                        target="_blank"
                        sx={{ width: '100%' }}
                        >
                        Sign in
                        </Button>
                    </MenuItem>
                    </Box>
                </Drawer>
                </Box>
            </ThemeProvider>
            
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

