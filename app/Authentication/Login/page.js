'use client'
import React from 'react';
import { useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { useSession, getSession, signIn } from 'next-auth/react'
import { Box, Grid, Button, TextField, Typography, Link, IconButton, InputAdornment, Container, CssBaseline, Avatar, LinearProgress, Alert} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';;
import { createTheme, } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { resolve } from 'styled-jsx/css';
import '/app/style.css';


const theme = createTheme({
   
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', // Default font family
        h1: {
          fontFamily: '"Poppins", serif', // Custom font family for H1
          fontWeight: 700,
          fontSize: '2.5rem',
          lineHeight: 1.2,
          letterSpacing: '0.015em',
          color: '#333333',
        },
        h2: {
          fontFamily: '"Poppins", serif', // Custom font family for H2
          fontWeight: 600,
          fontSize: '2rem',
          lineHeight: 1.3,
          letterSpacing: '0.015em',
          color: '#333333',
        },
        h3: {
          fontFamily: '"Poppins", serif',
          fontWeight: 500,
          fontSize: '1.75rem',
          lineHeight: 1.4,
          letterSpacing: '0.01em',
          color: '#444444',
        },
        h5: {
            fontFamily: '"Poppins", serif',
            fontWeight: 600,
            fontSize: '1.75rem',
            lineHeight: 1.4,
            letterSpacing: '0.01em',
            color: '#444444',
          },
        h6: {
            fontFamily: '"Poppins", serif',
            fontSize: '1.75rem',
            lineHeight: 1.4,
            letterSpacing: '0.01em',
            color: '#444444',
          },
        body1: {
          fontFamily: '"Roboto", sans-serif',
          fontWeight: 400,
          fontSize: '1rem',
          lineHeight: 1.5,
          color: '#666666',
        },
        body2: {
          fontFamily: '"Roboto", sans-serif',
          fontWeight: 300,
          fontSize: '0.875rem',
          lineHeight: 1.5,
          color: '#777777',
        },
        // button: {
        //   fontFamily: '"Roboto", sans-serif',
        //   fontWeight: 500,
        //   fontSize: '0.890rem',
        //   letterSpacing: '1rem',
        //   color: '#ffffff',
        // },
       
      },
  });
  
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [login, setLogin] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
      const { name, value } = e.target;
      setLogin({
          ...login,
          [name]: value
      });
  }

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    // signIn();

    

    try {
      // const response = await fetch(`http://127.0.0.1:8000/api/login`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json',
      //   },
      //   body: JSON.stringify(login),
      // });
      const response = await signIn("credentials", { 
      redirect: false,
      username: login.username,
      password: login.password,
    });

      // const data = await response.json();
      // console.log("Response data:", data);
      // console.log("Response status:", response.status);
      

      if (response.ok) {
        const updatedSession = await getSession();
        localStorage.setItem('userDetails', JSON.stringify(updatedSession))
        if (updatedSession && updatedSession.user) {
          console.log('Login successful:', updatedSession.user);
          console.log('Login successful:', updatedSession.user.role);
          router.push(`/${updatedSession.user.role}/Home`);
        }else{
          console.log('Login failed');
        }


        // if (data.token && data.user_type) {
        //   localStorage.setItem('userDetails', JSON.stringify(data));
        //   console.log('Login successful:', data);
        //   // Assuming that the name is present in the response, otherwise handle accordingly
        //   console.log('role:', data.user_type)
        //   router.push(`/${data.user_type}/Home`);
        // } else {
        //   console.error('Missing token or name in response:', data);
        //   setError(true);
        // }
      } else {
        console.error('Login failed:', response.status);
        setError(true);
        setLoading(false);
        // Handle login failure, e.g., display an error message
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setLoading(false);
    }
  };


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box className={'body'}>
    <ThemeProvider theme={theme}>
        <Container component="main" >
        <CssBaseline />
        <Box
            maxWidth={430}
            sx={{
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'snow',
            padding: 3,
            borderRadius: 5,
            boxShadow: 3,
            }}
        >
          {isLoading && <LinearProgress color="secondary" sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, borderRadius: '4px 4px 0 0' }} />}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2, mt:1 }}>
                <Avatar sx={{ bgcolor: "#673ab7", height: "60px", width: "65px" }}>
                    <LockPersonIcon fontSize="large" />
                </Avatar>
            </Box>
            <Typography component="h1" variant="h5" sx={{fontWeight: 550, fontStyle: 'Poppins, serif',}} >
            Sign in
            </Typography>
            {error && (
              <Grid item mt={2} mb={2} textAlign={'center'}>
                  <Alert severity="error" color="error">
                      Incorrect Username or Password!
                  </Alert>
              </Grid>
            )}

            {/* <Typography variant="body2" sx={{mt:1}}>
                Don’t have an account?{' '}
                <Link href="#" variant="body2">
                    Get started
                </Link>
            </Typography> */}
            <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Username"
                name="username"
                value={login.username}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
                borderRadius={2} 
                color='secondary'
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '10px', // Adjust the border-radius as needed
                        fontStyle: 'Poppins, serif',
                        fontSize: '16px'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e2' // Change the border color to red
                    },
                    '& .MuiFormLabel-root': { // Add this to target the label
                    fontSize: '15px' // Change the font size to 12px (or any other value you prefer)
                    }
                  }}
           
                
            />
            <TextField
              fullWidth
              margin="normal"
              required
              name="password"
              label="Password"
              value={login.password}
              onChange={handleChange}
              type={!showPassword ? 'password' : 'text'}
              id="password"
              autoComplete="current-password"
              color="secondary"
              InputProps={{
                startAdornment: undefined,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff /> }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              
              sx={{
                '&.MuiFilledInput-adornedStart':{
                  display:' none !important',  /* This will hide any element styled with adornedStart */
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  fontStyle: 'Poppins, serif',
                  fontSize: '16px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e2',
                },
                '& .MuiFormLabel-root': {
                  fontSize: '15px',
                },
              }}
            />
            <Link href="#" variant="body2"  sx={{ float: 'right', textDecoration: 'none', mt:1 }}>
                Forgot password?
            </Link>
            <Button
                type="submit"
                fullWidth
                // href='/Landlord/Home'
                sx={{ mt: 4, mb: 2, p:1.5, borderRadius: 3, fontStyle: 'Poppins, serif', fontSize: '0.950rem', fontWeight: 'bold', textTransform: 'none',  backgroundColor: '#6823a8', '&:hover': {backgroundColor: '#905dc0',}, color: 'white', }}

            >
                Sign In
            </Button>
            
            </Box>
        </Box>
        </Container>
    </ThemeProvider>
    </Box>
  );
}

