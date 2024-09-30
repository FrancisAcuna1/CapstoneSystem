'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box,  Breadcrumbs, Link, Grid, Fab, Paper, Tooltip, IconButton, Divider, Button} from '@mui/material';
import AddRoomModal from '../ModalComponent/AddPropertyModal';
import { styled, useTheme, css } from '@mui/system';
import BoardinghouseDetailsTable from '../TableComponent/BoardingHouseDetailsTable';
import BedroomChildOutlinedIcon from '@mui/icons-material/BedroomChildOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import TenantRegistrationForm from '../FormsComponent/BHTenantRegistrationForm';


const AcceptToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    '& .MuiTooltip-tooltip': {
      backgroundColor: '#4caf50', // Background color of the tooltip
      color: '#ffffff', // Text color
      borderRadius: '4px',
    },
});

const AddButton = styled(Fab)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const boardingHouse = {
    rooms: [
      {
        roomNumber: '101',
        beds: [
          { bedNumber: 1, status: 'Occupied', tenant: 'Tenant A' },
          { bedNumber: 2, status: 'Vacant', tenant: null },
          { bedNumber: 3, status: 'Occupied', tenant: 'Tenant B' },
        ],
        rentPerBed: 200,
        roomType: 'Shared',
        utilities: ['Water', 'Electricity', 'Wi-Fi'],
      },
      {
        roomNumber: '102',
        beds: [
          { bedNumber: 1, status: 'Occupied', tenant: 'Tenant C' },
          { bedNumber: 2, status: 'Vacant', tenant: null },
        ],
        rentPerBed: 220,
        roomType: 'Shared',
        utilities: ['Water', 'Electricity', 'Wi-Fi'],
      },
    ],
  };

  const RoomDetails = ({ room }) => {
    return (
      <div>
        <h3>Room {room.roomNumber}</h3>
        <p>Room Type: {room.roomType}</p>
        <p>Rent per Bed: ${room.rentPerBed}</p>
        <p>Utilities: {room.utilities.join(', ')}</p>
        <h4>Beds</h4>
        <ul>
          {room.beds.map((bed) => (
            <li key={bed.bedNumber}>
              Bed {bed.bedNumber}: {bed.status}{' '}
              {bed.tenant ? `by ${bed.tenant}` : ''}
            </li>
          ))}
        </ul>
      </div>
    );
  };


