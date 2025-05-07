'use client'
import React from "react"
import { useEffect, useState, useCallback, useMemo } from "react"
import { Box, Collapse, Card, CardContent, Skeleton, Typography, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions, Button, IconButton, Stack, Chip, Tooltip} from "@mui/material"
import { styled, alpha } from "@mui/material/styles";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { parseISO, format, differenceInDays, addMonths, setDate, getDate } from "date-fns";
import useSWR from "swr";
import dayjs from 'dayjs';

const GeneralTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    "& .MuiTooltip-tooltip": {
      backgroundColor: "#263238", // Background color of the tooltip
      color: "#ffffff", // Text color
      borderRadius: "4px",
    },
});

const fetcher = async([url, token]) => {
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

const calculateNextDueDate = (lastPaymentDate, monthsCovered) => {
    const lastDate = dayjs(lastPaymentDate);
    return lastDate.add(monthsCovered, 'month').format('MMMM D, YYYY');
};

// Function to determine the color based on days remaining
const getDueDateColor = (dueDateString) => {
    const dueDate = dayjs(dueDateString); // Convert the string to a dayjs object
    console.log("date: ", dueDate)
    const now = dayjs();
    const daysRemaining = dueDate.diff(now, 'day');
    console.log("days: ", daysRemaining)
  
    if (daysRemaining <= 0) {
      return '#d50000'; // Dark red for overdue or due today
    } else if (daysRemaining <= 7) {
      return '#e57373'; // Light red for within a week
    } else {
      return '#263238'; // Default color
    }
};
 
const getBgDueDateColor = (dueDateString) => {
    const dueDate = dayjs(dueDateString); // Convert the string to a dayjs object
    const now = dayjs();
    const daysRemaining = dueDate.diff(now, 'day');
  
    if (daysRemaining <= 0) {
      return '#fafafa'; // Dark red for overdue or due today
    } else if (daysRemaining <= 7) {
      return '#fafafa'; // Light red for within a week
    } else {
      return '#fafafa'; // Default color
    }
};

const getBorderDueDateColor = (dueDateString) => {
    const dueDate = dayjs(dueDateString); // Convert the string to a dayjs object
    const now = dayjs();
    const daysRemaining = dueDate.diff(now, 'day');
  
    if (daysRemaining <= 0) {
      return '2px solid #d50000'; // Dark red for overdue or due today
    } else if (daysRemaining <= 7) {
      return '1px solid #e57373'; // Light red for within a week
    } else {
      return '1px solid #bdbdbd'; // Default color
    }
};

const legendItem = [
    {label: 'Overdue/Due date', color: '#d50000', tooltip: 'Overdue or due today'},
    {label: 'Due within a week', color: '#e57373' , tooltip: "Due within a one week or 7 day's"},
    {label: 'Upcoming', color: '#263238', tooltip: 'Upcoming due date'},
]

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable

export default function UpComingDuedates({propId, openDialog, handleDialogClose, setLoading, loading}){
    const [accessToken, setAccessToken] = useState([])
    const [lastPayment, setLastPayment] = useState([])
    const [overdueTenants, setOverdueTenants] = useState([]);
    const [delinquentData, setDeliquentData] = useState([])
    const [expanded, setExpanded] = useState({});
    console.log('Overdue Tenants:', overdueTenants);

    console.log(propId)
    console.log(lastPayment)

    const toggleExpand = (tenantId) => {
        setExpanded((prev) => ({
        ...prev,
        [tenantId]: !prev[tenantId], // Toggle the specific tenant's expansion state
      }));
    };

    useEffect(() => {
        const userDataString = localStorage.getItem("userDetails"); 
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            if (userData && userData.accessToken) {
                setAccessToken(userData.accessToken);
            }
        }
    }, []);

    const {data:response, error: errorResponse, isLoading: isLoadingResponse} = useSWR(
        accessToken && [`${API_URL}/get_all_units/${propId}`, accessToken] || null,
        fetcher, {
            refreshInterval: 5000,
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            errorRetryCount: 3,
            onLoadingSlow: () => setLoading(true),
        }
    )
    console.log(errorResponse);
    useEffect(() => {
        if(response){
            setLastPayment(response.data);
            setLoading(false)
        }else if(isLoadingResponse){
            setLoading(true)
        }
    }, [response, setLoading, isLoadingResponse])

    
    const getOverdueTenants = (payments) => {
        // const currentDate = customCurrentDate ? dayjs(customCurrentDate) : dayjs();

        const overdue = payments
          .map((payment) => {
            const nextDueDate = dayjs(calculateNextDueDate(payment.last_payment.paid_for_month, payment.last_payment.months_covered));
            // Check if the tenant is overdue
            if (dayjs().isAfter(nextDueDate)) {
                const overdueDates = [];
                  let currentDate = nextDueDate;
                // let tempDate = nextDueDate; //sample

        
                // Add each overdue month's specific due date to the array
                while (currentDate.isBefore(dayjs())) {
                    overdueDates.push(currentDate.format('MMMM D, YYYY')); // Specific date format
                    currentDate = currentDate.add(1, 'month');
                }

                // while (tempDate.isBefore(currentDate)) {
                //     overdueDates.push(tempDate.format('MMMM D, YYYY')); // Specific date format
                //     tempDate = tempDate.add(1, 'month');
                // } sample 
        
                return {
                    tenant_id: payment.rental_agreement.tenant.id,
                    rental_fee: payment.rental_agreement.rental_fee,
                    overdue_months: overdueDates, // Store specific overdue dates
                };
            }
            return null; // Ignore tenants not overdue
          })
          .filter((tenant) => tenant !== null); // Filter out null values
      
        // Update state with overdue tenants
        setOverdueTenants(overdue);
    };

  

    const checkAndSubmitOverdues = useCallback(async() => {
        if(accessToken){
            for (const overdue of overdueTenants){
                console.log(overdue)
                const { tenant_id, rental_fee, overdue_months } = overdue;
                for (const month of overdue_months) {
                    const formattedDate = dayjs(month, 'MMMM D, YYYY').format('MM/DD/YYYY');
                    const overdueEntry = {
                        tenant_id,
                        amount_overdue: parseInt(rental_fee), // Assuming the rental fee is the amount overdue
                        month_overdue: formattedDate, // Use formatted date
                        last_due_date: formattedDate, // Use the same formatted date
                        status: "Overdue",
                    };
                    console.log(overdueEntry)
                    try{
                        const response = await fetch(`${API_URL}/store_delequent`,{
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${accessToken}`,
                            },
                            body: JSON.stringify(overdueEntry),
                        })
                        const data = await response.json();

                        if (response.ok) {
                          console.log(
                            `Overdue entry stored successfully for ${month.month}`,
                            data
                          );
                        } else {
                          console.error(data.message);
                        }
                    }catch (error) {
                        console.error("Error submitting overdue data:", error);
                    }
                }
            }
        }
    }, [accessToken])

    useEffect(() => {
        if (lastPayment.length > 0) {
            getOverdueTenants(lastPayment, '2025-05-1');
        }
    }, [lastPayment]);

    useEffect(() => {
        if (overdueTenants.length > 0) {
            checkAndSubmitOverdues();
        }
    }, [overdueTenants, checkAndSubmitOverdues]);

    const tenantIds = useMemo(() => lastPayment.map(item => item.rental_agreement.tenant_id), [lastPayment]);

    console.log(tenantIds)
    useEffect(() => {
        const fetchDelinquentData = async () => {
            if (!accessToken || tenantIds.length === 0) {
                console.warn('Access token or tenant IDs missing. Skipping fetch.');
                return;
            }

            try {
                // Use Promise.all to fetch data for all tenant IDs concurrently
                const fetchPromises = tenantIds.map(id =>
                    fetch(`${API_URL}/get_delequent/${id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    })
                        .then(async response => {
                            const data = await response.json();
                            if (response.ok) {
                                return { tenantId: id, delinquentData: data.data };
                            } else {
                                console.error('Error fetching data for tenant ID:', id, data.error, data.message);
                                return null; // Return null for failed requests
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching data for tenant ID:', id, error.message);
                            return null; // Return null for failed requests
                        })
                );

                // Wait for all fetches to complete
                const allData = (await Promise.all(fetchPromises)).filter(data => data !== null);

                // Update the state with the collected data
                setDeliquentData(allData);
            } catch (error) {
                console.error('Error during fetchDelinquentData:', error.message);
            }
        };

        fetchDelinquentData();

        // Dependency array includes tenantIds to re-trigger on change
    }, [tenantIds, accessToken]);

    console.log(delinquentData)
    
    const formatDate = (dateString) => {
        if (!dateString) {
            return null;
        }

        try {
            const parseDate = parseISO(dateString);
            return format(parseDate, "MMMM d, yyyy");
        } catch (error) {
            console.log("Error formating Date:", error);
            return dateString;
        }
    };
    

    return(
        <React.Fragment>
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                fullWidth
                maxWidth={"sm"}
                aria-describedby="alert-dialog-slide-description"
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <DialogTitle sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.7 }}>
                    <CalendarMonthOutlinedIcon />
                    Upcoming Due Dates
                </DialogTitle>
                <IconButton sx={{mr:2}} onClick={handleDialogClose}>
                    <CancelOutlinedIcon sx={{ color:'#263238', fontSize:'28px'}}/>
                </IconButton>
                </Box>

                
                <DialogContent dividers={true}>
                <DialogContentText id="alert-dialog-slide-description">
                    <Stack sx={{flexDirection:'row', justifyContent:'start', gap:1, mb:3, mt:1}}>
                        {legendItem.map((item, index) => (
                        <Tooltip key={index} title={item.tooltip} arrow>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                                <Box
                                sx={{
                                    width: '16px',       // Set the width of the circle
                                    height: '16px',      // Set the height of the circle
                                    borderRadius: '50%', // Make it a circle
                                    border: `2px solid ${item.color}`, // Border with the item color
                                    marginRight: 1,      // Add spacing between the circle and label
                                }}
                                />
                                <Typography
                                sx={{
                                    fontSize: '0.825rem',  // Adjust font size
                                    color: item.color,     // Set the color of the text to match the circle color
                                    fontWeight: 'bold',    // Optional: make the label bold
                                }}
                                >
                                {item.label}
                                </Typography>
                            </Box>
                        </Tooltip>
                        ))}
                    </Stack>
                    {loading ? (
                        <>
                        {Array.from(new Array(4)).map((_, index) => (
                        <Card key={index} sx={{mt:1}}>
                            <CardContent>
                                <Skeleton animation="wave" width="100%" />
                                <Skeleton animation="wave" width="80%" />
                                <Skeleton animation="wave" width="60%" />
                            </CardContent>
                        </Card>
                        ))}
                        </>
                    ):(
                        <>
                        {lastPayment && lastPayment.length > 0 ? (
                            lastPayment.map(payment => {
                                const nextDueDate = calculateNextDueDate(
                                    payment.last_payment.paid_for_month, 
                                    payment.last_payment.months_covered
                                );
                                console.log(nextDueDate)
                                console.log(payment.last_payment.paid_for_month)
                                console.log( payment.last_payment.months_covered)
                                const overDueDetails = delinquentData.find((item) => item.tenantId === payment.rental_agreement?.tenant_id)
                                    ?.delinquentData.filter((delinquentItem) => delinquentItem.status === "Overdue") || [];
                                console.log(overDueDetails);
                                const dueDateColor = getDueDateColor(nextDueDate);
                                const backgroundColor = getBgDueDateColor(nextDueDate);
                                const borderColor = getBorderDueDateColor(nextDueDate);
                                return(
                                    <Stack 
                                    key={payment.unit_id}
                                        sx={{
                                            backgroundColor: backgroundColor,
                                            p:1.6,
                                            borderRadius:1,
                                            border: borderColor,
                                            mb:1
                                        }}
                                    >
                                        <Box sx={{display: 'flex', justifyContent:'space-between'}}>
                                            <Typography variant="body1" sx={{color:'#263238', fontWeight:550}} gutterBottom>
                                            {payment.rental_agreement.tenant.firstname} {payment.rental_agreement.tenant.lastname}
                                            </Typography>
                                            <Typography variant="body1" sx={{color:'#263238', fontWeight:550}} gutterBottom>
                                                ₱{payment.rental_agreement.rental_fee}
                                            </Typography>
                                        </Box>
                                        <Box sx={{display: 'flex', justifyContent:'space-between'}}>
                                            <Typography variant="body2" gutterBottom>
                                                {payment.rental_agreement.rented_unit?.boarding_house_name || payment.rental_agreement.rented_unit?.apartment_name}
                                                - {payment.rental_agreement.rented_unit?.property_type}
                                            </Typography>
                                            {overDueDetails && overDueDetails.length > 1 ? (
                                            <Box
                                                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                                onClick={() => toggleExpand(payment.rental_agreement?.tenant_id)}
                                            >
                                                <Typography variant="body2" sx={{ color: dueDateColor, mr: 0.5 }}>
                                                {expanded[payment.rental_agreement?.tenant_id] ? 'Show less' : 'Show more'}
                                                </Typography>
                                                {expanded[payment.rental_agreement?.tenant_id] ? (
                                                <KeyboardArrowUpIcon sx={{ color: dueDateColor }} />
                                                ) : (
                                                <KeyboardArrowDownIcon sx={{ color: dueDateColor }} />
                                                )}
                                            </Box>
                                            ) : (
                                                <Typography variant="body2" sx={{ color: dueDateColor }} gutterBottom>
                                                    Due date {nextDueDate}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Collapse in={expanded[payment.rental_agreement?.tenant_id]}>
                                            <Stack spacing={1} sx={{ mt: 1 }}>
                                                {overDueDetails.map((detail, index) => {
                                                // Calculate the number of overdue days
                                                const overdueDate = new Date(detail.month_overdue);
                                                const today = new Date();
                                                const overdueDays = Math.max(
                                                    Math.ceil((today - overdueDate) / (1000 * 60 * 60 * 24)), // Calculate days
                                                    0 // Ensure non-negative value
                                                );
                                                
                                                return (
                                                    <Box
                                                    key={index}
                                                    sx={{ display: 'flex', justifyContent: 'space-between', pl: 2 }}
                                                    >
                                                    {/* Display overdue date */}
                                                    <Typography variant="body2" sx={{ color: dueDateColor, display:'inline-flex', alignItems:'center', gap:1 }}>
                                                       <ReportOutlinedIcon/> {formatDate(detail.month_overdue)}
                                                    </Typography>
                                                    {/* Display overdue status and days */}
                                                    <Typography variant="body2" sx={{ color: dueDateColor }}>
                                                        Due date overdue - Overdue by {overdueDays} {overdueDays === 1 ? 'day' : 'days'}
                                                    </Typography>
                                                    </Box>
                                                );
                                                })}
                                            </Stack>
                                        </Collapse>
                                    </Stack>
                                )
                            })
                        ):(
                            <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 2 }}>
                                <Box
                                    sx={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    backgroundColor: '#F4F5F7', // Light background color for the circle
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 2,
                                    }}
                                >
                                    <ReportOutlinedIcon sx={{ fontSize: '38px', color: '#607D8B' }} /> {/* Icon size and color */}
                                </Box>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: 1 }}>
                                    No Tenants or Units Registered
                                </Typography>
                                <Typography sx={{ color: '#607D8B', fontSize: '0.875rem' }}>
                                    There are no registered tenants or units in this property at the moment.
                                </Typography>
                            </Stack>

                        )}
                        </>
                    )}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button 
                    variant="contained"
                    size="small"
                    onClick={handleDialogClose}
                >
                    Close
                </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}