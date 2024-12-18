'use client'
import React, { useState, useEffect } from "react"
import { Paper, Box, Grid, CardHeader, Card, CardContent, Typography, IconButton, CardActions, Stack, Avatar, Divider, AppBar, Toolbar} from "@mui/material"
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

// const TenantInfo = [
    
//     {id: 1, name: 'John Doe', contact: '09369223915', role: 'Tenant'},
//     {id: 2, name: 'Jane Jalmasco', contact: '09369223915', role: 'Tenant'},
//     {id: 3, name: 'Mark Domasig', contact: '09369223915', role: 'Tenant'},
//     {id: 4, name: 'clark Mangampo', contact: '09369223915', role: 'Tenant'},
//     {id: 5, name: 'Izer Idol', contact: '09369223915', role: 'Tenant'},
//     {id: 6, name: 'Teressa Pura', contact: '09369223915', role: 'Tenant'},
//     {id: 7, name: 'Edwin Embile', contact: '09369223915', role: 'Tenant'},
//     {id: 8, name: 'Edmar Sanched', contact: '09369223915', role: 'Tenant'},
//     {id: 9, name: 'Rica Estives', contact: '09369223915', role: 'Tenant'},
//     {id: 10, name: 'April Mae Jebulan', contact: '09369223915', role: 'Tenant'},

// ]

const avatarColors = ['#1976d2', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#3f51b5', '#00bcd4', '#8bc34a'];

const getRandomColor = () => {
    return avatarColors[Math.floor(Math.random() * avatarColors.length)]
}

export default function TenantCardInfor({setLoading, loading}){
    const [tenantList, setTenantList] = useState([]);

    useEffect(() => {
        const fetchedData = async() => {
            setLoading(true)
            const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
            const userData = JSON.parse(userDataString); // parse the datastring into json 
            const accessToken = userData.accessToken;

            try{
                if(accessToken){
                    const response = await fetch('http://127.0.0.1:8000/api/all_tenant',{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
                    const data = await response.json();
                    console.log(data);
                    if(response.ok){
                        setTenantList(data.data)
                    }else{
                        console.log('error', response.status)
                        setLoading(false)
                    }
                }
            }catch(error){
                console.log(error);
                setLoading(false)
            }
        }
        fetchedData();
    }, [setLoading])


    return(
        <Paper sx={{mt: '2rem', }}>
         
                <Toolbar>
                    <Typography variant="h6" letterSpacing={2} component="div" sx={{ flexGrow: 1, color:'#263238', mt:'0.9rem', mb: '0.8rem' }}>
                        Tenant List
                    </Typography>
                </Toolbar>
                <Divider/>
            <Box  sx={{ maxWidth: { xs: 'auto',  lg: 800 },  height: { xs: '24vh', sm:'16vh', md:'14vh', lg: '48vh' },  padding: "0rem 0.9rem 3.5rem 0.9rem",   justifyContent: 'center',  lignItems: 'center',  overflowY: 'scroll'}}
            >   
            {tenantList.map((tenant) => (
                <React.Fragment key={tenant.id}>
                  
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt:'-0.5rem', mb: '-0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: getRandomColor(), marginRight: 2 }}>
                                {tenant.firstname.charAt(0).toUpperCase()} 
                            </Avatar>
                            <div>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize:'16px', color: '#333' }}>
                                    {tenant.firstname} {tenant.lastname}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {tenant.contact}
                                </Typography>
                            </div>
                        </div>
                        <IconButton aria-label="delete">
                            <MoreHorizIcon color="inherit" />
                        </IconButton>
                    </CardContent>
                    <Divider />
                </React.Fragment>
            ))}
           
            
                
               
         
           
            
        </Box>

        </Paper>
       
    )
}