export default function BoardingHouseDetailsComponent(){
  const router = useRouter();
//   const postId = params.id;
//   const [open, setOpen] = useState(false);


//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const handleCreate = () => {
//     router.push('/FormsComponent/createpropertyform');
//     console.log('Success', router);
//   }
  

 


  return (
    <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
        <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '5px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
            Details - Acuna Boarding House        
        </Typography>
        <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
            <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                {/* <Typography color="inherit">Navigation</Typography> */}
                <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Home">
                    Home
                </Link>
                <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Property">
                    Property
                </Link>
                <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Property/[propsid]">
                    List Property
                </Link>
                <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Details</Typography>
            </Breadcrumbs>
        </Grid>
        <Box sx={{mt:'4rem'}}>
        </Box>
        <Grid  container spacing={3} sx={{ mt: '-0.9rem', display:'flex',  }}>
          <Grid item xs={12} lg={5}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ borderRadius: '8px', padding: '24px', marginTop: '15px',}}>
                  <Grid container sx={{justifyContent: 'space-between'}}>
                    <Grid item>
                      <Typography variant='h6' letterSpacing={2} sx={{fontWeight: 'bold'}}>
                          Room 1
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Box   sx={{bgcolor: '#8785d0', borderRadius: '8px', height: '55px', padding: '13px', justifyContent: 'center' }}>
                      
                          <BedroomChildOutlinedIcon fontSize={'large'} sx={{color:'white', mt: '-0.2rem'}}/>
                      </Box>
                    </Grid>
                  </Grid>
                  <Typography variant='body1' letterSpacing={1} gutterBottom>
                      <strong>Rent per Bed:</strong> ₱1000.00
                  </Typography>
                  <Typography variant='body1' gutterBottom>
                      <strong>Inclusion:</strong> Water, Electricity, Wi-Fi, Kitchen, Stove, Rice Cooker,
                  </Typography>
                  <Typography variant='body1' gutterBottom>
                      <strong>Bed 1:</strong> Occupied
                  </Typography>
                  <Box display="flex" alignItems="start">
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
                  </Box>
                  <Box display="flex" alignItems="start">
                      <LocationOnOutlinedIcon/>:
                      <Typography variant="body1" gutterBottom sx={{ ml: 1, mt:'0.2rem', fontSize: '16px'}}>
                          Burgos st. Balud Norte, Gubat, Sorsogon
                      </Typography>
                  </Box>
                  <Button variant='contained' color='info' sx={{mb: '0.9rem'}} onClick={() => router.push('/Landlord/Property/[propsid]/occupiedapartment/[id]')}>
                      View Profile
                  </Button>
                  <Divider/>
                  <Typography variant='body1' gutterBottom  sx={{color:'green'}}>
                      <strong  style={{color: 'black'}}>Bed 2:</strong> Available 
                      <AcceptToolTip title="Add Tenant">
                          <IconButton>
                              <AddCircleOutlineOutlinedIcon color='success'/>
                          </IconButton>
                      </AcceptToolTip>
                  </Typography>
                  <Divider/>
                  <Typography variant='body1' gutterBottom sx={{color:'green'}}>
                      <strong style={{color: 'black'}}>Bed 3:</strong> Available
                      <AcceptToolTip title="Add Tenant">
                          <IconButton>
                              <AddCircleOutlineOutlinedIcon color='success'/>
                          </IconButton>
                      </AcceptToolTip>
                  </Typography>
                </Paper> 
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ borderRadius: '8px', padding: '24px', marginTop: '15px',}}>
                  <Grid container sx={{justifyContent: 'space-between'}}>
                    <Grid item>
                      <Typography variant='h6' letterSpacing={2} sx={{fontWeight: 'bold'}}>
                          Room 2
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Box   sx={{bgcolor: '#8785d0', borderRadius: '8px', height: '55px', padding: '13px', justifyContent: 'center' }}>
                      
                          <BedroomChildOutlinedIcon fontSize={'large'} sx={{color:'white', mt: '-0.2rem'}}/>
                      </Box>
                    </Grid>
                  </Grid>
                  <Typography variant='body1' letterSpacing={1} gutterBottom>
                      <strong>Rent per Bed:</strong> ₱1000.00
                  </Typography>
                  <Typography variant='body1' gutterBottom>
                      <strong>Inclusion:</strong> Water, Electricity, Wi-Fi, Kitchen, Stove, Rice Cooker,
                  </Typography>
                  <Typography variant='body1' gutterBottom>
                      <strong>Bed 1:</strong> Occupied
                  </Typography>
                  <Box display="flex" alignItems="start">
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
                  </Box>
                  <Box display="flex" alignItems="start">
                      <LocationOnOutlinedIcon/>:
                      <Typography variant="body1" gutterBottom sx={{ ml: 1, mt:'0.2rem', fontSize: '16px'}}>
                          Burgos st. Balud Norte, Gubat, Sorsogon
                      </Typography>
                  </Box>
                  <Button variant='contained' color='info' sx={{mb: '0.9rem'}} onClick={() => router.push('/Landlord/Property/[propsid]/occupiedapartment/[id]')}>
                      View Profile
                  </Button>
                  <Divider/>
                  <Typography variant='body1' gutterBottom  sx={{color:'green'}}>
                      <strong  style={{color: 'black'}}>Bed 2:</strong> Available 
                      <AcceptToolTip title="Add Tenant">
                          <IconButton>
                              <AddCircleOutlineOutlinedIcon color='success'/>
                          </IconButton>
                      </AcceptToolTip>
                  </Typography>
                  <Divider/>
                  <Typography variant='body1' gutterBottom sx={{color:'green'}}>
                      <strong style={{color: 'black'}}>Bed 3:</strong> Available
                      <AcceptToolTip title="Add Tenant">
                          <IconButton>
                              <AddCircleOutlineOutlinedIcon color='success'/>
                          </IconButton>
                      </AcceptToolTip>
                  </Typography>
                </Paper> 
              </Grid>
            </Grid>


            
          </Grid>
          <Grid item xs={12} lg={7}>
              <Paper elevation={3} style={{ padding: '25px', marginTop: '15px', borderRadius: '8px'}}>  
                  <TenantRegistrationForm/>
              </Paper>
          </Grid>
        </Grid>
    </Box>
    
  );
};

