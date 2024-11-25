'use client';
import * as React from 'react';
import { alpha } from '@mui/material';
import {Box, Grid, Paper, Button, Container, Link, Stack, TextField, Typography} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SearchIcon from '@mui/icons-material/Search';
import ForumIcon from '@mui/icons-material/Forum';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import { motion } from 'framer-motion'; // Import framer-motion

const features = [
    {
      title: 'Efficient Property Search',
      description: 'Find apartments or boarding houses efficiently with our advanced search tools.',
      icon: <SearchIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Tenant & Landlord Communication',
      description: 'Tools like chat, maintenance requests, and messaging to keep communication open.',
      icon: <ForumIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Property Management Tools',
      description: 'Features for landlords, such as payment tracking and lease management, to streamline property management.',
      icon: <BusinessCenterIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Verified Listings',
      description: 'All property listings are verified for authenticity to ensure safe and reliable rentals.',
      icon: <VerifiedUserIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Virtual Tours',
      description: 'View properties with 3D virtual tours, giving you a realistic experience without leaving home.',
      icon: <ThreeDRotationIcon fontSize="large" color="primary" />,
    },
];



export default function FeatureComponent() {
  return (
    <motion.div
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{ duration: 2 }}
>
    <Box
      sx={(theme) => ({
        width: '100%',
        height: { xs: 'auto', sm: '100vh' },
        backgroundImage: 'url("/wave.svg")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        // backgroundImage:
        //   theme.palette.mode === 'light'
        //     ? 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(270, 100%, 94%), transparent)'
        //     : 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(270, 100%, 20%), transparent)',
        // backgroundSize: '100%',
        // backgroundRepeat: 'no-repeat',
      })}
    >
        <Container
            sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 14, sm: 20 },
            pb: { xs: 8, sm: 20 },
            }}
            
        >
            <Box
            sx={{
                // display: 'flex',
                // flexDirection: { xs: 'column', lg: 'row' },
                // justifyContent: 'space-between',
                // alignItems: 'center',
                gap: 4,
               
            }}
            >
              <Typography variant="h4" gutterBottom align="center" fontWeight="bold"  sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' } }}>
                  Key Features
              </Typography>
              <Typography
              variant="subtitle1"
              color="textSecondary"
              align="center"
              sx={{ 
                mb: 6,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
              >
              Explore the features that make our platform the best choice for tenants
              </Typography>
              <Grid container spacing={4}>
              {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                      elevation={3}
                      sx={{
                      p: { xs: 2, sm: 3 },
                      textAlign: 'center',
                      borderRadius: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      }}
                  >
                      {feature.icon}
                      <Typography variant="h6" gutterBottom sx={{ mt: 2, fontSize: { xs: '1.25rem', sm: '1.5rem' }  }}>
                      {feature.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary"  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {feature.description}
                      </Typography>
                  </Paper>
                  </Grid>
              ))}
              </Grid>
            </Box>
      </Container>
    </Box>
    </motion.div>
  );
}
