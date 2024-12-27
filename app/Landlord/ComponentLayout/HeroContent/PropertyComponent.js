"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Link,
  Breadcrumbs,
  CardContent,
  Skeleton,
  Card,
  CardActions,
  CardMedia,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Modal as BaseModal } from "@mui/base/Modal";
import PropTypes from "prop-types";
import { styled, css } from "@mui/system";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Image from "next/image";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import AddApartmentModal from "../ModalComponent/AddEstateModal";
import { SnackbarProvider } from "notistack";
import useSWR from "swr";

const fetcherProperty = async ([url, token]) => {
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
const fetcherOccupiedDetails = async ([url, token]) => {
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

export default function PropertyComponent({ loading, setLoading }) {
    const router = useRouter();
    const [property, setProperty] = useState([]);
    const [editproperty, setEditProperty] = useState(null); //props id for editing
    const [status, setStatus] = useState([]);
    const [open, setOpen] = useState(false);
    // const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    console.log(editproperty);
    console.log(property);
    console.log(status);

    const getUserToken = () => {
        const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
        const userData = JSON.parse(userDataString); // parse the datastring into json
        const accessToken = userData.accessToken;
        return accessToken;
    };
    const token = getUserToken();

    const {
        data: responseProperty,
        error: errorProperty,
        isLoading: isLoadingProperty,
    } = useSWR(
        (token && ["http://127.0.0.1:8000/api/property_list", token]) || null,
        fetcherProperty,
        {
        refreshInterval: 3000,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        errorRetryCount: 3,
        }
    );
    useEffect(() => {
        if (responseProperty) {
        setProperty(responseProperty);
        setLoading(false);
        } else if (isLoadingProperty) {
        setLoading(true);
        }
    }, [responseProperty, isLoadingProperty, setLoading]);

    const {
        data: responseStatus,
        error: errorStatus,
        isLoading: isLoadingStatus,
    } = useSWR(
        (token && [`http://127.0.0.1:8000/api/all`, token]) || null,
        fetcherOccupiedDetails,
        {
        refreshInterval: 3000,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        errorRetryCount: 3,
        }
    );
    console.log(errorStatus);
    console.log(responseStatus);
    console;
    useEffect(() => {
        if (responseStatus) {
        setStatus(responseStatus?.data || "");
        setLoading(false);
        } else if (isLoadingStatus) {
        setLoading(true);
        }
    }, [responseStatus, isLoadingStatus, setLoading]);

    const getPropertyStatus = (propertyId) => {
        const propertyStatus = status.find((s) => s.id === propertyId);
        return propertyStatus
        ? {
            occupied: propertyStatus.occupied,
            available: propertyStatus.available,
            }
        : { occupied: 0, available: 0 };
    };

    const handleEdit = (id) => {
        console.log("Edit Property:", id);
        setEditProperty(id);
        setOpen(true);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = (id) => {
        setLoading(true);
        try {
        router.push(`/Landlord/Property/${id}`);
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 1400, margin: "auto" }}>
        <Typography
            variant="h5"
            letterSpacing={3}
            sx={{ marginLeft: "5px", fontSize: "24px", fontWeight: "bold", mt: 5 }}
        >
            List of Property
        </Typography>
        <Grid item xs={12} sx={{ marginLeft: "5px", mt: 2 }}>
            <Breadcrumbs
            separator={<NavigateNextIcon sx={{ fontSize: "22px", ml:-0.6, mr:-0.6}} />}
            aria-label="breadcrumb"
            sx={{ fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
            >
            <Link
                letterSpacing={2}
                underline="hover"
                color="inherit"
                href="/Landlord/Home"
            >
                <HomeOutlinedIcon sx={{color:'#673ab7', mt:0.5}}/>
            </Link>
            <Typography
                letterSpacing={2}
                // color="text.primary"
                sx={{color:'#263238', fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
            >
                Property
            </Typography>
            </Breadcrumbs>
        </Grid>
        {/* <hr style={{ width: '100%', backgroundColor: '#ecebee', height: '1px', marginTop: '10px',}} /> */}

        <Grid
            container
            sx={{ justifyContent: { xs: "start", lg: "space-between" }, mt: 4 }}
        >
            <Grid item></Grid>
            <Grid item>
            <SnackbarProvider maxSnack={3}>
                <AddApartmentModal
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
                setLoading={setLoading}
                loading={loading}
                editproperty={editproperty}
                setEditProperty={setEditProperty}
                // refreshData={fetchedData}
                />
            </SnackbarProvider>
            </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: -1 }}>
            {loading ? (
            // Display 6 skeleton loaders
            <Grid container spacing={2}>
                {Array.from(new Array(8)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card sx={{ maxWidth: 345 }}>
                    <Skeleton
                        animation="wave"
                        variant="rectangular"
                        height={140}
                    />
                    <CardContent>
                        <Skeleton animation="wave" width="80%" />
                        <Skeleton animation="wave" width="60%" />
                        <Skeleton animation="wave" width="40%" />
                    </CardContent>
                    <CardActions>
                        <Skeleton animation="wave" width={100} height={30} />
                        <Skeleton animation="wave" width={100} height={30} />
                    </CardActions>
                    </Card>
                </Grid>
                ))}
            </Grid>
            ) : (
            property.map((item, index) => {
                const { occupied, available } = getPropertyStatus(item.id);
                return (
                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                    <Paper
                    elevation={3}
                    style={{
                        maxWidth: { xs: 320, sm: 520, md: 890, lg: 890 },
                        height: 434,
                        padding: "25px",
                        marginTop: "15px",
                        borderRadius: "10px",
                    }}
                    >
                    <CardMedia
                        sx={{ height: 150 }}
                        image={`http://127.0.0.1:8000/ApartmentImage/${item.image}`} // Use the URL of the first image
                        title={item.propertyname[0].caption || "Image"}

                        // style={{ width: '100%', height: 'auto', objectFit: 'contain',  }}
                    />

                    <Box
                        sx={(theme) => ({
                        mt: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexShrink: 0,
                        borderRadius: "10px",
                        padding: {
                            xs: "10px",
                            sm: "21px",
                            md: "15px",
                            lg: "10px",
                        },

                        bgcolor:
                            theme.palette.mode === "light"
                            ? "rgba(255, 255, 255, 0.4)"
                            : "rgba(0, 0, 0, 0.4)",
                        backdropFilter: "blur(30px)",
                        maxHeight: { xs: 42, sm: 30, md: 35, lg: 37 },
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow:
                            theme.palette.mode === "light"
                            ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                            : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
                        })}
                    >
                        <Grid
                        container
                        justifyContent={"space-between"}
                        alignItems="center"
                        >
                        <Grid item>
                            <Typography
                            variant="body1"
                            color={"primary"}
                            sx={{
                                fontSize: { xs: 12, sm: 13, md: 12, lg: 13 },
                                mt: {
                                xs: "0.1rem",
                                sm: "0.1rem",
                                md: "0rem",
                                lg: "0.1rem",
                                },
                                ml: {
                                xs: "-0.1rem",
                                sm: "-0.5rem",
                                md: "-0.6rem",
                                lg: "0rem",
                                },
                            }}
                            letterSpacing={1}
                            >
                            Available Units: {available}
                            </Typography>
                        </Grid>
                        <Divider
                            orientation="vertical"
                            color="black"
                            variant="middle"
                            flexItem
                        />
                        <Grid item>
                            <Typography
                            variant="body1"
                            color={"#f78028"}
                            sx={{
                                fontSize: { xs: 12, sm: 13, md: 12, lg: 13 },
                                mt: {
                                xs: "0.5rem",
                                sm: "0.6rem",
                                md: "0.6rem",
                                lg: "0.6rem",
                                },
                                ml: {
                                xs: "0rem",
                                sm: "0rem",
                                md: "0rem",
                                lg: "0rem",
                                },
                                mb: { xs: "0.5rem" },
                                mr: {
                                xs: "-0.2rem",
                                sm: "-0.4rem",
                                md: "-0.5rem",
                                lg: "0rem",
                                },
                            }}
                            letterSpacing={1}
                            gutterBottom
                            >
                            Occupied Units: {occupied}
                            </Typography>
                        </Grid>
                        </Grid>
                    </Box>
                    <Box height={95} sx={{ mt: 2 }}>
                        <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{
                            fontSize: {
                            xs: "22px",
                            sm: "24px",
                            md: "22px",
                            lg: "24px",
                            },
                            fontWeight: 540,
                        }}
                        letterSpacing={2}
                        >
                        {item.propertyname}
                        </Typography>
                        <Typography
                        variant="body1"
                        color={"#424242"}
                        sx={{
                            fontSize: {
                            xs: "13px",
                            sm: "14px",
                            md: "13px",
                            lg: "14px",
                            },
                        }}
                        letterSpacing={1}
                        gutterBottom
                        >
                        {/* Magsaysay st. Brgy Cogon, Sorsogon City */}
                        Brgy {item.barangay}, {item.municipality}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                        display: "flex",
                        justifyContent: { xs: "flex-start", lg: "space-between" },
                        alignItems: { xs: "flex-start", lg: "center" },
                        gap: 1,
                        }}
                    >
                        <Box>
                        <Button
                            onClick={() => handleClick(item.id, item.propertyname)}
                            variant="contained"
                            sx={{
                            background: "#8785d0",
                            "&:hover": { background: "#b6bdf1" },
                            mt: "1.9rem",
                            fontSize: {
                                xs: "16px",
                                sm: "16px",
                                md: "15px",
                                lg: "16px",
                            },
                            borderRadius: "8px",
                            }}
                        >
                            <Box
                            component="span"
                            sx={{ display: { xs: "inline", lg: "none" } }}
                            >
                            View Property Type
                            </Box>
                            <Box
                            component="span"
                            sx={{ display: { xs: "none", lg: "inline" } }} // Hide text on mobile
                            >
                            <VisibilityOutlinedIcon
                                sx={{
                                mr: { xs: "0", lg: "0.3rem" },
                                mb: "-0.4rem",
                                }}
                            />
                            View Rental Units
                            </Box>
                        </Button>
                        </Box>
                        <Box>
                        <Button
                            variant="outlined"
                            onClick={() => handleEdit(item.id)}
                            sx={{
                            borderColor: "#263238", // Set the border color to black
                            color: "black", // Set the text color to black
                            "&:hover": {
                                background: "#eceff1", // Keep the hover background color
                                borderColor: "#263238", // Change border color on hover if needed
                                color: "black", // Change text color on hover
                            },
                            mt: "1.9rem",
                            fontSize: {
                                xs: "12px",
                                sm: "16px",
                                md: "15px",
                                lg: "16px",
                            },
                            borderRadius: "8px",
                            }}
                        >
                            <Box
                            component="span"
                            sx={{
                                display: { xs: "inline", lg: "none" },
                                height: 28,
                            }}
                            >
                            <DriveFileRenameOutlineOutlinedIcon
                                sx={{ mr: { xs: 0, lg: "0.2rem" } }}
                            />
                            </Box>
                            <Box
                            component="span"
                            sx={{ display: { xs: "none", lg: "inline" } }} // Hide text on mobile
                            >
                            Edit
                            </Box>
                        </Button>
                        </Box>
                    </Box>
                    </Paper>
                </Grid>
                );
            })
            )}
        </Grid>
        </Box>
    );
}
