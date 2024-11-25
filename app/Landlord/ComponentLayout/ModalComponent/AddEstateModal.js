'use client'; // Add this at the top for Next.js client-side rendering

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TextField, Typography, Box, Fab, Button, Fade, IconButton, FormHelperText, FormControl, InputLabel,Select, MenuItem } from '@mui/material';
import { styled, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import Image from 'next/image';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import UseAxios from '@/app/hooks/UseAxios';
import axios from "axios";

const Backdrop = React.forwardRef((props, ref) => {
  const { open, ...other } = props;
  return (
    <Fade in={open}>
      <div ref={ref} {...other} />
    </Fade>
  );
});
Backdrop.displayName = 'Backdrop';

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
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

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
      width: 90%;
      max-width: 400px;

      @media (min-width: 600px) {
          width: 400px;
      }
  `,
);

const AddButton = styled(Fab)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export default function AddApartmentModal({open, handleOpen, handleClose, error, setError, successful, setSuccessful, editproperty, setEditProperty}) {
  const { data: session, status } = useSession();
  const [selectedImage, setSelectedImage] = useState();
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const editItem = editproperty;
  const [errors, setErrors] = useState({});
  const [allBarangays, setAllBarangays] = useState([])
  const [newProperty, setNewProperty] = useState({
    propertyname: '',
    barangay: '',
    municipality: 'Sorsogon City',
  });

  console.log('id:', editItem)
  console.log('propdata:', newProperty);
  console.log(allBarangays)

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProperty({
        ...newProperty,
        [name]: value
    });

     // Clear error when field is modified
     if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }
  
  useEffect(() => {
    const fetchedBarangays = async() => {
      try{
        const response = await fetch('https://psgc.gitlab.io/api/cities/056216000/barangays', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',

          }
        })
        const data = await response.json();
        // const barangayNames = data.map(barangay => barangay.name);
        // console.log('Barangay names:', barangayNames);
        console.log('barangay:', data);
        
        setAllBarangays(data)
      }catch(error){

      }
    }
    fetchedBarangays();
  }, [])

  useEffect(() => {
    const fetchDataEdit =  async () => {
      const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json 
      const accessToken = userData.accessToken;
      if(accessToken){
        try{
          const response = await fetch(`http://127.0.0.1:8000/api/edit_property/${editItem}}`,{
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              "Accept": "application/json",
            }
          })
          const data = await response.json();
          console.log(data)
          console.log('Response:', response.status)

          if(response.ok){
            setNewProperty({
              propertyname: data.editProperty.propertyname || '',
              // street: data.editProperty.street,
              barangay: data.editProperty.barangay || '',
              municipality: data.editProperty.municipality,
            })
            // setSelectedImage(data?.editProperty?.image )
            if (data.editProperty.image) {
              setSelectedImage(data.editProperty.image);
            }
            console.log('Edit:', newProperty);
            console.log('Edit:', selectedImage)
            setSuccessful(successMessage);
          }else{
            setError(data.message || 'Failed to save property data.');
            handleClose();
          }
         

        }catch (error){
          setLoading(false); // Set loading to false regardless of success or failure
        }finally{
          setLoading(false); // Set loading to false regardless of success or failure
        }
      }

    }
    fetchDataEdit()
  }, [editItem, newProperty, selectedImage, handleClose, setError, setSuccessful])


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json 

    const accessToken = userData.accessToken;

    if (accessToken){
      console.log('authenticated', status)
      console.log("Value:", newProperty)
      console.log('Token:', accessToken); 
      console.log({selectedImage});

      const method = editItem ? 'POST' : 'POST';

      try {
        const formData = new FormData()
        let hasErrors = false;
        let newErrors = {};

        if (!newProperty.propertyname?.trim()) {
          newErrors.propertyname = 'Estate Property name is required';
          hasErrors = true;
        }
        if (!newProperty.barangay?.trim()) {
          newErrors.barangay = 'Barangay address is required';
          hasErrors = true;
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
        formData.append('propertyname', newProperty.propertyname);
        // formData.append('street', newProperty.street);
        formData.append('barangay', newProperty.barangay);
        formData.append('municipality', "Sorsogon City");

        // if(selectedImage && selectedImage instanceof File){
        //   formData.append('image', selectedImage)
        // }

        // Modify image appending to use the file from selectedImage
        if (selectedImage && selectedImage.file) {
          formData.append('image', selectedImage.file);
        }
        
        if (editItem) {
          formData.append('_method', 'PUT'); // Indicate to Laravel that this is an update
        }

        const url = editItem 
          ? `http://127.0.0.1:8000/api/update_property/${editItem}`
          : 'http://127.0.0.1:8000/api/create'
        
        // const method = editItem ? 'PUT' : 'POST';

      
        const response = await fetch(url, {
          method,
          headers:{
              'Authorization': `Bearer ${accessToken}`, 
              'Accept': 'application/json',
          },
          body: formData
        });

        const data = await response.json();

        console.log("Response data:", data);
        console.log("Response status:", response.status);

        if (response.ok) {
          handleClose();
          setNewProperty({
            propertyname: '',
            // street: '',
            barangay: '',
            municipality: 'Sorsogon City'
          });
          setSelectedImage(null);
          localStorage.setItem('successMessage', data.message || 'Operation successful!');
          window.location.reload();
          // const successMessage = data.message || 'Success!'; 
          // setSuccessful(successMessage);
          
        } else {
         if(data.error)
         {
          localStorage.setItem('errorMessage', data.error || 'Operation Error!');
          window.location.reload();
         }else{
          localStorage.setItem('errorMessage', data.message || 'Operation Error!');
          window.location.reload();
         }
        
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || 'An unexpected error occurred');
        setLoading(false);
        setSuccessful(false)
      }
    }else{
      console.error('Authentication error: Token missing or invalid');
      setSuccessful(false)
      setError('Authentication error: Token missing or invalid');
    }
    
  };

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
  
  }, [setError, setSuccessful]);

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


  // const handleImageChange = (e) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setSelectedImage(e.target.files[0]);
  //   }
  // };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      
      // Set the selected image with both the file and preview URL
      setSelectedImage({
        file: file,
        preview: previewUrl
      });
    }
    setErrors(prevErrors => ({
      ...prevErrors,
      images: ''
    }))

  };

  console.log(selectedImage)


  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5, mb: 3 }}>
      <AddButton variant="extended" aria-label="add" onClick={handleOpen} sx={{zIndex: 0, backgroundColor: '#f78028', '&:hover': { backgroundColor: '#ffa726' } }}>
        <AddCircleOutlineIcon sx={{ mr: 1 }} />
        Add New Property
      </AddButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => {
          setErrors({})
          handleClose();
          setEditProperty(null);
          setNewProperty({
            propertyname: '',
            // street: '',
            barangay: '',
            municipality: 'Sorsogon City',
          });
          setSelectedImage(null);
        }}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={open}>
          <ModalContent> 
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 550, letterSpacing: 1, textTransform: 'uppercase' }}>
              {editItem ? 'Edit Estate' : 'Add New Estate'}
            </Typography>
            <Box onSubmit={handleSubmit} component="form"  noValidate>
              <TextField 
                required 
                id="apartmentName"
                label="Estate Property Name" 
                fullWidth 
                margin="normal"
                name="propertyname"
                value={newProperty.propertyname}
                onChange={handleChange}
                error={Boolean(errors.propertyname)}
                helperText={errors.propertyname}
              />
              {/* <TextField 
                required 
                id="street"
                label="Street" 
                fullWidth 
                margin="normal" 
                name="street"
                value={newProperty.street}
                onChange={handleChange}
              /> */}
              {/* <TextField 
                required 
                id="barangay"
                label="Barangay"
                fullWidth 
                margin="normal"
                name="barangay"
                value={newProperty.barangay}
                onChange={handleChange}
              /> */}
              <FormControl fullWidth error={Boolean(errors.apartmentstatus)}>
                <InputLabel id="demo-simple-select-label" error={Boolean(errors.apartmentstatus)}>Barangay</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="barangay"
                  value={newProperty.barangay}
                  label="Barangay"
                  onChange={handleChange}
                  error={Boolean(errors.barangay)}
                  helperText={errors.barangay}
                >
                  {sortedBarangays.map((item) =>(
                    <MenuItem key={item.code} value={item.name}>{item.name}</MenuItem>
                  ))}
                </Select>
                {errors.barangay && (
                <FormHelperText 
                  error 
                  sx={{
                    marginLeft: '14px',
                    marginRight: '14px',
                    fontSize: '0.75rem',
                  }}
                >
                  {errors.barangay}
                </FormHelperText>
                )}
              </FormControl>
              <TextField
                id="municipality"
                label="Municipality"
                defaultValue="Sorsogon City"
                variant="outlined"
                InputProps={{ readOnly: true }}
                fullWidth
                margin="normal"
                name="municipality" // Ensure this matches your state key
                value={newProperty.municipality}
                // onChange={handleChange}
              />
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
                  {selectedImage ? (
                    <>
                    <Image
                      src={
                        typeof selectedImage === 'string' 
                          ? `http://127.0.0.1:8000/ApartmentImage/${selectedImage}`
                          : selectedImage.preview
                      }
                      alt="Property Image"
                      width={200}
                      height={200}
                      style={{
                        width: '100%',
                        height: '200px', // Fixed height
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                    <Typography variant="body1" gutterBottom sx={{ color: 'gray', fontSize: '18px' }}>
                    {typeof selectedImage === 'string' ? selectedImage : selectedImage.name} 
                    <IconButton>
                      <HighlightOffOutlinedIcon color='warning' onClick={() => setSelectedImage(null)} />
                    </IconButton>
                    </Typography>
                    </>
                  ):(
                  <Typography variant="body1" gutterBottom sx={{ color: 'gray' }}>
                  Drop or Select Property Image
                  </Typography>
                  )}
                  <IconButton component="label">
                    <CloudUploadOutlinedIcon fontSize="large" />
                    <input type="file" accept=".gif,.jpg,.jpeg,.png,.svg," name='image' hidden onChange={handleImageChange} />
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
                </Box>
              </Box>

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
                  '&:hover': { backgroundColor: '#ffa726' },
                  letterSpacing: '2px',
                }}
              >
                Submit
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
                  handleClose();
                  setErrors({})
                  setEditProperty(null);
                  setNewProperty({
                    propertyname: '',
                    street: '',
                    barangay: '',
                    municipality: 'Sorsogon City',
                  });
                  setSelectedImage(null);
                }}
              >
                Cancel
              </Button>

            </Box>
            
          </ModalContent>
        </Fade>
      </Modal>
    </Box>
  );



  
}
