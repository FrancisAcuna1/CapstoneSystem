'use client';
import React, { useEffect, useState } from 'react';
import {Typography, TextField, Button, Box, IconButton, Fade, Dialog, DialogTitle, DialogContent, DialogContentText, CircularProgress} from '@mui/material';
import { useSnackbar } from "notistack";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable


export default function AddRemarksForm({open, setRemarksOpen, itemId, setLoading, loading, handleClose1}){
    const {enqueueSnackbar} = useSnackbar();
    const [formError, setFormError] = useState([]);
    const [formData, setFormData] = useState({
        remarks: '',
    })

    console.log(itemId)
    console.log(formData);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
        [name]: value
        }));

        if(formError[name]){
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }))
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
        const userData = JSON.parse(userDataString); // parse the datastring into json 
        const accessToken = userData.accessToken;
        setLoading(true);
        if(accessToken){
            try{
                let hasErrors = false;
                let newErrors = {};

                if(!formData.remarks){
                    hasErrors = true;
                    newErrors.remarks = 'Please enter remarks';
                }else if (formData.remarks.trim().split(/\s+/).length < 3) {
                    hasErrors = true;
                    newErrors.remarks = 'Remarks must contain at least 3 words or more';
                } else if (formData.remarks.length < 10) {
                    hasErrors = true;
                    newErrors.remarks = 'Remarks must be at least 10 characters long';
                } 
                
                const response = await fetch(`${API_URL}/rejected_maintenance/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    }, 
                    body: JSON.stringify(formData)
                })
                const data = await response.json();
                if(!response.ok){
                    setLoading(false);
                    enqueueSnackbar(data.message, {variant: 'error'})
                    console.log(data.error);
                }
                enqueueSnackbar('Your feedback has been submitted successfully.', {variant: 'success'})
                console.log(data.data)
                setLoading(false)
                handleClose1();
                handleClose();
            }catch(error){
                console.log(error)
            }
        }
    }

    const handleClose = () => {
        setRemarksOpen(false)
        setFormData({})
        setFormError({})
    }


    return(
        <Box sx={{ display: "flex", justifySelf: "end", mt: 1.5 }}>
            <Dialog
            fullWidth={false}
            maxWidth={"sm"}
            open={open}
            >
                <DialogTitle>Remarks</DialogTitle>
                <DialogContent>
                    <DialogContentText fontSize={14.8} fontStyle={'italic'}>
                    Kindly provide a remark explaining the reason for rejecting the maintenance request.
                    </DialogContentText>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                        id="filled-multiline-flexible"
                        label="Remarks"
                        name='remarks'
                        value={formData.remarks}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Please provide a remark for the cancellation of your request"
                        inputProps={{ maxLength: 1000 }}
                        error={Boolean(formError.remarks)}
                        helperText={formError.remarks} 
                        sx={{mt:2}}
                        />
                        <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="small"
                        fullWidth
                        disabled={loading}
                        sx={{
                            mt: 3,
                            py: 1.1,
                            textTransform: 'none',
                            fontSize: '1.1rem'
                        }}
                        >
                        {loading ? <CircularProgress color='primary'/> : 'Submit Remarks'}
                        </Button>
                        <Button
                        
                            variant="outlined"
                            color="primary"
                            fullWidth
                            sx={{
                            borderRadius: "8px",
                            color: "#000",
                            mb: 1,
                            mt:2,
                            fontSize: '18px',
                            borderColor: "#000",
                            "&:hover": {
                                backgroundColor: "#f5f5f5",
                                borderColor: "#000",
                            },
                            }}
                            disabled={loading}
                            onClick={() => {
                            handleClose();
                            setFormError({});
                            setFormData({});
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    )
}