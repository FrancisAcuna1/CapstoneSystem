'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Button, IconButton, Container, ImageList, ImageListItem, ImageListItemBar, Skeleton, styled} from '@mui/material';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import Slider from "react-slick"; // Import the slider
import styles from '../../../gallery.module.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import BedroomChildOutlinedIcon from '@mui/icons-material/BedroomChildOutlined';
import Image from 'next/image';
// ... (keep the NavigationButton and srcset function as they are)
const NavigationButton = styled(IconButton)(({ theme }) => ({
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.7)',
    },
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
  }));
  
  function srcset(image, width, height, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format&dpr=2 2x`,
    };
  }

export default function BoardingHouseGallery ({loading, setLoading, boardinghouseId, propsId}) {
  const [details, setDetails] = useState([]);
  const [landlord, setLandlord] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  console.log('data:', details);
  console.log('landlord:', landlord);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
        try{
            const response = await fetch(`http://127.0.0.1:8000/api/boardinghousedetails/${propsId}/${boardinghouseId}`, {
                method: 'GET',
                headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                }
            });

            const data = await response.json()
            console.log(data);

            if(response.ok){
                setDetails(data.boardinghouse);
                setLandlord(data.landlord);
                console.log('data:', data.apartment);
                setLoading(false);
            }else{
                console.log('error:', response.status);
                console.log('errorMessage', error.message || 'Failed to Query')
                setLoading(false);
            }
        }catch(error){
            console.error(error);
            setLoading(false);
        }
    }
    fetchDetails();
}, [boardinghouseId, propsId, setLoading])

  const images = details?.images && details?.images || []; 
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
        cursor: "pointer"
      }}
    >
      <ArrowForwardIosIcon fontSize='small' style={{ color: "#fff" }} />
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
        cursor: "pointer"
      }}
    >
      <ArrowBackIosIcon  fontSize='small' style={{ color: "#fff", marginLeft: "8px" }} />
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
    <Container maxWidth="lg" sx={{ py: 4, height: {xs:'auto', lg:'100vh'}, display: 'flex', flexDirection: 'column',}}>
    <Grid container spacing={4} sx={{ flexGrow: 1,}}>
      {/* Left side - Property details */}
      <Grid item xs={12} md={5} sx={{ height: '100%' }}>
        {loading ? (
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="text" width="100%" height={40} />
            <Skeleton variant="text" width="70%" height={30} />
            <Skeleton variant="text" width="60%" height={30} />
            <Skeleton variant="rectangular" width="100%" height={180} />
          </Box>
        ) : (
          <Box sx={{ position: {xs:'sticky', lg:'sticky'}, top: 110, maxHeight: 'calc(100vh - 64px)', overflow: 'auto', px: 2 }}>
            
            <Typography variant="h4" fontWeight="bold" fontSize={{xs:'1.5rem', sm:'1.9rem'}} gutterBottom >
              {details?.boarding_house_name}
            </Typography>

            <Typography variant="body1" sx={{ color: 'text', fontSize: '1rem', mb: 1 }}>
              {details?.street} St., {details?.barangay}, {details?.municipality}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {details?.inclusions?.map((inclusion, index) => (
                <Typography
                  key={inclusion.id}
                  variant="body2"
                  sx={{fontWeight:500, fontSize: '0.95rem', color: 'text' }}
                >
                  {inclusion.quantity} {inclusion.equipment.name}{index < details.inclusions.length - 1 ? ' |' : ''} 
                </Typography>
              ))}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
              {details?.rooms?.map((room) => (
                <Box 
                  key={room.id}
                  sx={{ 
                    borderRadius: '8px',
                    padding: 2,
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                > 
                  <Box sx={{display:'flex', justifyContent: 'space-between', alignItems:'center', mb: 1}}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                      Room {room.room_number}
                    </Typography>
                    <Box>
                      <BedroomChildOutlinedIcon sx={{fontSize: { xs: '2rem', sm: '2.5rem' }, color: '#8785d0'}}/>
                    </Box>
                  </Box>

                  {/* Display beds information */}
                  <Box sx={{ ml: 1 }}>
                    {room.beds.map((bed) => (
                      <Box key={bed.id} sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', alignItems:'center', gap: 0.5 }}>
                        <Typography variant="body2" sx={{fontSize: { xs: '0.99rem', sm: '0.97rem' }}}>
                          Bed {bed.bed_number}: |
                        </Typography>
                        <Typography variant="body2" sx={{fontSize: { xs: '0.99', sm: '0.97rem' }}}>
                          Rental Fee: ₱ {bed.price.toLocaleString()} |
                        </Typography>
                        <Typography variant="body2" sx={{fontSize: { xs: '0.99rem', sm: '0.97rem' }, color: bed.status === 'available' ? 'green' : 'red' }}>
                          {bed.status} 
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* <Typography variant="h6" sx={{ color: '#8785d0', fontWeight: 600, mt: 2, mb: 1 }}>
              ₱ {details?.rental_fee}
            </Typography> */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 10, mb: 1 }}>
                Contact Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PhoneInTalkOutlinedIcon sx={{ color: 'text.secondary', fontSize: '1.3rem' }} />
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem' }}>
                    {landlord.contact}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <MailOutlinedIcon sx={{ color: 'text.secondary', fontSize: '1.3rem' }} />
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1rem'}}>
                    {landlord.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
          </Box>
        )}
      </Grid>


      {/* Right side - Image gallery */}
      <Grid item xs={12} md={7} sx={{ overflow: 'hidden',}}>
        {loading ? (
          <>
            <Box sx={{mt:2.4}}>
              <Skeleton variant="rectangular" height={140} />
              <Skeleton width="100%" height={100}/>
              <Skeleton width="100%" height={100}/>
            </Box>
          </>
        ) : isMobile ? (
          <Box 
            className={styles.gallerySlider}
            sx={{
              position: 'relative',
              width: '100%',
              mb: 4,
              gap: 2,
              borderColor: '1px solid black',
              '& .slick-slider, & .slick-list, & .slick-track': {
                height: '100%',
                overflow: 'hidden',
              },
              '& .slick-slide': {
                '& > div': {
                  height: '100%',
                }
              }
            }}
          >
            <Slider {...sliderSettings}>
              {images.map((image, index) => (
                <div key={image.id}>
                  <Box
                    sx={{
                      height: '300px',
                      width: '100%',
                      position: 'relative',
                      
                    }}
                  >
                    <Image
                      src={`http://127.0.0.1:8000/ApartmentImage/${image.image_path}`}
                      alt={`Apartment image ${index + 1}`}
                      width={100}
                      height={100}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        borderColor:'1px solid black'
                        
                      }}
                    />
                  </Box>
                </div>
              ))}
            </Slider>
          </Box>
        ):(
          <Box sx={{ position: 'relative', height: '100%' }}>
          <ImageList
            sx={{
              width: '100%',
              transform: 'translateZ(0)',
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
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      opacity: 0.8,
                    },
                    
                  }}
                  onClick={() => setActiveIndex(index)}
                >
                  <Image
                    {...srcset(`http://127.0.0.1:8000/ApartmentImage/${image.image_path}`, 250, 200, isTopImage ? 2 : 1, isTopImage ? 2 : 1)}
                    alt={`Image ${index + 1}`}
                    loading="lazy"
                    width={100}
                    height={100}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius:'10px' }}
                  />
                  <ImageListItemBar
                    sx={{
                      background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                      borderRadius:'10px',
                    }}
                    position="top"
                    actionPosition="left"
                  />
                </ImageListItem>
              );
            })}
          </ImageList>
          </Box>
        )}
      </Grid>
    </Grid>
  </Container>
  );
};

