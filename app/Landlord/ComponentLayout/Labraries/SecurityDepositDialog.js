import React, { useEffect, useState} from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Paper,
  Alert,
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ClockIcon from "@mui/icons-material/AccessTime";
import ShieldIcon from "@mui/icons-material/ShieldOutlined";
import useSWR from "swr";
import { useSnackbar } from "notistack";
import { SecurityTwoTone } from "@mui/icons-material";


const fetcherSecurityDeposit = async([url, token]) => {
    const response = await fetch(url, {
        method: 'GET', 
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if(!response.ok){
        throw new Error(response.statusText)
    }
    return response.json();
}   

const fetcherDelinquent = async([url, token]) => {
    const response = await fetch(url, {
        method: 'GET', 
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if(!response.ok){
        throw new Error(response.statusText)
    }
    return response.json();
}   

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable

export default function SecurityDepositDialog({open, handleClose, tenantId, setLoading, loading, payorList, formatDueDate}) { 
  const { enqueueSnackbar } = useSnackbar();
  const [tenants, setTenants] = useState([]);
  const [securityDeposit, setSecuritDeposit] = useState([]);
  const [hasDelinquent, setHasDelinquent] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [accessToken, setAccessToken] = useState([])

  console.log(tenantId);
  console.log(tenants)
  console.log(securityDeposit)
  console.log(hasDelinquent)
  console.log(payorList)
  console.log(formatDueDate)

  
  useEffect(() => {
    const userDataString = localStorage.getItem("userDetails"); 
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      if (userData && userData.accessToken) {
        setAccessToken(userData.accessToken);
      }
    }
  }, []); 

  const {data: responseDeposit, error: errorDeposit, isLoading: isLoadingDeposit} = useSWR(
    accessToken && tenantId 
    ? [`${API_URL}/security_deposit/${tenantId}`, accessToken]
    : null,
    fetcherSecurityDeposit, {
      refreshInterval: 3000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  )
  useEffect(() => {
    if(responseDeposit){
        setTenants(responseDeposit?.data?.tenant || '');
        setSecuritDeposit(responseDeposit?.data)
        setLoading(false);
    }else if(isLoadingDeposit){
        setLoading(true)
    }
  }, [responseDeposit, isLoadingDeposit, setLoading])


  const {data: responseDelinquent, error: errorDeliquent, isLoading: isLoadingDeliquent} = useSWR(
    accessToken && tenantId 
    ? [`${API_URL}/get_delequent/${tenantId}`, accessToken]
    : null,
    fetcherDelinquent, {
      refreshInterval: 3000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  )
  useEffect(() => {
    if(responseDelinquent){
        const isOverdue = responseDelinquent.data.some((entry) => entry.status === 'Overdue');
        setHasDelinquent(isOverdue);
        setLoading(false);
    }else if(isLoadingDeliquent){
        setLoading(true)
    }
  }, [responseDelinquent, isLoadingDeliquent, setLoading])


  // Open confirmation dialog
  const handleOpenConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };

  const handleUseSecurityDeposit = async() => {
    if(accessToken){
        setLoading(true)
        try{
            const response = await fetch(`${API_URL}/paid_by_deposit/${tenantId}`, {
                method: 'POST',
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            })
            const data = await response.json();
            if(response.ok){
                console.log(data?.data)
                setLoading(false);
                enqueueSnackbar(data.message, { variant: "success" });
                setConfirmDialogOpen(false)
                handleClose()
            }else{
                console.log(data.error)
                setLoading(false)
                enqueueSnackbar(data.message, { variant: "error" });
                handleOpenConfirmDialog()
                setConfirmDialogOpen(false)
                handleClose()
            }
        }catch(error){
            console.log(error);
        }
    }
  }

  // Use security deposit for last month's rent
//   const handleUseSecurityDepositForRent = () => {
//     if (!selectedTenant) return;

//     setTenants(
//       tenants.map((tenant) =>
//         tenant.id === selectedTenant.id
//           ? {
//               ...tenant,
//               isLastMonthRent: true,
//               rentalFee: 0,
//             }
//           : tenant
//       )
//     );
//     setConfirmDialogOpen(false);
//     handleClose()
//   };

    return (
        <div style={{ width: "100%", maxWidth: 600, margin: "auto" }}>
        <Typography variant="h4" gutterBottom>
            Tenant Rent Management
        </Typography>

      
        <Paper
        elevation={2}
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            marginBottom: 16,
        }}
        >
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Security Deposit Details - {tenants.firstname} {tenants.lastname}</DialogTitle>

                <DialogContent>
                <Grid container spacing={2}>
                    {/* Total Deposit Section */}
                    <Grid item xs={12} sx={{mt:1}}>
                    <Paper
                        variant="outlined"
                        style={{
                        display: "flex",
                        alignItems: "center",
                        padding: 16,
                        backgroundColor: "#f5f5f5",
                        }}
                    >
                        <AccountBalanceWalletOutlinedIcon  sx={{color:'#4caf50', fontSize:'28px', mr: 2}} />
                        <div>
                        <Typography variant="subtitle1" sx={{color:'#263238', fontSize:'16px',}}>
                            Total Security Deposit
                        </Typography>
                        <Typography variant="h6" sx={{color:'#263238', fontSize:'20px', fontWeight:'500'}}>
                        ₱ {securityDeposit?.deposit}
                        </Typography>
                        </div>
                    </Paper>
                    </Grid>

                    {/* Last Month's Rent Option */}
                    <Grid item xs={12}>
                    <Paper
                        variant="outlined"
                        style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 16,
                        backgroundColor: "#f5f5f5",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                        <ClockIcon sx={{color:'#2196f3',  fontSize:'28px', mr: 2}} />
                        <div>
                            <Typography variant="subtitle1">
                            Last Month&apos;s Rent Option
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            Use security deposit to cover final month&apos;s rent
                            </Typography>
                        </div>
                        </div>

                        {/* <Button
                        variant="contained"
                        color="primary"
                        disabled={securityDeposit.is_last_month === 1}
                        onClick={() => handleOpenConfirmDialog(tenants)}
                        >
                        {tenants.is_last_month === 1 ? "Applied" : "Apply to Rent"}
                        </Button> */}
                        <Button
                        variant="contained"
                        color="primary"
                        disabled={securityDeposit.is_last_month === 1 || hasDelinquent}
                        onClick={() => handleOpenConfirmDialog(tenants)}
                        >
                        {hasDelinquent
                            ? "Restricted"
                            : securityDeposit.is_last_month === 1 
                            ? "Applied"
                            : "Apply to Rent"}
                        </Button>
                    </Paper>
                    </Grid>

                    {/* Applied Confirmation */}
                    {securityDeposit.is_last_month === 1  && (
                    <Grid item xs={12}>
                         <Alert
                            severity="success"
                            style={{
                            backgroundColor: '#EDFFED', // Light green background
                            borderLeft: '4px solid #3cba92', // Green border on the left
                            color: '#43a047', // Dark green text color
                            }}
                        >
                            Security deposit has been applied to cover the last month&apos;s rent.
                        </Alert>
                    </Grid>
                    )}
                </Grid>
                </DialogContent>

                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
                </DialogActions>
            </Dialog>
         </Paper>


        {/* Confirmation Dialog */}
        <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
            style: {
            borderRadius: '12px',
            padding: '20px',
            },
        }}
        >
        <DialogTitle>
            <Typography
            variant="h6"
            align="center"
            style={{
                fontWeight: '600',
                color: '#263238',
                display:'inline-flex',
                alignItems:'center'
            }}
            >
            Confirm Security Deposit Usage <SecurityTwoTone sx={{fontSize: '28px'}}/>
            </Typography>
        </DialogTitle>
        <DialogContent>
            <Typography
            variant="body1"
            align="center"
            style={{
                marginBottom: '16px',
                color: '#555',
            }}
            >
            Are you sure you want to use the security deposit of 
            <span style={{ fontWeight: 'bold', color: '#7e57c2', marginLeft: '5px', marginRight: '5px' }}>
            ₱{securityDeposit?.deposit}
            </span> 
            to cover the last month&apos;s rent for 
            <span style={{ fontWeight: 'bold', color: '#263238', marginLeft: '5px', }}>
            {tenants.firstname} 
            </span>?
            </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center', paddingTop: '8px' }}>
            <Button
            onClick={() => setConfirmDialogOpen(false)}
            style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                color: '#555',
                border: '1px solid #ccc',
            }}
            >
            Cancel
            </Button>
            <Button
            onClick={handleUseSecurityDeposit}
            variant="contained"
            style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                backgroundColor: '#7e57c2',
                color: '#fff',
                marginLeft: '8px',
            }}
            >
            Confirm
            </Button>
        </DialogActions>
        </Dialog>

        </div>
    );
}
