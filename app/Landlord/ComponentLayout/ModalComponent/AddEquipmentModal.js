'use client'

import React, { useEffect } from "react"
import { useState } from "react"
import { Grid, Box, Paper, Typography, Button, Divider, Link, Fade, Breadcrumbs, TextField, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
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


export default function AddEquipmentModal({open, handleOpen, handleClose,setLoading, setSuccessful, setError, error, editItem, setEditItem}){
  const [addEquipment, setAddEquipment] = useState({
    name: ''
  })

  console.log('ID:', editItem)
  console.log('EditItem:'. addEquipment)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddEquipment({
        ...addEquipment,
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

          const response = await fetch(`http://127.0.0.1:8000/api/edit_inclusion/${editItem}`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',  
              'Authorization': `Bearer ${accessToken}`,
            }
          })

          const data = await response.json();

          if(response.ok){
            setAddEquipment({
              name: data?.data?.name,
            });
            console.log( data?.data?.name)
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
  }, [editItem])


  const handleSubmit = async(e) => {
    e.preventDefault()
    setLoading(true);

    const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json 
    const accessToken = userData.accessToken;
   

    if(accessToken){
      try{
        const method = editItem ? 'PUT' : 'POST';
        const endpoint = editItem 
        ? `http://127.0.0.1:8000/api/update_inclusion/${editItem}`  
        : 'http://127.0.0.1:8000/api/store_inclusion' 
            
        const response = await fetch(endpoint,{
          method,
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, 
            'Accept': 'application/json',
          },
          body: JSON.stringify(addEquipment)
        })

        const data = await response.json();
     
        if(response.ok){
          // setLoading(false);
          handleClose()
          setAddEquipment({
            name: ''
          })
          localStorage.setItem('successMessage', data.message || 'Operation Sucess!');
          window.location.reload();
          // const successMessage = data.message || 'Success!'; 
          // setSuccessful(successMessage);
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



  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt:1.5, }}>
      <Button variant="contained"  onClick={handleOpen} sx={{ borderRadius: '10px', p:1.1, mb: 2 }}>
          <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
          Add New Equipment
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={open}>
        <ModalContent sx={style}>
          <Typography variant='h1' letterSpacing={3} sx={{ fontSize: '20px' }}>Add New Equipment</Typography>
          <Box onSubmit={handleSubmit} component="form"  noValidate>          
          <TextField 
            id="taskname" 
            label="Equipment Name" 
            name="name"
            variant="outlined" 
            fullWidth 
            margin="normal" 
            sx={{mt:1}} 
            value={addEquipment.name}
            onChange={handleChange}
           />
          <Button variant='contained' type='submit' sx={{width: '100%',background: 'primary','&:hover': {backgroundColor: '#b6bdf1',}, padding: '8px', fontSize: '16px', mt:4 }}>Add </Button>
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