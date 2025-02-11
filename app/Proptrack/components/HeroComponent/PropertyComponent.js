"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import {
  Container,
  Stack,
  Box,
  Grid,
  Chip,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputBase,
  AppBar,
  Toolbar,
  CircularProgress,
  TextField,
  InputAdornment,
  Tooltip,
  useTheme,
  Badge,
} from "@mui/material";
import { styled, alpha } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import BedroomChildOutlinedIcon from "@mui/icons-material/BedroomChildOutlined";
import NoResultUI from "../Libraries/NoResult";
import { format, parseISO } from "date-fns";
import Slider from "react-slick"; // Import the slider
import styles from "../../../gallery.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Image from "next/image";

const GeneralTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#263238", // Background color of the tooltip
    color: "#ffffff", // Text color
    borderRadius: "4px",
  },
});

const StyledStack = styled(Stack)(({ theme }) => ({
  flex: "1 1 auto",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#eceff1",
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(1),
}));

const fetcher = async ([url]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

const categories = [
  "All",
  "Apartment",
  "Boardinghouse",
  "Available",
  "Occupied",
];


const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable
const API_URL_IMG = process.env.NEXT_PUBLIC_API_URL_IMG;

export default function PropertyComponentPage({ loading, setLoading }) {
  const router = useRouter();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [properties, setProperties] = useState([]);
  console.log("Properties:", properties);
  console.log("SelectedCategory:", selectedCategory);

  const url =
    selectedCategory === "Apartment"
      ? `${API_URL}/all_apartment`
      : selectedCategory === "Boardinghouse"
      ? `${API_URL}/all_boardinghouse`
      : selectedCategory === "Available"
      ? `${API_URL}/all_available/Available`
      : selectedCategory === "Occupied"
      ? `${API_URL}/all_occupied/Occupied`
      : `${API_URL}/all_prop`;

  const {
    data: response,
    error,
    isLoading,
  } = useSWR([url] || null, fetcher, {
    refreshInterval: 10000, // Refresh the data every 10 seconds
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    errorRetryCount: 3,
    onLoadingSlow: () => setLoading(true),
  });
  useEffect(() => {
    if (response) {
      if (selectedCategory === "All") {
        const allProperties = [
          ...(response?.data || []),
          ...(response[0] || []),
        ];
        setProperties(allProperties);
      } else if (
        selectedCategory === "Available" ||
        selectedCategory === "Occupied"
      ) {
        const allProperties = [
          ...(response?.data || []),
          ...(response[0] || []),
        ];
        setProperties(allProperties);
      } else {
        setProperties(response?.data || []);
      }
      setLoading(false);
    } else if (isLoading) {
      setLoading(true);
    }
  }, [response, isLoading, setLoading, selectedCategory]);

  const handleCategoryChange = (event) => {
    // const category = event.target.value;
    setSelectedCategory(event);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter properties based on the search query
  const filteredProperties = properties.filter((property) => {
    const apartmentName = property.apartment_name
      ? property.apartment_name.toLowerCase()
      : "";
    const boardinghouse = property.boarding_house_name
      ? property.boarding_house_name.toLowerCase()
      : "";
    const status = property.status ? property.status.toLowerCase() : "";
    const rentalfee = property.rental_fee
      ? property.rental_fee.toLowerCase()
      : "";
    const propertyType = property.property_type
      ? property.property_type.toLowerCase()
      : "";
    const street = property.street ? property.street.toLowerCase() : "";
    const barangay = property.barangay ? property.barangay.toLowerCase() : "";
    const municipality = property.municipality
      ? property.municipality.toLowerCase()
      : "";

    return (
      apartmentName.includes(searchQuery.toLowerCase()) ||
      boardinghouse.includes(searchQuery.toLowerCase()) ||
      status.includes(searchQuery.toLowerCase()) ||
      rentalfee.includes(searchQuery.toLowerCase()) ||
      propertyType.includes(searchQuery.toLowerCase()) ||
      street.includes(searchQuery.toLowerCase()) ||
      barangay.includes(searchQuery.toLowerCase()) ||
      municipality.includes(searchQuery.toLowerCase())
    );
  });

  console.log(filteredProperties);

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

  const calculateDaysUntilAvailable = (date) => {
    const today = new Date();
    const availableDate = new Date(date);
    const diffTime = availableDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const propertiesWithDaysUntilAvailable = filteredProperties.map(
    (property) => {
      const moveOutDate = property.move_out_date; // Assuming property has move_out_date field
      const daysUntilAvailable = moveOutDate
        ? calculateDaysUntilAvailable(moveOutDate)
        : null;

      return {
        ...property,
        daysUntilAvailable,
      };
    }
  );

  console.log(propertiesWithDaysUntilAvailable);

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
    <Box
      sx={(theme) => ({
        width: "100%",
        backgroundImage:
          theme.palette.mode === "light"
            ? "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(270, 100%, 94%), transparent)"
            : "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(270, 100%, 20%), transparent)",
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
        borderColor: "1px solid black",
      })}
    >
      <Container
        maxWidth="lg"
        sx={{
          // display: 'flex',
          // flexDirection: 'column',
          // alignItems: 'center',
          // margin: 'auto',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppBar
              position="static"
              sx={{
                boxShadow: 0,
                bgcolor: "transparent",
                backgroundImage: "none",
                margin: "0 auto",
              }}
            >
              <Container maxWidth="lg">
                <Box sx={{ textAlign: "center", mb: 7, mt: 2 }}>
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontSize: "2.25rem",
                      fontWeight: 800,
                      color: "text.primary",
                      mb: 2,
                    }}
                  >
                    Discover Your Perfect Space
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1.25rem",
                      color: "text.secondary",
                    }}
                  >
                    Modern living spaces tailored to your lifestyle
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    // flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    justifyContent: "center",
                    mb: 4,
                  }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{
                      mt: 1,
                      maxWidth: 800,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "9999px",
                        backgroundColor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "white", // Set background color based on theme mode
                        "& fieldset": {
                          borderColor: (theme) =>
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.3)"
                              : "rgba(0,0,0,0.23)",
                        },
                        "&:hover fieldset": {
                          borderColor: (theme) =>
                            theme.palette.mode === "dark"
                              ? "primary.main"
                              : "primary.main",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: (theme) =>
                            theme.palette.mode === "dark"
                              ? "primary.main"
                              : "primary.main",
                          boxShadow: (theme) =>
                            theme.palette.mode === "dark"
                              ? "0 0 0 2px rgba(255, 255, 255, 0.5)"
                              : "0 0 0 2px rgba(14, 165, 233, 0.5)",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: (theme) =>
                          theme.palette.mode === "dark" ? "white" : "black", // Set text color based on theme mode
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.5)"
                            : "rgba(0, 0, 0, 0.5)", // Set placeholder text color based on theme mode
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "white"
                                  : "text.secondary",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {categories.map((type) => {
                    // Access the theme
                    const isDarkMode = theme.palette.mode === "dark"; // Check if dark mode is active

                    return (
                      <Button
                        key={type}
                        onClick={() => handleCategoryChange(type)}
                        size="small"
                        variant={
                          selectedCategory === type ? "contained" : "outlined"
                        }
                        sx={{
                          borderRadius: "9999px",
                          textTransform: "none",
                          ...(selectedCategory !== type && {
                            backgroundColor: isDarkMode
                              ? theme.palette.grey[800]
                              : "white", // Change background based on mode
                            color: isDarkMode
                              ? theme.palette.text.primary
                              : "text.secondary", // Change text color based on mode
                            "&:hover": {
                              backgroundColor: isDarkMode
                                ? "rgba(255, 255, 255, 0.1)"
                                : "rgba(0,0,0,0.1)", // Adjust hover effect
                            },
                          }),
                        }}
                      >
                        {type}
                      </Button>
                    );
                  })}
                </Box>
              </Container>
            </AppBar>
          </Grid>
        </Grid>

        <Box>
          <Grid container spacing={2} sx={{ mt: "6rem" }}>
            {loading ? (
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <CircularProgress />
              </Grid>
            ) : propertiesWithDaysUntilAvailable.length > 0 ? (
              propertiesWithDaysUntilAvailable.map((property, index) => {
                const unitImages = property.images
                  ? property.images.map((img) => img.image_path)
                  : [];
                console.log(unitImages);
                return (
                  <Grid item key={index} xs={12} sm={6} md={6} lg={4}>
                    <Card
                      sx={{
                        position: "relative",
                        borderRadius: 3,
                        boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 16px 32px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      <Box position="relative">
                        <Box
                          className={styles.gallerySlider}
                          sx={{
                            maxWidth: { xs: 285, lg: 1400 },
                            mb: 4,
                            gap: 2,
                            position: "relative", // Added to establish positioning context
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
                            {unitImages.map((image, index) => (
                              <div key={index}>
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
                                    src={`${API_URL_IMG}/ApartmentImage/${image}`}
                                    alt={`Image image ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    style={{ borderRadius: "10px" }}
                                  />
                                </Box>
                              </div>
                            ))}
                          </Slider>
                          
                          {/* Repositioned Chip component */}
                          <Chip
                            label={property.status}
                            size="small"
                            icon={
                              property.status === "Available" ? (
                                <LocalOfferOutlinedIcon />
                              ) : (
                                <SensorOccupiedIcon />
                              )
                            }
                            sx={{
                              position: "absolute",
                              top: 16, // Changed from bottom to top
                              right: 16,
                              zIndex: 2, // Increased z-index to ensure it's above the slider
                              backgroundColor: (theme) =>
                                property.status === "Available"
                                  ? theme.palette.mode === "dark"
                                    ? "#43a047"
                                    : "#388e3c"
                                  : theme.palette.mode === "dark"
                                  ? "#e74c3c"
                                  : "#ff3737",
                              color: (theme) =>
                                property.status === "Available"
                                  ? theme.palette.mode === "dark"
                                    ? "white"
                                    : "white"
                                  : "white",
                              "& .MuiChip-icon": {
                                color: (theme) =>
                                  property.status === "Available"
                                    ? theme.palette.mode === "dark"
                                      ? "white"
                                      : "white"
                                    : "white",
                              },
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)', // Added shadow for better visibility
                              '&:hover': {
                                opacity: 0.95, // Added hover effect
                              },
                            }}
                          />
                        </Box>
                      </Box>

                      <CardContent sx={{ flex: "1 1 auto", p: 3 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{ mb: 2 }}
                        >
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            sx={{
                              fontWeight: 700,
                              alignItems: "center",
                              display: "flex",
                              letterSpacing: "-0.5px",
                              color: "text.primary",
                              // mb: 1
                            }}
                          >
                            <ApartmentOutlinedIcon
                              color="text.inherit"
                              sx={{ mr: 1 }}
                            />{" "}
                            {property.apartment_name ||
                              property.boarding_house_name}
                          </Typography>
                          {property.rental_fee ? (
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,

                                color: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "#d1c4e9"
                                    : "#673ab7", // Keep text color white
                              }}
                            >
                              {/* {property.rental_fee ? `₱${property.rental_fee}/mo` : 'See full bed pricing.'} */}
                              ₱{property.rental_fee}/mo
                            </Typography>
                          ) : (
                            <GeneralTooltip title="Please view the details of unit to see the complete pricing for each bed">
                              <HelpOutlinedIcon
                                sx={{
                                  alignItems: "center",
                                  mt: -1,
                                  color: "primary.main",
                                  fontSize: "26px",
                                }}
                              />
                            </GeneralTooltip>
                          )}
                        </Stack>
                        <Stack>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mt: -1,
                              mb: 2,
                            }}
                          >
                            <BedroomChildOutlinedIcon />{" "}
                            {property.property_type}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{ mb: 2 }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mt: -1,
                              mb: 1,
                            }}
                          >
                            <LocationOnOutlinedIcon /> {property.street} st.{" "}
                            {property.barangay}, {property.municipality},
                          </Typography>
                        </Stack>

                        {property.property_type === "Apartment" &&
                          property.status === "Occupied" &&
                          property.move_out_date !== null && (
                            <StyledStack>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <div>
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight="medium"
                                  >
                                    Available from
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {formatDate(property.move_out_date)}
                                  </Typography>
                                </div>
                                <Chip
                                  label={`In ${property.daysUntilAvailable} days`}
                                  color="warning"
                                  size="small"
                                />
                              </Stack>
                            </StyledStack>
                          )}

                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{ mb: 2, mt: 2 }}
                        >
                          <Box
                            sx={{
                              flex: "1 1 auto",
                              p: 2,
                              backgroundColor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#424242"
                                  : "#e3f2fd", // Responsive background color
                              borderRadius: 2,
                              textAlign: "center",
                            }}
                          >
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {property.number_of_rooms}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Rooms
                            </Typography>
                          </Box>
                          {property.property_type === "Apartment" ? (
                            <Box
                              sx={{
                                flex: "1 1 auto",
                                p: 2,
                                backgroundColor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "#424242"
                                    : "#e3f2fd", // Responsive background color
                                borderRadius: 2,
                                textAlign: "center",
                              }}
                            >
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {property.capacity}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Capacity
                              </Typography>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                flex: "1 1 auto",
                                p: 2,
                                backgroundColor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "#424242"
                                    : "#e3f2fd", // Responsive background color
                                borderRadius: 2,
                                textAlign: "center",
                              }}
                            >
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {property.capacity}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Beds
                              </Typography>
                            </Box>
                          )}
                          <Box
                            sx={{
                              flex: "1 1 auto",
                              p: 2,
                              backgroundColor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#424242"
                                  : "#e3f2fd", // Responsive background color
                              borderRadius: 2,
                              textAlign: "center",
                            }}
                          >
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {(property.inclusions &&
                                property.inclusion?.filter(
                                  (inclusion) =>
                                    inclusion.equipment.name === "Comfort Room"
                                ).length) ||
                                "0"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Comfort Room
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{
                            flexWrap: "wrap",
                            justifyContent: "flex-start",
                            gap: 1, // Space between the rows and columns
                            opacity: 0.8,
                          }}
                        >
                          {property.inclusions?.map((amenity) => (
                            <Chip
                              key={amenity.id}
                              label={amenity.equipment.name} // Display the equipment name
                              variant="contained" // Chip variant
                              sx={{
                                margin: "4px", // Consistent spacing around each chip
                                backgroundColor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "#424242"
                                    : "rgba(0, 0, 0, 0.05)",
                                color: "text.primary",
                                borderRadius: 2,
                                fontSize: "14px",
                              }}
                            />
                          ))}
                        </Stack>
                      </CardContent>

                      <CardActions sx={{ p: 3, pt: 0 }}>
                        {property.status === "Available" ? (
                          <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            sx={{
                              backgroundColor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#4527a0"
                                  : "#7e57c2", // Adjust color for dark mode
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "white"
                                  : "white", // Keep text color white
                              borderRadius: 2,
                              py: 1.5,
                              fontWeight: 600,
                              "&:hover": {
                                backgroundColor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "#115293"
                                    : "#512da8", // Adjust hover color for dark mode
                                transform: "scale(1.02)",
                              },
                              transition: "all 0.3s ease",
                            }}
                            onClick={() => {
                              if (property.property_type === "Apartment") {
                                router.replace(
                                  `/Proptrack/Properties/${property.property_id}/apartment/${property.id}`
                                );
                              } else if (
                                property.property_type === "Boarding House"
                              ) {
                                router.replace(
                                  `/Proptrack/Properties/${property.property_id}/boardinghouse/${property.id}`
                                );
                              }
                            }}
                          >
                            View Details
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            disabled
                            sx={{
                              borderRadius: 2,
                              py: 1.5,
                              fontWeight: 600,
                              opacity: 0.5,
                              backgroundColor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#424242"
                                  : "#e0e0e0", // Adjust background for disabled state
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "rgba(255, 255, 255, 0.7)"
                                  : "rgba(0, 0, 0, 0.5)", // Adjust text color for disabled state
                            }}
                          >
                            Not Available
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12} sx={{ textAlign: "center", mt: -25 }}>
                <NoResultUI />
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
