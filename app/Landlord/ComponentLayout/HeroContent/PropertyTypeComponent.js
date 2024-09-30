'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box,  Breadcrumbs, Link, Grid, Fab,} from '@mui/material';
import ListofPropertyTable from '../TableComponent/ListofPropertyTable';
import AddPropertyModal from '../ModalComponent/AddPropertyModal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { styled, useTheme, css } from '@mui/system';



const AddButton = styled(Fab)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));


export default function PropertyTypeComponent({propsId}){
  const router = useRouter();
  const id = propsId;
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreate = () => {
    router.push('/FormsComponent/createpropertyform');
    console.log('Success', router);
  }
  

 


  return (
    <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
        <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '5px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
            List of Propreties - id Acuna
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
                <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>List of property</Typography>
            </Breadcrumbs>
        </Grid>
        <Box sx={{mt:'4rem'}}>
        </Box>
        <Grid  container spacing={1} sx={{ mt: '-0.9rem', display:'flex', justifyContent:' center',  }}>
            <Grid item xs={12}>
                <Grid item>
                  {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5, mb: 3 }}>
                    <AddButton variant="extended" aria-label="add" onClick={() =>  router.push('/Landlord/Apartment/[id]/CreateProperty')}>
                      <AddCircleOutlineIcon sx={{ mr: 1 }} />
                      Add Property
                    </AddButton>
                  </Box> */}

                  <AddPropertyModal
                    open={open}
                    handleOpen={handleOpen}
                    handleClose={handleClose}
                    propsId={propsId}
                  />
                </Grid>
                
                <Grid Item>
                  <ListofPropertyTable/> 
                </Grid>
                    
                
            </Grid>

        </Grid>
    </Box>
    
  );
};

