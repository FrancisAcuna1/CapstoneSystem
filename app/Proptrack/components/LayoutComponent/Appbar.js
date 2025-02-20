'use client';
import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation.js';
import { Box, Grid } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ToggleColorMode from './ToggleColorMode.js';
import Image from 'next/image.js';
import Link from 'next/link';

const logoStyle = {
  width: '120px',
  height: '90px',
  cursor: 'pointer',
};

const logonameStyle = {
  width: '150px',
  height: '120px',
  cursor: 'pointer',
  marginTop: '0.6rem',
  marginLeft: '-3.5rem',
};

function AppAppBar({ mode, toggleColorMode}) {
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevents rendering until the component is mounted
  }

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

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
              bgcolor:
                theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(24px)',
              maxHeight: 40,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow:
                theme.palette.mode === 'light'
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                ml: '-18px',
                px: 0,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Image
                  src="/logo1.png"
                  style={logoStyle}
                  alt="proptrack logo"
                  width={200}
                  height={100}
                  priority
                  loading='eager'
                  className={mode === 'dark' ? 'dark-mode-logo' : ''}
                />
                <Image
                  src="/logotitle.png"
                  style={logonameStyle}
                  alt="proptrack logoname"
                  width={200}
                  height={80}
                  priority
                  loading='eager'
                  className={mode === 'dark' ? 'dark-mode-logo' : ''}
                />
              </Box>
            </Box>

            {/* Adjusted Navbar Items to Right Side */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 'auto', gap: 2 }}>
              <Link href="/" passHref   style={{ textDecoration: 'none' }}>
                <MenuItem component="a" sx={{ py: '6px', px: '5px',}}  >
                  <Typography variant="body2" color="text.primary" letterSpacing={1}>
                    Home
                  </Typography>
                </MenuItem>
              </Link>
              <Link href="/Proptrack/Properties" passHref style={{ textDecoration: 'none' }}>
                <MenuItem
                  component="a"
                  sx={{
                    py: '6px',
                    px: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <Typography variant="body2" color="text.primary" letterSpacing={1}>
                    Properties
                  </Typography>
                </MenuItem>
              </Link>
              <Link href="/Proptrack/AboutUs" passHref style={{ textDecoration: 'none' }}>
                <MenuItem
                  component="a"
                  sx={{
                    py: '6px',
                    px: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <Typography variant="body2" color="text.primary" letterSpacing={1}>
                    About Us
                  </Typography>
                </MenuItem>
              </Link>
              <Link href="/Proptrack/FAQS" passHref style={{ textDecoration: 'none' }}>
                <MenuItem
                  component="a"
                  sx={{
                    py: '6px',
                    px: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <Typography variant="body2" color="text.primary" letterSpacing={1}>
                    FAQ&apos;S
                  </Typography>
                </MenuItem>
              </Link>
            </Box>

            {/* Logout button and color mode toggle */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              <Button
                sx={{ color: '#fafafa',background: 'linear-gradient(360deg, hsla(270, 100%, 87%, 1) 9%, hsla(267, 74%, 55%, 1) 89%)', borderRadius:2}}
                variant="text"
                size="small"
                component="a"
                target="_blank"
                onClick={() => router.push('../../../Authentication/Login')}
              >
                Sign In
              </Button>
            </Box>

            {/* Drawer for small screens */}
            <Box sx={{ display: { sm: '', md: 'none' } }}>
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
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'end',
                      flexGrow: 1,
                    }}
                  >
                    <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
                  </Box>
                  <Link href="/" passHref   style={{ textDecoration: 'none' }}>
                  <MenuItem component="a" sx={{ py: '6px', px: '12px'}}>
                    <Typography variant="body2" color="text.primary" letterSpacing={1}>
                      Home
                    </Typography>
                  </MenuItem>
                  </Link>
                  <Link href="/Proptrack/Properties" passHref style={{ textDecoration: 'none' }}>
                    <MenuItem component="a" sx={{ py: '6px', px: '12px' }}>
                      <Typography variant="body2" color="text.primary" letterSpacing={1}>
                        Properties
                      </Typography>
                    </MenuItem>
                  </Link>
                  <Link href="/Proptrack/AboutUs" passHref style={{ textDecoration: 'none' }}>
                    <MenuItem component="a" sx={{ py: '6px', px: '12px' }}>
                      <Typography variant="body2" color="text.primary" letterSpacing={1}>
                        About Us
                      </Typography>
                    </MenuItem>
                  </Link>
                  <Link href="/Proptrack/Contact" passHref style={{ textDecoration: 'none' }}>
                    <MenuItem component="a" sx={{ py: '6px', px: '12px' }}>
                      <Typography variant="body2" color="text.primary" letterSpacing={1}>
                        Contact Us
                      </Typography>
                    </MenuItem>
                  </Link>
                  <Divider />
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="contained"
                      component="a"
                      onClick={() => router.push('../../../Authentication/Login')}
                      target="_blank"
                      sx={{ width: '100%' }}
                    >
                      Sign In
                    </Button>
                  </MenuItem>
                  {/* <MenuItem>
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
                  </MenuItem> */}
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <style jsx global>{`
        .dark-mode-logo {
          filter: brightness(0) invert(1);
        }
      `}</style>
    </div>
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default AppAppBar;
