'use client';
import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";


export default function Contact() {
  return (
    <Layout>
      <Typography variant="h3" gutterBottom>
        Contact Us
      </Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
        <TextField fullWidth label="Name" margin="normal" />
        <TextField fullWidth label="Email" margin="normal" />
        <TextField
          fullWidth
          label="Message"
          multiline
          rows={4}
          margin="normal"
        />
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Send Message
        </Button>
      </Box>
    </Layout>
  );
}