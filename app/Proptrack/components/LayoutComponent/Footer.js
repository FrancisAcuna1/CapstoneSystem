// components/Footer.js
'use client';
import React from 'react';
import { Box, Container, Grid, Link, Typography } from '@mui/material';
import Image from 'next/image';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        bgcolor: 'black',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Company
            </Typography>
            <Link href="#" color="inherit" underline="none" sx={{ display: 'block', mt: 1 }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" underline="none" sx={{ display: 'block', mt: 1 }}>
              Cookies Policy
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Product
            </Typography>
            <Link href="#" color="inherit" underline="none" sx={{ display: 'block', mt: 1 }}>
              Features
            </Link>
            <Link href="#" color="inherit" underline="none" sx={{ display: 'block', mt: 1 }}>
              Something
            </Link>
            <Link href="#" color="inherit" underline="none" sx={{ display: 'block', mt: 1 }}>
              Something else
            </Link>
            <Link href="#" color="inherit" underline="none" sx={{ display: 'block', mt: 1 }}>
              And something else
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Knowledge
            </Typography>
            <Link href="#" color="inherit" underline="none" sx={{ display: 'block', mt: 1 }}>
              Blog
            </Link>
            <Link href="#" color="inherit" underline="none" sx={{ display: 'block', mt: 1 }}>
              Contact
            </Link>
            <Link href="#" color="inherit" underline="none" sx={{ display: 'block', mt: 1 }}>
              FAQ
            </Link>
            <Link href="#" color="inherit" underline="none" sx={{ display: 'block', mt: 1 }}>
              Help Center
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Social
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Link href="#" color="inherit">
                <Image width={24} height={24} src="/twitter-icon.svg" alt="Twitter"/>
              </Link>
              <Link href="#" color="inherit">
                <Image width={24} height={24} src="/facebook-icon.svg" alt="Facebook"/>
              </Link>
              <Link href="#" color="inherit">
                <Image width={24} height={24} src="/linkedin-icon.svg" alt="LinkedIn"/>
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2">&copy; 2024 PropTrack: </Typography>
        </Box>
      </Container>
    </Box>
  );
}
