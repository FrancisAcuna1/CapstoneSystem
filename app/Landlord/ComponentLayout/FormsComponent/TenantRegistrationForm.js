import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Grid,
  FormHelperText
} from '@mui/material';

const steps = ['Tenant Information', 'Account Creation', 'Unit Details'];

const MultiStepForm = () => {
    const [contact, setContact] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    // email: '',
    // contactNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    unitNumber: '',
    apartmentName: '',
    rentalFee: '',
    });

    const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChange = (event) => {
    setFormData({
        ...formData,
        [event.target.name]: event.target.value,
    });
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

    const isStepComplete = () => {
    switch (activeStep) {
        case 0:
        return (
            formData.firstName &&
            formData.middleName &&
            formData.lastName &&
            formData.email &&
            formData.contactNumber
        );
        case 1:
        return (
            formData.username &&
            formData.password &&
            formData.confirmPassword &&
            formData.password === formData.confirmPassword
        );
        case 2:
        return (
            formData.unitNumber &&
            formData.apartmentName &&
            formData.rentalFee
        );
        default:
        return false;
    }
    };

    const handleSubmit = () => {
    console.log('Form Data Submitted:', formData);
    // Add your form submission logic here
    };

    const renderFormFields = () => {
    switch (activeStep) {
        case 0:
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <TextField
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '10px', // Adjust the border-radius as needed
                            fontStyle: 'Poppins, serif',
                            fontSize: '15px',
                            
                        },
                        '& .MuiFormLabel-root': { // Add this to target the label
                            fontSize: '16px' // Change the font size to 12px (or any other value you prefer)
                        }       
                    }}  
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                    name="middleName"
                    label="Middle Name"
                    value={formData.middleName}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '10px', // Adjust the border-radius as needed
                            fontStyle: 'Poppins, serif',
                            fontSize: '15px',
                            
                        },
                        '& .MuiFormLabel-root': { // Add this to target the label
                            fontSize: '16px' // Change the font size to 12px (or any other value you prefer)
                        }       
                    }}  
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '10px', // Adjust the border-radius as needed
                            fontStyle: 'Poppins, serif',
                            fontSize: '15px',
                            
                        },
                        '& .MuiFormLabel-root': { // Add this to target the label
                            fontSize: '16px' // Change the font size to 12px (or any other value you prefer)
                        }       
                    }}  
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                    name="age"
                    label="age"
                    type="number"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                    name="contactNumber"
                    label="Contact Number"
                    // value={formData.contactNumber}
                    value={contact}
                    // onChange={handleChange}
                    onChange={handleContactChange}
                    fullWidth
                    required
                    // focused
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '10px', // Adjust the border-radius as needed
                            fontStyle: 'Poppins, serif',
                            fontSize: '15px',
                            
                            
                        },
                        '& .MuiFormLabel-root': { // Add this to target the label
                            fontSize: '16px' // Change the font size to 12px (or any other value you prefer)
                        }       
                    }}  
                    />
                    <FormHelperText id="component-helper-text" sx={{ml:1}}>
                    ex: +63 936 9223 915
                    </FormHelperText>
                    
                </Grid>
                <Grid item xs={12} sm={3} sx={{mt:-1}}>
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
                <Grid item xs={12} sm={3} sx={{mt:-1}}>
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
                <Grid item xs={12} sm={3} sx={{mt:-1}}>
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
                <Grid item xs={12} sm={3} sx={{mt:-1}}>
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
                            width: '100%',
                            
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
            </Grid>
        );
        case 1:
        return (
            <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
                <TextField
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                required
                error={formData.password !== formData.confirmPassword}
                helperText={
                    formData.password !== formData.confirmPassword
                    ? "Passwords do not match"
                    : ""
                }
                />
            </Grid>
            </Grid>
        );
        case 2:
        return (
            <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                <TextField
                name="unitNumber"
                label="Unit Number"
                value={formData.unitNumber}
                onChange={handleChange}
                fullWidth
                required
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                name="apartmentName"
                label="Apartment Name"
                value={formData.apartmentName}
                onChange={handleChange}
                fullWidth
                required
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                name="rentalFee"
                label="Rental Fee"
                value={formData.rentalFee}
                onChange={handleChange}
                fullWidth
                required
                />
            </Grid>
            </Grid>
        );
        default:
        return null;
    }
    };

    return (
    <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
            <Step key={index}>
            <StepLabel>{label}</StepLabel>
            </Step>
        ))}
        </Stepper>
        <Box sx={{ mt: 3 }}>
        {activeStep === steps.length ? (
            <Box>
            <Typography variant="h6" align="center">
                All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleSubmit} variant="contained" color="primary">
                Submit
            </Button>
            </Box>
        ) : (
            <Box>
            {renderFormFields()}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                >
                Back
                </Button>
                <Button
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                variant="contained"
                color="primary"
                // disabled={!isStepComplete()} pang disable ng next button 
                >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Box>
            </Box>
        )}
        </Box>
    </Box>
    );
};

export default MultiStepForm;
