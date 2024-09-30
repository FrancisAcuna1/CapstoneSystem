'use client';
import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link'; // Updated import
import { Drawer, Typography, MenuItem, Grid, Box, Divider } from '@mui/material';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import NightShelterOutlinedIcon from '@mui/icons-material/NightShelterOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const { ...other } = props;


  const menuItems = [
    { text: 'Dashboard', Icon: <DashboardCustomizeOutlinedIcon sx={{ mx: '0.1rem', fontSize: 27 }} />, href: '/User/Overview', category: 'Menu' },
    { text: 'Maintenance Request', Icon: <ConstructionOutlinedIcon sx={{ mx: '0.1rem', fontSize: 27 }} />, href: '/User/RequestMaintenance', category: 'Menu' },
    { text: 'Account Balance', Icon: <AccountBalanceWalletOutlinedIcon sx={{ mx: '0.1rem', fontSize: 27 }} />, href: '/User/', category: 'Menu' },
    { text: 'Chatbot', Icon: <SmartToyOutlinedIcon sx={{ mx: '0.1rem', fontSize: 27 }} />, href: '/Landlord/ExpensesTracking', category: 'Menu' },
    { text: 'My Account', Icon: <AccountCircleOutlinedIcon sx={{ mx: '0.1rem', fontSize: 27 }} />, href: '/Landlord/TenantInformation', category: 'User' }
  ];

  const categories = [...new Set(menuItems.map(item => item.category))];
  const isSelected = (itemHref) => {
    // Check if pathname matches the itemHref or if the pathname starts with the itemHref followed by a '/'
    return pathname === itemHref || pathname.startsWith(itemHref + '/');
  };
  // const [selectedIndex, setSelectedIndex] = useState(menuItems.findIndex(item => item.href === pathname) || 0);

  // const handleMenuItemClick = (index, href) => {
  //   setSelectedIndex(index);
  // };

  return (
    <Drawer variant="permanent" {...other}>
      <Grid container alignItems="center" justifyContent="center">
        <Grid item>
          <Image
            src="/logo1.png"
            style={logoStyle}
            alt="proptrack logo"
            width={200}
            height={125}
          />
        </Grid>
        <Grid item>
          <Image
            src="/logotitle.png"
            style={logonameStyle}
            alt="proptrack logo"
            width={300}
            height={100}
          />
        </Grid>
      </Grid>

      <Box sx={{ width: 250, my: '-0.9rem' }} role="presentation">
          {/* <Typography variant='h2' color="text.primary" sx={{ mx: '1.7rem', fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1.5px' }}>
            Navigation
          </Typography>
          */}
        {categories.map((category, index) => (
          <React.Fragment key={index}>
            <Typography variant='h2' color="text.primary" sx={{ mx: '1.7rem', mt:'0.1rem', fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1.5px' }}>
            {category}
            </Typography>
            
            {menuItems.filter(item => item.category === category).map((item, itemIndex) => (
              <Link
                key={itemIndex}
                href={item.href}
                passHref
                style={{ textDecoration: 'none' }} // Remove underline from links
              >
                <MenuItem
                  // selected={selectedIndex === menuItems.findIndex(i => i.href === item.href)}
                  // onClick={() => handleMenuItemClick(menuItems.findIndex(i => i.href === item.href), item.href)}
                  sx={{
                    mx: '0.7rem',
                    my: '0.5rem',
                    backgroundColor:  isSelected(item.href) ? '#9aa3ee' : 'transparent', // Background color when selected
                    color:  isSelected(item.href) ? '#ffffff' : 'text.primary', // Text color
                    borderRadius: '8px',
                    '& .MuiSvgIcon-root': {
                      color:  isSelected(item.href) ? '#ffffff' : 'text.primary', // Icon color when selected
                    },
                    '&:hover': {
                      backgroundColor:  isSelected(item.href) ? '#9aa3ee' : 'rgba(0, 0, 0, 0.08)', // Hover effect
                    },
                  }}
                >
                  {item.Icon}
                  <Typography variant="body2" sx={{ ml: '0.4rem', fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '1px', textAlign: 'center' }}>
                    {item.text}
                  </Typography>
                </MenuItem>
              </Link>
            ))}
           <Box sx={{mt:'2.3rem'}}>
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </Drawer>
  );
}
