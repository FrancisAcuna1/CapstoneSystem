'use client'
import React from 'react';
import { Box, Grid, Card, InputAdornment, Typography, FormHelperText,  Divider, TextField, Button, Link, Avatar,  IconButton, FormControl, } from '@mui/material'
import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/navigation';
// import { MuiFileInput } from 'mui-file-input';



export default function RegisterComponent() {
    const [image, setImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const  router = useRouter();   
    const [contact, setContact] = useState('');

    const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClickShowConfirmPassword = () => {
        setShowCPassword(!showCPassword);
        };
    
    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };


    const formatContact = (value) => {
      // Remove all non-digit characters from the input value
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.replace(/(\d{4})(\d{3})(\d{4})/, '+63 $1 $2 $3');
      // Format the phone number as desired
      
    };
  
    const handleContactChange = (event) => {
      const formattedValue = formatContact(event.target.value);
      setContact(formattedValue);
    };


    // file input ini 
    const [value, setValue] = React.useState(null)

    const handleChange = (newValue) => {
        setValue(newValue)
    }
  return (
    <>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <form>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                <Typography variant="h5" component="div" gutterBottom sx={{ textAlign: 'center'}}>
                     Registration Form
                </Typography>
                </Grid>
                <Grid  item xs={12} sm={4}>
                    <TextField required id="firstname" label="First Name"  name="fristname" variant="outlined" fullWidth margin="normal" autoFocus autoComplete='firstname'
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px', // Adjust the border-radius as needed
                                fontStyle: 'Poppins, serif',
                                fontSize: '15px'
                            },
                            '& .MuiFormLabel-root': { // Add this to target the label
                                fontSize: '15px' // Change the font size to 12px (or any other value you prefer)
                            }       
                        }}
                    />
                </Grid>
                <Grid  item xs={12} sm={4}>
                    <TextField required id="middle" label="Middle Name" name='middlename' variant="outlined" fullWidth margin="normal" autoFocus autoComplete='Middle Name'
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px', // Adjust the border-radius as needed
                                fontStyle: 'Poppins, serif',
                                fontSize: '15px'
                            },
                            '& .MuiFormLabel-root': { // Add this to target the label
                                fontSize: '15px' // Change the font size to 12px (or any other value you prefer)
                            }       
                        }}  
                    />
                </Grid>
                <Grid  item xs={12} sm={4}>
                    <TextField required id="lastname" label="Last Name" name='lastname' variant="outlined" fullWidth margin="normal" autoFocus autoComplete='Middle Name'
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px', // Adjust the border-radius as needed
                                fontStyle: 'Poppins, serif',
                                fontSize: '15px'
                            },
                            '& .MuiFormLabel-root': { // Add this to target the label
                                fontSize: '15px' // Change the font size to 12px (or any other value you prefer)
                            }       
                        }}  
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField required id="email" label="Email" name='email' variant="outlined" fullWidth margin="normal" autoFocus autoComplete='email'
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px', // Adjust the border-radius as needed
                                fontStyle: 'Poppins, serif',
                                fontSize: '15px'
                            },
                            '& .MuiFormLabel-root': { // Add this to target the label
                                fontSize: '15px' // Change the font size to 12px (or any other value you prefer)
                            }       
                        }}  
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        required
                        id="contact"
                        label="Contact No."
                        variant="outlined"
                        name='contact'
                        fullWidth
                        margin="normal"
                        value={contact}
                        onChange={handleContactChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px', // Adjust the border-radius as needed
                                fontStyle: 'Poppins, serif',
                                fontSize: '15px'
                            },
                            '& .MuiFormLabel-root': { // Add this to target the label
                                fontSize: '15px' // Change the font size to 12px (or any other value you prefer)
                            }       
                        }}  
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField id="outlined-adornment-password-register" type={showPassword ? 'text' : 'password'} label="Password" name='password' variant="outlined" fullWidth margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end" disablePointerEvents={false} 
                                disableTypography = {false}>
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
                            notchedOutline: null,
                            startAdornment: null, 
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField  id="outlined-adornment-password-register" type={showCPassword ? 'text' : 'password'}  label="Confirm Password" name='cpassword' variant="outlined" fullWidth margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowConfirmPassword}
                                    onMouseDown={handleMouseDownConfirmPassword}
                                    edge="end"
                                >
                                     {showCPassword ? <Visibility /> : <VisibilityOff />   }
                                </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField id="street" label="Street" name='street' variant="outlined" fullWidth margin="normal" autoFocus autoComplete='street'
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px', // Adjust the border-radius as needed
                                fontStyle: 'Poppins, serif',
                                fontSize: '15px'
                            },
                            '& .MuiFormLabel-root': { // Add this to target the label
                                fontSize: '15px' // Change the font size to 12px (or any other value you prefer)
                            }       
                        }}  
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField id="barangay" label="Barangay" name='barangay' variant="outlined" fullWidth margin="normal" autoFocus autoComplete='barangay' 
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px', // Adjust the border-radius as needed
                                fontStyle: 'Poppins, serif',
                                fontSize: '15px'
                            },
                            '& .MuiFormLabel-root': { // Add this to target the label
                                fontSize: '15px' // Change the font size to 12px (or any other value you prefer)
                            }       
                        }}  
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField id="municipality" label="Municipality" name='municipality' variant="outlined" fullWidth margin="normal" autoFocus autoComplete='barangay' 
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px', // Adjust the border-radius as needed
                                fontStyle: 'Poppins, serif',
                                fontSize: '15px'
                            },
                            '& .MuiFormLabel-root': { // Add this to target the label
                                fontSize: '15px' // Change the font size to 12px (or any other value you prefer)
                            }       
                        }}  
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField id="zipcode" label="ZIP CODE" name='zipcode' variant="outlined" fullWidth margin="normal" autoFocus autoComplete='zipcode'
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px', // Adjust the border-radius as needed
                                fontStyle: 'Poppins, serif',
                                fontSize: '15px'
                            },
                            '& .MuiFormLabel-root': { // Add this to target the label
                                fontSize: '15px' // Change the font size to 12px (or any other value you prefer)
                            }       
                        }}  
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Box 
                        sx={{
                            border: '2px dashed #ccc',
                            borderRadius: '5px',
                            padding: '20px',
                            textAlign: 'center',
                            width: '93.5%',
                            
                        }}
                    >
                        <Box sx={{ marginBottom: '10px' }}>
                            <Typography variant="body1" gutterBottom sx={{color: 'gray'}}>
                                Drop or Select Image
                            </Typography>
                        </Box>

                        {/* <MuiFileInput component="form" value={value} onChange={handleChange} sx={{width: '100%',}}/> */}
                    </Box>
                </Grid>
                
                <Grid item xs={12}>
                    <Button variant="contained"
                        sx={{background: '#673ab7', mt:'2rem', width: '100%', padding: '10px',  fontSize: '18px','&:hover': {backgroundColor: '#9575cd',}, }}
                        // onClick={() => router.push('/Dashboard/login')}
                        href='/Dashboard/login'
                    >
                        Register Account
                    </Button>  
                </Grid>

                
                
            </Grid>

            </form>

                
        </Box>
    </>

  );
}