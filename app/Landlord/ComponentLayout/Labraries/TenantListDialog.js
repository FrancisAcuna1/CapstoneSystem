'use client';
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Box, Chip, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, TableContainer, Table, TableHead, TableRow, FormGroup, 
FormControl, FormControlLabel, Select, MenuItem, TableBody, Checkbox, Collapse, TableCell, Divider } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { format, addMonths, isSameMonth, subMonths, differenceInMonths, parseISO} from 'date-fns';
import Swal from 'sweetalert2'; 
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


// Styled components
const StyledTableCell = styled(TableCell)({ fontWeight: 'bold', letterSpacing: '1px', fontSize: '14px', color: '#263238' });
const StyledTableRow = styled(TableRow)(({ theme, isSelected }) => ({ backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.2) : 'inherit', color: '#263238' }));
const BootstrapDialog = styled(Dialog)(({ theme }) => ({ '& .MuiDialogContent-root': { padding: theme.spacing(2) }, '& .MuiDialogActions-root': { padding: theme.spacing(1) } }));


export default function TenantListDialog({ openDialog, handleCloseDialog, selectedUnit, loading, setLoading, setError, setSuccessful }) {
    const [selectedItem, setSelectedItem] = useState([]);
    const [payorList, setPayorList] = useState([]);
    const [tenantPayment, setLastPayment] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState({});
    const [advancePayments, setAdvancePayments] = useState({});
    const [expandedRows, setExpandedRows] = useState({});
    const [deliquent, setDeliquent] = useState([])
    // const [overdueData, setOverdueData] = useState([]);


    const toggleRow = (tenantId) => {
        setExpandedRows(prev => ({
            ...prev,
            [tenantId]: !prev[tenantId]
        }));
    };

   



    console.log(payorList)
    console.log(tenantPayment)
    console.log(payorList?.tenant_id)

    useEffect(() => {
        const fetchPayorData = async () => {
            const userDataString = localStorage.getItem('userDetails');
            const userData = JSON.parse(userDataString);
            const accessToken = userData.accessToken;
            if (accessToken) {
                const response = await fetch(`http://127.0.0.1:8000/api/get_payor_list/${selectedUnit.id}/${selectedUnit.property_type}`, {
                    method: 'GET',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${accessToken}` 
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setPayorList(data.data);
                }
                else{
                    console.log('Error fetching payor list');
                }
            }else{
                console.log('No access token found');
            }
        };
        fetchPayorData();
    }, [selectedUnit]);


    useEffect(() => {
        const fethcedPaymentData = async() => {
            const userDataString = localStorage.getItem('userDetails');
            const userData = JSON.parse(userDataString);
            const accessToken = userData.accessToken;
            if(accessToken){
                try{
                    const response = await fetch(`http://127.0.0.1:8000/api/get_tenant_payment/${selectedUnit.id}/${selectedUnit.property_type}`, {
                        method: 'GET',
                        headers: { 
                            'Content-Type': 'application/json', 
                            'Authorization': `Bearer ${accessToken}` 
                        }
                    })
                    const data = await response.json();
                    if(response.ok){
                        setLastPayment(data.data);
                    }else{
                        console.log('Error fetching payment data');
                    }
                }catch(error){

                }
            }else{
                console.log('No Access Token Found!')
            }
            
        }
        fethcedPaymentData();
    }, [selectedUnit])

    // this code is get the last payment of every tenant
    const getLastPayments = () => {
        // Group payments by tenant
        const groupedPayments = tenantPayment.reduce((acc, payment) => {
          if (!acc[payment.tenant_id]) {
            acc[payment.tenant_id] = [];
          }
          acc[payment.tenant_id].push(payment);
          return acc;
        }, {});
      
        // Find the last payment for each tenant
        return Object.values(groupedPayments).map(tenantPayments => 
          tenantPayments.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
        );
    };
      
    const lastPayments = getLastPayments()
    console.log(lastPayments)
    console.log(selectedItem)


    const handleMonthSelection = (tenantId, month) => {
        setSelectedMonths(prev => {
            const currentTenantMonths = prev[tenantId] || [];
            const monthExists = currentTenantMonths.includes(month);
            
            const updatedTenantMonths = monthExists
                ? currentTenantMonths.filter(m => m !== month)
                : [...currentTenantMonths, month];

            return {
                ...prev,
                [tenantId]: updatedTenantMonths
            };
        });

        // Update selectedItem to include/exclude tenant based on month selection
        setSelectedItem(prev => {
            const hasSelectedMonths = selectedMonths[tenantId]?.length > 0;
            if (hasSelectedMonths && !prev.includes(tenantId)) {
                return [...prev, tenantId];
            } else if (!hasSelectedMonths && prev.includes(tenantId)) {
                return prev.filter(id => id !== tenantId);
            }
            return prev;
        });
    };

    console.log(selectedMonths)


    const handleAdvancePaymentChange = (tenantId, numMonths) => {
        setAdvancePayments(prev => ({
            ...prev,
            [tenantId]: numMonths
        }));

        // When advance payment is selected, automatically select the tenant
        if (numMonths > 0 && !selectedItem.includes(tenantId)) {
            setSelectedItem(prev => [...prev, tenantId]);
        }
    };

    console.log(advancePayments)
    console.log(selectedMonths)

    // const generateAdvanceMonths = (startDate, numMonths) => {
    //     const months = [];
    //     let currentDate = new Date(startDate);
        
    //     for (let i = 0; i < numMonths; i++) {
    //         currentDate = addMonths(currentDate, 1);
    //         months.push(format(currentDate, 'MMMM yyyy'));
    //     }
        
    //     return months;
    // };

    // const calculateTotalAmount = (baseAmount, months) => {
    //     return parseFloat(baseAmount) * months;
    // };
    

    console.log(selectedMonths)
    console.log(advancePayments)
    const handleSave = async (e) =>{
        e.preventDefault()
        const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
        const userData = JSON.parse(userDataString); // parse the datastring into json 
        const accessToken = userData.accessToken;
        setLoading(true);
        if(accessToken){
            try{
                // Get the selected tenants' data
            const selectedTenantsData = selectedItem.map(selectedId => {
                const payor = payorList.find(p => p.tenant.id === selectedId);
                
                if (!payor) return null;

                let advanceMonthCount = advancePayments[selectedId];
                let selectedMonthsList = selectedMonths[selectedId] || [];
                let paymentAmount;

                const selectedMonthsCount = selectedMonthsList.length;

                advanceMonthCount = advanceMonthCount > 0 ? advanceMonthCount + 1 : 0;
                const totalMonthsCovered = selectedMonthsCount + advanceMonthCount;
                console.log(totalMonthsCovered)
              

                if (totalMonthsCovered > 0) {
                    paymentAmount = parseFloat(payor.rental_fee) * totalMonthsCovered;
                    console.log(paymentAmount)
                } else {
                    paymentAmount = parseFloat(payor.rental_fee);
                }

                // if(advanceMonthCount > 0){
                //     paymentAmount = parseFloat(payor.rental_fee) * (advanceMonthCount + 1);
                //     // transactionstype = `Rental Fee (${advanceMonthCount + 1}) `
                // }else{
                //     paymentAmount = parseFloat(payor.rental_fee);

                // }

                return {
                    tenant_id: payor.tenant.id,
                    amount: paymentAmount.toFixed(0), 
                    payment_date: format(new Date(), 'MM/dd/yyyy'), // Format date as MM/dd/yyyy
                    transaction_type: 'Rental Fee', // You can adjust this
                    status: 'Paid', // You can adjust this
                    months_covered: totalMonthsCovered || 1,
                    selected_months: selectedMonthsList // Pass selected months to backend
                };
              
                
            }).filter(Boolean);
            
            

            for(const paymentData of selectedTenantsData){
                const response = await fetch(`http://127.0.0.1:8000/api/storepayment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept' : 'application/json',
                    },
                    body: JSON.stringify(paymentData)
                })
                const data = await response.json();
                if(response.ok){
                    console.log(data.data)
                    console.log(data.message)
                    setLoading(false);
                    // Show success message
                    Swal.fire({
                        icon: 'success',
                        title: 'Payments Processed',
                        text: 'All selected tenant payments have been recorded successfully.',
                        confirmButtonText: 'OK'
                        
                    });
                    setSelectedItem([]);
                    handleCloseDialog();
                    window.location.reload();
                }else{
                    console.log(data.error)
                    setLoading(false);
                    if(data.error)
                    {
                        console.log(data.error)
                        localStorage.setItem('errorMessage', data.message || 'Operation Error!');
                        window.location.reload();
                        setSelectedItem([]);
                        handleCloseDialog();
                        setLoading(false);
                        // setError(data.error)
                    
                    }else{
                        console.log(data.message); // for duplicate entry
                        setError(data.message);
                        setSelectedItem([]);
                        handleCloseDialog();
                        setLoading(false);
                    }
                   
                }
            }   
            }catch(error){
                console.log(error)
            }
        }else{
            console.log('No Access Token Found!')
        }
    }

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
    })


    const getOverdueDetails = useCallback((payor) => {
        const currentDate = new Date('2025-5-1');
        currentDate.setDate(2);
        const tenantPayments = lastPayments.filter(
            payment => payment.tenant_id === payor.tenant.id
        );
        
        const sortedPayments = tenantPayments.sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        const lastPayment = sortedPayments[0];
        let lastCoveredDate;
        console.log(lastPayment)
        
        if (lastPayment) {
            lastCoveredDate = new Date(lastPayment.date);
            lastCoveredDate.setDate(1);
            lastCoveredDate.setMonth(lastCoveredDate.getMonth() + (lastPayment.months_covered - 1));
        } else {
            // If no payments, use lease start date plus prepaid period
            lastCoveredDate = new Date(payor.lease_start_date);
            lastCoveredDate.setDate(1);
            lastCoveredDate.setMonth(lastCoveredDate.getMonth() + (payor.prepaid_rent_period - 1));
        }

        console.log(lastCoveredDate)

        // Set to end of month for accurate comparison
        lastCoveredDate.setDate(1);
        lastCoveredDate.setMonth(lastCoveredDate.getMonth() + 1);
        lastCoveredDate.setDate(0);

        const overdueMonths = [];
        let dateIterator = new Date(lastCoveredDate);
        dateIterator.setDate(1);
        dateIterator.setMonth(dateIterator.getMonth() + 1);

        console.log(dateIterator)

        while (dateIterator <= currentDate) {
            const monthYear = format(dateIterator, 'MMMM yyyy');
            const isMonthCovered = sortedPayments.some(payment => {
                const paymentDate = new Date(payment.date);
                const coverageEndDate = new Date(paymentDate);
                coverageEndDate.setMonth(coverageEndDate.getMonth() + (payment.months_covered - 1));
                return dateIterator >= paymentDate && dateIterator <= coverageEndDate && payment.status === 'Paid';
                // return dateIterator >= paymentDate && dateIterator <= coverageEndDate; this code is working
            })|| deliquent.some(item => 
                item.tenant_id === payor.tenant.id && 
                isSameMonth(new Date(item.month_overdue), dateIterator) && 
                item.status === 'Paid'
            );;

            if (!isMonthCovered) {
                overdueMonths.push({
                    month: monthYear,
                    date: format(dateIterator, 'MM/dd/yyyy'),
                    amount: parseFloat(payor.rental_fee)
                });
            }
            
            dateIterator.setMonth(dateIterator.getMonth() + 1);
        }

        return overdueMonths;
    }, [lastPayments, deliquent]);

    // Add this function to check and submit overdue information
    const checkAndSubmitOverdues = useCallback (async () => {
        const userDataString = localStorage.getItem('userDetails');
        const userData = JSON.parse(userDataString);
        const accessToken = userData.accessToken;
        if(accessToken){
            for (const payor of payorList) {
                const overdueMonths = getOverdueDetails(payor);
                
                // Process each overdue month separately
                for (const overdueMonth of overdueMonths) {
                    const overdueEntry = {
                        tenant_id: payor.tenant.id,
                        amount_overdue: overdueMonth.amount,
                        month_overdue: overdueMonth.month,
                        last_due_date: overdueMonth.date,
                        status: 'Overdue'
                    };
    
                    try {
                        const response = await fetch('http://127.0.0.1:8000/api/store_delequent', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`,
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify(overdueEntry)
                        });
    
                        const data = await response.json();
                        
                        if (response.ok) {
                            console.log(`Overdue entry stored successfully for ${overdueMonth.month}`, data);
                        } else {
                            console.error(`Failed to store overdue entry for ${overdueMonth.month}:`, data.error);
                        }
                    } catch (error) {
                        console.error('Error submitting overdue data:', error);
                    }
                }
            }
        }   
    },[payorList, getOverdueDetails]);

    // Add this useEffect to check overdues whenever the component mounts or payorList/lastPayments change
    useEffect(() => {
        if (payorList.length > 0 && lastPayments.length > 0) {
            checkAndSubmitOverdues();
        }
    }, [payorList, lastPayments, checkAndSubmitOverdues]);




    const handleCheckBoxChange = (event, uniqueKey) => {
        setSelectedItem(prev => prev.includes(uniqueKey) ? prev.filter(id => id !== uniqueKey) : [...prev, uniqueKey]);
    };

    const formatDueDate = (payor) => {
        const leaseStart = new Date(payor.lease_start_date);
        const currentDate = new Date('2024-12-1');
        const prepaidMonths = payor.prepaid_rent_period;
    
        // Filter payments specific to this tenant
        const tenantPayments = lastPayments.filter(
            payment => payment.tenant_id === payor.tenant.id
        );
    
        // Include paid overdue payments
        const paidOverduePayments = deliquent.filter(item => 
            item.tenant_id === payor.tenant.id && 
            item.status === 'Paid'
        );
    
        // Combine and sort all payments by date
        const allPayments = [...tenantPayments, ...paidOverduePayments].sort((a, b) => 
            new Date(b.date || b.month_overdue) - new Date(a.date || a.month_overdue)
        );
    
        // If no payments, use lease start date
        const lastPayment = allPayments[0] || null;
        const lastPaymentDate = lastPayment 
            ? new Date(lastPayment.date || lastPayment.month_overdue) 
            : leaseStart;
    
        const calculateNextDueDate = () => {
            // Scenario 1: Current due date was May, paid with 2 months advance
            if (lastPayment && lastPayment.months_covered > 1) {
                const advanceMonths = lastPayment.months_covered - 1;
                return addMonths(lastPaymentDate, advanceMonths + 1);
            }
    
            // Scenario 2: Current due date was May, 1 month overdue, and 2 months paid
            const overdueMonths = getOverdueDetails(payor);
            if (overdueMonths.length > 0) {
                const paidOverdueMonths = overdueMonths.filter(month => 
                    allPayments.some(payment => 
                        isSameMonth(new Date(payment.date || payment.month_overdue), new Date(month.date))
                    )
                );
    
                // If paid more months than overdue
                if (paidOverdueMonths.length < lastPayment?.months_covered) {
                    return addMonths(lastPaymentDate, lastPayment.months_covered);
                }
            }
    
            // Default case: Add one month from last payment
            return addMonths(lastPaymentDate, 1);
        };
    
        const nextDueDate = calculateNextDueDate();
        console.log(nextDueDate)
        const previousDueDate = subMonths(nextDueDate, 1);
    
        // Check if next due date is paid
        const isNextDueDatePaid = allPayments.some(payment => 
            isSameMonth(new Date(payment.date || payment.month_overdue), nextDueDate)
        );
    
        // Determine status based on current date and payment history
        if (isSameMonth(currentDate, nextDueDate)) {
            return { 
                dueDate: nextDueDate, 
                status: isNextDueDatePaid ? "Paid" : "Not Paid" 
            };
        } else if (currentDate < nextDueDate) {
            return { 
                dueDate: previousDueDate, 
                status: "Paid" 
            };
        } else {
            return { 
                dueDate: nextDueDate, 
                status: isNextDueDatePaid ? "Paid" : "Overdue" 
            };
        }
    };

    useEffect(() => {
        const fetchDeliquentData = async () => {
            const userDataString = localStorage.getItem('userDetails');
            const userData = JSON.parse(userDataString);
            const accessToken = userData.accessToken;
    
            if (accessToken) {
                // Create a new array to store delinquent data
                const deliquentDataArray = [];
    
                // Use Promise.all to fetch delinquent data for all tenants concurrently
                await Promise.all(payorList.map(async (payor) => {
                    try {
                        const response = await fetch(`http://127.0.0.1:8000/api/get_delequent/${payor.tenant.id}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            }
                        });
    
                        const data = await response.json();
    
                        if (response.ok) {
                            // Only add to the array if there's delinquent data
                            if (data.data && data.data.length > 0) {
                                deliquentDataArray.push({
                                    tenantId: payor.tenant.id,
                                    deliquentData: data.data
                                });
                            }
                        } else {
                            console.log('Error fetching data for tenant ID:', payor.tenant.id);
                            console.log(data.error);
                        }
                    } catch (error) {
                        console.error('Error fetching delinquent data for tenant:', payor.tenant.id, error);
                    }
                }));
    
                // Set the state with the collected delinquent data
                setDeliquent(deliquentDataArray);
            } else {
                console.log('Access token not found!');
            }
        };
    
        if (payorList && payorList.length > 0) {
            fetchDeliquentData();
        }
    }, [payorList]);
    console.log(payorList?.tenant_id)
    
    console.log(deliquent);

    // const filteredOverdueData = deliquent.flatMap(tenantItem => 
    //     tenantItem.deliquentData
    //         .filter(delinquentItem => delinquentItem.status === 'Overdue')
    //         .map(overdueItem => ({
    //             ...overdueItem,
    //             tenantId: tenantItem.tenantId
    //         }))
    // );
    // console.log(filteredOverdueData)
    

    return (
        <BootstrapDialog onClose={handleCloseDialog} open={openDialog} fullWidth maxWidth={'md'}>
            <DialogTitle sx={{ m: 0, p: 2 }}>Tenant Payment Status</DialogTitle>
            <IconButton onClick={handleCloseDialog}  sx={{'&:hover':{backgroundColor:'#263238'}, position: 'absolute', right: 8, top: 8, height:'35px',width:'35px',}}>
                <CloseIcon sx={{transition: 'transform 0.3s ease-in-out','&:hover': {transform: 'rotate(90deg)', color:'#fefefe'}, }} />
            </IconButton>
            {/* <IconButton aria-label="close" onClick={handleCloseDialog} sx={{ position: 'absolute', right: 8, top: 8, color: 'grey' }}>
                <CloseIcon />
            </IconButton> */}
            <DialogContent dividers>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt: '0.2rem', fontSize: '14px', color: 'gray' }}>
                    <InfoOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    Please mark the box to confirm tenant payment
                </Typography>
                <TableContainer sx={{ overflowy: 'auto', width: '100%', mb:3 }}>
                    <Table size='small' sx={{ mt: 2 }}>
                        <TableHead sx={{ backgroundColor: 'whitesmoke', p: 1 }}>
                            <TableRow>
                                <StyledTableCell>Tenant Name</StyledTableCell>
                                <StyledTableCell>Due Date</StyledTableCell>
                                <StyledTableCell>Rental Fee</StyledTableCell>
                                <StyledTableCell sx={{width: '12%' }}>Paid</StyledTableCell>
                                <StyledTableCell sx={{width: '20%' }}>Advance Payment</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payorList.map((payor, index) => {
                                const tenantOverdueData  = deliquent.find(item => item.tenantId === payor.tenant.id) ?. deliquentData.filter(deliquenItem => deliquenItem.status === 'Overdue') || [];
                                const { dueDate, status } = formatDueDate(payor);
                                // const overdueMonths = getOverdueDetails(payor);
                                // console.log(overdueMonths)
                                const isSelected = selectedItem.includes(payor.tenant.id);
                                const isExpanded = expandedRows[payor.tenant.id];
                                const tenantSelectedMonths = selectedMonths[payor.tenant.id] || [];
                                return (
                                    <>
                                    <StyledTableRow key={payor.tenant.id} selected={isSelected} onChange={(event) => handleCheckBoxChange(event, payor.tenant.id)}>
                                        <TableCell align="start">
                                            {payor.tenant.firstname} {payor.tenant.lastname}
                                            <Divider sx={{ width: '40%' }} />
                                            <Typography sx={{ fontSize: '13px', color: 'gray', fontStyle: 'italic', mt: '0.3rem' }}>
                                                {payor.tenant.contact}
                                            </Typography>
                                           
                                        </TableCell>
                                        <TableCell align="start">
                                            <Box variant={'component'} sx={{display:'inline-flex',}}>
                                            {tenantOverdueData && tenantOverdueData.length > 1 ? (
                                                <Chip
                                                    label={`${tenantOverdueData.length} unpaid ${tenantOverdueData.length === 1 ? 'month' : 'months'}`}
                                                    size="small"
                                                    sx={{
                                                        mt: 1,
                                                        backgroundColor: '#ffebee',
                                                        color: '#b71c1c',
                                                        '& .MuiChip-label': {
                                                            fontSize: '0.78rem',
                                                            fontWeight: 500,
                                                            letterSpacing:0.4
                                                        }
                                                    }}
                                                />
                                            ):( <Typography variant='body2' sx={{fontSize:'14px'}}>
                                                {format(dueDate, "MMM d, yyyy")}
                                                </Typography>
                                            )}
                                               
                                            {tenantOverdueData && tenantOverdueData.length > 1 && (
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => toggleRow(payor.tenant.id)}
                                                    sx={{ ml: 0.1}}
                                                >
                                                    {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </IconButton>
                                            )}
                                            </Box>
                                            
                                            {/* {unpaid.join(", ")},  */}
                                           

                                        </TableCell>
                                        <TableCell align="start">{payor.rental_fee}</TableCell>
                                        <TableCell align="start">
                                            {status === "Paid" 
                                                ? <Chip
                                                    label={status}
                                                    
                                                    variant="contained"
                                                // backgroundColor={item.status === 'Available' ? '#ede7f6' : 'secondary'}
                                                    color={'success'}
                                                    sx={{
                                                        backgroundColor: '#e8f5e9',
                                                        color:'#004d40',
                                                        ml:-0.6,
                                                        '& .MuiChip-label': {
                                                            color: '#004d40',
                                                            fontWeight: 560,
                                                            letterSpacing: 1
                                                            
                                                        }
                                                    }}
                                                />
                                                : <Checkbox 
                                                    color="primary" 
                                                    checked={isSelected} 
                                                   
                                                />
                                            }
                                        </TableCell>
                                        <TableCell align="start">
                                            <Select
                                                value={advancePayments[payor.tenant.id] || 0}
                                                onChange={(e) => handleAdvancePaymentChange(payor.tenant.id, e.target.value)}
                                                size="small"
                                                disabled={status === "Paid"}
                                            >
                                                <MenuItem value={0}>No advance</MenuItem>
                                                <MenuItem value={1}>1 month</MenuItem>
                                                <MenuItem value={2}>2 months</MenuItem>
                                                <MenuItem value={3}>3 months</MenuItem>
                                                <MenuItem value={6}>6 months</MenuItem>
                                                <MenuItem value={12}>12 months</MenuItem>
                                            </Select>
                                        </TableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <TableCell colSpan={4} sx={{ py: 0, borderBottom: isExpanded ? '1px solid rgba(224, 224, 224, 1)' : 'none' }}>
                                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                <Box sx={{ m: 2, backgroundColor: '#fafafa', borderRadius: 1, p: 2 }}>
                                                    <Typography variant="subtitle2" gutterBottom sx={{ color: '#455a64' }}>
                                                        Select months to mark as paid:
                                                    </Typography>
                                                    <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
                                                        {tenantOverdueData.map((item, index) => {
                                                            const date = new Date(item.month_overdue);
                                                            const formattedMonth = date.toLocaleString('default', { month: 'long' });
                                                            const year = date.getFullYear();
                                                            const monthYear = `${formattedMonth} ${year}`;
                                                            return(
                                                            <FormControlLabel
                                                                key={index}
                                                                control={
                                                                    <Checkbox
                                                                        checked={tenantSelectedMonths.includes(monthYear)}
                                                                        onChange={() => handleMonthSelection(payor.tenant.id, monthYear)}
                                                                        size="small"
                                                                        
                                                                    />
                                                                }
                                                                label={monthYear}
                                                                sx={{
                                                                    '& .MuiFormControlLabel-label': {
                                                                        fontSize: '0.875rem',
                                                                        color: '#455a64'
                                                                    }
                                                                }}
                                                            />
                                                            )
                                                            
                                                        })}
                                                    </FormGroup>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </StyledTableRow>
                                    </>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleSave}
                    variant='contained'
                    size='medium'
                    sx={{mr:2, mt:0.5, mb:0.5}}
                >
                    Save
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}
