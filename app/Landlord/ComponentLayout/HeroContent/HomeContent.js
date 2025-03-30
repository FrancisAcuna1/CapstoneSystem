"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import "/app/style.css";
import {
  useTheme,
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  Skeleton,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Fade,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";
import {
    NightShelter as NightShelterTwoToneIcon,
    AccountBalance as AccountBalanceWalletOutlinedIcon,
    Engineering as EngineeringIcon,
    InfoOutlined as InfoOutlined,
    BedroomChildTwoTone as BedroomChildTwoToneIcon,
    MonetizationOnTwoTone as MonetizationOnTwoToneIcon,
    PeopleTwoTone as PeopleTwoToneIcon
} from '@mui/icons-material'
import dynamic from "next/dynamic";
import Image from "next/image";
import { styled } from "@mui/system";
import useSWR from "swr";
import Link from "next/link";

const IncomeChartHeader = dynamic(
  () => import("../ChartComponent/incomechart"),
  {
    ssr: false,
  }
);
const ExpensesChartHeader = dynamic(
  () => import("../ChartComponent/expenseschart.js"),
  {
    ssr: false,
  }
);

const TenantCardInfor = dynamic(() => import("../Labraries/TenantCardInfo"), {
  ssr: false,
});

// Custom styled components
const StyledCard = styled(Card)(({ theme, color }) => ({
  height: "100%",
  // background: `linear-gradient(135deg, ${color}08 0%, ${theme.palette.background.paper} 100%)`,
  transition: "all 0.3s ease-in-out",
  border: "1px solid",
  borderColor: `${color}20`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 8px 15px ${color}30`,
    borderColor: `${color}100`,
  },
}));

const IncomeCard = styled(Card)(({ theme, color }) => ({
  height: "100%",
  backgroundImage: `linear-gradient(90deg, hsla(189, 100%, 95%, 1) 35%, hsla(0, 0%, 100%, 1) 100%)`,
  transition: "all 0.3s ease-in-out",
  border: "1px solid",
  borderColor: `${color}20`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 8px 15px ${color}30`,
    borderColor: `${color}100`,
  },
}));

