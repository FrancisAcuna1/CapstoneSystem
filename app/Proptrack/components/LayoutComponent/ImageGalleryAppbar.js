// CustomAppBar.jsx
'use client';
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, styled } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import ToggleColorMode from './ToggleColorMode.js';
import { useRouter } from 'next/navigation.js';
import PropTypes from 'prop-types';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    bgcolor: 'transparent',
    backgroundImage: 'none',
    backgroundColor:
        theme.palette.mode === 'light'
        ? 'rgba(255, 255, 255, 0.4)'
        : 'rgba(0, 0, 0, 0.4)',
    color: theme.palette.text.primary,
    boxShadow: 'none',
    borderBottom: '1px solid',
    borderColor: theme.palette.divider,
    backdropFilter: 'blur(24px)',
    boxShadow:
        theme.palette.mode === 'light'
        ? '0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)'
        : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
}));

const CustomAppBar = ({ mode, toggleColorMode }) => {
    const [mounted, setMounted] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Prevents rendering until the component is mounted
    }

    return (
        <StyledAppBar position="sticky">
        <Toolbar
            variant="regular"
            sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            maxHeight: 40,
            }}
        >
            {/* Left section */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="start" sx={{ mr: 1 }} onClick={() => router.back()}>
                <ArrowBack />
            </IconButton>
            </Box>

            {/* Center section */}
            <Typography
            variant="body1"
            sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                fontWeight: 500,
                letterSpacing: '0.5px',
            }}
            >
            IMAGE GALLERY
            </Typography>

            {/* Right section */}
            <Box sx={{ display: 'flex', gap: 1 }}>
            <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
            </Box>
        </Toolbar>
        </StyledAppBar>
    );
};

CustomAppBar.propTypes = {
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default CustomAppBar;
