'use client'
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { AppBar, Paper, InputBase, Menu, MenuItem, Badge, Box, IconButton, Toolbar, Typography, Avatar, StyledBadge, Tooltip, Breadcrumbs } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import MuiAppBar  from '@mui/material/AppBar';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { UserProfile } from '@clerk/clerk-react';
import { UserButton } from '@clerk/nextjs'
import { signOut } from "next-auth/react";
import { fetchData } from 'next-auth/client/_utils';
import useLogout from '@/app/Authentication/Logout/page';
import NotificationsDialog from '../ComponentLayout/Labraries/NotificationsDialog';


const lightColor = 'rgba(255, 255, 255, 0.7)';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    
    // backgroundColor: alpha(theme.palette.common.black, 0.10), // Semi-transparent background
    // '&:hover': {
    //   backgroundColor: alpha(theme.palette.common.black, 0.1),
    // },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
      width: '40%',
    },
    border: `1px solid ${alpha(theme.palette.common.black, 0.5)}`, // Border color
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: alpha(theme.palette.common.black, 0.5),  // Icon color
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(0.8, 1, 0.8, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
      color: theme.palette.common.black, // Text color
    },
  }));

//   const CustomPage = () => {
//     return (
//       <div>
//         <h1>Custom Profile Page</h1>
//         <p>This is the custom profile page</p>
//       </div>
//     )
//   }
const avatarColors = ['#1976d2', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#3f51b5', '#00bcd4', '#8bc34a'];

const getRandomColor = () => {
    return avatarColors[Math.floor(Math.random() * avatarColors.length)]
}


function Header(props) {
    const router = useRouter();
    const [totalNotif, setTotalNotif] = useState([]);
    const [isNotificationsOpen, setisNotificationsOpen] = useState(false)
    const { onDrawerToggle } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleClick = () => {
        setisNotificationsOpen(!isNotificationsOpen);
    }

   
    const handleLogout = async () => {
        const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
        const userData = JSON.parse(userDataString); // parse the datastring into json 
        const accessToken = userData.accessToken;
        if(accessToken){
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/logout`,{
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
        
                const data = await response.json();
                if(response.ok){
                    await signOut({ redirect: false });
                    localStorage.removeItem('userDetails'); // Clear user data
                    sessionStorage.clear(); // Clear token
                    // Redirect to login page
                    window.location.href = '/';
                }else{
                    console.log('error', response.status);
                }
            }catch(error){
                console.error(error);
            }
        }else{
            console.log('No access token found');
        }
    };

    useEffect(() => {
        const totalNotifications = async() => {
            const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
            const userData = JSON.parse(userDataString); // parse the datastring into json 
            const accessToken = userData.accessToken;
            if(accessToken){
                try{
                    const response = await fetch(`http://127.0.0.1:8000/api/total_notifications`,{
                        method:'GET',
                        headers:{
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
            
                    const data = await response.json();
                    if(response.ok){
                        setTotalNotif(data.count)
                    }else{
                        console.log('error', response.status);
                    }
                }catch(error){
                    console.error(error);
                }
            }else{
                console.log('No access token found');
            }
        }
        totalNotifications();
    }, [])
      
    console.log(totalNotif);
    
    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        >
        <MenuItem>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={4} color="error">
                <MailOutlineIcon />
            </Badge>
            </IconButton>
            <p>Messages</p>
        </MenuItem>
        <MenuItem>
            <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
            onClick={() => handleClick()}
            >
            <Badge badgeContent={17} color="error">
                <NotificationsActiveOutlinedIcon />
            </Badge>
            </IconButton>
            <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            >
            <AccountCircle />
            </IconButton>
            <p>Profile</p>
        </MenuItem>
        </Menu>
    );

    return (
        <React.Fragment>
            <AppBar
                component="div"
                color="primary"
                position="sticky"
                elevation={1}
                sx={ { zIndex: 1000, py: 1.3,  backgroundColor: '#ffffff', backgroundImage: 'none',
                   
                }}
                
            >

            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{  mt:'0.5rem',  display: { xs: 'none', xs: 'block', }} }
                    onClick={onDrawerToggle}
                >
                     <MenuIcon sx={{ display: { lg: 'none' }, backgroundColor: '#8785d0', color: '#ebf2f0', fontSize: '30px', borderRadius: '5px', }}/>
                </IconButton>
               
                <Search>
                    <SearchIconWrapper>
                    <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>
                
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'none', md: 'none', lg: 'flex' } }}>
                    <IconButton size="small" aria-label="show 4 new mails" sx={{mr: '0.1rem', "&:hover": {backgroundColor: '#d9defa'}}}>
                        <Badge badgeContent={4} color="error">
                            <MailOutlineIcon  sx={{color: '#212121', }}/>
                        </Badge>
                    </IconButton>
                    <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                    sx={{mr: '0.3rem', "&:hover": {backgroundColor: '#d9defa'}}}
                    onClick={() => handleClick()}
                    >
                        <Badge badgeContent={totalNotif} color="primary">
                            <NotificationsActiveOutlinedIcon sx={{color: '#212121',}}/>
                        </Badge>
                    </IconButton>
                    <Avatar
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                        sx={{ml: '1.2rem', mt:'0.1rem', width: '37px', height: '37px', }}
                        src="/user.png"
                    >
                        
                    </Avatar>
                    
                </Box>
                
                <Box sx={{ display: { xs: 'flex', md: 'flex', lg: 'none'} }}>
                    <IconButton
                    size="large"
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="primary"
                    >
                    <MoreIcon />
                    </IconButton>
                </Box>
            </Toolbar>
                
                    
            </AppBar>
            {renderMenu}
            {renderMobileMenu}
            <Box
            sx={{
                position: 'fixed', // Changed to fixed for sticky positioning
                top: '64px', // Adjust this value based on your navbar height
                right: '20px',
                zIndex: 1200,
                width:{xs:'315px', sm:'400px', md:'auto', lg:'auto'}
            }}
            >
            {isNotificationsOpen && <NotificationsDialog />}
            </Box>
          
        </React.Fragment>
    );
}

Header.propTypes = {
    onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;
