'use client'

import React, { useEffect } from "react"
import { useState } from "react"
import { Grid, Box, Paper, Typography, Button, Divider, Link, Fade, Breadcrumbs, TextField, FormControl, FormHelperText, Autocomplete, Accordion, AccordionSummary, AccordionDetails, InputLabel, Select, MenuItem} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Modal as BaseModal } from '@mui/base/Modal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PropTypes from 'prop-types';
import { styled, css, } from '@mui/system'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import useSWR from "swr";
import { useSnackbar } from "notistack";



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
    width: 400,
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
      border-radius: 8px;
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      box-shadow: 0 4px 12px
        ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
      padding: 24px;
      color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};
  
      & .modal-title {
        margin: 0;
        line-height: 1.5rem;
        margin-bottom: 8px;
      }
  
      & .modal-description {
        margin: 0;
        line-height: 1.5rem;
        font-weight: 400;
        color: ${theme.palette.mode === 'dark' ? grey[400] : grey[800]};
        margin-bottom: 4px;
      }
    `,
  );
  
  const TriggerButton = styled(Button)(
    ({ theme }) => css`
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1.5;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 150ms ease;
      cursor: pointer;
      background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  
      &:hover {
        background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
        border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
      }
  
      &:active {
        background: ${theme.palette.mode === 'dark' ? grey[700] : grey[100]};
      }
  
      &:focus-visible {
        box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
        outline: none;
      }
    `,
  );

  const fetcher = async ([url, token]) => {
    const response = await fetch(url ,{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
    if(!response.ok){
        throw new Error(response.statusText);
    }
    return response.json();
  }


const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable

export default function AddPaymentTransaction({open, handleOpen, handleClose, setLoading, setSuccessful, isEdit, setIsEdit, editPayment, setEditPayment}){
    const { enqueueSnackbar } = useSnackbar();
    const [errors, setErrors] = useState({});
    const [tenantlist, setTenantList] = useState([]);
    const [paymentData, setPaymentData] = useState({
        tenant_id:'',
        amount: '', 
        payment_date: null,
        transaction_type: '',
        status: 'Paid'
    })

    console.log('tenant:', tenantlist)
    console.log('ID:', editPayment)
    console.log('payment:', paymentData)
    console.log('editId:', editPayment)
    console.log('edit is status:', isEdit);

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!paymentData.tenant_id) {
            tempErrors.tenant_id = 'tenant_name is required';
            isValid = false;
        }

        if (!paymentData.amount) {
            tempErrors.amount = 'Amount is required';
            isValid = false;
        }
        if (!paymentData.payment_date) {
            tempErrors.payment_date = 'Payment date is required';
            isValid = false;
        }
        if (!paymentData.transaction_type) {
            tempErrors.transaction_type = 'Transaction type is required';
            isValid = false;
        }
        if (!paymentData.status) {
            tempErrors.status = 'Status type is required';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid; 
       
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('Handle Change:', { name, value });
        setPaymentData({
            ...paymentData,
            [name]: value
        });

        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    }

    const getUserToken = () => {
        const userDataString = localStorage.getItem('userDetails');
        const userData = JSON.parse(userDataString); 
        const accessToken = userData.accessToken;
        return accessToken;
    }
    const token = getUserToken();

    const {data: response, error} = useSWR(
        editPayment && [`${API_URL}/editpayment/${editPayment}`, token] || null,
        fetcher, {
            refreshInterval: 1000,
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            errorRetryCount: 3,
        }
    )
    console.log(error)
    useEffect(() => {
        if (response?.data) {
            const editData = response?.data[0] || '';
            setPaymentData({
                tenant_id: editData.tenant_id || '',
                amount:  editData.amount ? parseFloat(editData.amount).toFixed(0) : '', 
                payment_date: dayjs(editData.date) || null,
                transaction_type: editData?.transaction_type || '',
                status: editData.status || 'Paid'
            });
        }
    }, [response])

    useEffect(() => {
        const fetchedTenantList = async() => {
            const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
            const userData = JSON.parse(userDataString); // parse the datastring into json 
            const accessToken = userData.accessToken;

            if(accessToken){
                try{
                    const response = await fetch(`${API_URL}/listoftenants`,{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        }
                    })

                    const data = await response.json()

                    if(response.ok){
                        setTenantList(data.data)
                        console.log(data.data)
                    }else{
                        console.log('Error Message', data.message);
                        console.log('ResponseError:', response.status);
                    }
                }catch(error){
                    console.error('Error', error);
                }
            }else{
                console.log('No access token found')
            }
        }
        fetchedTenantList();
    }, [])


    const handleSubmit = async(e) => {
        e.preventDefault();
        // Validate form before submission
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }

        setLoading(true);

        const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
        const userData = JSON.parse(userDataString); // parse the datastring into json 
        const accessToken = userData.accessToken;
    

        const formattedFormData = {
            ...paymentData,
            payment_date: dayjs(paymentData.payment_date).format('MM/DD/YYYY'),
            paid_for_month: null
        };

        if(accessToken){
            try{
                const method = editPayment ? 'PUT' : 'POST';
                const endpoint = editPayment 
                ? `${API_URL}/updatepayment/${editPayment}`  
                : `${API_URL}/storepayment`
                    
                const response = await fetch(endpoint,{
                method,
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, 
                },
                body: JSON.stringify(formattedFormData)
                })

                const data = await response.json();
                
                if(response.ok){
                    setLoading(false);
                    setIsEdit(false);
                    handleClose()
                    setPaymentData({
                        tenant_id:'',
                        amount: '', 
                        payment_date: null,
                        transaction_type: '',
                        status: 'Paid'
                    })
                    enqueueSnackbar(data.message, { variant: "success" });
                }else{
                    setLoading(false);
                    setIsEdit(false);
                    handleClose();
                    console.log(data.error)
                    enqueueSnackbar(data.message, { variant: "error" });
                }

            }catch(error){
                console.error('Error to Submit', error);
                console.error('Fetch Error:', {
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                });
        
                // More detailed error handling
                if (error instanceof TypeError) {
                    // Network error or CORS issue
                    setErrorMessage('Network error. Please check your connection and server.');
                } else {
                    // API or other errors
                    setErrorMessage(error.message || 'An unexpected error occurred');
                }
            }finally{
                setLoading(false);
                console.log("Error")
            }
        }else{
            console.log("No token Available")
        }

    }

    const handleTenant = (selectedTenant) => {
        if (selectedTenant) {
            setPaymentData(prev => ({
                ...prev,
                tenant_id: selectedTenant.id, // Set tenant_id
            }));
            
        }else{
            setPaymentData(prev => ({
                ...prev,
                tenant_id: '', 
            }))
        }
        setErrors(prev => ({
            ...prev,
            tenant_id: ''
        }));
    };

    const handleDateChange = (name, value) => {
        setPaymentData({
          ...paymentData,
          [name]: value,
        });
        if (value) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };




  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt:1.5, }}>
        <Button variant="contained"  onClick={handleOpen}  sx={{ borderRadius: '10px', p:1.1, mb: 2,  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)'}}>
            <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
            Add New Payment
        </Button>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={() => {
                handleClose()
                setIsEdit(false);
                setErrors({})
                setPaymentData({
                    tenant_id:'',
                    amount: '', 
                    payment_date: null,
                    transaction_type: '',
                    status: 'Paid'
                })
            }}
            closeAfterTransition
            slots={{ backdrop: StyledBackdrop }}
        >
            <Fade in={open}>
            <ModalContent  style={{ width: '90%', maxWidth: '840px', }}> 
            <Typography variant='h4' letterSpacing={3} sx={{ fontSize: '20px' }}>
               {editPayment ? 'Edit Payment' : 'Add New Payment'}
            </Typography>
            <Box onSubmit={handleSubmit} component="form"  noValidate>          
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} sx={{mt:{xs:'2rem', lg:'1rem'},}}> 
                    <FormControl fullWidth required error={Boolean(errors.tenant_id)} >
                        <Autocomplete
                            id="tenant-autocomplete"
                            options={tenantlist}
                            getOptionLabel={(option) => `${option.firstname} ${option.lastname}` || ''}
                            value={tenantlist.find(tenant => tenant.id === paymentData.tenant_id) || null}
                            onChange={(event, newValue) => {
                            
                                handleTenant(newValue); // Pass the entire newValue
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Tenant Name"
                                    required
                                    error={Boolean(errors.tenant_id)}
                                    helperText={errors.tenant_id}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: params.InputProps.endAdornment,
                                    }}
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.id === value.id} // Compare IDs
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.firstname} {option.lastname}
                                </li>
                            )}
                            autoComplete
                            autoHighlight
                            clearOnEscape
                        />
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{mt:'1rem'}}>
                    <FormControl fullWidth error={Boolean(errors.transaction_type)}>
                        <InputLabel id="demo-simple-select-label" error={Boolean(errors.transaction_type)}>Transaction Type</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="transaction_type"
                        value={paymentData.transaction_type || ''}
                        label="Transaction Type"
                        onChange={handleChange}
                        error={Boolean(errors.transaction_type)}
                        helperText={errors.transaction_type}
                        >
                        {[
                        'Advance Payment',
                        'Rental Fee',
                        'Intial Payment',
                        'Penalties', 
                        'Extra Amenities', 
                        'Damage Compensation', 
                        'Replacement Fee'
                        ]
                        .filter(type => 
                        isEdit === true || 
                        type !== 'Advance Payment' && 
                        type !== 'Rental Fee' && type !== 'Intial Payment'
                        )
                        .map(type => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                        ))}
                        </Select>
                        {errors.transaction_type && (
                        <FormHelperText 
                        error 
                        sx={{
                            marginLeft: '14px',
                            marginRight: '14px',
                            fontSize: '0.75rem',
                        }}
                        >
                        {errors.transaction_type}
                        </FormHelperText>
                        )}
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{mt:{xs:'1rem', lg:'1rem'},}}>
                        <LocalizationProvider error={Boolean(errors.payment_date)} dateAdapter={AdapterDayjs} >
                            <DatePicker
                                label="Payment Date"
                                name="payment_date"
                                sx={{width: '100%',}}
                                value={paymentData.payment_date}
                                onChange={(newValue) => handleDateChange('payment_date', newValue)}
                                fullWidth
                                error={Boolean(errors.payment_date)} // Add error prop
                                slotProps={{
                                    textField: {
                                      error: Boolean(errors.payment_date),
                                      helperText: errors.payment_date,
                                      fullWidth: true
                                    }
                                  }}
                            />
                        </LocalizationProvider>
                        
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            type='number'
                            id="amount"
                            label="Amount Payment"
                            name="amount"
                            value={paymentData.amount || ''}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            error={Boolean(errors.amount)}
                            helperText={errors.amount}
                            onKeyDown={(e) => {
                                // Prevent 'e', 'E', '+', and '-' from being entered
                                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                  e.preventDefault();
                                }
                            }}
                        
                        />
                    </Grid>
                </Grid>
                <Button 
                    variant='contained'
                    type='submit' 
                    sx={{
                        width: '100%',background: '#7e57c2','&:hover': {backgroundColor: '#9575cd',}, padding: '8px', fontSize: '16px', mt:4 
                    }}
                >
                    Add
                </Button>
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
                onClick={() => {
                    handleClose()
                    setErrors({})
                    setIsEdit(false);
                    setPaymentData({
                        tenant_id:'',
                        amount: '', 
                        payment_date: null,
                        transaction_type: '',
                        status: 'Paid'
                    })
                }}
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