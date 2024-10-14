import * as React from 'react';
import { alpha } from '@mui/material';
import {Box, Grid, Paper, Card, CardContent, Button, Container, Link, Stack, TextField, Typography} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { motion } from 'framer-motion'; // Import framer-


const steps = [
    {
      title: 'Search for Properties',
      description: 'Browse through our extensive list of apartments and boarding houses to find the perfect place for you.',
      icon: <SearchIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Connect with Landlords',
      description: 'Get in touch with landlords directly through our platform, making communication simple and easy.',
      icon: <ConnectWithoutContactIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Schedule a Visit or Virtual Tour',
      description: 'Schedule an in-person visit or take a virtual tour to explore the property from the comfort of your home.',
      icon: <EventAvailableIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Apply Online and Manage Lease',
      description: 'Apply for your chosen property online and use our tools to manage your lease effortlessly.',
      icon: <AssignmentTurnedInIcon fontSize="large" color="primary" />,
    },
  ];



export default function HowItWorksComponent() {
  return (
    <Box
      sx={(theme) => ({

        width: '100%',
        height: { xs: 'auto', sm: '85vh' },
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
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{ duration: 2 }}
                >
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                How It Works
                </Typography>
                <Grid container spacing={4}>
                {steps.map((step, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card elevation={3} sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                        <CardContent>
                        <Box sx={{ mb: 2 }}>{step.icon}</Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {step.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {step.description}
                        </Typography>
                        </CardContent>
                    </Card>
                    </Grid>
                ))}
                </Grid>

                </motion.div>
                
                    {/* Stack for Typography and form elements */}
            
                
            </Box>
      </Container>
    </Box>
  );
}
