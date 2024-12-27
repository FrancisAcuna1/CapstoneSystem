'use client';
import React, { useState, useEffect} from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, TextField, Grid, FormHelperText, FormControl, MenuItem, Autocomplete, CircularProgress, Tooltip, IconButton} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Swal from 'sweetalert2'; 
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled, alpha, useTheme, css } from '@mui/system';
import { useSnackbar } from 'notistack';
// const steps = ['Tenant Information', 'Account Creation', 'Unit Details'];
const GeneralTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    '& .MuiTooltip-tooltip': {
      backgroundColor: '#263238', // Background color of the tooltip
      color: '#ffffff', // Text color
      borderRadius: '4px',
    },
});

// Municipality codes for Sorsogon
const SORSOGON_MUNICIPALITIES = [
    { code: '056202000', name: 'Barcelona' },
    { code: '056203000', name: 'Bulan' },
    { code: '056204000', name: 'Bulusan' },
    { code: '056205000', name: 'Casiguran' },
    { code: '056206000', name: 'Castilla' },
    { code: '056207000', name: 'Donsol' },
    { code: '056208000', name: 'Gubat' },
    { code: '056209000', name: 'Irosin' },
    { code: '056210000', name: 'Juban' },
    { code: '056211000', name: 'Magallanes' },
    { code: '056212000', name: 'Matnog' },
    { code: '056213000', name: 'Pilar' },
    { code: '056214000', name: 'Prieto Diaz' },
    { code: '056215000', name: 'Santa Magdalena' },
    { code: '056216000', name: 'Sorsogon City' }
];

