'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Typography, Box,  Breadcrumbs, Link, Grid, Fab, Paper, Tooltip, IconButton, Divider, Button, CardMedia, Skeleton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Backdrop, CircularProgress} from '@mui/material';
import { styled, useTheme, css } from '@mui/system';
import BedroomChildOutlinedIcon from '@mui/icons-material/BedroomChildOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
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


export default function OccupiedBoardinghouse({boardinghouseId, propsId, loading, setLoading}){
  const router = useRouter();
  const boardinghouseID = boardinghouseId; // boardinghouse ID
  const propsID = propsId // property ID
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDeleteTenant, setSelectedDeleteTenant] = useState({ id: null });
  const [details, setDetails] = useState([]);
  const [tenantInfo, setTenantInfo] = useState([]); 
  const propertyType = details?.boardinghouse?.property_type;
  
  console.log('baordinghouse ID:', boardinghouseID )
  console.log('property ID:', propsID )
  console.log('Details:', details);
  

  
  useEffect(() => {
    const fetchedData = async () => {
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
                
                    // setInclusions(data);
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
        
    }
    fetchedData();
  }, [boardinghouseID, propsID, setLoading])


   //this fetch function is to get the tenant info
   useEffect(() => {
    const fetchTenantInfo = async () => {
      const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json
      const accessToken = userData.accessToken;
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
    }
    fetchTenantInfo();
  }, [propertyType, boardinghouseID])

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

  console.log('id', selectedDeleteTenant)
  const handleClickOpen = (id) => {
      setSelectedDeleteTenant({id});
      setOpen(true);

  };
  const handleClose = () => {
      setOpen(false);
  };

  const handleDelete = async() => {
      const {id} = selectedDeleteTenant;
      console.log(id);
      
      const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json 
      const accessToken = userData.accessToken;

      if(accessToken){
          try{
              setDeleting(true);
              const response = await fetch(`http://127.0.0.1:8000/api/remove_tenant_occupancy/${id}`, {
                  method: 'DELETE',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${accessToken}`
                  }
              })

              const data = await response.json()

              if(response.ok){
                  localStorage.setItem('successMessage', data.message || 'Operation successful!');
                  window.history.back();
              }else{
                  console.log('Error:', response.status)
                  if(data.error)
                  {
                      console.log(data.error) // for empty field
                  }else{
                      localStorage.setItem('errorMessage', data.message || 'Operation Error!');
                      window.location.reload();
                      // console.log(data.message); // for duplicate entry
                      // setError(data.message);
                      handleClose();
                  }
              }

          }catch(error){
              console.log('Error:', error)
          }
      }else{
          localStorage.setItem('errorMessage', 'Please login to perform this action!');
      }
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
            Occupied - {details.boardinghouse.boarding_house_name}        
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
                        <Typography variant='body2' letterSpacing={1.2} gutterBottom sx={{ fontWeight: 500, }}>
                          Rooms: {details.boardinghouse.number_of_rooms}
                        </Typography>
                        <Typography variant='body2' letterSpacing={1.2} gutterBottom sx={{ fontWeight: 500, }}>
                          Status: {details.boardinghouse.status}
                        </Typography>
                        <Typography variant='body2' letterSpacing={1.2} gutterBottom sx={{ fontWeight: 500, }}>
                          Inclusion -
                        </Typography>
                        {details.boardinghouse.inclusions && details.boardinghouse.inclusions.length > 0 ? (
                          details.boardinghouse.inclusions.map((item, index) => (
                            <Typography key={item.index} variant='body2' letterSpacing={2} gutterBottom sx={{ fontWeight: 500, }}>
                                {item.equipment.name}: {item.quantity}
                            </Typography>
                          ))
                        ):(
                          <>
                          <Typography variant='body2' letterSpacing={2} gutterBottom sx={{ fontWeight: 500, }}>
                            No Included Inclusion 
                          </Typography>
                          </>
                        )}

                        </>
                      )}
                      
                      </>
                    )
                }
              </Paper>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
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
                      <Grid item xs={12} sm={12} lg={12}>
                        <Paper elevation={2} sx={{ borderRadius: '8px', padding: '24px', marginTop: '15px',}}>
                          <Grid container sx={{justifyContent: 'space-between'}}>
                            <Grid item>
                              <Typography variant='h6' letterSpacing={2} sx={{fontWeight: 'bold', textTransform: 'uppercase',}}>
                                  Room: {room.room_number}
                              </Typography>
                              <Typography variant='body2' letterSpacing={1} gutterBottom sx={{textTransform: 'uppercase', fontWeight: 500, mt:'0.9rem', mb:'0.6rem'}}>
                                <strong>Rent per Bed:</strong> ₱1000.00
                              </Typography>
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
                            <Box key={bedIndex}>
                              {bed.status.toLowerCase() === "available" ? (
                                <Typography color={'#4caf50'} variant='body1'  gutterBottom>
                                <strong style={{color:'#263238'}}>Bed {bed.bed_number} </strong> | <strong style={{color:'#263238'}}>type: {bed.bed_type}</strong> | {bed.status} 
                                <AcceptToolTip title="Add Tenant">
                                  <IconButton>
                                    <AddCircleOutlineOutlinedIcon color='success'/>
                                  </IconButton>
                                </AcceptToolTip>
                                </Typography>
                              ):(
                                <>
                                <Typography  variant='body1' color={'#a55555'} sx={{mt:'0.9rem', mb: '1rem'}} gutterBottom>
                                <strong style={{color:'#263238'}}>Bed {bed.bed_number} </strong> | {bed.status}
                                {tenant && (
                                  <>
                                  <Box display="flex" alignItems="start">
                                    <PersonOutlinedIcon sx={{color:'#263238'}}/>:
                                    <Typography variant="body1" color={'#263238'} gutterBottom sx={{ ml: 1, mt:'0.2rem', fontSize: '16px'}}>
                                        {tenant.tenant.firstname} {tenant.tenant.lastname}
                                    </Typography>
                                  </Box>
                                  <Box display="flex" alignItems="start">
                                    <CallOutlinedIcon sx={{color:'#263238'}}/>:
                                    <Typography variant="body1" color={'#263238'} gutterBottom sx={{ ml: 1, mt:'0.2rem', fontSize: '16px'}}>
                                        {tenant.tenant.contact}
                                    </Typography>
                                  </Box> 
                                  <Box display="flex" alignItems="start">
                                    <LocationOnOutlinedIcon sx={{color:'#263238'}}/>:
                                    <Typography variant="body1" color={'#263238'} gutterBottom sx={{ ml: 1, mt:'0.2rem', fontSize: '16px'}}>
                                        {tenant.tenant.street} st. {tenant.tenant.barangay}, {tenant.tenant.municipality}
                                    </Typography>
                                  </Box>

                                  <Button 
                                  variant='contained' 
                                  size='small' 
                                  sx={{padding: '4px 4px', ml:1, mt:0.1}} 
                                  onClick={() => handleClick(tenant?.tenant_id)}
                                  disabled={!tenant?.id}
                                  >
                                    View 
                                  </Button>
                                  <Button 
                                  variant='contained' 
                                  color='warning'
                                  size='small' 
                                  sx={{padding: '4px 4px', ml:1, mt:0.1}} 
                                  onClick={() => handleClickOpen(tenant?.tenant?.id)}
                                  disabled={!tenant?.id}
                                  >
                                    Remove 
                                  </Button>
                                  
                                  </>
                                  
                                  
                                )}
                                </Typography>
                                <Divider/>
                                </>
                              ) 
                              }
                              
                              
                            </Box>
                            )
                              
                             
                            
                          })}
                          {/* This Comment code is display when the bed is occupied */}
                          {/* {Array.from({ length: room.number_of_beds }, (_, index) => index + 1).map((bedNumber) => (
                            <>
                              <Typography variant='body1' gutterBottom>
                                <strong>Bed {bedNumber}:</strong> {bedNumber <= occupiedBeds ? 'Occupied' : 'Available'}
                                {bedNumber <= occupiedBeds ? (
                                  <>
                                    <PersonOutlinedIcon />: John Doe
                                  </>
                                ) : (
                                  <AcceptToolTip title="Add Tenant">
                                    <IconButton>
                                      <AddCircleOutlineOutlinedIcon color='success'/>
                                    </IconButton>
                                  </AcceptToolTip>
                                )}
                              </Typography>
                            </>
                          ))} */}
                          {/* <Box display="flex" alignItems="start">
                              <PersonOutlinedIcon />:
                              <Typography variant="body1" gutterBottom sx={{ ml: 1, mt:'0.2rem', fontSize: '16px'}}>
                                  John Doe
                              </Typography>
                          </Box>
                          <Box display="flex" alignItems="start">
                              <CallOutlinedIcon />:
                              <Typography variant="body1" gutterBottom sx={{ ml: 1, mt:'0.2rem', fontSize: '16px'}}>
                                  09092923190
                              </Typography>
                          </Box> */}
                          {/* <Box display="flex" alignItems="start">
                              <LocationOnOutlinedIcon/>:
                              <Typography variant="body1" gutterBottom sx={{ ml: 1, mt:'0.2rem', fontSize: '16px'}}>
                                  Burgos st. Balud Norte, Gubat, Sorsogon
                              </Typography>
                          </Box>
                          <Button variant='contained' color='info' sx={{mb: '0.9rem'}} onClick={() => router.push('/Landlord/Property/[propsid]/occupiedapartment/[id]')}>
                              View Profile
                          </Button> */}
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
        <React.Fragment>
          <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          >
          <DialogTitle id="delete-dialog-title">
              Confirm Deletion
          </DialogTitle>
          <DialogContent>
              <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this item? This action cannot be undone.
              </DialogContentText>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleClose} color="primary">
              Cancel
              </Button>
              <Button onClick={handleDelete} color="error" variant="contained">
              Delete
              </Button>
          </DialogActions>
          </Dialog>

          <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={deleting}
          >
          <CircularProgress color="inherit" />
          </Backdrop>
      </React.Fragment>
       
    </Box>
    
  );
};



