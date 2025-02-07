"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {Typography, Box, Breadcrumbs, Link, Grid, Fab, Paper, Tooltip, IconButton, Divider, Button, CardMedia, Skeleton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Backdrop, CircularProgress,} from "@mui/material";
import { styled, useTheme, css } from "@mui/system";
import Slider from "react-slick"; // Import the slider
import styles from "../../../gallery.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  WarningAmber as WarningAmberIcon,
  Close as CloseIcon,
  DeleteForever as DeleteForeverIcon,
  NavigateNext as NavigateNextIcon,
  Home as HomeOutlinedIcon
} from "@mui/icons-material";
import Swal from "sweetalert2";
import RoomsTable from "../TableComponent/RoomsTable";

const AcceptToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#4caf50", // Background color of the tooltip
    color: "#ffffff", // Text color
    borderRadius: "4px",
  },
});

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable

export default function OccupiedBoardinghouse({
  boardinghouseId,
  propsId,
  loading,
  setLoading,
}) {
  const router = useRouter();
  const boardinghouseID = boardinghouseId; // boardinghouse ID
  const propsID = propsId; // property ID
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDeleteTenant, setSelectedDeleteTenant] = useState({
    id: null,
  });
  const [details, setDetails] = useState([]);
  const [tenantInfo, setTenantInfo] = useState([]);
  const propertyType = details?.boardinghouse?.property_type;

  console.log("baordinghouse ID:", boardinghouseID);
  console.log("property ID:", propsID);
  console.log("Details:", details);

  useEffect(() => {
    const fetchedData = async () => {
      const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json
      const accessToken = userData.accessToken;
      if (accessToken) {
        console.log("Access Token Found", accessToken);

        try {
          setLoading(true);
          const response = await fetch(
            `${API_URL}/property/${propsID}/bhdetails/${boardinghouseID}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            console.log("Data:", data);
            setDetails(data);

            // setInclusions(data);
          } else {
            console.log("Error:", response.status);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(error);
        } finally {
          setLoading(false); // Set loading to false regardless of success or failure
        }
      }
    };
    fetchedData();
  }, [boardinghouseID, propsID, setLoading]);

  //this fetch function is to get the tenant info
  useEffect(() => {
    const fetchTenantInfo = async () => {
      const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json
      const accessToken = userData.accessToken;
      if (accessToken) {
        try {
          const response = await fetch(
            `${API_URL}/occupied_bed_info/${boardinghouseID}/type/${propertyType}`,
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
            console.log("Data:", data);
            setTenantInfo(data.data);
          } else {
            console.log("Error:", response.status);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        console.log("No access token found");
      }
    };
    fetchTenantInfo();
  }, [propertyType, boardinghouseID]);

  // Access the first object in the array and get tenant_id

  console.log("Tenant Info:", tenantInfo);
  if (tenantInfo && tenantInfo.length > 0) {
    const tenantId = tenantInfo[1]?.tenant_id; // Safely access tenant_id
    console.log("Tenant ID:", tenantId);
  }

  const handleClick = (tenantId) => {
    setLoading(true);
    router.push(
      `/Landlord/Property/${propsID}/occupiedboardinghouse/${boardinghouseID}/tenant/${tenantId}`
    );
  };

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

    const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json
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
            icon: 'success',
            title: 'Payments Processed',
            text: 'All selected tenant payments have been recorded successfully.',
            confirmButtonText: 'OK'
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
            console.log(data.error); // for empty field
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
              Occupied - {details.boardinghouse.boarding_house_name}
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
          <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Home">
            <HomeOutlinedIcon sx={{color:'#673ab7', mt:0.5}}/>
          </Link>
          <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Property">
            Property
          </Link>
          <Link letterSpacing={2} underline="hover" color="inherit" href={`/Landlord/Property/${propsID}`}>
            List Property
          </Link>
          <Typography letterSpacing={2} color="text.primary" sx={{ fontSize: { xs: "14px", sm: "15px", md: "15px" } }}>
            Details
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Box sx={{ mt: "4rem" }}></Box>
      <Grid container spacing={3} sx={{ mt: "-0.9rem", display: "flex" }}>
        <Grid item xs={12} lg={12}>
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
                      maxWidth: { xs: 300, lg: 1400 },
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
                                xs: "350px",
                                sm: "350px",
                                md: "350px",
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
                          mt: 3,
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
                        sx={{ fontWeight: 500 }}
                      >
                        Rooms: {details.boardinghouse.number_of_rooms}
                      </Typography>
                      <Typography
                        variant="body2"
                        letterSpacing={1.2}
                        gutterBottom
                        color='error'
                        sx={{ fontWeight: 500, }}
                      >
                        Status: {details.boardinghouse.status}
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
        </Grid>
        {/* may old code dini for cards nsa docs */}
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
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
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
      <RoomsTable
        boardinghouseId={boardinghouseId}
        propsId={propsId}
        loading={loading}
        setLoading={setLoading}
        // handleOpenDrawer={handleOpenDrawer}
      />
    </Box>
  );
}