const TenantRegistrationForm = ({details, setSuccessful, setError , loading, setLoading}) => {
    const {enqueueSnackbar} = useSnackbar();
    const [contact, setContact] = useState('');
    const [activeStep, setActiveStep] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [errors, setErrors] = useState({});
    const [allBarangays, setAllBarangays] = useState([]);
    const [municipalityCode, setMunicipalityCode] = useState('');
    const propDetails = details;
    const Property_Type = propDetails?.apartment?.property_type; // Default to empty string
    const ApartmentID = propDetails?.apartment?.id; 
    const Status = propDetails?.apartment?.status;
    const rentalFeeValue = parseInt(propDetails?.apartment?.rental_fee, 10) || 0;

    const [formData, setFormData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    contact: '',
    email: '',
    user_type: 'User',
    status: 'Active',
    username: '',
    password: '',
    street: '',
    barangay: '',
    municipality: '',
    rentalfee: rentalFeeValue,
    initial_payment: '',
    advancepayment:'',
    prepaidrentperiod:'',//this is the #of months for advance payment
    deposit: '',
    startDate: null,
    // endDate: null,
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
    console.log(rentalFeeValue)

  
    const handleClick = () => {
        setIsExpanded(!isExpanded);
    };

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;
    
        // First Name validation
        if (!formData.firstname) {
            tempErrors.firstname = 'First name is required';
            isValid = false;
        } else if (formData.firstname.length < 2) {
            tempErrors.firstname = 'First name must be at least 2 characters';
            isValid = false;
        }

        if(!formData.lastname){
            tempErrors.lastname = 'Last name is required';
            isValid = false;
        }else if (formData.lastname.length < 2) {
            tempErrors.lastname = 'First name must be at least 2 characters';
            isValid = false;
        }

        if(!formData.username){
            tempErrors.username = 'Username is required';
            isValid = false;
        }else if (formData.username.length < 8) {
            tempErrors.username = 'Username must be at least 8 characters';
            isValid = false;
        }

        if(!formData.password){
            tempErrors.password = 'Password is required';
            isValid = false;
        }else if (formData.password.length < 8) {
            tempErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        }

        // address validation
        if(!formData.street){
            tempErrors.street = 'Street Address is required';
            isValid = false;
        }else if (formData.street.length < 4) {
            tempErrors.street = 'Street Address must be at least 4 characters';
            isValid = false;
        }

        if(!formData.barangay){
            tempErrors.barangay = 'Barangay address is required';
            isValid = false;
        }else if (formData.barangay.length < 4) {
            tempErrors.barangay = 'Barangay must be at least 4 characters';
            isValid = false;
        }

        if(!formData.municipality){
            tempErrors.municipality = 'Municipality address is required';
            isValid = false;
        }else if (formData.municipality.length < 4) {
            tempErrors.municipality = 'Municipality must be at least 4 characters';
            isValid = false;
        }


        if(!formData.deposit){
            tempErrors.deposit = 'Deposit Amount is required';
            isValid = false;
        }
        if (isExpanded) {
            if (!formData.advancepayment) {
                tempErrors.advancepayment = 'Advance Payment Amount is required';
                isValid = false;
            }
            if (!formData.prepaidrentperiod) {
                tempErrors.prepaidrentperiod = 'Months of Advance Payment is required';
                isValid = false;
            }
        }

        // data
        if(!formData.startDate){
            tempErrors.startDate = 'Start Date is required';
            isValid = false;
        }
    
        // Email validation
        if (!formData.email) {
            tempErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email is invalid';
            isValid = false;
        }
    
        // Contact validation
        if (!formData.contact) {
            tempErrors.contact = 'Contact number is required';
            isValid = false;
        } else if (!/^\d{11}$/.test(formData.contact)) {
            tempErrors.contact = 'Contact must be 11 digits';
            isValid = false;
        }
    
        // Add more validations as needed for other fields...
    
        setErrors(tempErrors);
        return isValid;
    };

    console.log('code:', municipalityCode);
    
    useEffect(() => {
        const fetchedDataAddress = async() => {
            try{
                const response = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${municipalityCode}/barangays`,{
                    method: 'GET',
                    headers: {  
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                })
                const data = await response.json();
                if(response.ok){
                    console.log('data:', data);
                    setAllBarangays(data);
                }else{
                    console.log('error:', response.status);
                }
            }catch(error){
                console.error(error);
            }
        }
        fetchedDataAddress();
    },[municipalityCode, setAllBarangays])

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
        const userData = JSON.parse(userDataString); // parse the datastring into json 
        const accessToken = userData.accessToken;

        const updatedPrepaidRentPeriod = (formData.prepaidrentperiod || 0) + 1;

        const formattedFormData = {
            ...formData,
            prepaidrentperiod: updatedPrepaidRentPeriod,
            startDate: dayjs(formData.startDate).format('MM/DD/YYYY'),
        };
        console.log(formattedFormData)
        if(accessToken){
            setLoading(true);
            try{

                const response = await fetch(`http://127.0.0.1:8000/api/apartment_tenant_registration`,{
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
                    // localStorage.setItem('successMessage', data.message || 'Operation Sucess!');
                    window.history.back();
                    Swal.fire({
                        title: 'Success!',
                        text: 'Tenant Registered Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    setLoading(false)
                }else{
                    setLoading(false);
                    if(data.error)
                    {
                        console.log(data.error)
                        localStorage.setItem('errorMessage', data.message || 'Operation Error!');
                        window.location.reload();
                        // setError(data.error)
                    
                    }else{
                        if (response.status === 422) {
                            const validationErrors = data.message; // Assuming Laravel validation response
                            Object.keys(validationErrors).forEach((field) => {
                                console.log(`${field}: ${validationErrors[field].join(', ')}`);
                                // Optionally, display errors for each field in your UI
                                enqueueSnackbar(`${validationErrors[field].join(', ')}`, { variant: 'error' });
                            });
                        } else {
                            enqueueSnackbar(data.message || 'An unexpected error occurred.', { variant: "error" });
                        }
                    }
                }
            }catch(error){
                console.error(error);
            }
        }
    }
    
    useEffect(() => {
        if (propDetails?.apartment) {
            setFormData(prevFormData => ({
                ...prevFormData,
                rented_unit_type:Property_Type,
                rented_unit_id: ApartmentID,
                rentalfee: rentalFeeValue,
                
            }))
        }
    },[propDetails, Property_Type, ApartmentID, rentalFeeValue])

    useEffect(() => {
        if(formData.prepaidrentperiod && formData.rentalfee){
            const CalculateAdvancePayment = formData.prepaidrentperiod * formData.rentalfee
            setFormData(prevState => ({
                ...prevState,
                advancepayment: CalculateAdvancePayment,
            }));
            
            setErrors(prevErrors => ({
                ...prevErrors,
                advancepayment: '',
            }))
        } 
    },[formData.prepaidrentperiod, formData.rentalfee]);

    useEffect(() => {
        if (formData.rentalfee && !formData.initial_payment) {
        // Set initial payment to rental fee if it's not already set
        setFormData(prevState => ({
            ...prevState,
            initial_payment: formData.rentalfee, // Assuming initial payment is same as rental fee
        }));
        }
    }, [formData.rentalfee, formData.initial_payment, setFormData]);

    // Handle municipality change
    const handleMunicipalityChange = (event) => {
        const selectedMunicipalityName = event.target.value;
        const selectedMunicipality = SORSOGON_MUNICIPALITIES.find(
            m => m.name === selectedMunicipalityName
        );

        // Update form data with selected municipality
        setFormData(prev => ({
            ...prev,
            municipality: selectedMunicipalityName,
            barangay: '' // Reset barangay when municipality changes
        }));

        // Set the municipality code for fetching barangays
        if (selectedMunicipality) {
            setMunicipalityCode(selectedMunicipality.code);
        }
        setErrors(prev => ({
            ...prev,
            municipality: ''  
        }));
    };

    // Handle barangay change
    const handleBarangayChange = (event) => {
        const { value } = event.target;
        setFormData(prev => ({
        ...prev,
        barangay: value
        }));

        
        setErrors(prev => ({
            ...prev,
            barangay: ''  
        }));
    };

     // Remove duplicates by preferring non-district entries
    const uniqueBarangays = Object.values(allBarangays.reduce((acc, current) => {
        // If we haven't seen this barangay name before, add it
        if (!acc[current.name]) {
        acc[current.name] = current;
        } else {
        // If we have seen it before, prefer the one without an oldName
        if (!current.oldName || (current.oldName && !acc[current.name].oldName)) {
            acc[current.name] = current;
        }
        }
        return acc;
    }, {}));

    // Sort barangays alphabetically
    const sortedBarangays = uniqueBarangays.sort((a, b) => 
        a.name.localeCompare(b.name)
    );


    const handleChange = (event) => {
        // Clear error when field is modified
        if (errors[event.target.name]) {
            setErrors(prev => ({
            ...prev,
            [event.target.name]: ''
            }));
        }
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
        if (value) {
            setErrors(prev => ({ ...prev, [name]: '' })); // Clear error if valid
        }
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


    return (
    <Box sx={{ width: '100%' }} onSubmit={handleSubmit} component="form"  noValidate>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
                <Typography variant='h6' letterSpacing={2} sx={{fontWeight:600, fontSize:{xs:'18px', sm:'22px', md:'22px', lg:'22px'}}} gutterBottom>
                   TENANT REGISTRATION FORM
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt:'0.2rem',  mb:'-0.1rem', fontSize: '14px', color: '#424242'}}>
                    <InfoOutlinedIcon fontSize="small" sx={{ mr: 1,}} />
                    Tenant Information
                </Typography>
           </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                name="firstname"
                label="First Name"
                value={formData.firstname}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(errors.firstname)} // Add error prop
                helperText={errors.firstname} 
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
                error={Boolean(errors.lastname)} // Add error prop
                helperText={errors.lastname} 
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
            <Grid item xs={12} sm={6} sx={{mt:'0.99rem'}}>
                <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(errors.email)} // Add error prop
                helperText={errors.email} 
                />
            </Grid>
            <Grid item xs={12} sm={6} sx={{mt:'0.99rem'}}>
                <TextField
                    name="contact"
                    label="Contact Number"
                    value={contact}
                    onChange={handleContactChange}
                    fullWidth
                    required
                    error={Boolean(errors.contact)} // Add error prop
                    helperText={errors.contact} 
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
                ex: +63/09 936 9223 915
                </FormHelperText>
                
            </Grid>
            {/* <Grid item xs={12}>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt:'0.2rem', mb:'-1rem', fontSize: '14px',  color: '#424242'}}>
                    <InfoOutlinedIcon fontSize="small" sx={{ mr: 1,}} />
                    Tenant Address
                </Typography>
           </Grid> */}
            <Grid item xs={12} sm={4} sx={{mt:-1}}>
                <TextField 
                    id="street" 
                    label="Street" 
                    name='street' 
                    value={formData.street}
                    onChange={handleChange}
                    variant="outlined" 
                    fullWidth margin="normal" 
                    autoFocus 
                    autoComplete='street'
                    required
                    error={Boolean(errors.street)} // Add error prop
                    helperText={errors.street} 
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
            <FormControl fullWidth required error={Boolean(errors.barangay)} sx={{ mt: 2 }}>
                <Autocomplete
                id="municipality-autocomplete"
                options={sortedBarangays}
                disabled={!formData.municipality}
                getOptionLabel={(option) => option.name || ''}
                value={allBarangays.find(mun => mun.name === formData.barangay) || null}
                onChange={(event, newValue) => {
                    handleBarangayChange({
                        target: { value: newValue ? newValue.name : '' }
                    });
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Barangay"
                        required
                        error={Boolean(errors.barangay)}
                        helperText={errors.barangay}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading && <CircularProgress color="inherit" size={20} />}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
                loading={loading}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                renderOption={(props, option) => (
                    <li {...props} key={option.code}>
                        {loading && <CircularProgress color="inherit" size={20} />}
                        {option.name} 
                    </li>
                )}
                fullWidth
                // Add these props for better UX
                autoComplete
                autoHighlight
                clearOnEscape
                />
            </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} sx={{mt:1}}>
                <FormControl fullWidth required error={Boolean(errors.municipality)}>
                <Autocomplete
                    id="municipality-autocomplete"
                    options={SORSOGON_MUNICIPALITIES}
                    getOptionLabel={(option) => option.name || ''}
                    value={SORSOGON_MUNICIPALITIES.find(mun => mun.name === formData.municipality) || null}
                    onChange={(event, newValue) => {
                        handleMunicipalityChange({
                            target: { value: newValue ? newValue.name : '' }
                        });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Municipality"
                            required
                            error={Boolean(errors.municipality)}
                            helperText={errors.municipality}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading && <CircularProgress color="inherit" size={20} />}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                    loading={loading}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    renderOption={(props, option) => (
                        <li {...props} key={option.code}>
                            {option.name}
                        </li>
                    )}
                    fullWidth
                    // Add these props for better UX
                    autoComplete
                    autoHighlight
                    clearOnEscape
                />
                </FormControl>
            </Grid>
           <Grid item xs={12}>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt:'0.7rem',  mb:'0rem', fontSize: '14px', color: '#424242'}}>
                    <InfoOutlinedIcon fontSize="small" sx={{ mr: 1,}} />
                    Account Creation
                </Typography>
           </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(errors.username)} // Add error prop
                helperText={errors.username}
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
                error={Boolean(errors.password)} // Add error prop
                helperText={errors.password}
                />
            </Grid>
            {/* this is for unit details */}
            <Grid item xs={12}>
                    {/* Information message */}
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt:'1.5rem', mb:{xs:'-2.2rem', lg:'-1rem'}, fontSize: '14px',  color: '#424242'}}>
                <InfoOutlinedIcon fontSize="small" sx={{ mr: 1,}} />
                Rental Details
            </Typography>
            </Grid>

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
              <LocalizationProvider error={Boolean(errors.startDate)} dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Start Date"
                    name="startDate"
                    sx={{width: '100%'}}
                    value={formData.startDate}
                    onChange={(newValue) => handleDateChange('startDate', newValue)}
                    fullWidth
                    error={Boolean(errors.startDate)} 
                    slotProps={{
                        textField: {
                          error: Boolean(errors.startDate),
                          helperText: errors.startDate,
                          fullWidth: true
                        }
                    }}// Add error prop
                    // renderInput={(params) =>(
                    //     <TextField
                    //     {...params} 
                    //     fullWidth />
                    // )}
                />
              </LocalizationProvider>
            </Grid>
            {/* <Grid item xs={12} sm={6}>
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
            </Grid> */}
            <Grid item xs={12} sm={6}>
                <TextField
                name="rentalfee"
                label="Rental Fee"
                type='number'
                value={formData.rentalfee}
                onChange={handleChange}
                InputProps={{readOnly: true}}
                fullWidth
                required
                error={Boolean(errors.rentalfee)} // Add error prop
                helperText={errors.rentalfee}
                />
            </Grid>
            <Grid item xs={12} sm={6}  sx={{mt:'0.9rem'}}>
                <TextField
                name="initial_payment"
                label="Initial Payment"
                type='number'
                value={formData.initial_payment}
                onChange={handleChange}
                fullWidth
                required
                aria-readonly
                error={Boolean(errors.deposit)} // Add error prop
                helperText={
                    errors.deposit 
                    ? errors.deposit 
                    : 'Initial payment is usually the first month’s rent.' // Add explanation note
                }
                InputProps={{
                    inputProps: { 
                        min: 1,  // Set minimum value to 1
                        step: "1" // Allow only whole numbers
                    },
                    readOnly: true
                }}
                onKeyDown={(e) => {
                // Prevent 'e', 'E', '+', and '-' from being entered
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                    e.preventDefault();
                }
                }}
                
                />
            </Grid>
            <Grid item xs={12} sm={6}  sx={{mt:'0.9rem'}}>
                <TextField
                name="deposit"
                label="Payment Deposit Amount"
                type='number'
                value={formData.deposit}
                onChange={handleChange}
                fullWidth
                required
                aria-readonly
                error={Boolean(errors.deposit)} // Add error prop
                helperText={errors.deposit}
                InputProps={{
                    inputProps: { 
                        min: 1,  // Set minimum value to 1
                        step: "1" // Allow only whole numbers
                    }
                }}
                onKeyDown={(e) => {
                // Prevent 'e', 'E', '+', and '-' from being entered
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                    e.preventDefault();
                }
                }}
                
                />
            </Grid>
            <Grid item xs={12}>
                <GeneralTooltip title="Show the fields of Advance payment">
                    <IconButton>
                        <InfoOutlinedIcon sx={{color:'#607d8b'}}/>
                    </IconButton>
                </GeneralTooltip>
                <Button
                    variant="text"
                    color="primary"
                    onClick={handleClick}
                    style={{ textDecoration: 'underline', fontWeight: 500, marginLeft:'-10px' }}
                >
                    {isExpanded ? 'Show less...' : 'Show more...'}
                </Button>
                
            </Grid>
            {isExpanded && (
            <>
            <Grid item xs={12} sm={6} sx={{mt:1}}>
                <TextField
                label="Months of Advance Payment"
                name="prepaidrentperiod"
                select
                value={formData.prepaidrentperiod}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(errors.prepaidrentperiod)} // Add error prop
                helperText={errors.prepaidrentperiod}
                >
                    {[1, 2, 3, 4, 5, 6].map((month) => (
                    <MenuItem key={month} value={month}>
                        {month}
                    </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12} sm={6} sx={{mt:'0.5rem'}}>
                <TextField
                name="advancepayment"
                label="Advance Payment Amount"
                type='number'
                // defaultValue={formData.advancepayment}
                value={formData.advancepayment}
                onChange={handleChange}
                fullWidth
                required
                // aria-readonly
                InputProps={{
                    inputProps: { 
                        min: 1,  // Set minimum value to 1
                        step: "1" // Allow only whole numbers
                    },
                    readOnly: true
                }}
                error={Boolean(errors.advancepayment)} // Add error prop
                helperText={errors.advancepayment}
                onKeyDown={(e) => {
                // Prevent 'e', 'E', '+', and '-' from being entered
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                    e.preventDefault();
                }
                }}
                />
            </Grid>
            </>
            )}
            
            
            <Grid item xs={12} sm={4}>
            <Button
                variant="outlined"
                fullWidth
                sx={{
                    fontSize: '16px',
                    marginTop: '10px',
                    borderRadius: '10px',
                    padding: '10px',
                    color: '#000',
                    borderColor: '#000',
                    mt:'1.1rem',
                    '&:hover': {
                        backgroundColor: '#f5f5f5',
                        borderColor: '#000',
                    },
                }}
                onClick={() => {
                    setErrors({})
                    setFormData({
                        firstname: '',
                        middlename: '',
                        lastname: '',
                        contact: '',
                        email: '',
                        user_type: 'User',
                        status: 'Active',
                        username: '',
                        password: '',
                        street: '',
                        barangay: '',
                        municipality: '',
                        rentalfee: rentalFeeValue,
                        initial_payment: '',
                        deposit: '',
                        startDate: null,
                        advancepayment: '',
                        prepaidrentperiod:'',
                        rented_unit_type: Property_Type,
                        rented_unit_id: ApartmentID,
                        Newstatus: 'Occupied',
                    });
                    setContact('')
                }}
            >
                Clear
            </Button>
            </Grid>
            <Grid item xs={12} sm={8}>
            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  fontSize: '16px',
                  marginTop: '16px',
                  borderRadius: '10px',
                  padding: '12px',
                  background: 'primary',
                  '&:hover': { backgroundColor: '#9575cd' },
                  letterSpacing: '2px'
                }}
              >
                Register
            </Button>
            </Grid>            
        </Grid>
    </Box>
    );
};

export default TenantRegistrationForm;
