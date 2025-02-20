'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Image from 'next/image';

export default function FAQSection() {
  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        height: { xs: 'auto', sm: '100vh' },
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(270, 100%, 94%), transparent)'
            : 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(270, 100%, 20%), transparent)',
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
      })}
    >
      <Container
       maxWidth="lg"
       sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // margin: 'auto',
        pt: { xs: 14, sm: 20 },
        pb: { xs: 8, sm: 12 },
      }}
      >
        <Stack spacing={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ fontWeight: 'bold' }}
            >
              About Us
            </Typography>
            <Box 
              sx={{ 
                width: '50%', // Adjust the width as needed
                height: '3px', // Thickness of the line
                backgroundColor: '#7e57c2', // Color of the line
                margin: '0 auto' // Center the line
              }} 
            />
          </Box>
        </Stack>
        <Stack 
          direction="row"
          spacing={2}
          sx={{
            mt: '8rem',
            alignItems: 'flex-start',
            justifyContent: 'space-between' // Space out the content
          }}
        >
          <Box sx={{ flex: 1, pr: 2 }}> {/* Allocate space for text */}
            <Typography variant="h4" component="h1" letterSpacing={1} gutterBottom sx={{ fontWeight: 'bold' }}>
            Simplifying Property Management, Prioritizing Your Experience.
            </Typography>
            <Typography variant="body1" color="text.secondary" letterSpacing={0.1} sx={{ mt: 2}}>
              PropTrack is a modern property management system designed to simplify the lives of property owners, landlords, and tenants. Our platform offers seamless solutions for managing rental properties, tracking payments, handling maintenance requests, and streamlining communication between landlords and tenants. 
            </Typography>
            <Typography variant="body1" color="text.secondary" letterSpacing={0.1} sx={{ mt: 2 }}>
              Our mission is to transform property management into a hassle-free experience by integrating technology, innovation, and excellent customer support. Join PropTrack today and experience the future of property management!
            </Typography>
          </Box>
          <Box sx={{ flex: 1, pl: 2 }}> {/* Allocate equal space for the image */}
            <Image 
              src="/aboutus.jpeg"
              width={1200} // Larger width
              height={800} // Larger height
              priority
              loading='eager'
              style={{
                width: "100%", // Make the image fill the container
                height: "auto", // Maintain aspect ratio
                objectFit: "cover",
                borderRadius: "10px",
              }}
              alt="About Us" // Add alt text for accessibility
            />
          </Box>
        </Stack>

      </Container>
    </Box>
  );
}
