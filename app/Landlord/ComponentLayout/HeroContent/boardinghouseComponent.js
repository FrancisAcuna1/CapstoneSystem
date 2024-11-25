'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Typography, Box,  Breadcrumbs, Link, Grid, Fab, Paper, Tooltip, IconButton, Divider, Button, CardMedia, Skeleton} from '@mui/material';
import { styled,  } from '@mui/system';
import BedroomChildOutlinedIcon from '@mui/icons-material/BedroomChildOutlined';
import BHTenantRegistrationForm from '../FormsComponent/BHTenantRegistrationForm';
import SuccessSnackbar from '../Labraries/snackbar';
import ErrorSnackbar from '../Labraries/ErrorSnackbar'
import { SnackbarProvider } from 'notistack';
import Slider from "react-slick"; // Import the slider
import styles from '../../../gallery.module.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


const AcceptToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    '& .MuiTooltip-tooltip': {
      backgroundColor: '#4caf50', // Background color of the tooltip
      color: '#ffffff', // Text color
      borderRadius: '4px',
    },
});

// const AddButton = styled(Fab)(({ theme }) => ({
//   backgroundColor: theme.palette.primary.main,
//   color: '#fff',
//   '&:hover': {
//     backgroundColor: theme.palette.primary.dark,
//   },
// }));


