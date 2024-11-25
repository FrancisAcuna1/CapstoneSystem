'use client'

import React, { useEffect } from "react"
import { useState } from "react"
import Image from "next/image";
import { Grid, Box, Paper, Typography, Button, Divider, Link, Fade, Breadcrumbs, TextField, FormControl, FormHelperText, Autocomplete, IconButton, Accordion, AccordionSummary, AccordionDetails, InputLabel, Select, MenuItem, Checkbox, FormControlLabel} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Modal as BaseModal } from '@mui/base/Modal';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled, css, } from '@mui/system'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Category, Description } from "@mui/icons-material";




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


export default function AddRecurringExpenses({openRecurringModal, handleOpenModal, handleCloseModal, setLoading, setSuccessful, setError, error, editItemId}){
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState({})
    const [unitList, setUnitList] = useState([]);
    const [formData, setFormData] = useState({
        unitId: '',
        type: '',
        amount: '',
        description: '',
        category: '',
        frequency: '',
        type_of_bills: '',
        startDate: null,
        endDate: null,
        includeWeekends: true,
    })

    console.log('tenant:', unitList);
    console.log(formData)
    console.log(editItemId)

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!formData.description) {
            tempErrors.description = 'description is required';
            isValid = false;
        }
        if (!formData.amount) {
            tempErrors.amount = 'Amount is required';
            isValid = false;
        }
        if (!formData.startDate) {
            tempErrors.startDate = ' Start date is required';
            isValid = false;
        }
        if (!formData.endDate) {
        tempErrors.endDate = ' End date is required';
        isValid = false;
        }
        if (!formData.category) {
            tempErrors.category = 'Transaction type is required';
            isValid = false;
        }
        if (!formData.frequency) {
            tempErrors.frequency = 'Frequency type is required';
            isValid = false;
        }
        if (!formData.unitId){
        tempErrors.unitId = 'Unit type is required';
        isValid = false;
        }

        if(formData.category === 'utility bill' && !formData.type_of_bills){
        tempErrors.unitId = 'Type of bill is required';
        isValid = false;
        }
        

        setFormError(tempErrors);
        return isValid;
        
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
        
        // Clear error when user starts typing
        if (formError[name]) {
        setFormError(prev => ({
            ...prev,
            [name]: ''
        }));
        }
    }

  

  

    useEffect(() => {
        const fetchedUnitList = async() => {
            const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
            const userData = JSON.parse(userDataString); // parse the datastring into json 
            const accessToken = userData.accessToken;

            if(accessToken){
                try{
                    const response = await fetch(`http://127.0.0.1:8000/api/get_all_property`,{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        }
                    })

                    const data = await response.json()

                    if(response.ok){
                        setUnitList(data.data)
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
        fetchedUnitList();
    }, [])

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
  

        const formattedFormData = {
            ...formData,
            startDate: formData.startDate ? formData.startDate.format('MM/DD/YYYY') : null,
            endDate: formData.endDate ? formData.endDate.format('MM/DD/YYYY') : null,
        }
        console.log(formattedFormData)

        if(accessToken){
            try{  
                
                // const method = editPayment ? 'PUT' : 'POST';
                // const endpoint = editPayment 
                // ? `http://127.0.0.1:8000/api/update_inclusion/${editPayment}`  
                // : 'http://127.0.0.1:8000/api/store_expenses' 
                    
                const response = await fetch(`http://127.0.0.1:8000/api/generate_recurring_expenses`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, 
                    // 'Accept': 'application/json',
                },
                body:  JSON.stringify(formattedFormData),
                })

                const data = await response.json();
            
                if(response.ok){
                    setLoading(false);
                    handleClose()
                    setFormData({})
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
        }else{
            console.log("No token Available")
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

    // Helper function to create unique IDs for units
    const createUniqueId = (unit, type) => `${type}-${unit.id}`;

    // Helper function to parse unique ID back to original values
    const parseUniqueId = (uniqueId) => {
        if (!uniqueId) return { type: null, originalId: null };
        const [type, id] = uniqueId.split('-');
        return { type, originalId: parseInt(id) };
    };

    // Transform the options to include unique IDs
    const options = unitList.flatMap(property => [
        // Map apartments
        ...property.apartments.map(apartment => ({
        uniqueId: createUniqueId(apartment, 'apartment'),
        id: apartment.id,
        label: `${apartment.apartment_name} (${property.propertyname})`,
        propertyId: property.id,
        property_type: 'Apartment',
        name: apartment.apartment_name,
        ...apartment
        })),
        // Map boarding houses
        ...property.boarding_houses.map(boardingHouse => ({
        uniqueId: createUniqueId(boardingHouse, 'boarding'),
        id: boardingHouse.id,
        label: `${boardingHouse.boarding_house_name} (${property.propertyname})`,
        propertyId: property.id,
        property_type: 'Boarding House',
        name: boardingHouse.boarding_house_name,
        ...boardingHouse
        }))
    ]);


    const handleUnit = (selectedUnit) => {
        if (selectedUnit) {
        setFormData(prev => ({
            ...prev,
            unitId: selectedUnit.id,
            type: selectedUnit.property_type,
            propertyId: selectedUnit.propertyId
        }));
        } else {
            setFormData(prev => ({
                ...prev,
                unitId: '',
                type: '',
                propertyId: ''
            }));
        }

        setFormError(prev => ({
        ...prev,
        unitId: ''
        }));
    };

    // Find current value using uniqueId for maintenance feee
    const currentValue = options.find(option => 
        option.id === formData.unitId && 
        option.property_type === formData.type
    ) || null;

    const handleDateChange = (name, value) => {
        setFormData({
        ...formData,
        [name]: value,
        });
        
        // Clear date error when user selects a date
        if (name === 'startDate' && formError.startDate) {
            setFormError(prev => ({
                ...prev,
                startDate: '',
            }));
        }
        
        if (name === 'endDate' && formError.endDate) {
            setFormError(prev => ({
                ...prev,
                endDate: '',
            }));
        }
    };

    const handleCheckBoxChange = () => {
        setFormData(prev => ({
            ...prev,
            includeWeekends: false
        }))
    }






  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt:1.5, }}>
        <Button 
        variant='contained' 
        size='medium' 
        onClick={handleOpenModal}
        sx={{
            backgroundColor: 'white', 
            color: '#263238', 
            border: '0.9px solid #616161', 
            p:1,
            mt: 2,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', // Added shadow
            '&:hover': {
            backgroundColor: '#f5f5f5', // Slight color change on hover
            boxShadow: '0 6px 8px rgba(0,0,0,0.15)' // Slightly enhanced shadow on hover
            }
        }}
        >
        < RefreshIcon fontSize='medium' sx={{mr:1}}/> Set up Recurring 
        </Button>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={''}
            onClose={() => {
                handleCloseModal()
                setFormError({})
                setFormData({})
            }}
            closeAfterTransition
            slots={{ backdrop: StyledBackdrop }}
        >
            <Fade in={''}>
            <ModalContent  style={{ width: '90%', maxWidth: '840px', }}> 
            <Typography variant='h4' letterSpacing={3} sx={{ fontSize: '20px' }}>Add New Expenses</Typography>
            <Box onSubmit={handleSubmit} component="form"  noValidate>
            <Grid container spacing={2}>

                <Grid item xs={12}  sm={formData.category === "utility bill" ? 4 : 6} sx={{mt:{xs:'2rem', lg:'2rem'},}}> 
                    <FormControl fullWidth required error={Boolean(formError.unitId)}>
                    <Autocomplete
                        id="tenant-autocomplete"
                        options={options}
                        getOptionLabel={(option) => option.label || ''}
                        value={currentValue}
                        onChange={(event, newValue) => {
                        handleUnit(newValue);
                        }}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Unit name"
                            required
                            error={Boolean(formError.unitId)}
                            helperText={formError.unitId}
                            InputProps={{
                            ...params.InputProps,
                            endAdornment: params.InputProps.endAdornment,
                            }}
                        />
                        )}
                        isOptionEqualToValue={(option, value) => 
                        option.uniqueId === value.uniqueId
                        }
                        renderOption={(props, option) => (
                        <li {...props} key={option.uniqueId}>
                            {option.label}
                        </li>
                        )}
                        autoComplete
                        autoHighlight
                        clearOnEscape
                    />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={formData.category === "utility bill" ? 4 : 6} sx={{mt:4}}>
                    <FormControl fullWidth required error={Boolean(formError.category)}>
                        <InputLabel>Category</InputLabel>
                        <Select
                        label='Categoty'
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        error={Boolean(formError.category)}
                        >
                            <MenuItem value="maintenance fee">Maintenance Fee</MenuItem>
                            <MenuItem value="utility bill">Utility Bill</MenuItem>
                            
                        </Select>
                        {formError.category && (
                            <FormHelperText>
                            {formError.category}
                            </FormHelperText>
                        )}
                    </FormControl>
                   
                    
                </Grid>
                <Grid item xs={12} sm={formData.category === "utility bill" ? 4 : 0} >
                    <FormControl fullWidth required 
                        error={Boolean(formError.category)}
                        sx={{
                            display: formData.category === "utility bill" ? 'block' : 'none',
                            mt: formData.category === 'utility bill' ? 4 : -5
                        }}
                    >
                        <InputLabel>Type of utitlity Bill</InputLabel>
                        <Select
                        label='Type of utitlity Bill'
                        name="type_of_bills"
                        value={formData.type_of_bills}
                        onChange={handleChange}
                        required
                        fullWidth
                        disabled={formData.category !== "utility bill"}
                        error={Boolean(formError.type_of_bills)}
                        >
                            <MenuItem value="water bill">Water Bill</MenuItem>
                            <MenuItem value="electric Bill">Electric Bill</MenuItem>
                            <MenuItem value="wifi">Wifi</MenuItem>
                        </Select>
                        {formError.type_of_bills && (
                             <FormHelperText>
                             {formError.type_of_bills}
                         </FormHelperText>
                        )}
                    </FormControl>
                </Grid>
                <Grid  item xs={12} sm={6} sx={{mt:1}}>
                    <FormControl fullWidth required error={Boolean(formError.frequency)}>
                        <InputLabel>Frequency</InputLabel>
                        <Select
                        label="Frequency"
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                        required
                        error={Boolean(formError.frequency)}
                        >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="quarterly">Quarterly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                        </Select>
                        {formError.frequency && (
                            <FormHelperText>
                             {formError.frequency}
                            </FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} sx={{mt:-1}}>
                    <TextField
                    required
                    type='number'
                    id="apartment-name"
                    label="Amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    error={Boolean(formError.amount)}
                    helperText={formError.amount}
                    onKeyDown={(e) => {
                        // Prevent 'e', 'E', '+', and '-' from being entered
                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                        e.preventDefault();
                        }
                    }}
                    />
                </Grid>

                <Grid item xs={12} sm={6} sx={{mt:{xs:'1rem', lg:'1rem'},}}>
                    <LocalizationProvider error={Boolean(formError.startDate)} dateAdapter={AdapterDayjs} >
                    <DatePicker
                        label="Start Date"
                        name="startDate"
                        sx={{width: '100%',}}
                        value={formData.startDate}
                        onChange={(newValue) => handleDateChange('startDate', newValue)}
                        fullWidth
                        disablePast
                        error={Boolean(formError.startDate)} // Add error pro
                        slotProps={{
                        textField: {
                            error: Boolean(formError.startDate),
                            helperText: formError.startDate,
                            fullWidth: true
                        }
                        }}
                    />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} sx={{mt:{xs:'1rem', lg:'1rem'},}}>
                    <LocalizationProvider error={Boolean(formError.endDate)} dateAdapter={AdapterDayjs} >
                    <DatePicker
                        label="End Date"
                        name="endDate"
                        sx={{width: '100%',}}
                        value={formData.endDate}
                        onChange={(newValue) => handleDateChange('endDate', newValue)}
                        fullWidth
                        disablePast
                        error={Boolean(formError.endDate)} // Add error prop
                        slotProps={{
                        textField: {
                            error: Boolean(formError.endDate),
                            helperText: formError.endDate,
                            fullWidth: true
                        }
                        }}
                    />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>

                    
                    <FormControlLabel
                        sx={{
                            '& .MuiFormControlLabel-label': {
                                fontSize: '0.9rem', // Adjust the size as needed
                                color: 'rgba(0, 0, 0, 0.6)' // Optional: make it slightly lighter
                            }
                        }}
                        label="Select to exclude weekends from the recurrence."
                        control={
                            <Checkbox
                            color="primary" 
                            onChange={handleCheckBoxChange}
                            />
                        }
                    />
                </Grid>
                
                  
                <Grid item xs={12} sm={12} sx={{mt:2}}>
                    <TextField
                    name="description"
                    label="Expenses Description"
                    multiline
                    rows={4}
                    value={formData.description}
                    error={Boolean(formError.description)}
                    helperText={formError.description}
                    onChange={handleChange}
                    required
                    fullWidth
                    inputProps={{ maxLength: 1000 }} 
                    placeholder="Please describe the maintenance issue..."
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
                handleCloseModal()
                setFormError({})
                setFormData({})
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