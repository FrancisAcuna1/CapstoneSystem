'use client';
import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link'; // Updated import
import { Drawer, Typography, MenuItem, Grid, Box, Divider } from '@mui/material';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import NightShelterOutlinedIcon from '@mui/icons-material/NightShelterOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { color } from 'framer-motion';

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

const dottedLineStyle = {
  borderLeft: '2px dotted #9aa3ee', // Change color as needed
  height: '100%',
  marginRight: '0.5rem',
  color:'black'
};

export default function Navigator(props) {
  const [openDropdown, setOpenDropdown] = useState(false); // State to manage dropdown
  const pathname = usePathname();
  const { ...other } = props;

  const toggleDropdown = () => {
    setOpenDropdown(prev => !prev); // Toggle the dropdown state
  };

  const menuItems = [
    { text: 'Dashboard', Icon: <DashboardCustomizeOutlinedIcon sx={{ mx: '0.4rem', fontSize: 27 }} />, href: '/Landlord/Home', category: 'Menu' },
    { text: 'Property', Icon: <NightShelterOutlinedIcon sx={{ mx: '0.4rem', fontSize: 27 }} />, href: '/Landlord/Property', category: 'Menu' },
    { text: 'Expenses Tracking', Icon: <AssessmentOutlinedIcon sx={{ mx: '0.4rem', fontSize: 27 }} />, href: '/Landlord/ExpensesTracking', category: 'Menu' },
    { text: 'Income Tracking', Icon: <CurrencyExchangeIcon sx={{ mx: '0.4rem', fontSize: 27 }} />, category: 'Menu', href: '/Landlord/IncomeTracking'},
    { text: 'Amenties/Equipment', Icon: <DnsOutlinedIcon sx={{ mx: '0.4rem', fontSize: 27 }} />, href: '/Landlord/Equipment', category: 'Maintenance' },
    { text: 'Maintenance Request', Icon: <ConstructionOutlinedIcon sx={{ mx: '0.4rem', fontSize: 27 }} />, href: '/Landlord/MaintenanceRequest', category: 'Maintenance' },
    { text: 'Appointment Schedule', Icon: <CalendarMonthRoundedIcon sx={{ mx: '0.4rem', fontSize: 27 }} />, href: '/Landlord/ScheduleMaintenance', category: 'Maintenance' },
    { text: 'Status', Icon: <AutorenewOutlinedIcon sx={{ mx: '0.4rem', fontSize: 27 }} />, href: '/Landlord/MaintenanceStatus', category: 'Maintenance' },
    { text: 'Tenant Information', Icon: <AccountCircleOutlinedIcon sx={{ mx: '0.4rem', fontSize: 27 }} />, href: '/Landlord/TenantInformation', category: 'User' }
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
              <React.Fragment key={itemIndex}>
               {/* Revenue Tracking with Dropdown */}
                <Link href={item.href} passHref style={{ textDecoration: 'none' }}>
                  <MenuItem
                    sx={{
                      mx: '0.7rem',
                      my: '0.5rem',
                      width:'100%',
                      backgroundColor: isSelected(item.href) ? '#9aa3ee' : 'transparent',
                      color: isSelected(item.href) ? '#ffffff' : '#212121',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: isSelected(item.href) ? '#9aa3ee' : 'rgba(0, 0, 0, 0.08)',
                      },
                    }}
                  >
                    {item.Icon}
                    <Typography variant="body2" sx={{ ml: '0.4rem', fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 300, fontSize: '0.8rem', letterSpacing: '1px' }}>
                      {item.text}
                    </Typography>
                  </MenuItem>
                </Link>
             </React.Fragment>
            ))}
           <Box sx={{mt:'2.3rem'}}>
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </Drawer>
  );
}
