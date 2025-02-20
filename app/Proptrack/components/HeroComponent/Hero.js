'use client';
import * as React from 'react';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { motion } from 'framer-motion'; // Import framer-motion





export default function Hero() {
  return (
    <Box
      id="hero"
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
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 18 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {/* Stack for Typography and form elements */}
           
            <Box
                sx={{
                flex: 1,
                //   border: '1px solid black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                }}
                
            >
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{ duration: 2 }}
                >
                <Stack
                spacing={2}
                useFlexGap
                sx={{
                    width: { xs: '90%', sm: '70%' },
                    textAlign: { xs: 'center', lg: 'left' },
                    alignItems: { xs: 'center', lg: 'flex-start' },
                    ml:{xs: '0', xl:'3rem'}
                   
                }}
                >
                <Typography
                    variant="h1"
                    sx={{
                    fontSize: 'clamp(2.5rem, 8vw, 3.8rem)',
                    fontWeight: 'Bold',
                    
                    }}
                >
                    Find Your Perfect Property with Ease&nbsp;
                    {/* <Typography
                    component="span"
                    variant="h1"
                    sx={{
                        fontSize: 'inherit',
                        color: (theme) =>
                        theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                    }}
                    >
                    Ease
                    </Typography> */}
                </Typography>

                <Typography
                    textAlign={{ xs: 'center', lg: 'left' }}
                    color="text.secondary"
                    sx={{
                      width: '100%',
                      letterSpacing: 1
                     }}
                >
                    Our platform focuses on efficiently helping you find the perfect apartment or boarding house, offering tools for property management, tenant communication, and property features to make your rental experience smooth and hassle-free.
                </Typography>
                <Button variant='contained' href='/Proptrack/Properties' sx={{backgroundColor:'#8785d0', '&:hover': {backgroundColor:'#b6bdf1'}, p:1.8}}>
                  Discover Properties 
                  <ArrowForwardOutlinedIcon sx={{ml:'0.5rem'}}/>
                </Button>
                </Stack>
                </motion.div>
            </Box>
          {/* Image Box */}
            <motion.div
                initial={{ y: -200, opacity: 0 }} // Starting from above
                animate={{ y: 0, opacity: 1 }} // Sliding down into view
                transition={{ type: 'spring', stiffness: 50, damping: 20, duration: 1 }}
                //  initial={{ x: 200, opacity: 0 }} // Starting from right side 
                //  animate={{ x: 0, opacity: 1 }} // Sliding into view
                //  transition={{ type: 'spring', stiffness: 50, damping: 20, duration: 1 }}
            >
            <Box
            sx={{
              flex: 1,
            //   border: '1px solid black',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              
            }}
            >
                <Image
                src="/houseSearching.png" // Example image URL from Pexels
                alt="houseSearching"
                width={590}
                height={500}
                priority
                loading='eager'
                style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 8,
                    objectFit: 'cover',
                    objectPosition: 'center',
                }}
                />
            </Box>

          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
