'use client';
import React, { useEffect, useState } from 'react';
import {Grid, Divider, Card, CardContent, CardHeader, Typography, TextField, MenuItem, Button, Box, IconButton, Alert, Stack, FormControl, FormGroup, FormControlLabel, FormHelperText, InputLabel, Select, Checkbox} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Image from 'next/image';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 830,
  margin: '0 auto',
  padding: theme.spacing(2),
  boxShadow: theme.shadows[3]
}));

// checkbox style
const BpIcon = styled('span')(({ theme }) => ({
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
      ...theme.applyStyles('dark', {
        backgroundColor: '#30404d',
      }),
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
      ...theme.applyStyles('dark', {
        background: 'rgba(57,75,89,.5)',
      }),
    },
    ...theme.applyStyles('dark', {
      boxShadow: '0 0 0 1px rgb(16 22 26 / 40%)',
      backgroundColor: '#394b59',
      backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))',
    }),
  }));
  
  const BpCheckedIcon = styled(BpIcon)({
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&::before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  });



export default function RequestMaintenanceForm({setLoading, setError, setSuccessful}){
    const [deleteImage, setDeleteImage] = useState([]);
    const [selectedImage, setSelectedImage] = useState([]);
    const [unitInformation, setUnitInformation] = useState([]);
    const [selectedItem, setSelectedItem] = useState(''); // Now only storing single item
    const [errors, setErrors] = useState({});
    // const [otherIssue, setOtherIssue] = useState('');
    const [formData, setFormData] = useState({
        tenant_id: '',
        unit_type: '',
        otherissues: '',
        item_name: '',
        issue_description:'',
        date_reported: null,
        status: 'pending'
    });

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
        ...prevData,
        [name]: value
        }));

        if(errors[name]){
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }))
        }
    };

    console.log(formData);
    console.log(selectedItem);
    console.log(selectedImage);
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
  
        const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
        const userData = JSON.parse(userDataString); // parse the datastring into json 
        const accessToken = userData.accessToken;

        // const formattedFormData = {
        //     ...formData,
        //     date_reported: dayjs(formData.date_reported).format('MM/DD/YYYY'),
        // };

        // console.log(formattedFormData)


        if(accessToken){
            try {
                let hasErrors = false;
                let newErrors = {};
                
                if(!formData.tenant_id){
                    hasErrors = true;
                    newErrors.tenant_id = 'Tenant is requied!';
                }
                if(!formData.unit_type){
                    hasErrors = true;
                    newErrors.unit_type = 'Unit type is requied!';
                }

                if(!formData.item_name && !formData.otherissues){
                    hasErrors = true;
                    newErrors.item_name = 'Either Item Name or Other Issues must be filled';
                    newErrors.otherissues = 'Either Item Name or Other Issues must be filled';
                }else{
                    if (formData.item_name && formData.item_name.trim() === '') {
                        hasErrors = true;
                        newErrors.item_name = 'Item Name cannot be empty';
                    }
                    // If otherissues is provided, ensure it's not just whitespace
                    if (formData.otherissues && formData.otherissues.trim() === '') {
                        hasErrors = true;
                        newErrors.otherissues = 'Other Issues cannot be empty';
                    }
                }
              
                if(!formData.issue_description){
                    hasErrors = true;
                    newErrors.issue_description = 'Issue Discription is requied!';
                } 
                if (!selectedImage || selectedImage.length === 0) {
                    hasErrors = true;
                    newErrors.images = 'At least one image is required';
                }

                if (hasErrors) {
                    setErrors(newErrors);
                    setLoading(false);
                    return;
                }
              
                // Create a FormData object
              
                const formDataToSubmit = new FormData();
                formDataToSubmit.append('tenant_id', formData.tenant_id);
                formDataToSubmit.append('unit_type', formData.unit_type);
                formDataToSubmit.append('reported_issue', formData.item_name);
                formDataToSubmit.append('otherissues', formData.otherissues || '');
                formDataToSubmit.append('issue_description', formData.issue_description);
                formDataToSubmit.append('date_reported', dayjs(formData.date_reported).format('MM/DD/YYYY'));
                formDataToSubmit.append('status', 'pending');

                // Append images to FormData
                 // Handle multiple images
                if (selectedImage && selectedImage.length > 0) {
                    selectedImage.forEach((image, index) => {
                        if (image.file) {
                            formDataToSubmit.append(`images[${index}]`, image.file);
                        }
                    });
                }

                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8000/api/requestmaintenance`,{
                    method: 'POST',
                    headers:{
                        'Authorization': `Bearer ${accessToken}`, 
                        'Accept': 'application/json',
                        // 'Content-Type': 'application/json'
                    },
                    // body: JSON.stringify(formattedFormData),
                    body: formDataToSubmit

                })

                const data = await response.json();
                if(response.ok){
                    setFormData({})
                    localStorage.setItem('successMessage', data.message || 'Operation Sucess!');
                    window.location.reload();
                }else{
                    setLoading(false);
                    if(data.error)
                    {
                        console.log(data.error)
                        localStorage.setItem('errorMessage', data.error || 'Operation Error!');
                        window.location.reload();
                        // setError(data.error)
                    
                    }else{
                        console.log(data.message); // for duplicate entry
                        localStorage.setItem('errorMessage', data.message || 'Operation Error!');
                        window.location.reload();
                    }
                }
                
            } catch (error) {
            setError('Failed to submit maintenance request. Please try again.', error);
            }
        }else{
            setError('You must be logged in to submit a maintenance request.');
        }
        
        
    };

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

    // this code for automatic date generator
    useEffect(() => {
        const currentDate = dayjs().format('MM/DD/YYYY');
        setFormData(prevFormData => ({
            ...prevFormData,
            date_reported: currentDate
        }))
    }, [])

    useEffect(() => {
        if(unitInformation){
            setFormData(prevFormData => ({
                ...prevFormData,
                tenant_id: unitInformation.tenant_id,
                unit_type: unitInformation.rented_unit_type,
            }))
        }
    }, [unitInformation])

    useEffect(() => {
        const fetchedData = async() => {
            const userDataString = localStorage.getItem('userDetails');
            
            if(userDataString){
                try{
                    const userData = JSON.parse(userDataString); // Parse JSON
                    const accessToken = userData.accessToken; // Access token
                    const userId = userData.user.id; // User ID 
                    if(accessToken){
                        const response = await fetch(`http://127.0.0.1:8000/api/tenant_unit_info/${userId}`,{
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            }
                        })

                        const data = await response.json();
                        if(response.ok){
                            console.log(data);
                            setUnitInformation(data.data)
                        }else{
                            console.error('Error:', response.status, data);
                        }

                    }
                }catch(error){
                    console.error('Error fetching user data:', error);
                }

            }else{
                console.log('No user Found')
            }
        }
        fetchedData();
    }, [])
    console.log('unitInfo;', unitInformation);
    console.log('inclusions:', unitInformation?.rented_unit?.inclusions)

      // Modified to handle individual equipment instances
    const handleInclusionChange = (itemName) => (event) => {
        if (event.target.checked) {
            setSelectedItem(itemName);
            setFormData(prev => ({
                ...prev,
                item_name: itemName // Store single item name
            }));
            setErrors(prevErrors => ({
                ...prevErrors,
                item_name: ''
            }))
        } else {
            setSelectedItem('');
            setFormData(prev => ({
                ...prev,
                item_name: ''
            }));
            setErrors(prevErrors => ({
                ...prevErrors,
                [itemName]: ''
            }))
        }
    };

    // Helper function to generate numbered items based on quantity
    const generateNumberedItems = (inclusion) => {
        const items = [];
        for (let i = 1; i <= inclusion.quantity; i++) {
            items.push({
                key: `${inclusion.equipment.name}-${i}`,
                label: `${inclusion.equipment.name} ${i}`,
                name: `${inclusion.equipment.name} ${i}`
            });
        }
        return items;
    };

    
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
        const filesArray = Array.from(e.target.files);
        // Create preview URLs for new files
        const newPreviews = filesArray.map(file => ({
          file: file,
          name: file.name,
          preview: URL.createObjectURL(file)
        }));
        setSelectedImage((prevImages) => {
            // Ensure prevImages is always an array using nullish coalescing
            // const currentImages = prevImages ?? [];
            const currentImages = Array.isArray(prevImages) ? prevImages : [];
            return [...currentImages, ...newPreviews];
        });
        // setSelectedImage((prevImages) => [...prevImages, ...filesArray]);
        
        }
        setErrors(prevErrors => ({
            ...prevErrors,
            images: ''
        }))

    };

    const handleRemoveImage = (index) => {
        const removedImageId = selectedImage[index]?.id; // Assuming existingImages is an array of images with their IDs
        if (removedImageId) {
            setDeleteImage((prev) => [...prev, removedImageId]); // Store the ID of the removed image
        }
        setSelectedImage((prevImages) => prevImages.filter((_, i) => i !== index));
    };


    return (
        <StyledCard>
        <CardHeader
            title={
            <Typography variant="h5" component="h2" align="center" gutterBottom>
                Maintenance Request Form
            </Typography>
            }
        />
        <CardContent>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={3}>
                    <FormControl fullWidth error={Boolean(errors.unit_type)}>
                    <InputLabel id="unit-type-label"  error={Boolean(errors.unit_type)}>Unit Type</InputLabel>
                    <Select
                        labelId="unit-type-label"
                        name="unit_type"
                        value={formData.unit_type}
                        label="Unit Type"
                        onChange={handleChange}
                        required
                        error={Boolean(errors.unit_type)}
                       
                    >
                        {/* {unit.map((type) => ( */}
                        <MenuItem value={unitInformation.rented_unit_type}>
                            {unitInformation.rented_unit_type}
                        </MenuItem>
                        {/* // ))} */}
                    </Select>
                    {errors.unit_type && (
                    <FormHelperText 
                    error 
                    sx={{
                        marginLeft: '14px',
                        marginRight: '14px',
                        fontSize: '0.75rem',
                    }}
                    >
                    {errors.unit_type}
                    </FormHelperText>
                    )}
                    </FormControl>

                    {unitInformation?.rented_unit?.inclusions && (
                    <>
                        <Typography variant="h6" sx={{display: 'flex', alignItems: 'center', color:'#9e9e9e', fontSize:'15px'}} gutterBottom>
                        <InfoOutlinedIcon sx={{mr:'0.4rem'}}/> Select Items Needing Maintenance
                        </Typography>
                        <FormGroup>
                        <Grid container spacing={2}>
                            {unitInformation.rented_unit.inclusions.map((inclusion) => {
                                const numberedItems = generateNumberedItems(inclusion);
                                
                                return numberedItems.map((item) => (
                                    <Grid item xs={12} sm={12} key={item.key}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    sx={{ '&:hover': { bgcolor: 'transparent' } }}
                                                    disableRipple
                                                    color="default"
                                                    checkedIcon={<BpCheckedIcon />}
                                                    icon={<BpIcon />}
                                                    checked={selectedItem === item.name}
                                                    onChange={handleInclusionChange(item.name)}
                                                />
                                            }
                                            label={item.label}
                                        />
                                    </Grid>
                                ));
                            })}
                        </Grid>
                        {errors.item_name && (
                            <FormHelperText error sx={{ ml: 2 }}>
                                {errors.item_name}
                            </FormHelperText>
                        )}
                        </FormGroup>
                    </>
                    )}

                    <TextField 
                    id="standard-basic" 
                    label="others..."
                    placeholder='other type of issue'
                    variant="standard" 
                    name="otherissues"
                    value={formData.otherissues}
                    onChange={handleChange}
                    sx={{
                        '& .MuiInputBase-input': {
                          fontSize: '1rem' // adjust the font size to your liking
                        },
                        '& .MuiFormLabel-root': {
                          fontSize: '1rem' // adjust the label font size to match the placeholder
                        }
                      }}
                    />

                    <TextField
                    name="issue_description"
                    label="Issue Description"
                    multiline
                    rows={4}
                    value={formData.issue_description}
                    error={Boolean(errors.issue_description)}
                    helperText={errors.issue_description}
                    onChange={handleChange}
                    required
                    fullWidth
                    inputProps={{ maxLength: 1000 }} 
                    placeholder="Please describe the maintenance issue..."
                    />
                    
                    {/* Information message */}
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt:'0.2rem', fontSize: '15px', color: 'gray'}}>
                      <InfoOutlinedIcon fontSize="small" sx={{ mr: 1,}} />
                      Select or upload an image as evidence of the maintenance needed.
                    </Typography>
                
                  
                    <Box
                      sx={{
                        border: `2px dashed ${errors.images ? '#d32f2f' : '#ccc'}`,
                        borderRadius: '5px',
                        padding: '20px',
                        textAlign: 'center',
                        width: '100%',
                      }}
                    >
                      <Box sx={{ marginBottom: '-10px' }}>
                        {selectedImage && selectedImage.length > 0 ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {selectedImage.map((image, index) => (
                            <Box 
                              key={image.id || index}
                              sx={{ 
                                position: 'relative',
                                width: 100,
                                height: 100,
                                marginBottom: 2
                              }}
                              error={Boolean(errors.images)}
                            >
                              <Image
                                src={image.preview || `http://127.0.0.1:8000/ApartmentImage/${image.path}`}
                                alt={image.name}
                                width={500} // Add specific width
                                height={300} // Add specific height
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  borderRadius: '4px'
                                }}
                              />
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  mt: 1,
                                  display: 'block',
                                  maxWidth: '100%',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                                helperText={errors.images}
                              >
                                {image.name}
                              </Typography>
                              <IconButton 
                                onClick={() => handleRemoveImage(index)}
                                sx={{
                                  position: 'absolute',
                                  top: -8,
                                  right: -8,
                                  backgroundColor: 'white',
                                  '&:hover': { backgroundColor: 'white' }
                                }}
                              >
                                <HighlightOffOutlinedIcon color='warning' />
                              </IconButton>
                            </Box>
                          ))}
                          </Box>
                          
                        ) : (
                          <Typography variant="body1" gutterBottom sx={{ color: 'gray' }}>
                            Select or Drop Image
                          </Typography>
                        )}
                        <IconButton component="label">
                          <CloudUploadOutlinedIcon fontSize="large" />
                          <input type="file" accept=".jpg,.jpeg,.png,.svg," name='image' hidden multiple onChange={handleImageChange} />
                        </IconButton>
                        {errors.images && (
                            <FormHelperText
                                error
                                sx={{
                                    display: 'block',
                                    textAlign: 'center',
                                    marginTop: 1
                                }}
                            >
                                {errors.images}
                            </FormHelperText>
                        )}
                        {/* {errors.images && (
                            <FormHelperText color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                            {errors.images}
                            </FormHelperText>
                        )} */}
                      </Box>
                    </Box>
               
                 

                    {/* <TextField
                    name="date_reported"
                    label="Date Reported"
                    type="date"
                    value={formData.date_reported}
                    onChange={handleChange}
                    required
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    /> */}
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date Reported"
                            name="date_reported"
                            sx={{width: '100%'}}
                            value={formData.date_reported}
                            onChange={handleChange}
                            fullWidth
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </LocalizationProvider> */}

                    <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{
                        mt: 3,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1.1rem'
                    }}
                    >
                    Submit Request
                    </Button>
                </Stack>
            </Box>
        </CardContent>
        </StyledCard>
    );
};

