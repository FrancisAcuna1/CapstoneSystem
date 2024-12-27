"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  useTheme,
  IconButton,
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Skeleton,
  styled,
  Dialog,
  DialogContent,
  Stack,
  Chip,
  Card, 
  CardContent
} from "@mui/material";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import Slider from "react-slick"; // Import the slider
import styles from "../../../gallery.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import BedroomChildOutlinedIcon from "@mui/icons-material/BedroomChildOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Image from "next/image";
import useSWR from "swr";

const NavigationButton = styled(IconButton)(({ theme }) => ({
  background: "rgba(0, 0, 0, 0.5)",
  color: "white",
  "&:hover": {
    background: "rgba(0, 0, 0, 0.7)",
  },
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 1,
}));

function srcset(image, width, height, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${width * cols}&h=${
      height * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

const fetcher = async ([url]) => {
  const respons = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!respons.ok) {
    throw new Error(respons.statusText);
  }
  return respons.json();
};

export default function BoardingHouseGallery({
  loading,
  setLoading,
  boardinghouseId,
  propsId,
}) {
  const [open, setOpen] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [details, setDetails] = useState([]);
  const [landlord, setLandlord] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const theme = useTheme();
  
  console.log("data:", details);
  console.log("landlord:", landlord);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    propsId && boardinghouseId
      ? [
          `http://127.0.0.1:8000/api/boardinghousedetails/${propsId}/${boardinghouseId}`,
        ]
      : null,
    fetcher,
    {
      refreshInterval: 10000, // Refresh the data every 10 seconds
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  );

  useEffect(() => {
    if (response) {
      setDetails(response.boardinghouse);
      setLandlord(response.landlord);
      setLoading(false);
    } else if (isLoading) {
      setLoading(true);
    }
  }, [response, isLoading, setLoading]);

  const handleImageClick = (imagePath) => {
    setActiveImage(imagePath);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const images = (details?.images && details?.images) || [];
  console.log(images);

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
        zIndex: 1,
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
      className={`${className} custom-arrow prev-arrow`}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        left: "10px",
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
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        height: { xs: "auto", lg: "100vh" },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid container spacing={4} sx={{ flexGrow: 1 }}>
        {/* Left side - Property details */}
        <Grid item xs={12} md={5} sx={{ height: "100%" }}>
          {loading ? (
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" animation="wave" width="100%" height={40} />
              <Skeleton variant="text" animation="wave" width="70%" height={30} />
              <Skeleton variant="text" animation="wave" width="60%" height={30} />
              <Skeleton variant="rectangular" animation="wave" width="100%" height={180} />
            </Box>
          ) : (
            <Box
              sx={{
                position: { xs: "sticky", lg: "sticky" },
                top: 110,
                maxHeight: "calc(100vh - 64px)",
                overflow: "auto",
                px: 2,
                overflowX: "hidden",
                overflowY: "auto", // Allows vertical scrolling
                "&::-webkit-scrollbar": { display: "none" }, // Hides scrollbar in WebKit-based browsers (Chrome, Edge, Safari)
                "-ms-overflow-style": "none", // Hides scrollbar in IE and Edge
                "scrollbar-width": "none", // Hides scrollbar in Firefox
              }}
            >
        {/* Boarding House Name */}
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: 'text.primary', 
                  mb: 2 
                }}
              >
                {details?.boarding_house_name}
              </Typography>

              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary', 
                  mb: 3 
                }}
              >
                {details?.street} St., {details?.barangay}, {details?.municipality}
              </Typography>

              {/* Inclusions */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {details?.inclusions?.map((inclusion) => (
                  <Chip
                    key={inclusion.id}
                    label={`${inclusion.quantity} ${inclusion.equipment.name}`}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      fontWeight: 500,
                      backgroundColor: 'primary.50',
                      '& .MuiChip-label': {
                        fontSize: '0.8rem'
                      }
                    }}
                  />
                ))}
              </Box>

              {/* Rooms Section */}
              <Stack spacing={2}>
                {details?.rooms?.map((room) => (
                  <Card 
                    key={room.id} 
                    variant="outlined"
                    sx={{ 
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: 2,
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <CardContent>
                      {/* Room Header */}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          mb: 2 
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            color: 'text.primary'
                          }}
                        >
                          Room {room.room_number}
                        </Typography>
                        <BedroomChildOutlinedIcon 
                          sx={{ 
                            fontSize: { xs: '2rem', sm: '2.5rem' },
                            color: 'primary.main' 
                          }} 
                        />
                      </Box>

                      {/* Beds Information */}
                      <Stack spacing={1}>
                        {room.beds.map((bed) => (
                          <Box
                            key={bed.id}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              bgcolor: 'background.default',
                              p: 2,
                              borderRadius: 1
                            }}
                          >
                            <Box>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 500,
                                  color: 'text.primary' 
                                }}
                              >
                                Bed {bed.bed_number}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'text.secondary',
                                  fontSize: '0.8rem'
                                }}
                              >
                                Rental Fee: ₱ {bed.price.toLocaleString()}
                              </Typography>
                            </Box>
                            <Chip
                              label={bed.status}
                              size="small"
                              color={bed.status === 'Available' ? 'success' : 'error'}
                              sx={{ 
                                fontWeight: 600,
                                fontSize: '0.7rem'
                              }}
                            />
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>


              {/* <Typography variant="h6" sx={{ color: '#8785d0', fontWeight: 600, mt: 2, mb: 1 }}>
              ₱ {details?.rental_fee}
            </Typography> */}
              <Box sx={{mb:10}}>
                <Box
                  sx={{
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '10px',
                    mt:5,
                    mb:15,
                    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#9575cd', // Dark mode background
                    color: theme.palette.mode === 'dark' ? 'white' : 'white', // Text color
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                    Contact Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MailOutlinedIcon sx={{ marginRight: '0.5rem' }} />
                      <Typography variant="body1">{landlord.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneInTalkOutlinedIcon sx={{ marginRight: '0.5rem' }} />
                      <Typography variant="body1"> {landlord.contact}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnOutlinedIcon sx={{ marginRight: '0.5rem' }} />
                      <Typography variant="body1">{landlord.street}st. {landlord.barangay}, {landlord.municipality}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
      

            </Box>
          )}
        </Grid>

        {/* Right side - Image gallery */}
        <Grid item xs={12} md={7} sx={{ overflow: "hidden" }}>
          {loading ? (
            <>
              <Box sx={{ mt: 2.4 }}>
                <Skeleton variant="rectangular" height={140} />
                <Skeleton width="100%" height={100} />
                <Skeleton width="100%" height={100} />
              </Box>
            </>
          ) : isMobile ? (
            <Box
              className={styles.gallerySlider}
              sx={{
                position: "relative",
                width: "100%",
                mb: 4,
                gap: 2,
                borderColor: "1px solid black",
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
                        height: "300px",
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      <Image
                        src={`http://127.0.0.1:8000/ApartmentImage/${image.image_path}`}
                        alt={`Apartment image ${index + 1}`}
                        width={100}
                        height={100}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "10px",
                          borderColor: "1px solid black",
                        }}
                      />
                    </Box>
                  </div>
                ))}
              </Slider>
            </Box>
          ) : (
            <Box sx={{ position: "relative", height: "100%" }}>
              <ImageList
                sx={{
                  width: "100%",
                  transform: "translateZ(0)",
                  overflowX: "hidden",
                  overflowY: "auto", // Allows vertical scrolling
                  "&::-webkit-scrollbar": { display: "none" }, // Hides scrollbar in WebKit-based browsers (Chrome, Edge, Safari)
                  "-ms-overflow-style": "none", // Hides scrollbar in IE and Edge
                  "scrollbar-width": "none", // Hides scrollbar in Firefox
                }}
                variant="quilted"
                cols={2}
                rowHeight={200}
                gap={8}
              >
                {images.map((image, index) => {
                  const isTopImage = index % 3 === 0;
                  return (
                    <ImageListItem
                      key={image.id}
                      cols={isTopImage ? 2 : 1}
                      rows={isTopImage ? 2 : 1}
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          opacity: 0.8,
                        },
                      }}
                      onClick={() =>
                        handleImageClick(
                          `http://127.0.0.1:8000/ApartmentImage/${image.image_path}`
                        )
                      }
                    >
                      <Image
                        {...srcset(
                          `http://127.0.0.1:8000/ApartmentImage/${image.image_path}`,
                          250,
                          200,
                          isTopImage ? 2 : 1,
                          isTopImage ? 2 : 1
                        )}
                        alt={`Image ${index + 1}`}
                        loading="lazy"
                        width={900}
                        height={900}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                      <ImageListItemBar
                        sx={{
                          background:
                            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                          borderRadius: "10px",
                        }}
                        position="top"
                        actionPosition="left"
                      />
                    </ImageListItem>
                  );
                })}
              </ImageList>
              <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                PaperProps={{
                  sx: {
                    backgroundColor: "rgba(0, 0, 0, 0)", // Fully transparent background
                    boxShadow: "none", // Remove shadow for a clean look
                  },
                }}
              >
                <DialogContent
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0)", // Fully transparent content background
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "500px",
                    }}
                  >
                    <Image
                      src={activeImage}
                      alt="Active Image"
                      layout="fill"
                      objectFit="contain"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
