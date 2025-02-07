"use client";
import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Link,
  Breadcrumbs,
  Divider,
  Skeleton,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeOutlinedIcon,
  CalendarMonthOutlined as CalendarMonthOutlinedIcon,
  LocationOnOutlined as LocationOnOutlinedIcon,
  AccessAlarmOutlined as AccessAlarmOutlinedIcon
} from "@mui/icons-material";
import AssesmentFeeTable from "../TableComponent/AssessmentTable";
import "/app/style.css";
import useSWR from "swr";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import { styled, alpha } from "@mui/system";
import {
  format,
  addMonths,
  isSameMonth,
  subMonths,
  differenceInDays,
  differenceInMonths,
  parseISO,
  getDate
} from "date-fns"


const GeneralTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#263238",
    color: "#ffffff",
    borderRadius: "4px",
  },
});

const fetcherTenantInformation = async ([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

const fetcherPaymentInformation = async ([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

const fetcherDelinquentInformation = async ([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable


export default function AssessmentFeeComponent({ setLoading, loading }) {
  const [userId, setUserId] = useState([]);
  const [accessToken, setAccessToken] = useState([]);
  const [tenantInformation, setTenantInformation] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [delinquent, setDelinquent] = useState([]);

  console.log(paymentInfo);
  console.log(tenantInformation);
  console.log(delinquent);

  console.log(userId, accessToken);

  useEffect(() => {
    const userDataString = localStorage.getItem("userDetails");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      if (userData && userData.accessToken && userData.user) {
        setAccessToken(userData.accessToken);
        setUserId(userData.user.id);
      }
    }
  }, []);

  const { data: responseTenantInfo, error: errorTenantInfo, isLoading: isLoadingTenantInfo} = useSWR(
    userId && accessToken ? [ `${API_URL}/tenant_information_lease/${userId}`,accessToken,]
    : null,
    fetcherTenantInformation,
    {
      refreshInterval: 3000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  );
  console.log(errorTenantInfo);
  useEffect(() => {
    if (responseTenantInfo) {
      setTenantInformation(responseTenantInfo?.data || "");
      setLoading(false);
    } else if (isLoadingTenantInfo) {
      setLoading(true);
    }
  }, [responseTenantInfo, isLoadingTenantInfo, setLoading]);

  const {
    data: responsePaymentInfo,
    erro: errorPaymentInfo,
    isLoading: isLoadingPaymentInfo,
  } = useSWR(
    userId && accessToken
      ? [`${API_URL}/tenant_payment/${userId}`, accessToken]
      : null,
    fetcherPaymentInformation,
    {
      refreshInterval: 3000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  );
  console.log(errorPaymentInfo);
  useEffect(() => {
    if (responsePaymentInfo) {
      setPaymentInfo(responsePaymentInfo?.data || "");
      setLoading(false);
    } else if (isLoadingPaymentInfo) {
      setLoading(true);
    }
  }, [responsePaymentInfo, isLoadingPaymentInfo, setLoading]);

  const {
    data: responseDelinquent,
    error: erroDelinquent,
    isLoading: isLoadingDeliquent,
  } = useSWR(
    userId && accessToken
      ? [`${API_URL}/get_delequent/${userId}`, accessToken]
      : null,
    fetcherDelinquentInformation,
    {
      refreshInterval: 3000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  );
  console.log(erroDelinquent);
  useEffect(() => {
    if (responseDelinquent) {
      setDelinquent(responseDelinquent?.data || "");
      setLoading(false);
    } else if (isLoadingDeliquent) {
      setLoading(true);
    }
  }, [responseDelinquent, isLoadingDeliquent, setLoading]);

  const lastPayment = paymentInfo[paymentInfo.length - 1] || 0;
  const filteredOverdue = delinquent.filter(
    (item) => item.status === "Overdue"
  );
  const balanced = filteredOverdue.reduce(
    (total, item) => total + parseFloat(item.amount_overdue),
    0
  );

  const formatDate = (dateString) => {
    if (!dateString) {
      return null;
    }

    try {
      const parseDate = parseISO(dateString);
      return format(parseDate, "MMM d, yyyy");
    } catch (error) {
      console.log("Error formating Date:", error);
      return dateString;
    }
  };
  
  let dayWithSuffix;
  const getDayWithSuffix = (day) => {
    if(day % 10 === 1 && day !== 11) return `${day}st`;
    if(day % 10 === 2 && day !== 12) return `${day}nd`;
    if(day % 10 === 3 && day !== 13) return `${day}rd`;
    return `${day}th`;
  }
  const leaseStartDate = tenantInformation[0]?.lease_start_date;

  if (leaseStartDate) {
    const date = new Date(leaseStartDate).getDate(); // Convert to Date and get the day
    dayWithSuffix = getDayWithSuffix(date);   // Add suffix
    console.log(dayWithSuffix);
    console.log(date); // Outputs the day of the month, e.g., 14
  } else {
    console.log("Lease start date is not available.");
  }
  // const formatDueDate = (payor) => {
  //   const leaseStart = new Date(payor.lease_start_date);
  //   const prepaidMonths = payor.prepaid_rent_period || 0;
  
  //   console.log("Prepaid Months:", prepaidMonths);
  
  //   // Ensure lastPayment is an array
  //   const tenantPayments = Array.isArray(lastPayment)
  //     ? lastPayment.filter((payment) => payment.tenant_id === payor.tenant?.id)
  //     : [];
  
  //   if (!Array.isArray(lastPayment)) {
  //     console.warn("Expected lastPayment to be an array, but got:", lastPayment);
  //   }
  
  //   // Include paid overdue payments
  //   const paidOverduePayments = Array.isArray(delinquent)
  //     ? delinquent.filter(
  //         (item) => item.tenant_id === payor.tenant.id && item.status === "Paid"
  //       )
  //     : [];
  
  //   // Combine and sort payments by date
  //   const allPayments = [...tenantPayments, ...paidOverduePayments].sort(
  //     (a, b) =>
  //       new Date(b.date || b.month_overdue) - new Date(a.date || a.month_overdue)
  //   );
  
  //   // Determine the most recent payment date
  //   const lastPayments = allPayments[0] || null;
  //   const lastPaymentDate = lastPayments
  //     ? new Date(lastPayments.date || lastPayments.month_overdue)
  //     : leaseStart;
  
  //   const dueDay = leaseStart.getDate();
  
  //   const calculateNextDueDate = () => {
  //     if (lastPayments) {
  //       // If the last payment covers multiple months
  //       if (lastPayments.months_covered > 1) {
  //         const advanceMonths = lastPayments.months_covered - 1;
  //         let nextDueDate = addMonths(lastPaymentDate, advanceMonths);
  //         nextDueDate.setDate(dueDay); // Ensure the due date matches the day of lease start
  //         return nextDueDate;
  //       }
  
  //       // If the last payment covers only one month
  //       if (lastPayments.months_covered === 1) {
  //         let nextDueDate = addMonths(lastPaymentDate, 1);
  //         nextDueDate.setDate(dueDay);
  //         return nextDueDate;
  //       }
  //     }
  
  //     // Default case: Start from lease start + prepaid months
  //     let nextDueDate = addMonths(leaseStart, prepaidMonths);
  //     nextDueDate.setDate(dueDay);
  //     return nextDueDate;
  //   };
  
  //   const nextDueDate = calculateNextDueDate();
  
  //   console.log("Next Due Date:", nextDueDate);
  
  //   return {
  //     dueDate: nextDueDate,
  //     status: "Upcoming",
  //   };
  // };
  

  return (
    <>
      <Box sx={{ maxWidth: 1400, margin: "auto" }}>
        <Typography
          variant="h5"
          letterSpacing={3}
          sx={{
            marginLeft: "1px",
            fontSize: "24px",
            fontWeight: "bold",
            mt: 5,
          }}
        >
          Tenant Information
        </Typography>
        <Grid item xs={12} sx={{ marginLeft: "5px", mt: 2 }}>
          <Breadcrumbs
            separator={
              <NavigateNextIcon sx={{ fontSize: "22px", ml: -0.6, mr: -0.6 }} />
            }
            aria-label="breadcrumb"
            sx={{ fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
          >
            {/* <Typography color="inherit">Navigation</Typography> */}
            <Link
              letterSpacing={2}
              underline="hover"
              color="inherit"
              href="/User/Home"
            >
              <HomeOutlinedIcon sx={{ color: "#673ab7", mt: 0.5 }} />
            </Link>
            <Typography
              letterSpacing={2}
              color="text.primary"
              sx={{ fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
            >
              Assesment of Fees
            </Typography>
          </Breadcrumbs>
        </Grid>
        <Box sx={{ mt: "4rem" }}></Box>

        <Grid
          container
          spacing={1}
          sx={{ mt: "-0.9rem", display: "flex", justifyContent: " center" }}
        >
          <Grid item xs={12}>
            <Paper
              sx={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
                borderRadius: 3,
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                padding: 3,
                backgroundColor: "white",
                borderLeft: "4px solid #3498db",
              }}
            >
              {loading ? (
                <Box width="100%">
                  <Skeleton width="100%" height={50} />
                  <Skeleton width="90%" height={40} />
                  <Skeleton width="70%" height={30} />
                </Box>
              ) : (
                <>
                  {tenantInformation.map((info, index) => {
                    // const { dueDate, status } = formatDueDate(info)
                    return (
               
                    <React.Fragment key={index}>
                      {/* Personal Information Section */}
                      <Box
                        sx={{
                          flex: { md: 1 },
                          borderRight: { md: "1px solid #e0e0e0" },
                          paddingRight: { md: 3 },
                          justifyContent: "center",
                        }}
                      >
                        <Grid
                          container
                          justifyContent="center"
                          sx={{
                            mb: 3,
                            mt: 1,
                            position: "relative",
                            zIndex: 0,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 120,
                              height: 120,
                              backgroundColor: "#5a4acd",
                              fontSize: "3.5rem",
                              boxShadow: "0 15px 30px rgba(90,74,205,0.4)",
                              border: "5px solid white",
                              fontWeight: "bold",
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                            aria-label="tenant-avatar"
                          >
                            {info?.tenant?.firstname?.charAt(0).toUpperCase() ||
                              ""}
                            {info?.tenant?.lastname?.charAt(0) || ""}
                          </Avatar>
                        </Grid>

                        <Typography
                          variant="h4"
                          align="center"
                          sx={{
                            fontWeight: 700,
                            color: "#2c3e50",
                            marginBottom: "20px",
                            paddingBottom: "12px",
                            position: "relative",
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              bottom: 0,
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: "80px",
                              height: "3px",
                              backgroundColor: "#3498db",
                            },
                          }}
                        >
                          {info.tenant.firstname} {info.tenant.middlename}{" "}
                          {info.tenant.lastname}
                        </Typography>

                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            {[
                              {
                                icon: <HomeOutlinedIcon sx={{display:'flex', fontSize:'24px'}}/>,
                                text: `${
                                  info.rented_unit.apartment_name ||
                                  info.rented_unit.boarding_house_name
                                }`,
                              },
                              {
                                icon: <CalendarMonthOutlinedIcon sx={{display:'flex', fontSize:'24px'}}/>,
                                text: `Lease start date: ${formatDate(
                                  info.lease_start_date
                                )}`,
                              },
                              {
                                icon: <LocationOnOutlinedIcon sx={{display:'flex', fontSize:'24px'}}/>,
                                text: `${info.tenant.street} st. ${info.tenant.barangay}, ${info.tenant.municipality}, Sorsogon`,
                              },
                              {
                                icon: <AccessAlarmOutlinedIcon  color="error" sx={{display:'flex', fontSize:'24px'}}/>,
                                text: `Your payment is due on the ${dayWithSuffix} of every month.`,
                                isDueDate: true, 
                              },
                            ].map((detail, idx) => (
                              <Typography
                                key={idx}
                                variant="body1"
                                sx={{
                                  color: detail.isDueDate ? '#e53935' : '#34495e',
                                  fontSize: "1rem",
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: "15px",
                                  backgroundColor: "#f7f9fc",
                                  padding: "10px",
                                  borderRadius: "8px",
                                  transition: "background-color 0.3s ease",
                                }}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    marginRight: "15px",
                                    color: "#3498db",
                                    fontSize: "1.5rem",
                                  }}
                                >
                                  {detail.icon}
                                </Box>
                                {detail.text}
                              </Typography>
                            ))}
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Financial Information Section */}
                      <Box
                        sx={{
                          flex: { md: 1 },
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {[
                          {
                            title: "Security Deposit",
                            amount: Number(info.rental_fee)?.toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            ),
                            color: "#2c3e50",
                          },
                          {
                            title: "Rental Fee",
                            amount: Number(info.rental_fee)?.toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            ),
                            color: "#2c3e50",
                          },
                          {
                            title: "Last Payment",
                            amount: Number(lastPayment?.amount)?.toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            ),
                            date: formatDate(lastPayment?.date),
                            color: "#2e7d32",
                          },
                          {
                            title: "Current Balance",
                            amount: Number(balanced)?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }),
                            color: "#c62828",
                          },
                        ].map((section, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              backgroundColor: "#f1f5f9",
                              borderRadius: "8px",
                              padding: "15px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 500,
                                color: "#34495e",
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              {section.title}
                              {/* {section.title === 'Security Deposit' && (
                                  <GeneralTooltip title="Security Deposit usable for last month rent">
                                   <HelpOutlinedIcon sx={{ml:2, fontSize:'20px'}}/>
                                  </GeneralTooltip>
                                )} */}
                            </Typography>

                            <Box>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 600,
                                  color: section.color,
                                  textAlign: "right",
                                }}
                              >
                                {section.amount}
                              </Typography>
                              {section.date && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#7f8c8d",
                                    display: "block",
                                    textAlign: "right",
                                  }}
                                >
                                  {section.date}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        ))}
                        <Typography
                          variant="body1"
                          style={{
                            color: "#555",
                            marginTop: "10px",
                            fontSize: "15px",
                          }}
                        >
                          <strong>Note:</strong> The security deposit is a
                          safeguard held by the landlord during the tenancy
                          period. It is strictly intended to cover the rent for
                          the last month of the lease agreement. This deposit
                          cannot be utilized for any other purposes, such as
                          early rent payments or deductions for damages, unless
                          explicitly stated in the rental agreement.
                        </Typography>
                      </Box>
                    </React.Fragment>
                    )
                  })}
                </>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 4 }}>
              <AssesmentFeeTable setLoading={setLoading} loading={loading} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
