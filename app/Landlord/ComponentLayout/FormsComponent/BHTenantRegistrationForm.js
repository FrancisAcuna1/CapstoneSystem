import React, { useState } from 'react';
import {Box, Stepper, Step, StepLabel, Button, Typography, TextField, Grid, FormHelperText, FormControl, InputLabel, Select, FormControlLabel, Checkbox, MenuItem} from '@mui/material';

const steps = ['Tenant Information', 'Account Creation', 'Unit Details'];

const rooms = [
    { id: 1, name: "Room 101", totalBeds: 3, occupiedBeds: 0 },
    { id: 2, name: "Room 102", totalBeds: 2, occupiedBeds: 1 },
]




const MultiStepForm = () => {
    const [contact, setContact] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [room, setRoom] = useState("");
    const [bedsAvailable, setBedsAvailable] = useState(3); // Example: 3 beds in each room initially
    const [numOfBeds, setNumOfBeds] = useState(1); // Default is 1 bed
    const [wantPrivacy, setWantPrivacy] = useState(false);
    const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    // email: '',
    // contactNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    });

    const handleRoomChange = (e) => {
        const selectedRoom = rooms.find((r) => r.id === e.target.value);
        setRoom(selectedRoom);
        setBedsAvailable(selectedRoom.totalBeds - selectedRoom.occupiedBeds);
    };
    const handleNumOfBedsChange = (e) => {
        const selectedBeds = parseInt(e.target.value);
        setNumOfBeds(selectedBeds);
    };
    
    const handlePrivacyChange = (e) => {
        setWantPrivacy(e.target.checked);
        if (e.target.checked) {
          setNumOfBeds(bedsAvailable); // Set all beds if privacy is selected
        }
    };
   

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
            <Grid container spacing={2} >
                <Grid item xs={12} sm={4} sx={{zIndex: 0,}}>
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
                <Grid item xs={12} sm={4} sx={{zIndex: 0,}}>
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
                <Grid item xs={12} sm={4} sx={{zIndex: 0,}}>
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
                <Grid item xs={12} sm={6} sx={{zIndex: 0,}}>
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
                        zIndex: 0,
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
                            zIndex: 0,
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
                            zIndex: 0,
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
                            zIndex: 0,
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
                            zIndex: 0,
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
                            zIndex: 0,
                            border: '2px dashed #ccc',
                            borderRadius: '5px',
                            padding: '20px',
                            textAlign: 'center',
                            width: '100%',
                            
                        }}
                    >
                        <Box sx={{ marginBottom: '10px', zIndex: 0, }}>
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
                label="Boarding House Name"
                value={formData.unitNumber}
                onChange={handleChange}
                fullWidth
                required
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <FormControl fullWidth margin="normal" required sx={{mt:'0rem'}}>
                    <InputLabel>Room</InputLabel>
                    <Select value={room.id || ""} onChange={handleRoomChange}>
                        {rooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                            {room.name} - {room.totalBeds - room.occupiedBeds} beds available
                        </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
                {/* Number of Beds Selection */}
                {!wantPrivacy && (
                <FormControl fullWidth margin="normal" required  sx={{mt:'0rem'}}>
                    <InputLabel>Number of Beds</InputLabel>
                    <Select value={numOfBeds} onChange={handleNumOfBedsChange}>
                    {[...Array(bedsAvailable)].map((_, index) => (
                        <MenuItem key={index + 1} value={index + 1}>
                        {index + 1} bed{index + 1 > 1 ? "s" : ""}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                )}
            </Grid>
            <Grid item xs={12} sx={{mt: '-0.8rem'}}>
                <FormControlLabel
                    control={<Checkbox sx={{color:'gray'}} checked={wantPrivacy} onChange={handlePrivacyChange} />}
                    label="I want the entire room (Privacy)"
                   sx={{
                        "& .MuiFormControlLabel-label": { // This targets the label inside FormControlLabel
                          fontSize: '14px', // Adjust font size
                          color: 'gray', // Adjust label color (example color)
                          fontWeight: '500' // Optional: set the font weight if needed
                        }
                    }}
                   
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
            <StepLabel sx={{ml:{xs: '-0.8rem'}}}>{label}</StepLabel>
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
