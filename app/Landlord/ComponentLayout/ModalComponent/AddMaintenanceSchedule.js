'use client'

import React from "react"
import { useState } from "react"
import { Grid, Box, Paper, Typography, Button, Divider, Link, Fade, Breadcrumbs, TextField, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { Modal as BaseModal } from '@mui/base/Modal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PropTypes from 'prop-types';
import { styled, css, } from '@mui/system'
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";



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


export default function ModalComponent({open, handleOpen, handleClose}){


    return (
        <Box sx={{ display: 'flex', justifySelf: 'end', mt:1.5, }}>
            <Button variant="contained"  onClick={handleOpen} sx={{background: '#f78028','&:hover': {backgroundColor: '#ffab40',}, borderRadius: '15px', p:1.1, mb: 2 }}>
                <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
                Add New Schedule
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
                    <Typography variant='h1' letterSpacing={3} sx={{ fontSize: '20px' }}>Add New Schedule</Typography>
                    <FormControl fullWidth margin="normal" sx={{mt:3}}>
                        <InputLabel required>Select Apartment</InputLabel>
                        <Select>
                            <MenuItem value={1}>Apartment no.1</MenuItem>
                            <MenuItem value={2}>Apartment no.2</MenuItem>
                            <MenuItem value={3}>Apartment no.3</MenuItem>    
                            <MenuItem value={4}>Apartment no.4</MenuItem>  
                            <MenuItem value={5}>Apartment no.5</MenuItem>  
                            <MenuItem value={6}>Apartment no.6</MenuItem>  
                            <MenuItem value={7}>Apartment no.7</MenuItem>  
                            <MenuItem value={8}>Apartment no.8</MenuItem>  
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal" sx={{mt:-0.1}}>
                        <InputLabel required>Select Room</InputLabel>
                        <Select>
                            <MenuItem value={1}>Room no.1</MenuItem>
                            <MenuItem value={2}>Room no.2</MenuItem>
                            <MenuItem value={3}>Room no.3</MenuItem>    
                            <MenuItem value={4}>Room no.4</MenuItem>  
                            <MenuItem value={5}>Room no.5</MenuItem>  
                            <MenuItem value={6}>Room no.6</MenuItem>  
                            <MenuItem value={7}>Room no.7</MenuItem>  
                            <MenuItem value={8}>Room no.8</MenuItem>  
                        </Select>
                    </FormControl>
                    <TextField id="taskname" label="Task Name" variant="outlined" fullWidth margin="normal" sx={{mt:-0.1}} />
                    <TextField id="estimatedamount" label="Estamated Amount" type="number" variant="outlined" fullWidth margin="normal" sx={{mt:-0.1}} />
                    <FormControl fullWidth margin="normal" sx={{mt:-0.1}}>
                        <InputLabel required>Status</InputLabel>
                        <Select>
                            <MenuItem value={1}>To Do</MenuItem>
                            {/* <MenuItem value={2}>Room no.2</MenuItem>
                            <MenuItem value={3}>Room no.3</MenuItem>     */}
                        </Select>
                    </FormControl>
                    <TextField id="description" label="Task Description" variant="outlined" multiline maxRows={5} fullWidth margin="normal" sx={{mt:-0.1}}/>
                    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{mt:-0.1}}>
                        <DemoContainer components={['DatePicker']}>
                            <DateRangePicker localeText={{ start: 'Start-Date', end: 'End-Date' }} />
                           
                        </DemoContainer>
                    </LocalizationProvider>
                    
                    <Button variant='contained' sx={{background: 'primary','&:hover': {backgroundColor: '#b6bdf1',}, padding: '8px', fontSize: '16px', mt:4 }}>Add </Button>
                </ModalContent>
                </Fade>
            </Modal>
        </Box>
    )
}