const ExpenseCard = styled(Card)(({ theme, color }) => ({
  height: "100%",
  backgroundImage: `linear-gradient(90deg, hsla(29, 76%, 92%, 1) 28%, hsla(0, 0%, 100%, 1) 100%)`,
  transition: "all 0.3s ease-in-out",
  border: "1px solid",
  borderColor: `${color}20`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 8px 15px ${color}30`,
    borderColor: `${color}100`,
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
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 8px",
  borderRadius: "6px",
  backgroundColor: positive
    ? theme.palette.success.light + "20"
    : theme.palette.error.light + "20",
  color: positive ? theme.palette.success.main : theme.palette.error.main,
  fontSize: "0.75rem",
  fontWeight: 600,
  marginLeft: theme.spacing(1),
}));

const fetcher = async ([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json"',
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

const fetcherIncomeData = async ([url, token, isSelectedTypeIncome]) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json"',
    },
    body: JSON.stringify({
      type: isSelectedTypeIncome,
    }),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

const fetcherExpensesData = async ([url, token, isSelectedTypeExpenses]) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json"',
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable

export default function HomeContent({ setLoading, loading }) {
  const [isloading, setIsloading] = useState(false);
  const [isloading1, setIsloading1] = useState(false);
  const [countTenant, setCountTenant] = useState([]);
  const [countProperty, setCountProperty] = useState([]);
  const [countBed, setCountBed] = useState([]);
  const [countRequest, setCountReqeust] = useState([]);
  const [countIncome, setCountIncome] = useState([]);
  const [countExpenses, setCountExpenses] = useState([]);
  const [isSelectedTypeIncome, setIsSelectedTypeIncome] = useState("monthly");
  const [isSelectedTypeExpenses, setIsSelectedTypeExpenses] =
    useState("monthly");
  const [hoveredCard, setHoveredCard] = useState(null);
  const theme = useTheme();

  console.log(countProperty);
  console.log(countTenant);
  console.log(countBed);
  console.log(countRequest);
  console.log(isSelectedTypeIncome);
  console.log(isSelectedTypeExpenses);
  console.log(countIncome);
  console.log(countExpenses);

  const getUserToken = () => {
    const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json
    const accessToken = userData.accessToken;
    return accessToken;
  };

  const token = getUserToken();
  const {
    data: response,
    error: responseError,
    isLoading: responseIsLoading,
  } = useSWR(
    (token && [`${API_URL}/index`, token]) || null,
    fetcher,
    {
      refreshInterval: 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  );
  console.log(responseError);
  useEffect(() => {
    if (response) {
      setCountProperty(response.data);
      setCountTenant(response?.[0] || "");
      setCountBed(response?.[1] || "");
      setCountReqeust(response?.[2] || "");
      setLoading(false);
    } else if (responseIsLoading) {
      setLoading(true);
    }
  }, [response, responseIsLoading, setLoading]);

  const {
    data: responseIncomeData,
    error: errorIncomeData,
    isLoading: incomeDataIsLoading,
  } = useSWR(
    token && isSelectedTypeIncome
      ? [`${API_URL}/getIncome`, token, isSelectedTypeIncome]
      : null,
    fetcherIncomeData,
    {
      refreshInterval: 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  );
  console.log(errorIncomeData);
  useEffect(() => {
    if (responseIncomeData?.data) {
      setCountIncome(responseIncomeData?.data || "");
      setIsloading(false);
    } else if (incomeDataIsLoading) {
      setIsloading(true);
    }
  }, [responseIncomeData, incomeDataIsLoading, setIsloading]);

  const {
    data: responseExpensesData,
    error: errorExpensesData,
    isLoading: expensesDataIsLoading,
  } = useSWR(
    token && isSelectedTypeExpenses
      ? [`${API_URL}/getExpenses`, token, isSelectedTypeExpenses]
      : null,
    fetcherExpensesData,
    {
      refreshInterval: 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  );
  console.log(errorExpensesData);
  useEffect(() => {
    if (responseExpensesData?.data) {
      setCountExpenses(responseExpensesData?.data || "");
      setIsloading1(false);
    } else if (expensesDataIsLoading) {
      setIsloading1(true);
    }
  }, [responseExpensesData, expensesDataIsLoading, setIsloading1]);

  const handleIncomeChange = (event, category) => {
    setIsSelectedTypeIncome(category);
  };
  const handleExpensesChange = (event, category) => {
    setIsSelectedTypeExpenses(category);
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
        return "Good morning";
    } else if (currentHour < 18) {
        return "Good efternoon";
    } else {
        return "Good evening";
    }
  };

  const cards = [
    {
      title: countTenant?.user,
      value: countTenant?.tenant || "0",
      icon: PeopleTwoToneIcon,
      color: theme.palette.primary.main,
      url: "/Landlord/TenantInformation",
      tooltip: "Total number of tenants currently occupying units",
      backgroundImage:
        " linear-gradient(90deg, hsla(238, 82%, 70%, 1) 0%, hsla(246, 100%, 96%, 1) 0%, hsla(0, 0%, 100%, 1) 100%)",
    },
    {
      title: countProperty?.type2,
      value: countProperty?.apartment || "0",
      icon: NightShelterTwoToneIcon,
      color: theme.palette.success.main,
      url: "/Landlord/Property",
      tooltip: "Total number of Apartment",
      backgroundImage:
        "linear-gradient(90deg, hsla(136, 100%, 96%, 1) 15%, hsla(0, 0%, 100%, 1) 100%)",
    },
    {
      title: countProperty?.type1,
      value: countProperty?.boardingHouse || "0",
      icon: BedroomChildTwoToneIcon,
      color: theme.palette.error.main,
      url: "/Landlord/Property",
      tooltip: "Total number of Boarding House",
      backgroundImage:
        "linear-gradient(90deg, hsla(0, 100%, 96%, 1) 6%, hsla(0, 0%, 100%, 1) 100%)",
    },
    {
      title: "Maintenance Request",
      value: countRequest?.totalReqeust || "0",
      icon: EngineeringIcon,
      color: theme.palette.secondary.main,
      url: "/Landlord/MaintenanceRequest",
      tooltip: "Total number of pending maintenance requests",
      backgroundImage:
        "linear-gradient(90deg, hsla(49, 100%, 93%, 1) 18%, hsla(0, 0%, 100%, 1) 100%)",
    },
  ];

    return (
        <>
        <Box sx={{ maxWidth: 1400, margin: "auto" }}>
            <Typography
            variant="h5"
            gutterBottom
            letterSpacing={0.5}
            sx={{
                marginLeft: "5px",
                // fontSize: "25px",
                fontWeight: "bold",
                mt: 6,
                mb: "2.5rem",
            }}
            >
            {getGreeting()}, welcome to your admin dashboard!
            </Typography>
            <Grid container spacing={2} sx={{ alignItems: "center", mt:6 }}>
            {cards.map((card, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} lg={4}>
                    <Link href={card.url} passHref style={{ textDecoration: 'none' }}>
                        <StyledCard
                            color={card.color}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <CardContent
                            sx={{
                                backgroundImage: card.backgroundImage,
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
                                            <InfoOutlined fontSize="small" />
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
                                        {card.value}
                                        </Typography>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                            color: theme.palette.text.secondary,
                                            mt: 3,
                                            }}
                                        >
                                            {/* {item.subtitle1} */}
                                            {/* asdasd */}
                                        </Typography>

                                        {/* <ValueChangeIndicator>
                                                asdasd
                                            </ValueChangeIndicator> */}
                                        </Box>
                                    </Box>
                                    </Fade>
                                </Box>
                                </Box>
                            )}
                            </CardContent>
                        </StyledCard>
                    </Link>
                </Grid>
            ))}

            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Link href="/Landlord/IncomeTracking" passHref style={{ textDecoration: 'none' }}>
                <IncomeCard
                color={theme.palette.info.main}
                onMouseEnter={() => setHoveredCard(1)}
                onMouseLeave={() => setHoveredCard(null)}
                >
                <CardContent sx={{ height: "100%", p: 3 }}>
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
                            flexDirection: { xs: "row", md: "row" },
                            justifyContent: "space-between",
                            mb: 3,
                        }}
                        >
                        <Box
                            sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            alignItems: { xs: "flex-start", md: "center" },
                            mb: { xs: 1, md: 0 },
                            width: "100%",
                            }}
                        >
                            <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: { xs: 1, md: 0 },
                                mr: { md: 1 },
                                width: "100%",
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
                                Net Income
                            </Typography>
                            <Tooltip
                                title={`Total number of Net Income by ${isSelectedTypeIncome}`}
                                arrow
                            >
                                <IconButton size="small" sx={{ opacity: 0.6 }}>
                                <InfoOutlined fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            </Box>

                            <Box
                            sx={{
                                display: "flex",

                                width: "100%",
                            }}
                            >
                            <ToggleButtonGroup
                                value={isSelectedTypeIncome}
                                exclusive
                                onChange={handleIncomeChange}
                                sx={{
                                height: 31,
                                "& .MuiToggleButton-root": {
                                    textTransform: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    padding: "2px 2px",
                                    fontSize: "0.7rem",
                                    minWidth: "65px",
                                    letterSpacing: 1,
                                },
                                "& .MuiToggleButton-root.Mui-selected": {
                                    backgroundColor: "#263238",
                                    color: "white",
                                    "&:hover": {
                                    backgroundColor: "#37474f",
                                    },
                                },
                                }}
                            >
                                <ToggleButton value={"monthly"}>
                                Monthly
                                </ToggleButton>
                                <ToggleButton value="yearly">Yearly</ToggleButton>
                            </ToggleButtonGroup>
                            </Box>
                        </Box>

                        <IconWrapper color={theme.palette.info.main}>
                            <AccountBalanceWalletOutlinedIcon
                            fontSize="large"
                            sx={{ color: theme.palette.info.main }}
                            />
                        </IconWrapper>
                        </Box>

                        <Box sx={{ position: "relative", minHeight: "60px" }}>
                        {isloading ? (
                            <CircularProgress
                            size={24}
                            sx={{ position: "absolute" }}
                            />
                        ) : (
                            <Fade in={!loading}>
                            <Box>
                                <Typography
                                variant="h4"
                                component="div"
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.info.main,
                                    mb: 1,
                                    mt: -2,
                                }}
                                >
                                {Number(
                                    countIncome?.total_revenue || "0"
                                )?.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography
                                    variant="body2"
                                    sx={{ color: theme.palette.text.secondary }}
                                >
                                    {isSelectedTypeIncome === "monthly"
                                    ? "vs last month"
                                    : "vs last year"}
                                </Typography>

                                <ValueChangeIndicator
                                    positive={
                                    countIncome?.percentage_change === "Increase"
                                        ? true
                                        : false
                                    }
                                >
                                    {countIncome?.percentage_change === "Increase"
                                    ? `+${countIncome?.income_percentage} %`
                                    : `${countIncome?.income_percentage} %`}
                                </ValueChangeIndicator>
                                </Box>
                            </Box>
                            </Fade>
                        )}
                        </Box>
                    </Box>
                    )}
                </CardContent>
                </IncomeCard>
                </Link>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={4}>
                <Link href="/Landlord/ExpensesTracking" passHref style={{ textDecoration: 'none' }}>
                <ExpenseCard
                color={theme.palette.warning.main}
                onMouseEnter={() => setHoveredCard(1)}
                onMouseLeave={() => setHoveredCard(null)}
                >
                <CardContent sx={{ height: "100%", p: 3 }}>
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
                            flexDirection: { xs: "row", md: "row" },
                            justifyContent: "space-between",
                            mb: 3,
                        }}
                        >
                        <Box
                            sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            alignItems: { xs: "flex-start", md: "center" },
                            mb: { xs: 1, md: 0 },
                            width: "100%",
                            }}
                        >
                            <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: { xs: 1, md: 0 },
                                mr: { md: 1 },
                                width: "100%",
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
                                Total Expenses
                            </Typography>
                            <Tooltip
                                title={`Total number of Expenses by ${isSelectedTypeExpenses}`}
                                arrow
                            >
                                <IconButton size="small" sx={{ opacity: 0.6 }}>
                                <InfoOutlined fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            </Box>

                            <Box
                            sx={{
                                display: "flex",

                                width: "100%",
                            }}
                            >
                            <ToggleButtonGroup
                                value={isSelectedTypeExpenses}
                                exclusive
                                onChange={handleExpensesChange}
                                sx={{
                                height: 31,
                                "& .MuiToggleButton-root": {
                                    textTransform: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    padding: "2px 2px",
                                    fontSize: "0.7rem",
                                    minWidth: "65px",
                                    letterSpacing: 1,
                                },
                                "& .MuiToggleButton-root.Mui-selected": {
                                    backgroundColor: "#263238",
                                    color: "white",
                                    "&:hover": {
                                    backgroundColor: "#37474f",
                                    },
                                },
                                }}
                            >
                                <ToggleButton value={"monthly"}>
                                Monthly
                                </ToggleButton>
                                <ToggleButton value="yearly">Yearly</ToggleButton>
                            </ToggleButtonGroup>
                            </Box>
                        </Box>

                        <IconWrapper color={theme.palette.warning.main}>
                            <MonetizationOnTwoToneIcon
                            fontSize="large"
                            sx={{ color: theme.palette.warning.main }}
                            />
                        </IconWrapper>
                        </Box>

                        <Box sx={{ position: "relative", minHeight: "60px" }}>
                        {isloading1 ? (
                            <CircularProgress
                            size={24}
                            sx={{ position: "absolute" }}
                            />
                        ) : (
                            <Fade in={!loading}>
                            <Box>
                                <Typography
                                variant="h4"
                                component="div"
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.warning.main,
                                    mb: 1,
                                    mt: -2,
                                }}
                                >
                                {Number(
                                    countExpenses?.currentExpenses || "0"
                                )?.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography
                                    variant="body2"
                                    sx={{ color: theme.palette.text.secondary }}
                                >
                                    {isSelectedTypeExpenses === "monthly"
                                    ? "vs last month"
                                    : "vs last year"}
                                </Typography>

                                <ValueChangeIndicator
                                    positive={
                                    countExpenses.precentageType === "Increase"
                                        ? true
                                        : false
                                    }
                                >
                                    {countExpenses.precentageType === "Increase"
                                    ? `+${countExpenses.percentageChange} %`
                                    : `${countExpenses.percentageChange} %`}
                                </ValueChangeIndicator>
                                </Box>
                            </Box>
                            </Fade>
                        )}
                        </Box>
                    </Box>
                    )}
                </CardContent>
                </ExpenseCard>
                </Link>
            </Grid>
            </Grid>

            <Grid container spacing={2}>
            <Grid item xs={12} lg={7}>
                <Paper
                elevation={2}
                sx={{
                    maxWidth: { xs: 800, md: 940, lg: 1200 },
                    height: { xs: "50vh", lg: "54vh" },
                    marginTop: "2rem",
                    padding: "1.8rem 1rem 4rem 1rem",
                    borderRadius: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                >
                {loading ? (
                    <>
                    <Box>
                        <Skeleton
                        animation="wave"
                        variant="rectangular"
                        height={400}
                        />
                        {/* <Skeleton width={100} height={30} />
                            <Skeleton width={100} height={30} /> */}
                    </Box>
                    </>
                ) : (
                    <>
                    <Typography
                        variant="h5"
                        color={"black"}
                        sx={{ fontSize: "20px", marginTop: "0.6rem", ml: "1rem" }}
                        letterSpacing={2}
                        gutterBottom
                    >
                        Monthly Income
                    </Typography>
                    <IncomeChartHeader />
                    </>
                )}
                </Paper>
            </Grid>
            <Grid item xs={12} lg={5} sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={12}>
                    <Paper
                    elevation={2}
                    sx={{
                        maxWidth: { xs: "auto", lg: 800 },
                        height: { xs: "22vh", sm: "22vh", md: "22vh", lg: "25vh" },
                        padding: "1rem 0.9rem 3.5rem 0.9rem",
                        borderRadius: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    >
                    {loading ? (
                        <>
                        <Box>
                            <Skeleton
                            animation="wave"
                            variant="rectangular"
                            height={100}
                            />
                            <Skeleton animation="wave" width={100} height={30} />
                            <Skeleton animation="wave" width={100} height={30} />
                        </Box>
                        </>
                    ) : (
                        <>
                        <Grid container justifyContent={"space-between"}>
                            <Grid item>
                            <Typography
                                variant="h3"
                                color="black"
                                sx={{ ml: "1rem", mt: "1.5rem", fontWeight: 500 }}
                                letterSpacing={2}
                                gutterBottom
                            >
                                {countBed.Availablebed}
                            </Typography>
                            </Grid>
                            <Grid item>
                            <Box
                                sx={{
                                mr: "1rem",
                                mt: "0.4rem",
                                color: "secondary",
                                }}
                            >
                                <Image
                                src="/3D home.png"
                                className="home3dIcon"
                                alt="proptrack logo"
                                width={59}
                                height={72}
                                />
                            </Box>
                            </Grid>
                        </Grid>
                        <Typography
                            variant="h5"
                            color="black"
                            sx={{
                            fontSize: {
                                xs: "20px",
                                sm: "18px",
                                md: "18px",
                                lg: "20px",
                            },
                            mt: { xs: "0rem", md: "0.1rem", lg: 3, xl: 2 },
                            ml: "1rem",
                            }}
                            letterSpacing={2}
                            gutterBottom
                        >
                            {countBed.status1}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="#a55555"
                            sx={{
                            fontSize: {
                                xs: "13px",
                                sm: "12px",
                                md: "12px",
                                lg: "13px",
                            },
                            marginTop: "0.1rem",
                            ml: "1rem",
                            }}
                            letterSpacing={2}
                            gutterBottom
                        >
                            {countBed.occupiedbed} {countBed.status2}
                        </Typography>
                        </>
                    )}
                    </Paper>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={12}
                    sx={{ mt: { xs: 4, sm: 0, md: 0, lg: 2 } }}
                >
                    <Paper
                    elevation={2}
                    sx={{
                        maxWidth: { xs: "auto", lg: 800 },
                        height: { xs: "22vh", sm: "22vh", md: "22vh", lg: "25vh" },
                        padding: "1rem 0.9rem 3.5rem 0.9rem",
                        borderRadius: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    >
                    {loading ? (
                        <>
                        <Box>
                            <Skeleton
                            animation="wave"
                            variant="rectangular"
                            height={100}
                            />
                            <Skeleton animation="wave" width={100} height={30} />
                            <Skeleton animation="wave" width={100} height={30} />
                        </Box>
                        </>
                    ) : (
                        <>
                        <Grid container justifyContent={"space-between"}>
                            <Grid item>
                            <Typography
                                variant="h3"
                                color="black"
                                sx={{ ml: "1rem", mt: "1rem" }}
                                letterSpacing={2}
                                gutterBottom
                            >
                                {countRequest.upcomingMaintenance}
                            </Typography>
                            </Grid>
                            <Grid item>
                            <Box
                                sx={{
                                mr: "1rem",
                                mt: "0.4rem",
                                color: "secondary",
                                }}
                            >
                                <Image
                                src="/3D rep.png"
                                className="repairIcon"
                                alt="proptrack logo"
                                width={60}
                                height={72}
                                />
                            </Box>
                            </Grid>
                        </Grid>

                        <Typography
                            variant="h5"
                            color="black"
                            sx={{
                            fontSize: {
                                xs: "20px",
                                sm: "18px",
                                md: "18px",
                                lg: "20px",
                            },
                            ml: "1rem",
                            mt: { xs: "0rem", md: "0.1rem", lg: 3, xl: 2 },
                            }}
                            letterSpacing={2}
                            gutterBottom
                        >
                            Upcoming Maintenance
                        </Typography>
                        <Typography
                            variant="body1"
                            color="#a55555"
                            sx={{
                            fontSize: {
                                xs: "13px",
                                sm: "12px",
                                md: "12px",
                                lg: "13px",
                            },
                            marginTop: "0.1rem",
                            ml: "1rem",
                            }}
                            letterSpacing={2}
                            gutterBottom
                        >
                            {countRequest.finishedMaintenance} Finished Maintenance
                        </Typography>
                        </>
                    )}
                    </Paper>
                </Grid>
                </Grid>
            </Grid>
            </Grid>

            <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
                <Grid container direction={"column"} height={"100%"}>
                <Grid item>
                    <Paper
                    elevation={2}
                    sx={{
                        overflowX: "none",
                        maxWidth: { xs: 800, md: 940, lg: 1200 },
                        height: { xs: "50vh", lg: "55vh" },
                        padding: "1.8rem 1rem 3.5rem 1rem",
                        marginTop: "2rem",
                        borderRadius: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    >
                    {loading ? (
                        <>
                        <Box>
                            <Skeleton
                            animation="wave"
                            variant="rectangular"
                            height={300}
                            />
                            <Skeleton
                            animation="wave"
                            variant="rectangular"
                            height={100}
                            />
                        </Box>
                        </>
                    ) : (
                        <>
                        <Typography
                            variant="h5"
                            color={"black"}
                            sx={{
                            fontSize: "20px",
                            marginTop: "0.6rem",
                            ml: "1rem",
                            }}
                            letterSpacing={2}
                            gutterBottom
                        >
                            Monthly Expenses
                        </Typography>
                        <ExpensesChartHeader />
                        </>
                    )}
                    </Paper>
                </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} lg={4}>
                <TenantCardInfor
                setLoading={setLoading}
                loading={loading}
                sx={{
                    maxWidth: { xs: 312, sm: 730, md: 940, lg: 890 },
                    height: { xs: "50vh", md: "43vh", lg: "64vh" },
                    padding: "1rem 0rem 2.7rem 0rem",
                    borderRadius: "10px",
                    marginTop: "10rem",
                }}
                />
            </Grid>
            </Grid>
        </Box>
        </>
    );
}
