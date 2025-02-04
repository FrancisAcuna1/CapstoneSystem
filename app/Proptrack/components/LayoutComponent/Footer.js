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
        <Box sx={{ textAlign: 'center', mt: 4}}>
          <Typography variant="body2">&copy; 2024 PropTrack. All Rights Reserved. </Typography>
        </Box>
      </Container>
    </Box>
  );
}
