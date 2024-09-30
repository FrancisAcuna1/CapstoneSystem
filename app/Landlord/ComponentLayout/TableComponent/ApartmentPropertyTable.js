'use client';

import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Divider, Avatar, List, ListItem, ListItemText } from '@mui/material';

export default function ApartmentDetails() {
  // State to handle tenant form input
  const [tenant, setTenant] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    email: '',
  });

  const handleChange = (e) => {
    setTenant({
      ...tenant,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = () => {
    // Handle tenant registration logic here
    console.log('Tenant registered:', tenant);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Grid container spacing={3}>
        {/* Apartment Details Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              Apartment Details
            </Typography>
            <Divider sx={{ marginBottom: '20px' }} />
            
            <Typography variant="body1" gutterBottom>
              <strong>Name:</strong> Apartment No. 1
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Location:</strong> Peralta St., Brgy. Burabod, Sor City
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Inclusions:</strong> Aircon, Kitchen, Stove, Comfort Room
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Rooms:</strong> 3 rooms
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Status:</strong> Available
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Capacity:</strong> 6
            </Typography>
          </Paper>
        </Grid>

        {/* Tenant Registration Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              Tenant Registration
            </Typography>
            <Divider sx={{ marginBottom: '20px' }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={tenant.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={tenant.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  name="contact"
                  value={tenant.contact}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={tenant.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
                  Register Tenant
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
