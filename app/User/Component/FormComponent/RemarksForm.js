'use client';
import React, { useEffect, useId, useState } from 'react';
import {Typography, TextField, Button, Box, IconButton, Fade, Dialog, DialogTitle, DialogContent, DialogContentText, CircularProgress} from '@mui/material';
import { useSnackbar } from "notistack";
import useSWR from 'swr';


const fetcherUnitInfo = async ([url, token]) => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
};  

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable

export default function RemarksForm({open, setRemarksOpen, cancelId, setLoading, loading}){
    const {enqueueSnackbar} = useSnackbar();
    const [userId, setUserId] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [unitInformation, setUnitInformation] = useState([]);
    const [formError, setFormError] = useState([]);
    const [formData, setFormData] = useState({
        remarks: '',
    })
    
    console.log(cancelId)
    console.log(formData);
    console.log(userId);
    console.log(accessToken);
    console.log(unitInformation);


    const handleChange = (e) => {
        const { name, value } = e.target;
        const unitName = unitInformation.rented_unit.boarding_house_name || unitInformation.rented_unit.apartment_name;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
            unitName: unitName
        }));
        if(formError[name]){
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }))
        }
    }

    useEffect(() => {
        const userDataString = localStorage.getItem("userDetails");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserId(userData?.user?.id || null);
          setAccessToken(userData?.accessToken || null);
        }
    }, []);

    const {data: responseUnitinfo, error: errorResponse, isLoading: isLoadingUnitInfo} = useSWR(
        accessToken && userId 
        ? [`${API_URL}/tenant_unit_info/${userId}`, accessToken] 
        : null,
        fetcherUnitInfo, {
            refreshInterval: 60000,
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            errorRetryCount: 3,
            onLoadingSlow: () => setLoading(true),
        }
    )

    console.log(errorResponse)
    useEffect(() => {
        if (responseUnitinfo) {
          setUnitInformation(responseUnitinfo?.data || "");
          setLoading(false);
        } else if (isLoadingUnitInfo) {
          setLoading(true);
        }
    }, [responseUnitinfo, isLoadingUnitInfo, setLoading]);
    


    const handleSubmit = async(e) => {
        e.preventDefault();
        const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
        const userData = JSON.parse(userDataString); // parse the datastring into json 
        const accessToken = userData.accessToken;
        
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
                
                const response = await fetch(`${API_URL}/cancel_request/${cancelId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': 'application/json',
                    }, 
                    body: JSON.stringify(formData)
                })
                const data = await response.json();
                if(!response.ok){
                    setLoading(false);
                    enqueueSnackbar(data.message, {variant: 'error'})
                    console.log(data.error);
                    console.log(data.message)
                }
                enqueueSnackbar('Your feedback has been submitted successfully.', {variant: 'success'})
                console.log(data.data)
                setLoading(false)
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
                    Kindly provide a remark explaining the reason for the cancellation of your submitted request.
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
                        {loading ? <CircularProgress size="30px"  sx={{color:"white"}}/> : 'Submit Remarks'}
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