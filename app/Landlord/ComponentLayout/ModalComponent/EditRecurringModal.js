"use client";
import React, { useEffect, useState } from "react";
import {Grid, Box, Paper, Typography, Button, Fade, TextField, FormHelperText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Modal as BaseModal } from "@mui/base/Modal";
import { styled, css, getValue } from "@mui/system";
import { useSnackbar } from "notistack";

export default function EditRecurringModal({openRecurringModal, setOpenRecurringModal, handleCloseModal, editItemId, setLoading, loading, setError, setSuccess, refreshData}) {
    const { enqueueSnackbar } = useSnackbar();
    const [formError, setFormError] = useState({});
    const [formData, setFormData] = useState({
        amount: '',
    })

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prev) => ({
            ...prev,
        [name]: value,
        }))
            // Clear error when user starts typing
        if (formError[name]) {
            setFormError((prev) => ({
            ...prev,
            [name]: "",
            }));
        }
    }

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        if (!formData.amount) {
            tempErrors.amount = "Amount is required";
            isValid = false;
        }else if(formData.amount < 0){
            tempErrors.amount = "Please input atleast 1 or 100";
            isValid = false;
        }

        setFormError(tempErrors);
        return isValid;
    }

    console.log(editItemId)
    console.log(formData)


    useEffect(() => {
        const fetchedData = async() => {
            const userDataString = localStorage.getItem("userDetails");
            const userData = JSON.parse(userDataString);
            const accessToken = userData.accessToken;
            setLoading(true);

            if(accessToken){
                try{
                    const response = await fetch(`http://127.0.0.1:8000/api/edit_recurring/${editItemId}`,{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
                    const data = await response.json();
                    if(response.ok){
                        console.log(data.data);
                        setFormData({
                            amount: data.data.amount,
                        })
                        setLoading(false);
                    }else{
                        console.log("Error");
                        console.log(data.error);
                        setLoading(false);
                    }
                }catch(error){
                    console.log(error)
                }
            }else{
                console.log('No access token found!')
            }
        }
        fetchedData();
    }, [editItemId, setFormData, setLoading])


    const handleSubmit = async(e) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }
    
        setLoading(true);
        const userDataString = localStorage.getItem("userDetails");
        const userData = JSON.parse(userDataString);
        const accessToken = userData.accessToken;

        if(accessToken){
            const response = await fetch(`http://127.0.0.1:8000/api/update_recurring/${editItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json();
            if(response.ok){
                console.log(data.data)
                console.log(data.message)
                // setOpenSnackbar(true)
                enqueueSnackbar("Recurring expense updated successfully!", { variant: "success" });
                handleCloseModal()
                refreshData();
            }else{
                console.log(data.message)
                console.log(data.error)
                handleCloseModal()
                enqueueSnackbar(data.message, { variant: "error" });
                refreshData();
            }
        }else{
            console.log('No Accesstoken found!')
        }

    }
    


  return (
    <React.Fragment>
        <Dialog
        fullWidth={false}
        maxWidth={'sm'}
        open={openRecurringModal}
        onClose={() => {
            handleCloseModal();
            setFormError({});
            setFormData({});
        }}
        >
            <DialogTitle>Edit Recurring Expenses</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{mb:3}}>
                You are about to modify the amount for this recurring expense. This change will be applied only in this expense. The current amount is {formData.amount ? `₱${formData.amount.toLocaleString()}` : '---'}.
                </DialogContentText>
                    <TextField
                        required
                        type="number"
                        id="amount"
                        label="Amount"
                        name="amount"
                        value={formData.amount || ''}
                        onChange={handleChange}
                        margin="normal"
                        fullWidth
                        error={Boolean(formError.amount)}
                        helperText={formError.amount}
                        placeholder={loading ? 'Loading...' : ''}
                        onKeyDown={(e) => {
                            // Prevent 'e', 'E', '+', and '-' from being entered
                            if (
                                e.key === "e" ||
                                e.key === "E" ||
                                e.key === "+" ||
                                e.key === "-"
                            ) {
                                e.preventDefault();
                            }
                        }}
                        inputProps={{
                            pattern: "^[0-9]*(\\.[0-9]{0,2})?$", // Only allow numbers and optional 2 decimal places
                            min: 0,
                            step: "0.01",
                            disabled: loading, // Disable input while loading
                        }}
                    />
                </DialogContent>
                <DialogActions>
                <Button 
                variant="outlined"
                color="primary"
                sx={{
                    borderRadius: "8px",
                    color: "#000",
                    mb:1,
                    borderColor: "#000",
                    "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#000",
                    },
                }}
                onClick={() =>{
                    handleCloseModal();
                    setFormError({});
                    setFormData({});
                }}
            >
                Cancel
            </Button>
                <Button 
                onClick={handleSubmit}
                variant="contained"
                sx={{
                    mb:1
                }}
                >
                    Save
            </Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>
  );
}
