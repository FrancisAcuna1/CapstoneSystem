'use client'
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {Drawer, Typography, MenuItem, Grid, Box} from '@mui/material';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import NightShelterOutlinedIcon from '@mui/icons-material/NightShelterOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Image from 'next/image';



const logoStyle = {
  width: '150px',
  cursor: 'pointer',
  marginLeft: '-1.5rem',
  marginTop: '-1rem'
};

const logonameStyle = {
  width: '150px',
  height: '120px',
  cursor: 'pointer',
  marginTop: '-0.5rem',
  marginLeft: '-3rem',
};
 


export default function Navigator(props) {
  const { ...other } = props;
  const [selectedindex, setSelectedIndex] = useState(1);
  // const router = useRouter();
  // const [activeTab, setActiveTab] = useState('');

  const handleMenuItemClick = (index) => {
    setSelectedIndex(index)
    // setActiveTab(href)
  }
  console.log(selectedindex)



  // const menuitems = [
  //   {text: 'Dashboard', Icon: <DashboardCustomizeOutlinedIcon sx={{ fontSize: 27 }} />, href: './content.js'},
  //   {text: 'Apartment', Icon:  <NightShelterOutlinedIcon sx={{ mx: '0.4rem', fontSize: 27 }} />, link: './about.js'},
  //   {text: 'Expenses Tracking', Icon:  <AssessmentOutlinedIcon sx={{ mx: '0.4rem', fontSize: 27  }} />, link: './about.js'},
  //   {text: 'Maintenance Request', Icon: <ConstructionOutlinedIcon sx={{ mx: '0.4rem', fontSize: 27 }} />, link: './about.js'},
  //   {text: 'Add Maintenance ', Icon: <AddCircleOutlineRoundedIcon sx={{ mx: '0.4rem', fontSize: 27 }} />, link: './about.js'},
  //   {text: 'Schedule of Maintenance', Icon: <CalendarMonthRoundedIcon sx={{ mx: '0.4rem', fontsize:'27px' }} />, link: './about.js'},
  //   {text: 'Register Tenant', Icon: <GroupAddOutlinedIcon sx={{ mx: '0.4rem', fontsize:'27px' }} />, link: './about.js'},
  //   {text: 'User Account', Icon: <AccountCircleOutlinedIcon sx={{ mx: '0.4rem', fontsize:'27px' }} />, link: './about.js'}
  // ]

  // console.log(menuitems)

  return (
    <Drawer  variant="permanent" {...other}>
       <Grid container alignItems="center" justifyContent="center">
            <Grid item>
                <Image
                    src="/logo1.png" 
                    style={logoStyle}
                    alt="proptrack logo" 
                    width={200}  // Replace with your desired width
                    height={125} // Replace with your desired height
                />
            </Grid>
            <Grid item>
                <Image
                    src="/logotitle.png" 
                    style={logonameStyle}
                    alt="proptrack logo" 
                    width={300}  // Replace with your desired width
                    height={100} // Replace with your desired height
                />
            </Grid>
        </Grid>

      <Box
        sx={{ width: 250, my:'-0.9rem'}}
        role="presentation"
      > 
        <Typography variant='h2' color="text.primary" sx={{ mx: '1.7rem', fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1.5px' }}>
        Navigation
        </Typography>
          <MenuItem 
            selected={selectedindex === 1}
            onClick={() => handleMenuItemClick(1)}
            component={Link}
            href="/Landlord/Home"
            
           
            sx={{
  	          mx: '0.7rem',
  	          my: '0.8rem',
  	          '&.Mui-selected': {
  	            backgroundColor: '#9aa3ee', // Secondary Color as background when selected
  	            color: '#ffffff',            // White text color for contrast
  	            borderRadius: '8px',
  	          },
  	          '&.Mui-selected .MuiSvgIcon-root': {
  	            color: '#ffffff',            // White icon color when selected
  	          },
              
  	        }}
              
          
          >
              <DashboardCustomizeOutlinedIcon sx={{ mx: '0.4rem', fontSize: 27 }} />
              <Typography variant="body2" sx={{ml:'0.4rem',  fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1px', textAlign: 'center' }}>
                  Dashboard
              </Typography>
          </MenuItem>

          <MenuItem 
            selected={selectedindex === 2}
            onClick={() => handleMenuItemClick(2)}
            component={Link}
            href="/Landlord/Apartment"
            
            sx={{
  	          mx: '0.7rem',
  	          my: '0.8rem',
  	          '&.Mui-selected': {
  	            backgroundColor: '#9aa3ee', // Secondary Color as background when selected
  	            color: '#ffffff',            // White text color for contrast
  	            borderRadius: '8px',
  	          },
  	          '&.Mui-selected .MuiSvgIcon-root': {
  	            color: '#ffffff',            // White icon color when selected
  	          },
              
  	        }}
          >
              <NightShelterOutlinedIcon sx={{ mx: '0.4rem', fontSize: 27 }} />
              <Typography variant="body2" sx={{ml:'0.4rem',  fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1px', textAlign: 'center' }}>
                  Apartment
              </Typography>
          </MenuItem>

          <MenuItem
            component={Link}
            href='#'
            selected={selectedindex === 3}
            onClick={() => handleMenuItemClick(3)}
            sx={{
  	          mx: '0.7rem',
  	          my: '0.8rem',
  	          '&.Mui-selected': {
  	            backgroundColor: '#9aa3ee', // Secondary Color as background when selected
  	            color: '#ffffff',            // White text color for contrast
  	            borderRadius: '8px',
  	          },
  	          '&.Mui-selected .MuiSvgIcon-root': {
  	            color: '#ffffff',            // White icon color when selected
  	          },
              
  	        }}
          >
              <AssessmentOutlinedIcon sx={{ mx: '0.4rem', fontSize: 27  }} />
              <Typography variant="body2" sx={{ml:'0.4rem',  fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1px', textAlign: 'center' }}>
                  Expenses Tracking
              </Typography>
          </MenuItem>

          <Typography variant='h2' color="text.primary" sx={{mt:'2.5rem', mx: '1.7rem', fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1.5px' }}>
          Maintenance 
          </Typography>

          <MenuItem 
            component={Link}
            href='/Landlord/MaintenanceRequest'
            selected={selectedindex === 4}
            onClick={() => handleMenuItemClick(4)}
            sx={{
  	          mx: '0.7rem',
  	          my: '0.8rem',
  	          '&.Mui-selected': {
  	            backgroundColor: '#9aa3ee', // Secondary Color as background when selected
  	            color: '#ffffff',            // White text color for contrast
  	            borderRadius: '8px',
  	          },
  	          '&.Mui-selected .MuiSvgIcon-root': {
  	            color: '#ffffff',            // White icon color when selected
  	          },
              
  	        }}
          >
              <ConstructionOutlinedIcon sx={{ mx: '0.4rem', fontSize: 27 }} />
              <Typography variant="body2"  sx={{ml:'0.4rem',  fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1px', textAlign: 'center' }}>
                  Maintenance Request
              </Typography>
          </MenuItem>

          {/* <MenuItem
            component={Link}
            href='/Landlord/CreateMaintenanceTask'
            selected={selectedindex === 5}
            onClick={() => handleMenuItemClick(5)}
            sx={{
  	          mx: '0.7rem',
  	          my: '0.8rem',
  	          '&.Mui-selected': {
  	            backgroundColor: '#9aa3ee', // Secondary Color as background when selected
  	            color: '#ffffff',            // White text color for contrast
  	            borderRadius: '8px',
  	          },
  	          '&.Mui-selected .MuiSvgIcon-root': {
  	            color: '#ffffff',            // White icon color when selected
  	          },
              
  	        }}
          >
              <AddCircleOutlineRoundedIcon sx={{ mx: '0.4rem', fontSize: 27 }} />
              <Typography variant="body2"  sx={{ml:'0.4rem',  fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1px', textAlign: 'center' }}>
                  Add Maintenance 
              </Typography>
          </MenuItem> */}

          <MenuItem
            component={Link}
            href='/Landlord/CreateMaintenanceTask'
            selected={selectedindex === 5} 
            onClick={() => handleMenuItemClick(5)}
            sx={{
  	          mx: '0.7rem',
  	          my: '0.8rem',
  	          '&.Mui-selected': {
  	            backgroundColor: '#9aa3ee', // Secondary Color as background when selected
  	            color: '#ffffff',            // White text color for contrast
  	            borderRadius: '8px',
  	          },
  	          '&.Mui-selected .MuiSvgIcon-root': {
  	            color: '#ffffff',            // White icon color when selected
  	          },
              
  	        }}
          >
              <CalendarMonthRoundedIcon sx={{ mx: '0.4rem', fontsize:'27px' }} />
              <Typography variant="body2"  sx={{ml:'0.4rem',  fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1px', textAlign: 'center' }}>
                  Maintenance Schedule
              </Typography>
          </MenuItem>

          <Typography variant='h2' color="text.primary" sx={{mt:'2.3rem', mx: '1.7rem', fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1.5px' }}>
          Users 
          </Typography>
          <MenuItem
            component={Link}
            href='#'
            selected={selectedindex === 7}
            onClick={() => handleMenuItemClick(7)}
            sx={{
  	          mx: '0.7rem',
  	          my: '0.8rem',
  	          '&.Mui-selected': {
  	            backgroundColor: '#9aa3ee', // Secondary Color as background when selected
  	            color: '#ffffff',            // White text color for contrast
  	            borderRadius: '8px',
  	          },
  	          '&.Mui-selected .MuiSvgIcon-root': {
  	            color: '#ffffff',            // White icon color when selected
  	          },
              
  	        }}
          >
              <GroupAddOutlinedIcon sx={{ mx: '0.4rem', fontsize:'27px' }} />
              <Typography variant="body2"   sx={{ml:'0.4rem', fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1px', textAlign: 'center' }}>
                  Register Tenant
              </Typography>
          </MenuItem>
          <MenuItem
            component={Link}
            href='#'
            selected={selectedindex === 8}
            onClick={() => handleMenuItemClick(8)}
            sx={{
  	          mx: '0.7rem',
  	          my: '0.8rem',
  	          '&.Mui-selected': {
  	            backgroundColor: '#9aa3ee', // Secondary Color as background when selected
  	            color: '#ffffff',            // White text color for contrast
  	            borderRadius: '8px',
  	          },
  	          '&.Mui-selected .MuiSvgIcon-root': {
  	            color: '#ffffff',            // White icon color when selected
  	          },
              
  	        }}
          >
              <AccountCircleOutlinedIcon sx={{ mx: '0.4rem', fontsize:'27px' }} />
              <Typography variant="body2"  sx={{ml:'0.4rem', fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1px', textAlign: 'center' }}>
                  List of Tenant
              </Typography>
          </MenuItem>
      </Box>
    </Drawer>
  );
}