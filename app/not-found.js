'use client'
import React, { useState, useEffect} from "react"
import { useRouter } from "next/navigation"
import { Box, Typography, Button, Container } from "@mui/material"
import Image from "next/image"

export default function UnauthorizedPage(){
    const router = useRouter();
    const [role, setRole] = useState([])

     useEffect(() => {
        const userDataString = localStorage.getItem("userDetails");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          if (userData && userData.user.role) {
            setRole(userData.user.role);
          }
        }
      }, []);
    // const getUserRole = () => {
    //     const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
    //     const userData = JSON.parse(userDataString); // parse the datastring into json
    //     const userRole = userData.user.role;
    //     return userRole;
    // };
    // const role = getUserRole();
    // console.log(role);
    const handleGoHome = () => {
        router.push(`/${role}/Home`);
    }

    return (
        <Container 
            maxWidth="md" 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '95vh',
                textAlign: 'center',
                py: 4
            }}
        >
            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3
                }}
            >
                <Image
                    src='/404-error.png'
                    alt='404 Error'
                    width={500}
                    height={500}
                    style={{
                        maxWidth: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                        filter: 'grayscale(20%) opacity(100%)',
                        animation: 'float 3s ease-in-out infinite'
                        
                    }}
                />
                
                <Typography variant="h4" component="h4" fontWeight={550} gutterBottom>
                    Page not Found!
                </Typography>
                
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    The page you are looking for does not exist. Please check the URL and try again.
                </Typography>
            </Box>
        </Container>
    )
}