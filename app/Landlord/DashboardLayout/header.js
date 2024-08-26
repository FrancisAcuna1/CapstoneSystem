'use client'
import * as React from 'react';
import PropTypes from 'prop-types';
import { AppBar, InputBase, Menu, MenuItem, Badge, Box, IconButton, Toolbar, Avatar, StyledBadge, Tooltip, Breadcrumbs } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import MoreIcon from '@mui/icons-material/MoreVert';
import MuiAppBar  from '@mui/material/AppBar';

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
      marginLeft: theme.spacing(3),
      width: 'auto',
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




function Header(props) {
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
        <MenuItem onClick={() => router.push('/')}>Log out</MenuItem>
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
                <MailIcon />
            </Badge>
            </IconButton>
            <p>Messages</p>
        </MenuItem>
        <MenuItem>
            <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
            >
            <Badge badgeContent={17} color="error">
                <NotificationsIcon />
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
                sx={ { zIndex: 1, py: 1.3,  backgroundColor: '#ebf2f0', backgroundImage: 'none',
                   
                }}
                
            >
                <Toolbar
                  >
                    <Grid container alignItems="center">
                        <Grid item sx={{display: { xs: 'none', xs: 'block' }}}>
                            <IconButton
                        
                                aria-label="open drawer"
                                onClick={onDrawerToggle}
                                edge="start"
                                sx={{ display: { sm: 'none' }, }}
                            >
                                <MenuIcon sx={{backgroundColor: '#8785d0', color: '#ebf2f0', fontSize: '30px', borderRadius: '5px'}}/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={4}>
                            <Search >
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                        </Grid>
                        <Grid item xs={2} lg={3}>

                        </Grid>
                        <Grid item xs={3} sm={4} md={4} lg={5}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: '0.1rem'}}>
                                <Box sx={{mx: '1.4rem', mt:'0.5rem'}}>
                                    <Badge badgeContent={4} color="error">
                                        <MailIcon color='primary' sx={{fontSize: '25px'}}/>
                                    </Badge>
                                </Box>
                                <Box sx={{mr: '0.9rem', mt:'0.5rem'}}>
                                    <Badge badgeContent={17} color="error">
                                        <NotificationsIcon color='primary' sx={{ fontSize: '25px'}}/>
                                    </Badge>
                                </Box>
                                {/* <IconButton size="large" aria-label="show 4 new mails" sx={{mx: '0.4rem', color:"#eaeff1"}}>
                                    <Badge badgeContent={4} color="error">
                                        <MailIcon />
                                    </Badge>
                                </IconButton> */}
                                {/* <IconButton size="large" aria-label="show 17 new notifications" sx={{color:"#eaeff1"}} >
                                    <Badge badgeContent={17} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton> */}
                                <Avatar
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                    sx={{ml: '1.2rem', mt:'0.1rem', width: '37px', height: '37px' }}
                                    src="/user.png"
                                >
                                    
                                </Avatar>
                            
                                
                            
                            </Box>
                        </Grid>
                    </Grid>
                    {renderMenu}
            {renderMobileMenu}
                </Toolbar>
            </AppBar>
            
        </React.Fragment>
    );
}

Header.propTypes = {
    onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;