export default function BoardingHouseDetailsComponent({boardinghouseId, propsId, loading, setLoading}){
  const router = useRouter();
  const boardinghouseID = boardinghouseId; // boardinghouse ID
  const propsID = propsId // property ID
  
  const [details, setDetails] = useState([]);
  const [tenantInfo, setTenantInfo] = useState([]);
  const [successful, setSuccessful] = useState(null);
  const [error, setError] = useState(null);
  const price = details?.boardinghouse?.rooms[0].beds[0].price;
  const propertyType = details?.boardinghouse?.property_type;
  console.log('baordinghouse ID:', boardinghouseID )
  console.log('property ID:', propsID )
  console.log('Details:', details);
  console.log(price);
  console.log(propertyType);
  

  const fetchData = useCallback( async(propsID, boardinghouseID) => {
    const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json 
    const accessToken = userData.accessToken;
    if (accessToken){
        console.log('Access Token Found', accessToken)

        try{
            setLoading(true);
            const response = await fetch(`http://127.0.0.1:8000/api/property/${propsID}/bhdetails/${boardinghouseID}`,{
              method: "GET",
              headers: {
                "Authorization": `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                "Accept": "application/json",
              }
        
            })

            const data = await response.json();

            if(response.ok){ 
              console.log('Data:', data)
              setDetails(data);
            }
            else{
              console.log('Error:', response.status)
            }

        }catch (error) {
          console.error("Error fetching data:", error);
          setError(error);

        } finally {
          setLoading(false); // Set loading to false regardless of success or failure
        }
    }
  
  }, [setLoading])

  useEffect(() => {
    fetchData(propsID, boardinghouseID);
  }, [fetchData, propsID, boardinghouseID])

  
  // useEffect(() => {
  //   const fetchedData = async () => {
  //       const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
  //       const userData = JSON.parse(userDataString); // parse the datastring into json 
  //       const accessToken = userData.accessToken;
  //       if (accessToken){
  //           console.log('Access Token Found', accessToken)

  //           try{
  //               setLoading(true);
  //               const response = await fetch(`http://127.0.0.1:8000/api/property/${propsID}/bhdetails/${boardinghouseID}`,{
  //                   method: "GET",
  //                   headers: {
  //                       "Authorization": `Bearer ${accessToken}`,
  //                       'Content-Type': 'application/json',
  //                       "Accept": "application/json",
  //                   }
            
  //               })

  //               const data = await response.json();

  //               if(response.ok){ 
  //                   console.log('Data:', data)
  //                   setDetails(data);

                    
                
  //                   // setInclusions(data);
  //               }
  //               else{
  //                   console.log('Error:', response.status)
  //               }

  //           }catch (error) {
  //               console.error("Error fetching data:", error);
  //               setError(error);

  //           } finally {
  //               setLoading(false); // Set loading to false regardless of success or failure
  //           }
  //       }
        
  //   }
  //   fetchedData();
  // }, [propsID, boardinghouseID])

  const fetchTenantInfo = useCallback(async(boardinghouseID, propertyType) => {
    const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json
    const accessToken = userData.accessToken;
    setLoading(true)
    if (accessToken){
      try{
        const response = await fetch(`http://127.0.0.1:8000/api/occupied_bed_info/${boardinghouseID}/type/${propertyType}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            
          },
        })
        const data = await response.json();
        if(response.ok){
          console.log('Data:', data)
          
          setTenantInfo(data.data)
        }else{
          console.log('Error:', response.status)
        }
      }catch(error){
        console.error("Error fetching data:", error);
      }

    }else{
      console.log('No access token found')
    }
  }, [setLoading])

  useEffect(() => {
    fetchTenantInfo(propertyType, boardinghouseID)
  }, [fetchTenantInfo, propertyType, boardinghouseID])

  //this fetch function is to get the tenant info
  // useEffect(() => {
  //   const fetchTenantInfo = async () => {
  //     const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
  //     const userData = JSON.parse(userDataString); // parse the datastring into json
  //     const accessToken = userData.accessToken;
  //     if (accessToken){
  //       try{
  //         const response = await fetch(`http://127.0.0.1:8000/api/occupied_bed_info/${boardinghouseID}/type/${propertyType}`, {
  //           method: "GET",
  //           headers: {
  //             "Authorization": `Bearer ${accessToken}`,
  //             'Content-Type': 'application/json',
              
  //           },
  //         })
  //         const data = await response.json();
  //         if(response.ok){
  //           console.log('Data:', data)
            
  //           setTenantInfo(data.data)
  //         }else{
  //           console.log('Error:', response.status)
  //         }
  //       }catch(error){
  //         console.error("Error fetching data:", error);
  //       }

  //     }else{
  //       console.log('No access token found')
  //     }
  //   }
  //   fetchTenantInfo();
  // }, [propertyType, boardinghouseID])

  // Access the first object in the array and get tenant_id
  
  console.log('Tenant Info:', tenantInfo);
  if (tenantInfo && tenantInfo.length > 0) {
      const tenantId = tenantInfo[1]?.tenant_id; // Safely access tenant_id
      console.log('Tenant ID:', tenantId);
  }
  
  
  const handleClick = (tenantId) => {
    setLoading(true);
    router.push(`/Landlord/Property/${propsID}/occupiedboardinghouse/${boardinghouseID}/tenant/${tenantId}`)
  }


  const images = details?.boardinghouse?.images && details?.boardinghouse?.images || []; 
    console.log('images:', images);
    
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
        cursor: "pointer"
        }}
    >
        <ArrowForwardIosIcon fontSize='small' style={{ color: "#fff" }} />
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
    <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
       <SnackbarProvider maxSnack={3}>
          <SuccessSnackbar
              setSuccessful={setSuccessful}
              successful={successful}          
          />
          <ErrorSnackbar
              error={error}
              setError={setError}          
          />
      </SnackbarProvider>
        {loading ? (
          <>
            <Box>
            <Skeleton width="40%" />
            </Box>
          </>
        ):(
          <>
         
          {details.boardinghouse && details.boardinghouse.boarding_house_name ? (
          <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '5px', fontSize: '24px', fontWeight: 'bold',  mt:5 }}>
            Details - {details.boardinghouse.boarding_house_name}        
          </Typography>
          ) : null }
          </>
        )}
        
        <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
            <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                {/* <Typography color="inherit">Navigation</Typography> */}
                <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Home">
                    Home
                </Link>
                <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Property">
                    Property
                </Link>
                <Link letterSpacing={2} underline="hover" color="inherit" href={`/Landlord/Property/${propsID}`}>
                    List Property
                </Link>
                <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Details</Typography>
            </Breadcrumbs>
        </Grid>
        <Box sx={{mt:'4rem'}}>
        </Box>
        <Grid  container spacing={3} sx={{ mt: '-0.9rem', display:'flex',  }}>
          <Grid item xs={12} lg={5}>
            <Grid item>
              <Paper elevation={2} sx={{ borderRadius: '8px', padding: '24px', marginTop: '15px',}}>
                {loading ?
                  (
                    <Box>
                      <Skeleton variant="rectangular" height={140} />
                        <Skeleton width="100%" />
                        <Skeleton width="90%" />
                        <Skeleton width="40%" />
                        <Skeleton width={100} height={30} />
                        <Skeleton width={100} height={30} />
                    </Box>   
                    ):(
                      <>
                      <Box 
                        className={styles.gallerySlider}
                        sx={{
                            position: 'relative',
                            maxWidth:{xs:285, lg:1400},
                            mb: 4,
                            gap: 2,
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
                                    height: { xs: '300px', sm: '300px', md: '300px', lg:'300px' },
                                    width: '100%',
                                    position: 'relative',
                                    
                                }}
                                >
                                <Image
                                    src={`http://127.0.0.1:8000/ApartmentImage/${image.image_path}`}
                                    alt={`Boardinghouse image ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"  
                                    style={{ borderRadius: '10px'}}
                                />
                                </Box>
                            </div>
                            ))}
                        </Slider>
                      </Box>
                      {details && details.boardinghouse && (
                        <>
                        <Typography variant='h6' letterSpacing={1.2} gutterBottom sx={{textTransform: 'uppercase', fontWeight: 550, mt: 2}}>
                          {details.boardinghouse.boarding_house_name}
                        </Typography>
                        <Typography variant='body2' letterSpacing={1.2} gutterBottom sx={{textTransform: 'uppercase', fontWeight: 500, }}>
                          Bdlg no.{details.boardinghouse.building_no}.  {details.boardinghouse.street}.st.,  Brgy.{details.boardinghouse.barangay},  {details.boardinghouse.municipality}.
                        </Typography>
                        <Typography variant='body2' letterSpacing={1.2} gutterBottom sx={{ fontWeight: 500, mt:'0.9rem' }}>
                          {details.boardinghouse.number_of_rooms} Rooms
                        </Typography>
                        <Box sx={{display:'flex', justifyContent:'start'}}>
                          <Typography variant='body2' letterSpacing={1.2} gutterBottom sx={{mr:'0.5rem', fontWeight: 500, mt:'0.1rem' }}>
                          <strong>Inclusions:</strong>
                          </Typography>
                          {details.boardinghouse.inclusions && details.boardinghouse.inclusions.length > 0 ? (
                          details.boardinghouse.inclusions.map((item, index) => (
                              <Typography key={item.index} variant='body2' letterSpacing={2} gutterBottom sx={{ display: 'inline', mt:'0.1rem', fontWeight: 500, mr:'0.2rem'}}>
                                  {item.equipment.name}- {item.quantity} {index < details.boardinghouse.inclusions.length - 1 && '|'}
                              </Typography>
                          ))
                          ):(
                          <>
                          <Typography variant='body2' letterSpacing={2} gutterBottom sx={{ fontWeight: 500, }}>
                              No Included Inclusion 
                          </Typography>
                          </>
                          )}
                        </Box>

                        </>
                      )}
                      
                      </>
                    )
                }
              </Paper>
            </Grid>
            <Grid container spacing={2}>
              {loading ?
                (
                  <Grid item xs={12}>
                    <Paper elevation={2} sx={{borderRadius: '8px', padding: '24px', marginTop: '15px',}}>
                      <Box>
                        <Skeleton variant="rectangular" height={120} />
                        <Skeleton width="100%" />
                        <Skeleton width="90%" />
                        <Skeleton width="40%" />
                        <Skeleton width={100} height={30} />
                        <Skeleton width={100} height={30} />
                      </Box>
                    </Paper>
                  </Grid>
                  
                 
                ):(
                  <>
                  {details?.boardinghouse?.rooms?.length > 0 ? (
                    details.boardinghouse.rooms.map((room, index) => {
                      
                      return (
                        <>
                        <Grid item xs={12}>
                          <Paper elevation={2} sx={{ borderRadius: '8px', padding: '24px', marginTop: '15px',}}>
                            <Grid container sx={{justifyContent: 'space-between'}}>
                              <Grid item>
                                <Typography variant='h6' letterSpacing={2} sx={{fontWeight: 'bold', textTransform: 'uppercase',}}>
                                    Room: {room.room_number}
                                </Typography>
                                {/* <Typography variant='body2' letterSpacing={1} gutterBottom sx={{textTransform: 'uppercase', fontWeight: 500, mt:'0.9rem', mb:'0.6rem'}}>
                                  <strong>Rent per Bed:</strong> {details?.boardinghouse?.rooms[0].beds[0].price}
                                </Typography> */}
                              </Grid>
                              <Grid item>
                                <Box   sx={{bgcolor: '#8785d0', borderRadius: '8px', height: '55px', padding: '13px', justifyContent: 'center' }}>
                                
                                    <BedroomChildOutlinedIcon fontSize={'large'} sx={{color:'white', mt: '-0.2rem'}}/>
                                </Box>
                              </Grid>
                            </Grid>
                            
                            {room.beds && room.beds.map((bed, bedIndex) => {
                                const tenant = tenantInfo.find(tenant => tenant.rented_unit_details.bed_id === bed.id); // Find the tenant assigned to the bed

                              // <Typography key={bedIndex} variant='body2' sx={{ fontWeight: 500 }}>
                              //   Bed {bed.bed_number} - Type: {bed.bed_type}, Status: {bed.status}
                              // </Typography>
                              return (
                                <Box key={bedIndex} sx={{ width: '100%', maxWidth: 'md', mb: 2 }}>
                              <Box sx={{ 
                                display: 'flex', 
                                gap: 16, // This creates the spacing between bed sections
                                mb: 2 
                              }}>
                                {bed.status.toLowerCase() === "available" ? (
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant='body1' sx={{ mb: 1, mt:1}}>
                                      <strong style={{ color: '#263238' }}>Bed {bed.bed_number}</strong>
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                      <Typography variant='body1'>
                                        <strong style={{color:"#424242"}}>Price:</strong> {bed.price}
                                      </Typography>
                                      <Typography gutterBottom variant='body1' style={{ color: '#4caf50' }}>
                                       <strong style={{color:"#424242"}}>Status</strong> {bed.status}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ) : (
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant='body1' sx={{ mb: 1 }}>
                                      <strong style={{ color: '#263238' }}>Bed {bed.bed_number}</strong>
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                      <Typography variant='body1' color='#a55555'>
                                        Status: {bed.status}
                                      </Typography>
                                      {tenantInfo && tenantInfo.length > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                          <Button 
                                            variant='contained' 
                                            size='small' 
                                            sx={{ padding: '4px 8px' }} 
                                            onClick={() => handleClick(tenant?.tenant_id)}
                                            disabled={!tenant?.tenant_id}
                                          >
                                            View
                                          </Button>
                                        </Box>
                                      )}
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                              )
                              
                             
                            
                            })}
                          </Paper> 
                        </Grid>
                        </>

                      )
                    })
                  ):(
                    <>
                    <Grid item xs={12}>
                      <Paper elevation={2} sx={{ borderRadius: '8px', padding: '24px', marginTop: '15px',}}>
                        <Typography variant='body2' letterSpacing={1} gutterBottom sx={{textTransform: 'uppercase', fontWeight: 500, mt:'0.9rem', mb:'0.6rem'}}>
                          No Rooms
                        </Typography>
                      </Paper>
                    </Grid>
                      
                    </>
                  )}
                  
                  </>
                )
              }
              
            </Grid>


            
          </Grid>
          <Grid item xs={12} lg={7}>
              <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '8px'}}>  
                  <BHTenantRegistrationForm
                    details={details}
                    setDetails={setDetails}
                    setSuccessful={setSuccessful}
                    setError={setError}
                    setLoading={setLoading}
                  />
              </Paper>
          </Grid>
        </Grid>
    </Box>
    
  );
};

