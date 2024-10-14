"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container, Stack, Box, Grid, Chip, Card, CardContent, CardMedia, CardActions,
  Typography, Button, IconButton, FormControl, InputLabel, Select, MenuItem,
  InputBase, AppBar, Toolbar, CircularProgress
} from '@mui/material';
import BookmarkTwoToneIcon from '@mui/icons-material/BookmarkTwoTone';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import { styled, alpha, useTheme } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
  border: `1px solid ${alpha(theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white, 0.5)}`, // Dynamic border color based on mode
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white, 0.5), // Dynamic icon color
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white, // Dynamic text color
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.9, 0, 0.9, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '85ch',
    },
    fontSize: '16px',
  },
}));

const categories = ['All', 'Apartment', 'Boardinghouse', 'Available', 'Occupied'];

export default function PropertyCard() {
  const router = useRouter();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);

  console.log('Properties:', properties)
  console.log('SelectedCategory:', selectedCategory);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = selectedCategory === "Apartment"
          ? "http://127.0.0.1:8000/api/all_apartment"
          : selectedCategory === "Boardinghouse"
          ? "http://127.0.0.1:8000/api/all_boardinghouse"
          : selectedCategory === "Available"
          ? "http://127.0.0.1:8000/api/all_available/Available"
          : selectedCategory === "Occupied"
          ? "http://127.0.0.1:8000/api/all_occupied/Occupied"
          : "http://127.0.0.1:8000/api/all";

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          }
        });

        const data = await response.json();
        if (response.ok) {
          if(selectedCategory === "All"){
            const allProperties = [...(data.data || []), ...(data[0] || [])];
            setProperties(allProperties);
          }else if(selectedCategory === "Available" || selectedCategory === "Occupied"){
            const allProperties = [...(data.data || []), ...(data[0] || [])];
            setProperties(allProperties);
          }else{
            setProperties(data.data || []);
          }
          // if (Array.isArray(data.data)) {
          //   setProperties(data.data);
          // } else {
          //   console.error('Expected data to be an array but got:', data);
          //   setProperties([]);
          // }
        } else {
          console.error('Error:', response.status);
          setProperties([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

 // Filter properties based on the search query
  const filteredProperties = properties.filter((property) => {
    const apartmentName = property.apartment_name ? property.apartment_name.toLowerCase() : '';
    const boardinghouse = property.boarding_house_name ? property.boarding_house_name.toLowerCase(): '';
    const status = property.status ? property.status.toLowerCase() : '';
    const rentalfee = property.rental_fee ? property.rental_fee.toLowerCase() : '';
    const propertyType = property.property_type ? property.property_type.toLowerCase() : '';
    const street = property.street ? property.street.toLowerCase() : '';
    const barangay = property.barangay ? property.barangay.toLowerCase() : '';
    const municipality = property.municipality ? property.municipality.toLowerCase() : '';
    
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


  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        backgroundImage: theme.palette.mode === 'light'
          ? 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(270, 100%, 94%), transparent)'
          : 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(270, 100%, 20%), transparent)',
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        borderColor: '1px solid black'
      })}
    >
      <Container
        maxWidth='lg'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: 'center',
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
                bgcolor: 'transparent',
                backgroundImage: 'none',
                margin: '0 auto'
              }}
            >
              <Container maxWidth="lg">
                <Toolbar
                  variant="regular"
                  sx={(theme) => ({
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    bgcolor: theme.palette.mode === 'light'
                      ? 'rgba(255, 255, 255, 0.4)'
                      : 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: theme.palette.mode === 'light'
                      ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                      : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
                    gap: 3,
                    py: 2,
                  })}
                >
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2, width: '100%' }}>
                    <FormControl sx={{ minWidth: { xs: '100%', sm: '200px' } }}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        label="Category"
                        variant="outlined"
                        size="small"
                        sx={{
                          backgroundColor: theme.palette.mode === 'light' ? 'white' : alpha(theme.palette.common.white, 0.1),
                          borderRadius: 1,
                        }}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Search
                      sx={{
                        width: { xs: '100%', sm: 'auto' },
                        mt: { xs: 1, sm: 0 },
                        backgroundColor: theme.palette.mode === 'light' ? 'white' : alpha(theme.palette.common.white, 0.1),
                      }}
                    >
                      <SearchIconWrapper>
                        <SearchIcon fontSize="small" />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </Search>
                  </Box>
                </Toolbar>
              </Container>
            </AppBar>
          </Grid>
        </Grid>

        <Box>
          <Grid container spacing={2} sx={{ mt: '1rem' }}>
            {loading ? (
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <CircularProgress />
              </Grid>
            ) : filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <Grid item key={property.id} xs={12} sm={6} md={4} lg={4}>
                  <Card sx={{ position: 'relative', borderRadius: 3, boxShadow: 3 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      
                      image={property.image ? `http://127.0.0.1:8000/ApartmentImage/${property.image}` : "/apartment2.jpeg"}
                      alt={property.apartment_name}
                    />
                    <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 1 }}>
                      <Chip label="Featured" color="secondary" size="small" />
                    </Box>
                    <Box sx={{position: 'absolute', height: '24px', top: 16, left: 90, backgroundColor:'#ff9800', borderRadius:'50px', p:0.3, px:0.8}}>
                      <Typography variant='body2' letterSpacing={1}  sx={{color: theme.palette.mode === 'light' ? 'white' :' black',  fontSize:'13px'}}>
                        {property.property_type}
                      </Typography>
                    </Box>
                    <IconButton
                      sx={{ position: 'absolute', top: 16, right: 16 }}
                      aria-label="bookmark"
                    >
                      <BookmarkTwoToneIcon sx={{ fontsize: 'large', color: '#f5f5f5' }} />
                    </IconButton>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip
                          icon={<StarIcon fontSize="small" />}
                          label={property.status}
                          color="success"
                          size="small"
                        />
                        <VerifiedIcon fontSize="small" color="#424242" />
                        <Typography variant="body2" color="text.#424242">
                          Verified
                        </Typography>
                        <Typography variant="body2" color="primary" sx={{ marginLeft: 'auto' }}>
                          Quick look
                        </Typography>
                      </Stack>
                      <Typography gutterBottom variant="h6" component="div" letterSpacing={1} sx={{ fontWeight: '550', mt: 1 }}>
                        {property.apartment_name || property.boarding_house_name}
                      </Typography>
                      <Typography gutterBottom variant="body2" sx={{ color: "text.#424242" }}>
                        {`${property.building_no}, ${property.street}, ${property.barangay}, ${property.municipality}`}
                      </Typography>
                      <Typography gutterBottom variant="body2" sx={{ color: "text.#424242" }}>
                        {`${property.number_of_rooms} Rooms | Capacity: ${property.capacity}`}
                      </Typography>
                      <Typography gutterBottom variant="body2" sx={{ color: "text.#424242" }}>
                        {property.property_type}
                      </Typography>
                      <Typography gutterBottom variant="h6" color="text.primary" sx={{ mt: 1 }}>
                      ₱{property.rental_fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="secondary"
                        startIcon={<BookmarkBorderOutlinedIcon />}
                        sx={{
                          '&:hover': {
                            bgcolor: (theme) =>
                              theme.palette.mode === 'light' ? alpha(theme.palette.secondary.light, 0.1) : alpha(theme.palette.secondary.dark, 0.1),
                          },
                          mb: '1rem'
                        }}
                      >
                        Tour
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          backgroundColor: (theme) =>
                            theme.palette.mode === 'light' ? '#212121' : '#424242',
                          color: '#fff',
                          '&:hover': {
                            backgroundColor: (theme) =>
                              theme.palette.mode === 'light' ? '#424242' : '#757575',
                          },
                          mb: '1rem'
                        }}
                      >
                        Check availability
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No properties found matching your criteria.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
