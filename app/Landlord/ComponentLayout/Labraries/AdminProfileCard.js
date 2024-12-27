import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsIcon from "@mui/icons-material/Settings";
import useSWR from "swr";


const fetchAdminInfo = async([url, token]) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    if(!response.ok){
        throw new Error(response.statusText)
    }
    return response.json()
}

export default function AdminProfileCard({ avatarSrc, handleLogout, userId, userToken}) {
    const router = useRouter();
    const [admin, setAdmin] = useState([]);
    console.log(avatarSrc);
    console.log(admin)
    const {data: response, error} = useSWR(
        userToken && userId ? [`http://127.0.0.1:8000/api/tenant_information/${userId}`, userToken] : null, 
        fetchAdminInfo, {
            refreshInterval: 10000,
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            errorRetryCount: 3,
        }
    )
    useEffect(() => {
        if(response?.data){
            setAdmin(response?.data || '')
        }
    }, [response])

    const getCurrentTimeOfDay = () => {
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12) {
            return "Good Morning";
        }else if(currentHour < 18) {
            return "Good Afternoon";
        }else {
            return "Good Evening";
        }
    }
    console.log(getCurrentTimeOfDay())

    const handleViewProfile = () => {
        router.push('/Landlord/Profile')
    }


    // const getInitials = (firstName, lastName) => {
    //     if (typeof firstName !== 'string' || typeof lastName !== 'string') {
    //       return ''; // Return empty string if not valid
    //     }
    //     const firstInitial = firstName.charAt(0).toUpperCase();
    //     const lastInitial = lastName.charAt(0).toUpperCase();
    //     return `${firstInitial}${lastInitial}`;
    // };
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
                {admin.firstname} {admin.lastname}
            </Typography>
            <Typography
                variant="subtitle1"
                sx={{
                color: "rgba(255,255,255,0.7)",
                mb: 1,
                fontWeight: 300,
                }}
            >
                {getCurrentTimeOfDay()}, {admin.firstname}!
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection:'column', gap: 1 }}>
                <Button
                    onClick={handleViewProfile}
                    variant="contained"
                    sx={{
                    mt: 2,
                    mb: 1,
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
                    <SettingsIcon sx={{ fontSize: 20 }} />
                    Profile
                </Button>
                <Button
                    onClick={handleLogout}
                    variant="contained"
                    sx={{
                    mt: 1,
                    mb: 1,
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
            </Box>
        </CardContent>
        </Card>
    );
}
