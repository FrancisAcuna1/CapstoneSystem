"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Box,
  Paper,
  Skeleton,
  useTheme,
  Fade,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import Image from "next/image";
import "/app/style.css";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import LoopOutlinedIcon from "@mui/icons-material/LoopOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useSWR from "swr";
const StyledCard = styled(Card)(({ theme, color }) => ({
    height: '100%',
    background: `linear-gradient(135deg, ${color}08 0%, ${theme.palette.background.paper} 100%)`,
    transition: 'all 0.3s ease-in-out',
    border: '1px solid',
    borderColor: `${color}30`,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 8px 24px ${color}20`,
      borderColor: `${color}40`,
    },
}));
const IconWrapper = styled(Box)(({ theme, color }) => ({
  backgroundColor: `${color}15`,
  borderRadius: "12px",
  padding: theme.spacing(1.5),
  height: "46px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: `${color}25`,
  },
}));
const ValueChangeIndicator = styled(Box)(({ theme, positive }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '6px',
    backgroundColor: positive ? theme.palette.success.light + '20' : theme.palette.error.light + '20',
    color: positive ? theme.palette.success.main : theme.palette.error.main,
    fontSize: '0.75rem',
    fontWeight: 600,
    marginLeft: theme.spacing(1),
  }));
const fetcher = async ([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

export default function StatusCards({ loading, setLoading }) {
    const [countStatus, setCountStatus] = useState([]);
    const [hoveredCard, setHoveredCard] = useState(null);
    const theme = useTheme();
    console.log(countStatus);

    const getUseToken = () => {
        const userDataString = localStorage.getItem("userDetails");
        const userData = JSON.parse(userDataString);
        const accessToken = userData?.accessToken;
        return accessToken;
    };
    const token = getUseToken();
    const {
        data: response,
        error,
        isLoading,
    } = useSWR(
        (token && [`http://127.0.0.1:8000/api/count_status`, token]) || null,
        fetcher,
        {
        refreshInterval: 5000,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        errorRetryCount: 3,
        onLoadingSlow: () => setLoading(true),
        }
    );
    useEffect(() => {
        if (response) {
        setCountStatus(response);
        setLoading(false);
        } else if (isLoading) {
        setLoading(true);
        }
    }, [response, isLoading, setLoading]);

    const cards = [
        {
        title: "Completed",
        count: countStatus?.completed || 0,
        icon: AssignmentTurnedInOutlinedIcon,
        color: '#388e3c',
        tooltip: "Total number of completed maintenance!",
        },
        {
        title: "To do",
        count: countStatus?.todo || 0,
        icon: PendingActionsOutlinedIcon,
        color: theme.palette.secondary.main,
        tooltip: "Total number of todo maintenance!",
        },
        {
        title: "In Progress",
        count: countStatus?.inprogress || 0,
        icon: LoopOutlinedIcon,
        color: theme.palette.primary.main,
        tooltip: "Total number of in progress or on going maintenance!",
        },
    ];

    return (
        <Box>
        <Grid container spacing={2} justifyContent="center">
            {cards.map((card, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={4}>
                <StyledCard
                color={card.color}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                >
                <CardContent
                    sx={{
                   
                    height: "100%",
                    p: 3,
                    }}
                >
                    {loading ? (
                    <>
                        <Box>
                        <Skeleton
                            variant="rectangular"
                            animation="wave"
                            height={55}
                        />
                        <Skeleton width={100} animation="wave" height={30} />
                        <Skeleton width={100} animation="wave" height={30} />
                        </Box>
                    </>
                    ) : (
                    <Box>
                        <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 3,
                        }}
                        >
                        <Box>
                            <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 0.5,
                            }}
                            >
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                fontWeight: 600,
                                color: "#263238",
                                mr: 1,
                                fontSize: {
                                    xs: "20px",
                                    sm: "16px",
                                    md: "18px",
                                    lg: "20px",
                                },
                                }}
                            >
                                {card.title}
                            </Typography>
                            <Tooltip title={card.tooltip} arrow>
                                <IconButton size="small" sx={{ opacity: 0.6 }}>
                                <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            </Box>
                        </Box>
                        <IconWrapper color={card.color}>
                            <card.icon
                            fontSize="large"
                            sx={{ color: card.color }}
                            />
                        </IconWrapper>
                        </Box>
                        <Box sx={{ position: "relative", minHeight: "65px" }}>
                        <Fade in={!loading}>
                            <Box>
                            <Typography
                                variant="h4"
                                component="div"
                                sx={{
                                fontWeight: 700,
                                color: card.color,
                                mb: 1,
                                mt: -2,
                                }}
                            >
                                {card.count}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    mt: 3,
                                }}
                                >
                                </Typography>
                            </Box>
                            </Box>
                        </Fade>
                        </Box>
                    </Box>
                    )}
                </CardContent>
                </StyledCard>
            </Grid>
            ))}
        </Grid>
        </Box>
    );
}
