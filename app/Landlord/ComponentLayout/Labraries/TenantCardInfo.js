"use client";
import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Paper,
  Box,
  Toolbar,
  Typography,
  Divider,
  Avatar,
  IconButton,
  CardContent,
  Skeleton,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const avatarColors = [
  "#1976d2",
  "#f44336",
  "#4caf50",
  "#ff9800",
  "#9c27b0",
  "#3f51b5",
  "#00bcd4",
  "#8bc34a",
];

const getRandomColor = () =>
  avatarColors[Math.floor(Math.random() * avatarColors.length)];

const TenantCard = memo(({ tenant }) => (
  <CardContent
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mt: "-0.5rem",
      mb: "-0.5rem",
    }}
  >
    <div style={{ display: "flex", alignItems: "center" }}>
      <Avatar sx={{ bgcolor: getRandomColor(), marginRight: 2 }}>
        {tenant.firstname.charAt(0).toUpperCase()}
      </Avatar>
      <div>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
        >
          {tenant.firstname} {tenant.lastname}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {tenant.contact}
        </Typography>
      </div>
    </div>
    <IconButton aria-label="more">
      <MoreHorizIcon color="inherit" />
    </IconButton>
  </CardContent>
));

TenantCard.displayName = "TenantCard";

export default function TenantCardInfor({ setLoading, loading }) {
  const [tenantList, setTenantList] = useState([]);

  const fetchTenantData = useCallback(async () => {
    const userDataString = localStorage.getItem("userDetails");
    if (!userDataString) return;

    const { accessToken } = JSON.parse(userDataString);
    if (!accessToken) return;

    setLoading(true);
    const controller = new AbortController();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/all_tenant", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        console.error("Error:", response.status);
        return;
      }

      const data = await response.json();
      setTenantList(data.data || []);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Fetch error:", error);
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [setLoading]);

  useEffect(() => {
    fetchTenantData();
  }, [fetchTenantData]);

  return (
    <Paper sx={{ mt: "2rem" }}>
      <Toolbar>
        <Typography
          variant="h6"
          letterSpacing={2}
          sx={{ flexGrow: 1, color: "#263238", mt: "0.9rem", mb: "0.8rem" }}
        >
          Tenant List
        </Typography>
      </Toolbar>
      <Divider />
      <Box
        sx={{
          maxWidth: { xs: "auto", lg: 800 },
          height: { xs: "45vh", sm: "45vh", md: "45vh", lg: "48vh" },
          p: "0.9rem",
          overflowX: 'hidden',
          overflowY: 'auto', // Allows vertical scrolling
          '&::-webkit-scrollbar': { display: 'none' }, // Hides scrollbar in WebKit-based browsers (Chrome, Edge, Safari)
          '-ms-overflow-style': 'none', // Hides scrollbar in IE and Edge
        }}
      >
        {loading
          ? Array.from(new Array(4)).map((_, index) => (
              <Skeleton
                key={index}
                animation="wave"
                height={80}
                sx={{ mb: 2 }}
              />
            ))
          : tenantList.map((tenant) => (
              <React.Fragment key={tenant.id}>
                <TenantCard tenant={tenant} />
                <Divider />
              </React.Fragment>
            ))}
      </Box>
    </Paper>
  );
}
