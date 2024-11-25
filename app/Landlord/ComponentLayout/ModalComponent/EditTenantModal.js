'use client'
import React, { useEffect } from "react"
import { useState } from "react"
import { Grid, Box, Paper, Typography, Button, Divider, Link, Fade, Breadcrumbs, TextField,FormHelperText, FormControl, MenuItem, Autocomplete, CircularProgress,} from '@mui/material';
import { Modal as BaseModal } from '@mui/base/Modal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PropTypes from 'prop-types';
import { styled, css, } from '@mui/system'




const Backdrop = React.forwardRef((props, ref) => {
    const { open, ...other } = props;
    return (
      <Fade in={open}>
        <div ref={ref} {...other} />
      </Fade>
    );
  });
  Backdrop.displayName = 'Backdrop';
  // Backdrop.propTypes = {
  //   open: PropTypes.bool,
  // };
  
  const blue = {
    200: '#99CCFF',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0066CC',
  };
  
  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };
  
  const Modal = styled(BaseModal)`
    position: fixed;
    z-index: 1300;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const StyledBackdrop = styled(Backdrop)`
    z-index: -1;
    position: fixed;
    inset: 0;
    background-color: rgb(0 0 0 / 0.5);
    -webkit-tap-highlight-color: transparent;
  `;
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
  };

  const ModalContent = styled('div')(
    ({ theme }) => css`
        font-family: 'IBM Plex Sans', sans-serif;
        font-weight: 500;
        text-align: start;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow: hidden;
        background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
        border-radius: 10px;
        border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
        box-shadow: 0 4px 12px
            ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
        padding: 24px;
        color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};
        width: 100%;
        max-width: 5000px;
        max-height: 90vh; /* Ensures it does not overflow vertically */
        overflow-y: auto; /* Adds scrolling if content is too large */
  
        @media (min-width: 600px) {
            width: 400px;
            padding: 20px; /* Adjust padding for larger screens */
        }
  
        @media (max-width: 600px) {
            width: 95%; /* Adjusts the width for mobile screens */
            padding: 16px; /* Reduce padding for smaller screens */
        }
        
    `,
  );


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



export default function EditTenantModal({open, handleOpen, handleClose, loading, setLoading, setSuccessful, setError, error, editItem, setEditItem}){
    const [contact, setContact] = useState('');
    const [municipalityCode, setMunicipalityCode] = useState('');
    const [allBarangays, setAllBarangays] = useState([]);
    const [formError, setFormError] = useState({})
    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        contact: '',
        email: '',
        street: '',
        barangay: '',
        municipality: '',
        user_type: 'User',
    });

  console.log('ID:', editItem)
  console.log('EditItem:'. formData)
  console.log('contact:', contact)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value
    });
  }

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

    setFormError(tempErrors);
    return isValid;
  };

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

  useEffect(() => {
    const fetchDataEdit = async () => {
      const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json 
      const accessToken = userData.accessToken;
      if(accessToken){
        console.log('Token:', accessToken)
        try{

          const response = await fetch(`http://127.0.0.1:8000/api/edit_tenant/${editItem}`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',  
              'Authorization': `Bearer ${accessToken}`,
            }
          })

          const data = await response.json();
          console.log(data)

          if(response.ok){
            setFormData(data.data || formData)
            setContact(data.data.contact || '')
            // setAddEquipment(data)
          }else{
            console.log(data.message); // for duplicate entry
            setError(data.message);
          }

        }catch(error){
          console.error('Error', error);
        }finally{
          console.log(error);
        }
      }
    }
    fetchDataEdit();
  }, [editItem, setFormData, error, setError, formData])


  const handleSubmit = async(e) => {
    e.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    setLoading(true);

    const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json 
    const accessToken = userData.accessToken;
  
    if(accessToken){
      try{
        // const method = editItem ? 'PUT' : 'POST';
        // const endpoint = editItem 
        // ? `http://127.0.0.1:8000/api/update_tenant/${editItem}`  
        // : 'http://127.0.0.1:8000/api/store_inclusion' 
            
        const response = await fetch(`http://127.0.0.1:8000/api/update_tenant/${editItem}`,{
          method: 'PUT',
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, 
            'Accept': 'application/json',
          },
          body: JSON.stringify(formData)
        })

        const data = await response.json();
     
        if(response.ok){
          // setLoading(false);
          handleClose()
          localStorage.setItem('successMessage', data.message || 'Operation Sucess!');
          window.location.reload();
        }else{
          setLoading(false);
          if(data.error)
          {
            handleClose();
            console.log(data.error)
            localStorage.setItem('errorMessage', data.message || 'Operation Error!');
            window.location.reload();
            // setError(data.error)
          
          }else{
            console.log(data.message); // for duplicate entry
            setError(data.message);
            handleClose();
          }
        }

      }catch(error){
        console.error('Error to Submit', error);
      }finally{
        setLoading(false);
        console.log("Error")
      }
    }

  }

  useEffect(() => {
    const successMessage = localStorage.getItem('successMessage');
    const errorMessage = localStorage.getItem('errorMessage')
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

  
  }, [setSuccessful, setError]);

  
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
    setFormError(prev => ({
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

      
      setFormError(prev => ({
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



  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt:1.5, }}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={open}>
        <ModalContent style={{ width: '90%', maxWidth: '720px' }}>
          <Typography variant='h1' letterSpacing={3} sx={{ fontSize: '20px', mt:0.5}}>Edit Tenant Information</Typography>
          <Box onSubmit={handleSubmit} component="form"  noValidate>          
            <Grid container spacing={2} sx={{mt:1}}>
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
                  <FormControl fullWidth required error={Boolean(formError.barangay)} sx={{ mt: 2 }}>
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
                        error={Boolean(formError.barangay)}
                        helperText={formError.barangay}
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
                  <FormControl fullWidth required error={Boolean(formError.municipality)}>
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
                        error={Boolean(formError.municipality)}
                        helperText={formError.municipality}
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
            </Grid>
            <Button variant='contained' type='submit' sx={{width: '100%',background: 'primary','&:hover': {backgroundColor: '#b6bdf1',}, padding: '8px', fontSize: '16px', mt:4 }}>Submit </Button>
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
                '&:hover': {
                    backgroundColor: '#f5f5f5',
                    borderColor: '#000',
                },
            }}
            onClick={handleClose}
            // onClick={() => {
            //   handleClose()
            //   setEditItem(null);
            //   setNewApartment({
            //     propertyid: propertyId,
            //     apartmentname: '',
            //     capacity: '',
            //     rentalfee: '',
            //     payorname:'none',
            //     apartmentstatus:'',
            //     buildingno: '' ,
            //     street: '',
            //     barangay: '' ,
            //     municipality: 'Sorsogon City' ,
            //   })
            //   setNewBoardinghouse({
            //     propertyid: propertyId,
            //     boardinghousename: '',
            //     rentalfee: '',
            //     payorname:'none',
            //     boardinghousestatus:'',
            //     buildingno: '' ,
            //     street: '',
            //     barangay: '' ,
            //     municipality: 'Sorsogon City' ,
            //   })
            //   setSelectedImage(null);
            //   setSelectedProperty('')
            // }}
            >
            Cancel
            </Button>
        </Box>
        </ModalContent>
        </Fade>
      </Modal>
    </Box>
  )
}