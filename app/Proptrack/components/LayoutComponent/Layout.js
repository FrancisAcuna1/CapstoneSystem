import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Layout = ({ children }) => {
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Property Management System
          </Typography>
          <Box>
            <Link href="/Proptrack/Home" passHref>
              <Button color="inherit">Home</Button>
            </Link>
            <Link href="/Proptrack/Properties" passHref>
              <Button color="inherit">Properties</Button>
            </Link>
            <Link href="/Proptrack/About" passHref>
              <Button color="inherit">About Us</Button>
            </Link>
            <Link href="/Proptrack/Contact" passHref>
              <Button color="inherit">Contact Us</Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>{children}</Container>
    </>
  );
};

export default Layout;