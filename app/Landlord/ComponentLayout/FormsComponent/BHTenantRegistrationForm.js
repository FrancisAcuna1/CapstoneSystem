import React, { useEffect, useState } from 'react';
import {Box, Stepper, Step, StepLabel, Button, Typography, TextField, Grid, FormHelperText, FormControl, InputLabel, Select, FormControlLabel, Checkbox, MenuItem} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Swal from 'sweetalert2'; 
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const steps = ['Tenant Information', 'Account Creation', 'Unit Details'];

// const rooms = [
//     { id: 1, name: "Room 101", totalBeds: 3, occupiedBeds: 0 },
//     { id: 2, name: "Room 102", totalBeds: 2, occupiedBeds: 1 },
// ]

const MultiStepForm = ({details, setDetails, setLoading, setError, setSuccessful}) => {
    const [contact, setContact] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [rooms, setRooms] = useState([]);
    const [totalBeds, setTotalBeds] = useState();
    const [selectedRoom, setSelectedRoom] = useState("");
    const [bedsAvailable, setBedsAvailable] = useState(0);
    const [numOfBeds, setNumOfBeds] = useState(1); //for selected bed
    const [wantPrivacy, setWantPrivacy] = useState(false);
    const propsDetails = details;
    const Property_Type = propsDetails?.boardinghouse?.property_type;
    const BoardinghouseID = propsDetails?.boardinghouse?.id;


    console.log(BoardinghouseID);
    console.log(Property_Type);
    console.log(rooms)
    console.log(numOfBeds);
    console.log(selectedRoom);
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
        rented_unit_id: BoardinghouseID,
        rented_bed_number: '',
        Newstatus: 'Available',
    });

    console.log(formData)

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

                const response = await fetch(`http://127.0.0.1:8000/api/bh_tenant_registration`,{
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
        const successMessage = localStorage.getItem('successMessage');
        const errorMessage = localStorage.getItem('errorMessage');
        if (successMessage) {
        setSuccessful(successMessage);
        setTimeout(() => {
            localStorage.removeItem('successMessage');
        }, 3000);
        }

        if(errorMessage){
        setError(errorMessage);
        setTimeout(() => {
            localStorage.removeItem('errorMessage');
        }, 3000);
        }
    })






    useEffect(() => {
        if (propsDetails && propsDetails.boardinghouse) {
            setRooms(propsDetails.boardinghouse.rooms || []);
            const totalBedsCount = propsDetails.boardinghouse.rooms.reduce((sum, room) => sum + room.number_of_beds, 0);
            setTotalBeds(totalBedsCount);
            setFormData(prevFormData => ({
                ...prevFormData,
                rented_unit_type:Property_Type,
                rented_unit_id: BoardinghouseID,
            }));
        }
    }, [propsDetails]);

    // const handleRoomChange = (e) => {
    //     const roomId = e.target.value;
    //     const selectedRoom = rooms.find((r) => r.id === roomId);
    //     setSelectedRoom(selectedRoom);
    //     setBedsAvailable(selectedRoom ? selectedRoom.number_of_beds : 0);
    //     setNumOfBeds(1); // Reset selected beds when room changes
    // };

    // const handleNumOfBedsChange = (e) => {
    //     const selectedBeds = parseInt(e.target.value);
    //     setNumOfBeds(selectedBeds);
    // };


    const handleRoomChange = (e) => {
        const roomId = e.target.value;
        const selectedRoom = rooms.find((r) => r.id === roomId);
        setSelectedRoom(selectedRoom);
        setBedsAvailable(selectedRoom ? selectedRoom.number_of_beds : 0);
        setNumOfBeds(1); // Reset selected beds when room changes

        // Update formData with the selected room information
        setFormData((prevFormData) => ({
            ...prevFormData,
            roomid: selectedRoom ? selectedRoom.id : '',
        }));
    };

    const handleNumOfBedsChange = (e) => {
        const selectedBeds = parseInt(e.target.value, 10);
        setNumOfBeds(selectedBeds);

        // Update formData with the number of selected beds
        setFormData((prevFormData) => ({
            ...prevFormData,
            rented_bed_number: selectedBeds,
        }));
    };

    const handlePrivacyChange = (e) => {
        setWantPrivacy(e.target.checked);
        if (e.target.checked) {
            setNumOfBeds(bedsAvailable);
        } else {
            setNumOfBeds(1);
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
                formData.endDate &&
                formData.roomid &&
                formData.rented_bed_number
            );
            default:
            return false;
        }
        };

    

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
                value={BoardinghouseID}
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
            <Grid item xs={12} sm={6} sx={{mt:'-1rem'}}>
                <FormControl fullWidth margin="normal" required>
                    <InputLabel id="demo-simple-select-label">Room</InputLabel>
                    <Select
                        required
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name='roomnumber'
                        label="Status"
                        value={selectedRoom ? selectedRoom.id : ""}
                        onChange={handleRoomChange}
                        displayEmpty
                    >
                        <MenuItem value="" disabled>Select a room</MenuItem>
                        {rooms.map((room) => (
                            <MenuItem key={room.id} value={room.id}>
                                Room {room.room_number} - {room.number_of_beds} beds available
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>


            </Grid>
            <Grid item xs={12} sm={6} sx={{mt:'-1rem'}}>
                {/* Number of Beds Selection */}
                {!wantPrivacy && (
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="demo-simple-select-label">Number of Beds</InputLabel>
                        <Select
                            required
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name='rented_bed_number'
                            label="Number of Beds"
                            value={formData.rented_bed_number}
                            onChange={handleNumOfBedsChange}>
                            {[...Array(bedsAvailable)].map((_, index) => (
                                <MenuItem key={index + 1} value={index + 1}>
                                    {/* {index + 1} bed{index + 1 > 1 ? "s" : ""} */}
                                    bed {index + 1}
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
            <Grid item xs={12}>
                {/* Information message */}
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt:'-1rem', fontSize: '12px', color: 'gray'}}>
                    <InfoOutlinedIcon fontSize="small" sx={{ mr: 1,}} />
                    Please check this if necessary
                </Typography>
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
