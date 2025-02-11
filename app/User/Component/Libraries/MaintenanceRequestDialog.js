"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Skeleton,
  Grid,
  Chip,
  Card,
  CardMedia,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { format, parseISO } from "date-fns";
import { useSnackbar } from "notistack";
import useSWR from "swr";

const fetcher = async ([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable
const API_URL_IMG = process.env.NEXT_PUBLIC_API_URL_IMG;

const MaintenanceRequestDialog = ({
  open,
  handleClose,
  scroll = "paper",
  loading,
  setLoading,
  viewId,
}) => {
  const [userToken, setUserToken] = useState([]);
  const [viewAccepted, setViewAccepted] = useState([]);

  console.log(viewId);
  console.log(viewAccepted);
  console.log(loading)
  useEffect(() => {
    const userDataString = localStorage.getItem("userDetails");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserToken(userData?.accessToken || null);
    }
  }, []);

  const { data: response, error, isLoading,} = useSWR(
    userToken && viewId
      ? [`${API_URL}/view_accepted_request/${viewId}`, userToken]
      : null,
    fetcher, {
      refreshInterval: 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  );
  
  console.log(error)
  useEffect(() => {
    if (response?.data) {
      const details = response?.data || "";
      setViewAccepted(details);
      setLoading(false);
    } else if (isLoading) {
      setLoading(true);
    }else if(error){
      setLoading(false);
    }
  }, [response, error, isLoading, setLoading]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return null;
    }

    try {
      const parseDate = parseISO(dateString);
      return format(parseDate, "MMM d, yyyy");
    } catch (error) {
      console.log("Error formating Date:", error);
      return dateString;
    }
  };
  console.log("Images:", viewAccepted?.maintenance_images);

  const images =
    (viewAccepted?.maintenance_images && viewAccepted?.maintenance_images) ||
    [];
  console.log("images:", images);
  const imageBaseUrl = `${API_URL_IMG}/MaintenanceImages/`; // Adjust this based on your API endpoint

    return (
        <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        maxWidth="md"
        fullWidth
        aria-labelledby="maintenance-request-dialog"
        >
        <DialogTitle className="bg-blue-50">
            <div className="flex justify-between items-center">
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                variant="h6"
                component="div"
                letterSpacing={1}
                sx={{ color: "#263238", fontSize: "22px", fontWeight: "500" }}
                >
                Maintenance Request Details
                </Typography>
                <IconButton
                onClick={handleClose}
                sx={{
                    "&:hover": { backgroundColor: "#263238" },
                    height: "35px",
                    width: "35px",
                }}
                >
                <CloseIcon
                    sx={{
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": { transform: "rotate(90deg)", color: "#fefefe" },
                    }}
                />
                </IconButton>
            </Box>
            <Chip
              label={viewAccepted?.status?.toUpperCase()}
              sx={{
                backgroundColor: viewAccepted?.status === "Pending" 
                  ? "#f39c12"  // Yellow for Pending
                  : viewAccepted?.status === "Accepted" 
                  ? "#4caf50"  // Green for Accepted
                  : viewAccepted?.status === 'Rejected' 
                  ? '#e53935'
                  :"#ffb300" , // Red for Cancelled (default)
                color: 'white'
                
              }}
              size="small"
            />
            </div>
        </DialogTitle>

        <DialogContent dividers={scroll === "paper"}>
            {loading ? (
            <Box className="space-y-4">
                <Skeleton animation="wave" height={60} />
                <Skeleton animation="wave" height={40} />
                <Skeleton animation="wave" height={100} />
                <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Skeleton animation="wave" height={200} />
                </Grid>
                <Grid item xs={6}>
                    <Skeleton animation="wave" height={200} />
                </Grid>
                </Grid>
            </Box>
            ) : (
            <Box className="space-y-6">
                {/* Tenant Information */}
                <Box
                    sx={{
                        backgroundColor: '#eceff1',
                        padding: '1rem',
                        borderRadius: '8px',
                    }}
                >
                    <Typography
                        variant="body2"
                        color="#424242"
                        sx={{ fontWeight: 550, fontSize: '0.9rem', marginBottom: '0.5rem' }}
                        gutterBottom
                    >
                        MAINTENANCE DETAILS:
                    </Typography>
                    <Box display="flex" alignItems="center" marginBottom="1rem">
                        <CalendarMonthIcon sx={{ marginRight: '0.5rem', fontSize: '1rem' }} />
                        <Typography
                            variant="body1"
                            fontSize={{ xs: '0.9rem', lg: '0.99rem' }}
                            sx={{ fontWeight: '500' }}
                        >
                            {formatDate(viewAccepted?.date_reported)}
                        </Typography>
                    </Box>

                    {/* Maintenance Details */}
                    <Box>
                        <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography
                            variant="body1"
                            color="#424242"
                            gutterBottom
                            sx={{ fontSize: '0.99rem', marginTop: '1rem' }}
                            >
                           <span style={{fontWeight:'bold'}}> Reported Issue:{' '}</span>
                            {viewAccepted?.other_issue || viewAccepted?.reported_issue || ''}
                            </Typography>
                        </Grid>
                        </Grid>
                    </Box>
                    </Box>

                    {/* Description */}
                    <Box sx={{ marginTop: '2rem' }}>
                    <Typography
                        variant="subtitle1"
                        color="#424242"
                        sx={{ fontWeight: 550, fontSize: '0.9rem', marginBottom: '0.5rem' }}
                        gutterBottom
                    >
                        DESCRIPTION:
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                        backgroundColor: '#eceff1',
                        padding: '1rem',
                        borderRadius: '8px',
                        color: '#424242',
                        }}
                    >
                        {viewAccepted?.issue_description}
                    </Typography>
                      
                    {viewAccepted?.remarks && (
                      <Box>
                        <Typography
                        variant="subtitle1"
                        color="#424242"
                        sx={{ fontWeight: 550, fontSize: '0.9rem', marginBottom: '0.5rem', mt:3, color:'red'}}
                        gutterBottom
                        >
                            Remarks:
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                            backgroundColor: '#ffebee',
                            padding: '1rem',
                            borderRadius: '8px',
                            color: '#424242',
                            }}
                        >
                            {viewAccepted?.remarks}
                        </Typography>
                      </Box>
                    )}

                    

                    </Box>

                {/* Images */}
                {viewAccepted?.maintenance_images &&
                viewAccepted.maintenance_images.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="subtitle2"
                        color="#424242"
                        sx={{ mt: 5, fontWeight: "550", fontSize: "0.9rem" }}
                        gutterBottom
                    >
                        ATTACHED IMAGES
                    </Typography>
                    <Grid container spacing={2}>
                        {viewAccepted.maintenance_images.map((image, index) => (
                        <Grid item xs={12} sm={6} key={image.id}>
                            <Card className="relative">
                            <CardMedia
                                component="img"
                                height="300"
                                image={`${imageBaseUrl}${image.image_path}`}
                                alt={`Maintenance Image ${index + 1}`}
                                className="object-cover h-48 w-full"
                            />
                            </Card>
                        </Grid>
                        ))}
                    </Grid>
                    </Box>
                )}
            </Box>
            )}
        </DialogContent>

        <DialogActions className="bg-gray-50">
            <Button
            color="primary"
            variant="contained"
            onClick={() => handleClose()}
            >
            Close
            </Button>
        </DialogActions>
        </Dialog>
    );
};

export default MaintenanceRequestDialog;
