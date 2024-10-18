'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box,  Breadcrumbs, Link, Grid, Fab, Paper, Tooltip, IconButton, Divider, Button, CardMedia, Skeleton} from '@mui/material';
import AddRoomModal from '../ModalComponent/AddPropertyModal';
import { styled, useTheme, css } from '@mui/system';
import BoardinghouseDetailsTable from '../TableComponent/BoardingHouseDetailsTable';
import BedroomChildOutlinedIcon from '@mui/icons-material/BedroomChildOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import TenantRegistrationForm from '../FormsComponent/BHTenantRegistrationForm';
import SuccessSnackbar from '../Labraries/snackbar';
import ErrorSnackbar from '../Labraries/ErrorSnackbar'
import { SnackbarProvider } from 'notistack';

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
  const [details, setDetails] = useState([]);
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
  }, [])


  

 


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
                      <CardMedia
                        sx={{ height: 150 }}
                        image={details.boardinghouse && details.boardinghouse.image ? `http://127.0.0.1:8000/ApartmentImage/${details.boardinghouse.image}` : ''}
                        title={details.boardinghouse && details.boardinghouse.boarding_house_name && details.boardinghouse.boarding_house_name.caption || 'Image'}
                        // style={{ width: '100%', height: 'auto', objectFit: 'contain',  }}
                      />
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
                                {item.inclusion.name}: {item.quantity}
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
                        <Grid item xs={12} sm={12} lg={6}>
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
                          
                            
                            {Array.from({ length: room.number_of_beds }, (_, index) => index + 1).map((bedNumber) => (
                              <>
                                <Typography variant='body1' gutterBottom>
                                  <strong>Bed {bedNumber}:</strong> Available
                                  <AcceptToolTip title="Add Tenant">
                                    <IconButton>
                                      <AddCircleOutlineOutlinedIcon color='success'/>
                                    </IconButton>
                                  </AcceptToolTip>
                                </Typography>
                                <Divider/>
                              </>
                            ))}
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
        </Grid>
    </Box>
    
  );
};

