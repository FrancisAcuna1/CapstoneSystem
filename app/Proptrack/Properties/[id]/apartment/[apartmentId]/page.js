"use client"
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppAppBar from "../../../../components/LayoutComponent/Appbar";
import PropTypes from 'prop-types';
import {CssBaseline, ToggleButtonGroup, ToggleButton, Box, Grid, Typography, LinearProgress} from '@mui/material';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getLPTheme from "../../../../components/LayoutComponent/getLPTheme";
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import ApartmentGalleryComponent from "../../../../components/HeroComponent/ApartmentGalleryImageComponent";
import CustomAppBar from "../../../../components/LayoutComponent/ImageGalleryAppbar";
import '@fontsource/poppins';
import '@fontsource/montserrat'; // Add this import

export default function GalleryPage() {
    const params = useParams();
    const apartmentId = params.apartmentId;
    const propsId = params.id;
    const [loading, setLoading] = useState(false);
    console.log('id:', apartmentId);
    console.log('prop:', propsId);
    
    
    const [mode, setMode] = React.useState('light');
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);

    // Updated theme creation with Montserrat font
    const defaultTheme = createTheme({
    typography: {
        fontFamily: [
        'Poppins',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        ].join(','),
    },
    palette: {
        mode 
    },
    });


    const toggleColorMode = () => {
        setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const toggleCustomTheme = () => {
        setShowCustomTheme((prev) => !prev);
    };

    return (
    <ThemeProvider theme={showCustomTheme ? defaultTheme : defaultTheme}>
        <CssBaseline />
        {/* <AppAppBar mode={mode} toggleColorMode={toggleColorMode} /> */}
        {loading && <LinearProgress color='secondary' sx={{ position: 'absolute',  zIndex: 2100, top: 0, left: 0, right: 0, height: 4, borderRadius: '4px 4px 0 0' }} />}
        <CustomAppBar  mode={mode} toggleColorMode={toggleColorMode} />
        <ApartmentGalleryComponent
            loading={loading}
            setLoading={setLoading}
            apartmentId={apartmentId}       
            propsId={propsId}
        />
        <Box sx={{ bgcolor: 'background.default' }}>
        <Grid container justifyContent="space-between" sx={{ padding: '0 20px' }}>
            
            <Grid item>
            

            {/* Add any content here */}
            </Grid>
            {/* <Grid item>
            <Chatbot />
            </Grid> */}
        </Grid>
        </Box>
        
    </ThemeProvider>
    );

}