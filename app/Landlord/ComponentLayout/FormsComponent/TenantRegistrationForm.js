import React, { useState, useEffect} from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, TextField, Grid, FormHelperText} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Swal from 'sweetalert2'; 

const steps = ['Tenant Information', 'Account Creation', 'Unit Details'];

const MultiStepForm = ({details, setSuccessful, setError , setLoading}) => {
    const [contact, setContact] = useState('');
    const [activeStep, setActiveStep] = useState(0);

    const propDetails = details;
    const Property_Type = propDetails?.apartment?.property_type; // Default to empty string
    const ApartmentID = propDetails?.apartment?.id; 
    const Status = propDetails?.apartment?.status;

    const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    contact: '',
    email: '',
    user_type: 'User',
    username: '',
    password: '',
    street: '',
    barangay: '',
    municipality: '',
    rentalfee: '',
    deposit: '',
    startDate: null,
    endDate: null,
    rented_unit_type: Property_Type,
    rented_unit_id: ApartmentID,
    Newstatus: 'Occupied',
    });

    console.log(formData)
    console.log(propDetails);
    // const apartmentDetials =  propDetails.apartment.property.propertyname
    console.log(Property_Type) // for property name
    console.log(ApartmentID) // for apartment name
    console.log(Status)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
        const userData = JSON.parse(userDataString); // parse the datastring into json 
        const accessToken = userData.accessToken;

        const formattedFormData = {
            ...formData,
            startDate: dayjs(formData.startDate).format('MM/DD/YYYY'),
            endDate: dayjs(formData.endDate).format('MM/DD/YYYY'),
        };

        if(accessToken){
            try{

                const response = await fetch(`http://127.0.0.1:8000/api/register`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(formattedFormData)
                })

                const data = await response.json();

                if(response.ok){
                    console.log(data);
                    setFormData('')
                    localStorage.setItem('successMessage', data.message || 'Operation Sucess!');
                    window.history.back();
                    Swal.fire({
                        title: 'Success!',
                        text: 'Tenant Registered Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                }else{
                    setLoading(false);
                    if(data.error)
                    {
                        console.log(data.error)
                        localStorage.setItem('errorMessage', data.message || 'Operation Error!');
                        window.location.reload();
                        // setError(data.error)
                    
                    }else{
                        console.log(data.message); // for duplicate entry
                        setError(data.message);
                    }
                }
            }catch(error){
                console.error(error);
            }
        }
    }



    
    useEffect(() => {
        if (propDetails.apartment) {
            setFormData(prevFormData => ({
                ...prevFormData,
                rented_unit_type:Property_Type,
                rented_unit_id: ApartmentID,
                
            }))
        }
    },[propDetails])
    



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

    const handleDateChange = (name, value) => {
        setFormData({
          ...formData,
          [name]: value,
        });
    };
    
    const formatContact = (value) => {
        // Remove all non-digit characters except '+'
        const digitsOnly = value.replace(/[^\d+]/g, '');
    
        // Ensure it always starts with '+63' or '09'
        if (!digitsOnly.startsWith('+63') && !digitsOnly.startsWith('09')) {
            if (digitsOnly.startsWith('63')) {
                return '+63' + digitsOnly.substring(2);
            } else {
                return '09' + digitsOnly;
            }
        }
    
        return digitsOnly;
    };
    
    const handleContactChange = (event) => {
        let value = event.target.value;
    
        // Avoid appending '+63' multiple times
        if (value.includes('+63')) {
            value = value.replace('+63', '').trim();
        }
    
        const formattedValue = formatContact(value);
        setContact(formattedValue);
        setFormData({
            ...formData,
            contact: formattedValue
        });
    };

    const isStepComplete = () => {
    switch (activeStep) {
        case 0:
        return (
            formData.firstname ||
            formData.middlename &&
            formData.lastname &&
            formData.email &&
            formData.contact
        );
        case 1:
        return (
            formData.username &&
            formData.password 
        );
        case 2:
        return (
            formData.rentalfee &&
            formData.deposit &&
            formData.startDate &&
            formData.endDate
        );
        default:
        return false;
    }
    };

    // const handleSubmit = () => {
    // console.log('Form Data Submitted:', formData);
    // // Add your form submission logic here
    // };

    const renderFormFields = () => {
    switch (activeStep) {
        case 0:
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <TextField
                    name="firstname"
                    label="First Name"
                    value={formData.firstname}
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
                    name="middlename"
                    label="Middle Name"
                    value={formData.middlename}
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
                    name="lastname"
                    label="Last Name"
                    value={formData.lastname}
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
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="contact"
                        label="Contact Number"
                        value={contact}
                        onChange={handleContactChange}
                        fullWidth
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                fontStyle: 'Poppins, serif',
                                fontSize: '15px',
                            },
                            '& .MuiFormLabel-root': {
                                fontSize: '16px'
                            }
                        }}
                    />
                    <FormHelperText id="component-helper-text" sx={{ml:1}}>
                    ex: +63 936 9223 915
                    </FormHelperText>
                    
                </Grid>
                <Grid item xs={12} sm={4} sx={{mt:-1}}>
                    <TextField 
                        id="street" 
                        label="Street" 
                        name='street' 
                        value={formData.street}
                        onChange={handleChange}
                        variant="outlined" 
                        fullWidth margin="normal" 
                        autoFocus autoComplete='street'
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
                <Grid item xs={12} sm={4} sx={{mt:-1}}>
                    <TextField 
                        id="barangay" 
                        label="Barangay" 
                        name='barangay' 
                        value={formData.barangay}
                        onChange={handleChange}
                        variant="outlined" 
                        fullWidth 
                        margin="normal" 
                        autoFocus 
                        autoComplete='barangay' 
                       
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
                <Grid item xs={12} sm={4} sx={{mt:-1}}>
                    <TextField 
                        id="municipality" 
                        label="Municipality" 
                        name='municipality' 
                        value={formData.municipality}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth 
                        margin="normal"
                        autoFocus 
                        autoComplete='municipality' 
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
            </Grid>
        );
        case 1:
        return (
            <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
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
            {/* <Grid item xs={12} sm={6}>
                <TextField
                name="passwordconfirmation"
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
            </Grid> */}
            </Grid>
        );
        case 2:
        return (
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                name="rented_unit_type"
                label="Property_Type"
                value={Property_Type}
                onChange={handleChange}
                fullWidth
                required
                sx={{display:'none'}}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                name="rented_unit_id"
                label="Rented Unit Id"
                value={ApartmentID}
                onChange={handleChange}
                fullWidth
                required
                aria-readonly
                sx={{display: 'none'}}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                name="rentalfee"
                label="Rental Fee"
                type='number'
                value={formData.rentalfee}
                onChange={handleChange}
                fullWidth
                required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                name="deposit"
                label="Payment Deposit"
                type='number'
                value={formData.deposit}
                onChange={handleChange}
                fullWidth
                required
                aria-readonly
                />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  name="startDate"
                  sx={{width: '100%'}}
                  value={formData.startDate}
                  onChange={(newValue) => handleDateChange('startDate', newValue)}
                  fullWidth
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="End Date"
                        name="endDate"
                        sx={{width: '100%'}}
                        value={formData.endDate}
                        onChange={(newValue) => handleDateChange('endDate', newValue)}
                        fullWidth
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>
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
            <StepLabel sx={{ml:{xs: '-1rem'}}}>{label}</StepLabel>
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
                disabled={!isStepComplete()} pang disable ng next button 
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
