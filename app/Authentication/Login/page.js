"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, getSession, signIn } from "next-auth/react";
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Container,
  CssBaseline,
  Avatar,
  LinearProgress,
  Alert,
  Stack,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "styled-components";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { resolve } from "styled-jsx/css";
import "/app/style.css";
import Image from "next/image";

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', // Default font family
    h1: {
      fontFamily: '"Poppins", serif', // Custom font family for H1
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      letterSpacing: "0.015em",
      color: "#333333",
    },
    h2: {
      fontFamily: '"Poppins", serif', // Custom font family for H2
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.3,
      letterSpacing: "0.015em",
      color: "#333333",
    },
    h3: {
      fontFamily: '"Poppins", serif',
      fontWeight: 500,
      fontSize: "1.75rem",
      lineHeight: 1.4,
      letterSpacing: "0.01em",
      color: "#444444",
    },
    h5: {
      fontFamily: '"Poppins", serif',
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.4,
      letterSpacing: "0.01em",
      color: "#444444",
    },
    h6: {
      fontFamily: '"Poppins", serif',
      fontSize: "1.75rem",
      lineHeight: 1.4,
      letterSpacing: "0.01em",
      color: "#444444",
    },
    body1: {
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1.5,
      color: "#666666",
    },
    body2: {
      fontFamily: '"Roboto", sans-serif',
      fontWeight: 300,
      fontSize: "0.875rem",
      lineHeight: 1.5,
      color: "#777777",
    },
  },
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  console.log(login)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({
      ...login,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    // signIn();

    try {
      const response = await signIn("credentials", {
        redirect: false,
        username: login.username,
        password: login.password,
      });
      if (response.ok) {
        const updatedSession = await getSession();
        localStorage.setItem("userDetails", JSON.stringify(updatedSession)); // set the user to local storage
        if (updatedSession && updatedSession.user) {
          console.log("Login successful:", updatedSession.user);
          console.log("Login successful:", updatedSession.user.role);
          // router.push(`/${updatedSession.user.role}/Home`);
          router.replace(`/${updatedSession.user.role}/Home`);
          setTimeout(() => {
            window.location.href = `/${updatedSession.user.role}/Home`; // Force full-page reload
          }, 300);
        } else {
          console.log("Login failed");
        }
      } else {
        console.error("Login failed:", response.status);
        setError(true);
        setLoading(false);
        // Handle login failure, e.g., display an error message
      }
    } catch (error) {
      console.error("An error occurred:", error);
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
    <Box className={"body"}>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            px: { xs: 2, sm: 4 }
          }}
        >
          <Box
            sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            width: '100%',
            maxWidth: '1200px',
            height: { md: '600px' }, // Added fixed height for desktop
            minHeight: { xs: '600px', md: '500px' }, // Minimum height for mobile and de
            bgcolor: 'white',
            borderRadius: 4,
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)', // Enhanced shadow
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.05)', // Subtle border
            }}
          >
            {isLoading && (
              <LinearProgress
                color="secondary"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  borderRadius: "4px 4px 0 0",
                }}
              />
            )}
            <Box
              sx={{
                flex: 1,
                p:1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                width: '100%',
                maxWidth: '330px',
                margin: '0 auto'
              }}>
                <Avatar
                  sx={{ 
                    bgcolor: '#673ab7', 
                    height: 80, 
                    width: 80, 
                    mb: 3 
                  }}
                >
                  <LockPersonIcon fontSize="large" />
                </Avatar>
                
                <Typography
                  component="h5"
                  variant="h1"
                  sx={{ 
                    fontWeight: 600, 
                    mb: 5,
                    color: '#333',
                    fontSize: { xs: '1.5rem', sm: '1.7rem' }, // Responsive font size
                    fontFamily: 'Poppins, sans-serif',
                    textAlign: 'center',
                    letterSpacing: 1
                  }}
                >
                  Sign In
                </Typography>

                {error && (
                  <Grid item mt={2} mb={2} textAlign={"center"}>
                    <Alert severity="error" color="error">
                      Incorrect Username or Password!
                    </Alert>
                  </Grid>
                )}

                <Box 
                  component="form"
                  noValidate
                  // sx={{ width: '100%' }}
                  onSubmit={handleSubmit}
                >
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
                    color="secondary"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#673ab7',
                        },
                      },
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    value={login.password}
                    onChange={handleChange}
                    type={!showPassword ? "password" : "text"}
                    id="password"
                    autoComplete="current-password"
                    color="secondary"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#673ab7',
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Link
                    href="#"
                    variant="body2"
                    sx={{ 
                      float: 'right', 
                      mt: 1, 
                      color: '#673ab7',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Forgot password?
                  </Link>

                  <Button
                    type="submit"
                    fullWidth
                    sx={{
                      mt: 4,
                      mb: 2,
                      py: 1.5,
                      borderRadius: 3,
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(45deg, #673ab7 30%, #905dc0 90%)',
                      color: 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Image Section */}
            <Box
              sx={{
                flex: 1,
                display: { xs: 'none', md: 'block' },
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(45deg, #673ab7 30%, #905dc0 90%)', // Gradient background for image section
              }}
            >
              <Image
                src="/login-image.png"
                alt="login illustration"
                layout="fill"
                objectFit="cover"
                quality={100}
                style={{
                  opacity: 0.7, // Slightly reduce image opacity
                  filter: 'brightness(0.8) contrast(1.4)', // Enhance image contrast
                  marginLeft: '-40px'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(103,58,183,0.6) 0%, rgba(144,93,192,0.6) 100%)', // Overlay gradient
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textAlign: 'center',
                  p: 4,
                  display:'flex',
                  flexDirection:'column',
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600, 
                    maxWidth: '500px',
                    textShadow: '0 4px 6px rgba(0,0,0,0.2)'
                  }}
                >
                Welcome Back! Your Journey Begins Here.
                </Typography>
                <Typography variant="body1">
                Experience effortless access to your account with just a few clicks
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </Box>
  );
}
