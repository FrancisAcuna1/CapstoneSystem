"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Grid,
  Fab,
  Paper,
  Tooltip,
  Button,
  CardMedia,
  Skeleton,
  SwipeableDrawer,
} from "@mui/material";
import { styled } from "@mui/system";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BedroomChildOutlinedIcon from "@mui/icons-material/BedroomChildOutlined";
import BHTenantRegistrationForm from "../FormsComponent/BHTenantRegistrationForm";
import SuccessSnackbar from "../Labraries/snackbar";
import ErrorSnackbar from "../Labraries/ErrorSnackbar";
import { SnackbarProvider } from "notistack";
import Slider from "react-slick"; // Import the slider
import styles from "../../../gallery.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import RoomsTable from "../TableComponent/RoomsTable";
import useSWR from "swr";


const AcceptToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#4caf50", // Background color of the tooltip
    color: "#ffffff", // Text color
    borderRadius: "4px",
  },
});

const fetcherBhDetails = async ([url, token]) => {
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


export default function BoardingHouseDetailsComponent({
  boardinghouseId,
  propsId,
  loading,
  setLoading,
}) {
  const boardinghouseID = boardinghouseId; // boardinghouse ID
  const propsID = propsId; // property ID
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [successful, setSuccessful] = useState(null);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState([]);

  console.log("baordinghouse ID:", boardinghouseID);
  console.log("property ID:", propsID);
  console.log("Details:", details);


  const getUserToken = () => {
    const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json
    const accessToken = userData.accessToken;
    return accessToken;
  };
  const token = getUserToken();

  const {data: responseTenantInfo, error: errorTenantInfo, isLoading: isLoadingTenantInfo,} = useSWR( 
    token && boardinghouseID && propsID 
    ? [`${API_URL}/property/${propsID}/bhdetails/${boardinghouseID}`,token,]
    : null,

    fetcherBhDetails,{
      refreshInterval: 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
    }
  );
  console.log(errorTenantInfo);
  useEffect(() => {
    if (responseTenantInfo) {
      setDetails(responseTenantInfo);
      setLoading(false);
    } else if (isLoadingTenantInfo) {
      setLoading(true);
    }
  }, [responseTenantInfo, isLoadingTenantInfo, setLoading]);


  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  // Function to close the drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const images =
    (details?.boardinghouse?.images && details?.boardinghouse?.images) || [];
  console.log("images:", images);

  const CustomNextArrow = ({ className, onClick }) => (
    <div
      className={`${className} custom-arrow next-arrow`}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 0,
        width: "35px",
        height: "35px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "50%",
        cursor: "pointer",
      }}
    >
      <ArrowForwardIosIcon fontSize="small" style={{ color: "#fff" }} />
    </div>
  );

  const CustomPrevArrow = ({ className, onClick }) => (
    <div
      className={`${className} custom-arrow next-arrow`}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        width: "35px",
        height: "35px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "50%",
        cursor: "pointer",
      }}
    >
      <ArrowBackIosIcon
        fontSize="small"
        style={{ color: "#fff", marginLeft: "8px" }}
      />
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    dotsClass: "slick-dots custom-dots",
  };

  return (
    <Box sx={{ maxWidth: 1400, margin: "auto" }}>
      {/* <SnackbarProvider maxSnack={3}>
        <SuccessSnackbar
          setSuccessful={setSuccessful}
          successful={successful}
        />
        <ErrorSnackbar error={error} setError={setError} />
      </SnackbarProvider> */}
      {loading ? (
        <>
          <Box>
            <Skeleton width="40%" />
          </Box>
        </>
      ) : (
        <>
          {details.boardinghouse &&
          details.boardinghouse.boarding_house_name ? (
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
              Details - {details.boardinghouse.boarding_house_name}
            </Typography>
          ) : null}
        </>
      )}

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
            href={`/Landlord/Property/${propsID}`}
          >
            List Property
          </Link>
          <Typography
            letterSpacing={2}
            color="text.primary"
            sx={{ fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
          >
            Details
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Box sx={{ mt: "4rem" }}></Box>
      <Grid container spacing={3} sx={{ mt: "-0.9rem", display: "flex" }}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Grid item>
            <Paper
              elevation={2}
              sx={{ borderRadius: "8px", padding: "24px", marginTop: "15px" }}
            >
              {loading ? (
                <Box>
                  <Skeleton variant="rectangular" height={140} />
                  <Skeleton width="100%" />
                  <Skeleton width="90%" />
                  <Skeleton width="40%" />
                  <Skeleton width={100} height={30} />
                  <Skeleton width={100} height={30} />
                </Box>
              ) : (
                <>
                  <Box
                    className={styles.gallerySlider}
                    sx={{
                      position: "relative",
                      maxWidth: { xs: 285, lg: 1400 },
                      mb: 4,
                      gap: 2,
                      "& .slick-slider, & .slick-list, & .slick-track": {
                        height: "100%",
                        overflow: "hidden",
                      },
                      "& .slick-slide": {
                        "& > div": {
                          height: "100%",
                        },
                      },
                    }}
                  >
                    <Slider {...sliderSettings}>
                      {images.map((image, index) => (
                        <div key={image.id}>
                          <Box
                            sx={{
                              height: {
                                xs: "300px",
                                sm: "300px",
                                md: "300px",
                                lg: "350px",
                              },
                              width: "100%",
                              position: "relative",
                            }}
                          >
                            <Image
                              src={`https://sorciproptrack.com/ApartmentImage/${image.image_path}`}
                              alt={`Boardinghouse image ${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                              style={{ borderRadius: "10px" }}
                            />
                          </Box>
                        </div>
                      ))}
                    </Slider>
                  </Box>
                  {details && details.boardinghouse && (
                    <>
                      <Typography
                        variant="h6"
                        letterSpacing={1.2}
                        gutterBottom
                        sx={{
                          textTransform: "uppercase",
                          fontWeight: 550,
                          mt: 2,
                        }}
                      >
                        {details.boardinghouse.boarding_house_name}
                      </Typography>
                      <Typography
                        variant="body2"
                        letterSpacing={1.2}
                        gutterBottom
                        sx={{ textTransform: "uppercase", fontWeight: 500 }}
                      >
                        Bdlg no.{details.boardinghouse.building_no}.{" "}
                        {details.boardinghouse.street}.st., Brgy.
                        {details.boardinghouse.barangay},{" "}
                        {details.boardinghouse.municipality}.
                      </Typography>
                      <Typography
                        variant="body2"
                        letterSpacing={1.2}
                        gutterBottom
                        sx={{ fontWeight: 500, mt: "0.9rem" }}
                      >
                        {details.boardinghouse.number_of_rooms} Rooms
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "start", mt: 3 }}>
                        <Typography
                          variant="body2"
                          gutterBottom
                          sx={{ fontWeight: 600, color: "#333", mr: 1 }}
                        >
                          <strong>Inclusions:</strong>
                        </Typography>

                        <Grid container spacing={1}>
                          {details.boardinghouse.inclusions && details.boardinghouse.inclusions.length > 0 ? (
                            details.boardinghouse.inclusions.map(
                              (item, index) => (
                                <Grid item key={index} xs="auto">
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 500,
                                      color: "#555",
                                      backgroundColor: "#e8f0fe",
                                      padding: "4px 8px",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    {item.equipment?.name || ""} -{" "}
                                    {item?.quantity || ""}
                                  </Typography>
                                </Grid>
                              )
                            )
                          ) : (
                            <Grid item>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500, color: "#757575" }}
                              >
                                No Included Inclusions
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </>
                  )}
                </>
              )}
            </Paper>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <RoomsTable
                  boardinghouseId={boardinghouseId}
                  propsId={propsId}
                  loading={loading}
                  setLoading={setLoading}
                  handleOpenDrawer={handleOpenDrawer}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={7}>
          <SwipeableDrawer 
          anchor="right" // You can change to "left" or "bottom" as needed
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onOpen={handleOpenDrawer}
          sx={{
            "& .MuiDrawer-paper": {
              width: { xs: "80%", sm: "60%", md: "40%", lg:'50%' }, // Adjust the width as needed
              maxWidth: "1000px", // Limit the maximum width
              padding: "20px", // Add padding inside the drawer
              borderRadius: "8px",
              overflowX: 'hidden',
              overflowY: 'auto', // Allows vertical scrolling
              '&::-webkit-scrollbar': { display: 'none' }, // Hides scrollbar in WebKit-based browsers (Chrome, Edge, Safari)
              '-ms-overflow-style': 'none', // Hides scrollbar in IE and Edge
              'scrollbar-width': 'none', // Hides scrollbar in Firefox
            },
          }}
          >
            <SnackbarProvider maxSnack={3}>
            <BHTenantRegistrationForm
              details={details}
              setDetails={setDetails}
              setSuccessful={setSuccessful}
              setError={setError}
              setLoading={setLoading}
              handleCloseDrawer={handleCloseDrawer}
            />
            </SnackbarProvider>
          </SwipeableDrawer>
        </Grid>
      </Grid>
    </Box>
  );
}
