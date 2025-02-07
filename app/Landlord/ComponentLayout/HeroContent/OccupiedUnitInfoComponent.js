"use client";
import React, { useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  Breadcrumbs,
  Paper,
  Card,
  CardContent,
  Avatar,
  Divider,
  Button,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Backdrop,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import { Email, Phone } from "@mui/icons-material";
import {
  WarningAmber as WarningAmberIcon,
  Close as CloseIcon,
  DeleteForever as DeleteForeverIcon,
  NavigateNext as NavigateNextIcon,
  Home as HomeOutlinedIcon
} from "@mui/icons-material";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";
import { format, parseISO } from "date-fns";

// import PaymentHistoryTable from '../TableComponent/PaymentHistoryTable';
const PaymentHistory = dynamic(
  () => import("../TableComponent/paymenthistorytable"),
  {
    ssr: false,
  }
);
const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable


export default function OccupiedTenantInformation({
  apartmentId,
  propsId,
  loading,
  setLoading,
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tenantInformation, setTenantInformation] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [selectedDeleteTenant, setSelectedDeleteTenant] = useState({
    id: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [totalBalanced, setTotalBalanced] = useState([]);
  const TenantId = tenantInformation?.tenant?.id;

  console.log("Tenant:", tenantInformation);
  console.log(paymentInfo);
  console.log(TenantId);
  console.log(totalBalanced);

  useEffect(() => {
    const fetchedData = async () => {
      setLoading(true);
      const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json
      const accessToken = userData.accessToken;

      if (accessToken) {
        try {
          const response = await fetch(
            `${API_URL}/show_tenant_info/${apartmentId}/Apartment`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const data = await response.json();
          console.log(data);

          if (response.ok) {
            console.log(data);
            setTenantInformation(data.data);
            setLoading(false);
          } else {
            console.log("Error:", response.status);
            setLoading(false);
          }
        } catch (error) {
          console.log("Error:", error);
          setLoading(false);
        } finally {
          console.log("error");
          setLoading(false);
        }
      }
    };

    fetchedData();
  }, [apartmentId, setLoading]);

  useEffect(() => {
    const fethcedPaymentData = async () => {
      setLoading(true);
      const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json
      const accessToken = userData.accessToken;

      if (accessToken) {
        try {
          const response = await fetch(
            `${API_URL}/tenant_payment/${TenantId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            console.log("Data:", data.data);
            setPaymentInfo(data.data);
          } else {
            console.log("Error:", response.status);
          }
        } catch (error) {
          console.log("Error:", error);
        }
      } else {
        console.log("Error: Access token is not available");
      }
    };

    fethcedPaymentData();
  }, [TenantId, setLoading]);

  useEffect(() => {
    const fetchDeliquentData = async () => {
      const userDataString = localStorage.getItem("userDetails");
      const userData = JSON.parse(userDataString);
      const accessToken = userData.accessToken;

      if (accessToken) {
        try {
          const response = await fetch(
            `${API_URL}/get_delequent/${TenantId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            // Only add to the array if there's delinquent data
            if (data.data && data.data.length > 0) {
              setTotalBalanced(data.data);
            }
          } else {
            console.log("Error fetching data for tenant ID:", payor.tenant.id);
            console.log(data.error);
          }
        } catch (error) {
          console.error(
            "Error fetching delinquent data for tenant:",
            payor.tenant.id,
            error
          );
        }
      } else {
        console.log("Access token not found!");
      }
    };

    fetchDeliquentData();
  }, [TenantId]);

  //this code is to get the lastpayment Date of tenant
  const lastPayment = paymentInfo[paymentInfo.length - 1] || 0;
  console.log(lastPayment);

  //this code is to filter the overdue to get the balanced;
  const filteredOverdue = totalBalanced.filter(
    (item) => item.status === "Overdue"
  );
  const balanced = filteredOverdue.reduce(
    (total, item) => total + parseFloat(item.amount_overdue),
    0
  );
  console.log(filteredOverdue);
  console.log(balanced);

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

  // for Dialog alert for delete
  console.log("id", selectedDeleteTenant);
  const handleClickOpen = (id) => {
    setSelectedDeleteTenant({ id });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    const { id } = selectedDeleteTenant;
    console.log(id);

    const userDataString = localStorage.getItem("userDetails");
    const userData = JSON.parse(userDataString);
    const accessToken = userData.accessToken;

    if (accessToken) {
      try {
        const response = await fetch(
          `${API_URL}/remove_tenant_occupancy/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Payments Processed",
            text: "All selected tenant payments have been recorded successfully.",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              // Redirect to the previous page
              window.history.back(); // Go back to the previous page in browser history
            }
          });
          handleClose();
        } else {
          console.log("Error:", response.status);
          if (data.error) {
            console.log(data.error);
            setError(data.error);
            handleClose();
          } else {
            localStorage.setItem(
              "errorMessage",
              data.message || "Operation Error!"
            );
            window.location.reload();
            handleClose();
          }
        }
      } catch (error) {
        console.log("Error:", error);
      }
    } else {
      localStorage.setItem(
        "errorMessage",
        "Please login to perform this action!"
      );
    }
  };

  return (
    <>
      <Box sx={{ maxWidth: 1400, margin: "auto" }}>
        <Typography
          variant="h5"
          letterSpacing={3}
          sx={{
            marginLeft: "5px",
            fontSize: "24px",
            fontWeight: "bold",
            mt: 5,
          }}
        >
          Tenant Information
        </Typography>
        <Grid item xs={12} sx={{ marginLeft: "5px", mt: 2 }}>
          <Breadcrumbs
            separator={
              <NavigateNextIcon sx={{ fontSize: "22px", ml: -0.6, mr: -0.6 }} />
            }
            aria-label="breadcrumb"
            sx={{ fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
          >
            {/* <Typography color="inherit">Navigation</Typography> */}
            <Link
              letterSpacing={2}
              underline="hover"
              color="inherit"
              href="/Landlord/Home"
            >
              <HomeOutlinedIcon sx={{color:'#673ab7', mt:0.5}}/>
            </Link>
            <Link
              letterSpacing={2}
              underline="hover"
              color="inherit"
              href="/Landlord/Property"
            >
              Property
            </Link>
            <Link
              letterSpacing={2}
              underline="hover"
              color="inherit"
              href={`/Landlord/Property/${propsId}`}
            >
              List of Units
            </Link>
            <Typography
              letterSpacing={2}
              color="text.primary"
              sx={{ fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
            >
              Tenant Information
            </Typography>
          </Breadcrumbs>
        </Grid>
        <Box sx={{ mt: "4rem" }}></Box>

        <Grid container spacing={1}>
          <Grid item xs={12} md={5} lg={5}>
          <Paper
            elevation={3}
            sx={{
              width: { xs: 300, lg: "auto" },
              height: { xs: "65vh", sm: "43vh", md: "43vh", lg: "50vh" },
              padding: "30px",
              marginTop: "15px",
              borderRadius: "12px",
              // background: 'linear-gradient(145deg, #ffffff 0%, #f0f4f8 100%)',
              // boxShadow: '0 16px 32px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.05)',
              position: 'relative',
              overflow: 'hidden',
              // transition: 'transform 0.3s ease-in-out',
              // '&:hover': {
              //   transform: 'scale(1.02)'
              // }
            }}
          >
            {loading ? (
              <>
                <Box>
                  <Skeleton 
                    variant="rectangular" 
                    height={140} 
                    animation="wave"
                    sx={{ 
                      borderRadius: '12px', 
                      bgcolor: 'grey.300', 
                    }} 
                  />
                  <Skeleton width="100%" animation="wave" sx={{  bgcolor: 'grey.300', mt: 2 }} />
                  <Skeleton width="90%" animation="wave" sx={{  bgcolor: 'grey.300', mt: 1 }} />
                  <Skeleton width="40%" animation="wave" sx={{  bgcolor: 'grey.300', mt: 1 }} />
                  <Box sx={{ display: 'flex', gap: 2, mt: 5, justifyContent: 'center' }}>
                    <Skeleton width={'50%'} height={60} animation="wave" sx={{ borderRadius: '8px' }} />
                  </Box>
                </Box>
              </>
            ) : (
              <>
                {/* Decorative Background Element */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: 150,
                    height: 150,
                    background: 'linear-gradient(135deg, rgba(90,74,205,0.1) 0%, rgba(90,74,205,0.2) 100%)',
                    borderRadius: '50%',
                    transform: 'rotate(45deg)',
                    zIndex: 0
                  }}
                />

                <Grid 
                  container 
                  justifyContent="center" 
                  sx={{ 
                    mb: 2, 
                    mt: 1, 
                    position: 'relative', 
                    zIndex: 1 
                  }}
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      backgroundColor: "#3f51b5",
                      // backgroundColor: 'linear-gradient(145deg, #6a5acd 0%, #5a4acd 100%)',
                      fontSize: "3.5rem",
                      boxShadow: '0 10px 20px rgba(90,74,205,0.3)',
                      border: '4px solid white'
                    }}
                    aria-label="tenant-avatar"
                  >
                    {tenantInformation?.tenant?.firstname?.charAt(0)}
                    {tenantInformation?.tenant?.lastname?.charAt(0)}
                  </Avatar>
                </Grid>

                <Typography 
                  variant="h5" 
                  align="center" 
                  gutterBottom 
                  sx={{
                    fontWeight: 700,
                    color: '#2c3e50',
                    letterSpacing: 1,
                    mb: 2
                  }}
                >
                  {tenantInformation?.tenant?.firstname}{" "}
                  {tenantInformation?.tenant?.middlename || ''}{" "}
                  {tenantInformation?.tenant?.lastname}
                </Typography>

                <Grid 
                  container 
                  alignItems="center" 
                  justifyContent="center" 
                  sx={{ mb: 1 }}
                >
                  <Grid item>
                    <Email 
                      fontSize="small" 
                      sx={{ 
                        color: '#7f8c8d', 
                        mr: 1 
                      }} 
                    />
                  </Grid>
                  <Grid item>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#34495e',
                        fontWeight: 500
                      }}
                    >
                      {tenantInformation?.tenant?.email}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid 
                  container 
                  alignItems="center" 
                  justifyContent="center" 
                  sx={{ mb: 2 }}
                >
                  <Grid item>
                    <Phone 
                      fontSize="small" 
                      sx={{ 
                        color: '#7f8c8d', 
                        mr: 1 
                      }} 
                    />
                  </Grid>
                  <Grid item>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#34495e',
                        fontWeight: 500
                      }}
                    >
                      {tenantInformation?.tenant?.contact}
                    </Typography>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    mb: 2
                  }}
                >
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleClickOpen(tenantInformation?.tenant?.id)}
                    sx={{
                      borderRadius: '12px',
                      px: 3,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}
                  >
                    Remove Tenant
                  </Button>
                </Box>

                <Divider 
                  sx={{ 
                    my: 2,
                    backgroundColor: 'rgba(0,0,0,0.12)' 
                  }} 
                />

                <Typography
                  variant="body1"
                  align="center"
                  sx={{
                    mt: "1rem",
                    color: '#2c3e50',
                    fontWeight: 600,
                    letterSpacing: 0.5
                  }}
                >
                  <strong>Lease Start Date:</strong>{" "}
                  {formatDate(tenantInformation?.lease_start_date)}
                </Typography>
              </>
            )}
          </Paper>
          </Grid>
          <Grid item xs={12} md={5} lg={7}>
          <Paper
              elevation={3}
              sx={{
                height: { xs: "65vh", sm: "43vh", md: "43vh", lg: "50vh" },
                padding: "25px",
                marginTop: "15px",
                borderRadius: "12px",
                overflow:'hidden',
                position: 'relative',
                // background: 'linear-gradient(145deg, #f0f0f0 0%, #ffffff 100%)',
                // boxShadow: '0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.05)',
                // transition: 'transform 0.3s ease-in-out',
                // '&:hover': {
                //   transform: 'scale(1.02)',
                // }
              }}
            >
              {loading ? (
                <Box>
                  <Skeleton 
                    variant="rounded" 
                    width="100%" 
                    height={80} 
                    animation="wave"
                    sx={{ 
                      bgcolor: 'grey.300', 
                      borderRadius: '12px', 
                      marginBottom: 2 
                    }} 
                  />
                  <Skeleton 
                    variant="rounded" 
                    width="100%" 
                    height={80} 
                    animation="wave"
                    sx={{ 
                      bgcolor: 'grey.300', 
                      borderRadius: '12px', 
                      marginBottom: 2 
                    }} 
                  />
                  <Skeleton 
                    variant="rounded" 
                    width="100%" 
                    height={80} 
                    animation="wave"
                    sx={{ 
                      bgcolor: 'grey.300', 
                      borderRadius: '12px', 
                      marginBottom: 2 
                    }} 
                  />
                  <Skeleton 
                    variant="rounded" 
                    width="100%" 
                    height={80} 
                    animation="wave"
                    sx={{ 
                      bgcolor: 'grey.300', 
                      borderRadius: '12px' 
                    }} 
                  />
                </Box>
                
              ) : (
                <>
                  {/* Rental Fee Section */}
                  <Box
                  sx={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: 150,
                    height: 150,
                    background: 'linear-gradient(135deg, rgba(90,74,205,0.1) 0%, rgba(90,74,205,0.2) 100%)',
                    borderRadius: '50%',
                    transform: 'rotate(45deg)',
                    zIndex: 0
                  }}
                  />
                  <Grid container justifyContent="start" sx={{ mb: 2 }}>
                    <Box>
                      <Typography
                        variant="h5"
                        color="#333"
                        sx={{
                          fontSize: {
                            xs: "18px",
                            sm: "18px",
                            md: "20px",
                            lg: "20px",
                          },
                          fontWeight: 600,
                          marginTop: "0.1rem",
                          letterSpacing: 1,
                          borderBottom: '2px solid #4a4a4a',
                          paddingBottom: '8px'
                        }}
                      >
                        Rental Fee
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid container justifyContent="start" sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                      <Box
                        bgcolor="rgba(238, 238, 238, 0.6)"
                        borderRadius="12px"
                        p={2}
                        sx={{
                          backdropFilter: 'blur(5px)',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                      >
                        <Grid container justifyContent="space-between" alignItems="center">
                          <Grid item>
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{
                                fontSize: {
                                  xs: "16px",
                                  sm: "19px",
                                  md: "16px",
                                  lg: "19px",
                                },
                                fontWeight: 500,
                              }}
                            >
                              Total Amount
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography
                              variant="body1"
                              color="primary.dark"
                              sx={{
                                fontSize: {
                                  xs: "16px",
                                  sm: "19px",
                                  md: "16px",
                                  lg: "19px",
                                },
                                fontWeight: 700,
                              }}
                            >
                              {tenantInformation.rental_fee}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Payment Section */}
                  <Grid container justifyContent="start" sx={{ mb: 2 }}>
                    <Box>
                      <Typography
                        variant="h5"
                        color="#333"
                        sx={{
                        fontSize: {
                            xs: "18px",
                            sm: "18px",
                            md: "20px",
                            lg: "20px",
                          },
                          fontWeight: 600,
                          marginTop: "0.2rem",
                          letterSpacing: 1,
                          borderBottom: '2px solid #4a4a4a',
                          paddingBottom: '8px'
                        }}
                      >
                        Payment
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid container justifyContent="start" sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                      <Box
                        bgcolor="rgba(46, 125, 50, 0.1)"
                        borderRadius="12px"
                        p={2}
                        sx={{
                          backdropFilter: 'blur(5px)',
                          border: '1px solid rgba(46, 125, 50, 0.2)'
                        }}
                      >
                        <Grid container justifyContent="space-between" alignItems="center">
                          <Grid item>
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{
                                fontSize: {
                                  xs: "16px",
                                  sm: "19px",
                                  md: "16px",
                                  lg: "19px",
                                },
                                fontWeight: 500,
                              }}
                            >
                              Total Amount
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography
                              variant="body1"
                              color="#2e7d32"
                              sx={{
                                fontSize: {
                                  xs: "16px",
                                  sm: "19px",
                                  md: "16px",
                                  lg: "19px",
                                },
                                fontWeight: 700,
                              }}
                            >
                              {lastPayment.amount || ''}
                            </Typography>
                          </Grid>
                        </Grid>
                        
                      </Box>
                      <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 1,
                            mr:1
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                              fontStyle: 'italic'
                            }}
                          >
                            {formatDate(lastPayment.date)}
                          </Typography>
                        </Box>
                    </Grid>
                  </Grid>

                  {/* Balance Section */}
                  <Grid container justifyContent="start" sx={{ mb: 2 }}>
                    <Box>
                      <Typography
                        variant="h5"
                        color="#333"
                        sx={{
                        fontSize: {
                            xs: "18px",
                            sm: "18px",
                            md: "20px",
                            lg: "20px",
                          },
                          fontWeight: 600,
                          marginTop: "-0.9rem",
                          letterSpacing: 1,
                          borderBottom: '2px solid #4a4a4a',
                          paddingBottom: '8px'
                        }}
                      >
                        Balance
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid container justifyContent="start" sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                      <Box
                        bgcolor="rgba(198, 40, 40, 0.1)"
                        borderRadius="12px"
                        p={2}
                        sx={{
                          backdropFilter: 'blur(5px)',
                          border: '1px solid rgba(198, 40, 40, 0.2)'
                        }}
                      >
                        <Grid container justifyContent="space-between" alignItems="center">
                          <Grid item>
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{
                                fontSize: {
                                  xs: "16px",
                                  sm: "19px",
                                  md: "16px",
                                  lg: "19px",
                                },
                                fontWeight: 500,
                              }}
                            >
                              Total Amount
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography
                              variant="body1"
                              color="#c62828"
                              sx={{
                                fontSize: {
                                  xs: "16px",
                                  sm: "19px",
                                  md: "16px",
                                  lg: "19px",
                                },
                                fontWeight: 700,
                              }}
                            >
                              {Number(balanced)?.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <Paper
              elevation={2}
              style={{
                height: { xs: "20vh", lg: "20vh" },
                marginTop: "15px",
                borderRadius: "8px",
                padding: "1rem 0rem 0rem 0rem",
              }}
            >
              <Grid>
                <PaymentHistory
                  TenantId={TenantId}
                  setLoading={setLoading}
                  loading={loading}
                />
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <React.Fragment>
          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                pb: 0,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <WarningAmberIcon color="error" />
                <Typography variant="h6" fontWeight="bold">
                  Confirm Deletion
                </Typography>
              </Box>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <DialogContent>
              <DialogContentText>
                Are you sure you want to remove this tenant?
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  This action cannot be undone and will permanently delete the
                  tenant&apos;s information.
                </Typography>
              </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button onClick={handleClose} color="inherit" variant="text">
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                color="error"
                variant="contained"
                startIcon={<DeleteForeverIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Delete Tenant
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </Box>
    </>
  );
}
