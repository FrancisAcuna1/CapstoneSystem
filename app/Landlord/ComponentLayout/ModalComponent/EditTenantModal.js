'use client'
import React, { useEffect } from "react"
import { useState } from "react"
import { Grid, Box, Paper, Typography, Button, Divider, Link, Fade, Breadcrumbs, TextField,FormHelperText} from '@mui/material';
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
        border-radius: 18px;
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
  


export default function EditTenantModal({open, handleOpen, handleClose,setLoading, setSuccessful, setError, error, editItem, setEditItem}){
    const [contact, setContact] = useState('');
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
  }, [editItem, setFormData])


  const handleSubmit = async(e) => {
    e.preventDefault()
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

  
  }, []);

  
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