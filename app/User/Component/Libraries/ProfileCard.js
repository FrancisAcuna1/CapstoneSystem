import React from "react";
import {
  Avatar,
  Box,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function UserProfile({ avatarSrc, tenantInformation, handleLogout}) {
    console.log(avatarSrc);
    console.log(tenantInformation)
    const getInitials = (firstName, lastName) => {
        if (typeof firstName !== 'string' || typeof lastName !== 'string') {
          return ''; // Return empty string if not valid
        }
        const firstInitial = firstName.charAt(0).toUpperCase();
        const lastInitial = lastName.charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
      };
    console.log(getInitials(tenantInformation.firstname, tenantInformation.lastname))
    return (
        <Card
        sx={{
            width: 350,
            height: "auto",
            borderRadius: 1,
            boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
            textAlign: "center",
            background: "linear-gradient(145deg, #8E49E6, #6A1B9A)",
            position: "relative",
            overflow: "visible",
            transition: "transform 0.3s ease",
            // '&:hover': {
            //   transform: 'translateY(-10px)',
            //   boxShadow: '0 16px 32px rgba(0,0,0,0.16)'
            // }
        }}
        >
        <CardContent sx={{ px: 4, pt: 6, pb: 4 }}>
            <Avatar
            src={avatarSrc}
            // alt={getInitials(tenantInformation.lastname)}
            sx={{
                width: 110,
                height: 110,
                mx: "auto",
                mb: 3,
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                border: "4px solid white",
                position: "absolute",
                top: 25,
                left: 0,
                right: 0,
                margin: "auto",
                transition: "transform 0.3s ease",
                "&:hover": {
                transform: "scale(1.05)",
                },
                backgroundColor: 'primary.main',
            }}
            />
            <Box sx={{ mt: 8 }}>
            <Typography
                variant="h5"
                sx={{
                fontWeight: 600,
                mb: 1,
                mt: 14,
                color: "white",
                letterSpacing: 0.5,
                }}
            >
                {tenantInformation.firstname} {tenantInformation.lastname}
            </Typography>
            <Typography
                variant="subtitle1"
                sx={{
                color: "rgba(255,255,255,0.7)",
                mb: 3,
                fontWeight: 300,
                }}
            >
                Welcome to your elegant profile
            </Typography>
            <Button
                onClick={handleLogout}
                variant="contained"
                sx={{
                mt: 2,
                mb:1,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: "none",
                background: "white",
                color: "#6A1B9A",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                    background: "#F3E5F5",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
                    transform: "translateY(-2px)",
                },
                }}
            >
                <ExitToAppIcon sx={{ fontSize: 20 }} />
                Logout
            </Button>
            </Box>
        </CardContent>
        </Card>
    );
}
