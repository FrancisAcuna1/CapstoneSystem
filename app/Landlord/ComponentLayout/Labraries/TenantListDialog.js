"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  FormGroup,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  TableBody,
  Checkbox,
  Collapse,
  TableCell,
  Divider,
  Tooltip,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  format,
  addMonths,
  isSameMonth,
  subMonths,
  differenceInDays,
  differenceInMonths,
  parseISO,
} from "date-fns";
import Swal from "sweetalert2";
import { useSnackbar } from "notistack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SecurityTwoToneIcon from "@mui/icons-material/SecurityTwoTone";
import SecurityDepositDialog from "./SecurityDepositDialog";
import { SnackbarProvider } from "notistack";
import useSWR from "swr";
const GeneralTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#263238", // Background color of the tooltip
    color: "#ffffff", // Text color
    borderRadius: "4px",
  },
});

// Styled components
const StyledTableCell = styled(TableCell)({
  fontWeight: "bold",
  letterSpacing: "1px",
  fontSize: "14px",
  color: "#263238",
});
const StyledTableRow = styled(TableRow)(({ theme, isSelected }) => ({
  backgroundColor: isSelected
    ? alpha(theme.palette.primary.main, 0.2)
    : "inherit",
  color: "#263238",
}));
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
}));

const fetcherPayorInfo = async ([url, token]) => {
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

const fetcherPaymentInfo = async ([url, token]) => {
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


export default function TenantListDialog({
  openDialog,
  handleCloseDialog,
  selectedUnit,
  loading,
  setLoading,
  setError,
  setSuccessful,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [isShowSecurityDeposit, setIsShowSecurityDeposit] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [payorList, setPayorList] = useState([]);
  const [tenantPayment, setLastPayment] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState({});
  const [advancePayments, setAdvancePayments] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [deliquent, setDeliquent] = useState([]);
  const [tenantId, setTenantId] = useState([]);
  const [accessToken, setAccessToken] = useState([]);
  // const [overdueData, setOverdueData] = useState([]);

  console.log(tenantId);
  console.log(payorList);
  console.log(tenantPayment);
  console.log(payorList?.tenant_id);

  const toggleRow = (tenantId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [tenantId]: !prev[tenantId],
    }));
  };

  const handleShowDeposit = (id) => {
    setIsShowSecurityDeposit(true);
    setTenantId(id);
  };

  const handleCloseDeposit = () => {
    setIsShowSecurityDeposit(false);
  };

  useEffect(() => {
    const userDataString = localStorage.getItem("userDetails");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      if (userData && userData.accessToken) {
        setAccessToken(userData.accessToken);
      }
    }
  }, []);

  const {
    data: responsePayor,
    error: errorPayor,
    isLoading: isloadingPayor,
  } = useSWR(
    accessToken && selectedUnit.id && selectedUnit.property_type
      ? [
          `${API_URL}/get_payor_list/${selectedUnit.id}/${selectedUnit.property_type}`,
          accessToken,
        ]
      : null,
    fetcherPayorInfo,
    {
      refreshInterval: 2000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  );

  useEffect(() => {
    if (responsePayor) {
      setPayorList(responsePayor.data);
      setLoading(false);
    } else if (isloadingPayor) {
      setLoading(true);
    }
  }, [responsePayor, isloadingPayor, setLoading]);

  const {
    data: responsePayment,
    error: errorPayment,
    isLoading: isloadingPayment,
  } = useSWR(
    accessToken && selectedUnit.id && selectedUnit.property_type
      ? [
          `${API_URL}/get_tenant_payment/${selectedUnit.id}/${selectedUnit.property_type}`,
          accessToken,
        ]
      : null,
    fetcherPaymentInfo,
    {
      refreshInterval: 3000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  );
  useEffect(() => {
    if (responsePayment) {
      setLastPayment(responsePayment.data);
      setLoading(false);
    } else if (isloadingPayment) {
      setLoading(true);
    }
  }, [responsePayment, isloadingPayment, setLoading]);

  // this code is get the last payment of every tenant
  const getLastPayments = () => {
    // Group payments by tenant
    const groupedPayments = tenantPayment.reduce((acc, payment) => {
      if (!acc[payment.tenant_id]) {
        acc[payment.tenant_id] = [];
      }
      acc[payment.tenant_id].push(payment);
      return acc;
    }, {});
    console.log(groupedPayments);

    // Find the last payment for each tenant
    return Object.values(groupedPayments).map(
      (tenantPayments) =>
        tenantPayments.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    );
  };

  const lastPayments = getLastPayments();
  console.log(lastPayments);
  console.log(selectedItem);

  const handleMonthSelection = (tenantId, month) => {
    setSelectedMonths((prev) => {
      const currentTenantMonths = prev[tenantId] || [];
      const monthExists = currentTenantMonths.includes(month);

      const updatedTenantMonths = monthExists
        ? currentTenantMonths.filter((m) => m !== month)
        : [...currentTenantMonths, month];

      return {
        ...prev,
        [tenantId]: updatedTenantMonths,
      };
    });

    // Update selectedItem to include/exclude tenant based on month selection
    setSelectedItem((prev) => {
      const hasSelectedMonths = selectedMonths[tenantId]?.length > 0;
      if (hasSelectedMonths && !prev.includes(tenantId)) {
        return [...prev, tenantId];
      } else if (!hasSelectedMonths && prev.includes(tenantId)) {
        return prev.filter((id) => id !== tenantId);
      }
      return prev;
    });
  };

  console.log(selectedMonths);

  const handleAdvancePaymentChange = (tenantId, numMonths) => {
    setAdvancePayments((prev) => ({
      ...prev,
      [tenantId]: numMonths,
    }));

    // When advance payment is selected, automatically select the tenant
    if (numMonths > 0 && !selectedItem.includes(tenantId)) {
      setSelectedItem((prev) => [...prev, tenantId]);
    }
  };

  console.log(advancePayments);
  console.log(selectedMonths);
  console.log(selectedItem);
  console.log(selectedMonths);
  console.log(advancePayments);
  const handleSave = async (e) => {
    e.preventDefault();
    const userDataString = localStorage.getItem("userDetails");
    const userData = JSON.parse(userDataString);
    const accessToken = userData.accessToken;
    setLoading(true);
    if (accessToken) {
      try {
        const selectedTenantsData = selectedItem
          .map((selectedId) => {
            const payor = payorList.find((p) => p.tenant.id === selectedId);

            if (!payor) return null;

            let advanceMonthCount = advancePayments[selectedId] || 0;
            let selectedMonthsList = selectedMonths[selectedId] || [];
            let paymentAmount;
            let totalMonthsCovered;

            console.log(selectedMonthsList)
            const selectedMonthsCount = selectedMonthsList.length;

            advanceMonthCount = advanceMonthCount > 0 ? advanceMonthCount : 0;

            if (advanceMonthCount > 0 && selectedMonthsCount > 1) {
              totalMonthsCovered = selectedMonthsCount + advanceMonthCount;
            } else if (advanceMonthCount > 0 && selectedItem) {
              totalMonthsCovered = advanceMonthCount + 1;
            } else if (selectedMonthsCount > 1 && advanceMonthCount === 0) {
              totalMonthsCovered = selectedMonthsCount;
            } else {
              totalMonthsCovered = 1;
            }

            console.log(totalMonthsCovered);
            // const totalMonthsCovered = selectedMonthsCount + advanceMonthCount;

            if (totalMonthsCovered > 0) {
              paymentAmount = parseFloat(payor.rental_fee) * totalMonthsCovered;
              console.log(paymentAmount);
            } else {
              paymentAmount = parseFloat(payor.rental_fee);
            }

            return {
              tenant_id: payor.tenant.id,
              amount: paymentAmount.toFixed(0),
              payment_date: format(new Date(), "MM/dd/yyyy"),
              paid_for_month: format(new Date(selectedMonthsList[0]), "MM/dd/yyyy"),
              transaction_type: "Rental Fee",
              status: "Paid",
              months_covered: totalMonthsCovered,
              selected_months: selectedMonthsList,
            };
          })
          .filter(Boolean);

        for (const paymentData of selectedTenantsData) {
          const response = await fetch(
            `${API_URL}/storepayment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
              },
              body: JSON.stringify(paymentData),
            }
          );
          const data = await response.json();
          if (response.ok) {
            console.log(data.data);
            console.log(data.message);
            setLoading(false);
            // Show success message
            Swal.fire({
              icon: "success",
              title: "Payments Processed",
              text: "All selected tenant payments have been recorded successfully.",
              confirmButtonText: "OK",
            });
            setSelectedItem([]);
            handleCloseDialog();
            window.location.reload();
          } else {
            console.log(data.error);
            setLoading(false);
            if (data.error) {
              console.log(data.error);
              localStorage.setItem(
                "errorMessage",
                data.message || "Operation Error!"
              );
              window.location.reload();
              setSelectedItem([]);
              handleCloseDialog();
              setLoading(false);
              // setError(data.error)
            } else {
              console.log(data.message); // for duplicate entry
              setError(data.message);
              setSelectedItem([]);
              handleCloseDialog();
              setLoading(false);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("No Access Token Found!");
    }
  };

  useEffect(() => {
    const successMessage = localStorage.getItem("successMessage");
    const errorMessage = localStorage.getItem("errorMessage");
    if (successMessage) {
      setSuccessful(successMessage);
      setTimeout(() => {
        localStorage.removeItem("successMessage");
      }, 3000);
    }

    if (errorMessage) {
      setError(errorMessage);
      setTimeout(() => {
        localStorage.removeItem("errorMessage");
      }, 3000);
    }
  });

  const formatDueDate = (payor) => {
    const leaseStart = new Date(payor.lease_start_date);
    const currentDate = new Date("2025-3-11"); // You might want to replace with current date dynamically
    const prepaidMonths = payor.prepaid_rent_period;
    console.log(prepaidMonths);
    // Filter payments specific to this tenant
    const tenantPayments = lastPayments.filter(
      (payment) => payment.tenant_id === payor.tenant?.id
    );

    // Include paid overdue payments
    const paidOverduePayments = deliquent.filter(
      (item) => item.tenant_id === payor.tenant.id && item.status === "Paid"
    );

    // Combine and sort all payments by date
    const allPayments = [...tenantPayments, ...paidOverduePayments].sort(
      (a, b) =>
        new Date(b.date || b.month_overdue) -
        new Date(a.date || a.month_overdue)
    );

    // If no payments, use lease start date
    const lastPayment = allPayments[0] || null;
    const lastPaymentDate = lastPayment
      ? new Date(lastPayment.paid_for_month || lastPayment.month_overdue)
      : leaseStart;

    const dueDay = leaseStart.getDate();

    const calculateNextDueDate = () => {
      // Scenario 1: Current due date was May, paid with 2 months in advance
      if (lastPayment && lastPayment.months_covered > 1) {
        const advanceMonths = lastPayment.months_covered - 1;
        let nextDueDate = addMonths(lastPaymentDate, advanceMonths + 1);
        nextDueDate.setDate(dueDay); // Fix the day to match leaseStart
        return nextDueDate;
      }

      if (lastPayment && lastPayment.months_covered === 1) {
        const advanceMonths = lastPayment.months_covered;
        let nextDueDate = addMonths(lastPaymentDate, advanceMonths);
        nextDueDate.setDate(dueDay); // Fix the day to match leaseStart
        return nextDueDate;
      }

      // Scenario 2: If there are overdue months, calculate accordingly
      const overdueMonths = getOverdueDetails(payor);
      if (overdueMonths.length > 0) {
        const paidOverdueMonths = overdueMonths.filter((month) =>
          allPayments.some((payment) =>
            isSameMonth(
              new Date(payment.date || payment.month_overdue),
              new Date(month.date)
            )
          )
        );

        // If paid more months than overdue
        if (paidOverdueMonths.length < lastPayment?.months_covered) {
          let nextDueDate = addMonths(
            lastPaymentDate,
            lastPayment.months_covered
          );
          nextDueDate.setDate(dueDay); // Fix the day to match leaseStart
          return nextDueDate;
        }
      }

      // Default case: Add one month from last payment
      let nextDueDate = addMonths(lastPaymentDate, 1);
      nextDueDate.setDate(dueDay);
      return nextDueDate;
    };

    const nextDueDate = calculateNextDueDate();
    const previousDueDate = subMonths(nextDueDate, 1);
    console.log(nextDueDate);
    console.log(lastPayment);
    console.log(previousDueDate);
    // Check if next due date is paid
    const isNextDueDatePaid = allPayments.some((payment) =>
      isSameMonth(new Date(payment.paid_for_month || payment.month_overdue), nextDueDate)
    );
    console.log(isNextDueDatePaid);

    // Determine status based on current date and payment history
    if (isSameMonth(currentDate, nextDueDate)) {
      return {
        dueDate: nextDueDate,
        status: isNextDueDatePaid ? "Paid" : "Not Paid",
      };
    } else if (currentDate < nextDueDate) {
      return {
        dueDate: previousDueDate,
        status: "Paid",
      };
    } else {
      return {
        dueDate: nextDueDate,
        status: isNextDueDatePaid ? "Paid" : "Overdue",
      };
    }
  };

  const getOverdueDetails = (payor, currentDate = new Date()) => {
    // Ensure we have a valid payor and tenant
    if (!payor || !payor.tenant) {
      console.warn("Invalid payor object");
      return [];
    }

    const leaseStartDate = new Date(payor.lease_start_date);
    const rentalFee = parseFloat(payor.rental_fee);

    // Filter payments for this specific tenant
    const tenantPayments = lastPayments.filter(
      (payment) => payment.tenant_id === payor.tenant.id
    );

    // Include paid delinquent payments for this tenant
    const paidDelinquentPayments = deliquent.filter(
      (item) => item.tenant_id === payor.tenant.id && item.status === "Paid"
    );

    // Combine and sort all payments
    const allPayments = [...tenantPayments, ...paidDelinquentPayments].sort(
      (a, b) =>
        new Date(b.date || b.month_overdue) -
        new Date(a.date || a.month_overdue)
    );

    // Determine last covered date
    let lastCoveredDate;
    const lastPayment = allPayments[0];

    if (lastPayment) {
      lastCoveredDate = new Date(lastPayment.date || lastPayment.month_overdue);
      // lastCoveredDate.setDate(1);
      lastCoveredDate.setMonth(
        lastCoveredDate.getMonth() +
          (lastPayment.months_covered ? lastPayment.months_covered - 1 : 0)
      );
    } else {
      // If no payments, use lease start date plus prepaid period
      lastCoveredDate = new Date(leaseStartDate);
      // lastCoveredDate.setDate(1);
      lastCoveredDate.setMonth(
        lastCoveredDate.getMonth() +
          (payor.prepaid_rent_period ? payor.prepaid_rent_period - 1 : 0)
      );
    }

    // Prepare for overdue calculation
    const overdueMonths = [];
    let dateIterator = new Date(leaseStartDate);
    // dateIterator.setDate(1);
    dateIterator.setMonth(dateIterator.getMonth() + 1);

    // Debug logging
    console.log("Lease Start Date:", leaseStartDate);
    console.log("Last Covered Date:", lastCoveredDate);
    console.log("Current Date:", currentDate);
    console.log(dateIterator);
    // Iterate through months to find overdue periods
    while (dateIterator <= currentDate) {
      // Check if this month is already covered by any payment
      const isMonthCovered = allPayments.some((payment) => {
        const paymentDate = new Date(payment.date || payment.month_overdue);
        const coverageStartDate = new Date(paymentDate);
        const coverageEndDate = new Date(paymentDate);

        // Adjust coverage end date based on months covered
        coverageEndDate.setMonth(
          coverageEndDate.getMonth() +
            (payment.months_covered ? payment.months_covered - 1 : 0)
        );

        // Check if the current month falls within the payment coverage
        return (
          dateIterator >= coverageStartDate && dateIterator <= coverageEndDate
        );
      });

      // If month is not covered, add to overdue months
      if (!isMonthCovered) {
        overdueMonths.push({
          month: format(dateIterator, "MMMM yyyy"),
          date: format(dateIterator, "MM/dd/yyyy"),
          amount: rentalFee,
        });
      }

      // Move to next month
      dateIterator.setMonth(dateIterator.getMonth() + 1);
    }

    // Debug logging for overdue months
    console.log("Overdue Months:", overdueMonths);

    return overdueMonths;
  };

  // Add this function to check and submit overdue information
  const checkAndSubmitOverdues = useCallback(async () => {
    const userDataString = localStorage.getItem("userDetails");
    const userData = JSON.parse(userDataString);
    const accessToken = userData.accessToken;
    if (accessToken) {
      for (const payor of payorList) {
        const overdueMonths = getOverdueDetails(payor);
        console.log("Overdue Months for Payor", payor.tenant.id, overdueMonths);
        // Process each overdue month separately
        for (const overdueMonth of overdueMonths) {
          const overdueEntry = {
            tenant_id: payor.tenant.id,
            amount_overdue: overdueMonth.amount,
            month_overdue: overdueMonth.month,
            last_due_date: overdueMonth.date,
            status: "Overdue",
          };
          try {
            const response = await fetch(
              `${API_URL}/store_delequent`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(overdueEntry),
              }
            );

            const data = await response.json();

            if (response.ok) {
              console.log(
                `Overdue entry stored successfully for ${overdueMonth.month}`,
                data
              );
            } else {
              console.error(
                `Failed to store overdue entry for ${overdueMonth.month}:`,
                data.error
              );
            }
          } catch (error) {
            console.error("Error submitting overdue data:", error);
          }
        }
      }
    }
  }, [payorList, getOverdueDetails]);

  useEffect(() => {
    if (payorList.length > 0 && lastPayments.length > 0) {
      checkAndSubmitOverdues();
    }
    // const intervalId = setInterval(checkAndSubmitOverdues, 86400000); // 1 minute
    // return () => clearInterval(intervalId);
  }, [payorList, lastPayments, checkAndSubmitOverdues]);

  // const handleCheckBoxChange = (event, uniqueKey) => {
  //     setSelectedItem(prev => prev.includes(uniqueKey) ? prev.filter(id => id !== uniqueKey) : [...prev, uniqueKey]);
  // };
  const handleCheckBoxChange = (event, tenantId) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      // Add the tenant ID to the selected list
      setSelectedItem((prev) => [...prev, tenantId]);

      // Include all delinquent months for this tenant if applicable
      const tenantOverdueData =
        deliquent.find((item) => item.tenantId === tenantId)?.deliquentData ||
        [];
      const overdueMonths = tenantOverdueData.map((item) => {
        const date = new Date(item.month_overdue);
        const formattedMonth = date.toLocaleString("default", {
          month: "long",
        });
        const day = date.getDate();
        const year = date.getFullYear();
        return `${formattedMonth} ${day}, ${year}`;
      });

      setSelectedMonths((prev) => ({
        ...prev,
        [tenantId]: overdueMonths,
      }));
    } else {
      // Remove the tenant ID and their selected months
      setSelectedItem((prev) => prev.filter((id) => id !== tenantId));
      setSelectedMonths((prev) => {
        const updated = { ...prev };
        delete updated[tenantId];
        return updated;
      });
    }
  };

  useEffect(() => {
    const fetchDeliquentData = async () => {
      const userDataString = localStorage.getItem("userDetails");
      const userData = JSON.parse(userDataString);
      const accessToken = userData.accessToken;

      if (accessToken) {
        // Create a new array to store delinquent data
        const deliquentDataArray = [];

        // Use Promise.all to fetch delinquent data for all tenants concurrently
        await Promise.all(
          payorList.map(async (payor) => {
            try {
              const response = await fetch(
                `${API_URL}/get_delequent/${payor.tenant.id}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              const data = await response.json();

              if (response.ok) {
                // Only add to the array if there's delinquent data
                if (data.data && data.data.length > 0) {
                  deliquentDataArray.push({
                    tenantId: payor.tenant.id,
                    deliquentData: data.data,
                  });
                }
              } else {
                console.log(
                  "Error fetching data for tenant ID:",
                  payor.tenant.id
                );
                console.log(data.error);
              }
            } catch (error) {
              console.error(
                "Error fetching delinquent data for tenant:",
                payor.tenant.id,
                error
              );
            }
          })
        );

        // Set the state with the collected delinquent data
        setDeliquent(deliquentDataArray);
      } else {
        console.log("Access token not found!");
      }
    };

    if (payorList && payorList.length > 0) {
      fetchDeliquentData();
    }
  }, [payorList]);
  console.log(payorList?.tenant_id);

  console.log(deliquent);

  const handleWarning = () => {
    return enqueueSnackbar(
      "The security deposit cannot be used if the status marked as paid",
      { variant: "warning" }
    );
  };
  // const filteredOverdue Data = deliquent.flatMap(tenantItem =>
  //     tenantItem.deliquentData
  //         .filter(delinquentItem => delinquentItem.status === 'Overdue')
  //         .map(overdueItem => ({
  //             ...overdueItem,
  //             tenantId: tenantItem.tenantId
  //         }))
  // );
  // console.log(filteredOverdueData)

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleCloseDialog}
        open={openDialog}
        fullWidth
        maxWidth={"lg"}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>Tenant Payment Status</DialogTitle>
        <IconButton
          onClick={handleCloseDialog}
          sx={{
            "&:hover": { backgroundColor: "#263238" },
            position: "absolute",
            right: 8,
            top: 8,
            height: "35px",
            width: "35px",
          }}
        >
          <CloseIcon
            sx={{
              transition: "transform 0.3s ease-in-out",
              "&:hover": { transform: "rotate(90deg)", color: "#fefefe" },
            }}
          />
        </IconButton>
        {/* <IconButton aria-label="close" onClick={handleCloseDialog} sx={{ position: 'absolute', right: 8, top: 8, color: 'grey' }}>
                    <CloseIcon />
                </IconButton> */}
        <DialogContent dividers>
          <Typography
            variant="body1"
            sx={{
              display: "flex",
              alignItems: "center",
              mt: "0.2rem",
              fontSize: "14px",
              color: "gray",
            }}
          >
            <InfoOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
            Please mark the box to confirm tenant payment
          </Typography>
          <TableContainer sx={{ overflowy: "auto", width: "100%", mb: 3 }}>
            <Table size="small" sx={{ mt: 2 }}>
              <TableHead sx={{ backgroundColor: "whitesmoke", p: 2 }}>
                <TableRow>
                  <StyledTableCell>Tenant Name</StyledTableCell>
                  <StyledTableCell>Due Date</StyledTableCell>
                  <StyledTableCell>Rental Fee</StyledTableCell>
                  <StyledTableCell>Paid</StyledTableCell>
                  <StyledTableCell>Advance Payment</StyledTableCell>
                  <StyledTableCell>Security Deposit</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payorList.map((payor, index) => {
                  const tenantOverdueData =
                    deliquent
                      .find((item) => item.tenantId === payor.tenant.id)
                      ?.deliquentData.filter(
                        (deliquenItem) => deliquenItem.status === "Overdue"
                      ) || [];
                  const { dueDate, status } = formatDueDate(payor);
                  // const overdueMonths = getOverdueDetails(payor);
                  // console.log(overdueMonths)
                  const isSelected = selectedItem.includes(payor.tenant.id);
                  const isExpanded = expandedRows[payor.tenant.id];
                  const tenantSelectedMonths =
                    selectedMonths[payor.tenant.id] || [];

                  // Check if all overdue months are selected
                  const hasUnselectedOverdueMonths = tenantOverdueData.some(
                    (item) => {
                      const date = new Date(item.month_overdue);
                      const formattedMonth = date.toLocaleString("default", {
                        month: "long",
                      });
                      const day = date.getDate();
                      const year = date.getFullYear();
                      const monthYear = `${formattedMonth} ${day}, ${year}`;
                      return !tenantSelectedMonths.includes(monthYear); // Check if the month is not selected
                    }
                  );
                  const isAdvancePaymentDisabled =
                    tenantOverdueData.length > 1 && hasUnselectedOverdueMonths;
                  const monthOverdueDate = new Date(
                    tenantOverdueData[0]?.month_overdue
                  );
                  const currentDate = new Date(); // use this current date to track the number of days
                  const daysOverdue =
                    differenceInDays(currentDate, monthOverdueDate) + 1;
                  return (
                    <>
                      <StyledTableRow
                        key={payor.tenant.id}
                        selected={isSelected}
                        onChange={(event) =>
                          handleCheckBoxChange(event, payor.tenant.id)
                        }
                      >
                        <TableCell align="start">
                          {payor.tenant.firstname} {payor.tenant.lastname}
                          <Divider sx={{ width: "40%" }} />
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "gray",
                              fontStyle: "italic",
                              mt: "0.3rem",
                            }}
                          >
                            {payor.tenant.contact}
                          </Typography>
                        </TableCell>
                        <TableCell align="start">
                          <Box
                            variant={"component"}
                            sx={{ display: "inline-flex" }}
                          >
                            {tenantOverdueData &&
                            tenantOverdueData.length > 1 ? (
                              <Chip
                                label={`${tenantOverdueData.length} unpaid ${
                                  tenantOverdueData.length === 1
                                    ? "month"
                                    : "months"
                                }`}
                                size="small"
                                sx={{
                                  mt: 1,
                                  backgroundColor: "#ffebee",
                                  color: "#b71c1c",
                                  "& .MuiChip-label": {
                                    fontSize: "0.78rem",
                                    fontWeight: 500,
                                    letterSpacing: 0.4,
                                  },
                                }}
                              />
                            ) : (
                              <GeneralTooltip
                                title={
                                  tenantOverdueData[0]?.status === "Overdue"
                                    ? `Tenant is overdue by ${daysOverdue} day(s)`
                                    : payor.is_last_month === 1
                                    ? "The tenant is in their final lease period"
                                    : ""
                                }
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: "14px",
                                    color:
                                      tenantOverdueData[0]?.status === "Overdue"
                                        ? "red"
                                        : "inherit",
                                  }}
                                >
                                  {payor.is_last_month === 1 ? (
                                    <Chip
                                      label={"No upcoming duedate"}
                                      variant="contained"
                                      color={"success"}
                                      sx={{
                                        backgroundColor: "#e8f5e9",
                                        color: "#004d40",
                                        "& .MuiChip-label": {
                                          color: "#004d40",
                                          fontWeight: 560,
                                          letterSpacing: 1,
                                        },
                                      }}
                                    />
                                  ) : (
                                    format(dueDate, "MMM d, yyyy")
                                  )}
                                </Typography>
                              </GeneralTooltip>
                            )}

                            {tenantOverdueData &&
                              tenantOverdueData.length > 1 && (
                                <IconButton
                                  size="small"
                                  onClick={() => toggleRow(payor.tenant.id)}
                                  sx={{ ml: 0.1 }}
                                >
                                  {isExpanded ? (
                                    <KeyboardArrowUpIcon />
                                  ) : (
                                    <KeyboardArrowDownIcon />
                                  )}
                                </IconButton>
                              )}
                          </Box>

                          {/* {unpaid.join(", ")},  */}
                        </TableCell>
                        <TableCell align="start">
                          {payor.is_last_month === 1 ? (
                            <>
                              <Chip
                                label={"Covered by Deposit"}
                                variant="contained"
                                // backgroundColor={item.status === 'Available' ? '#ede7f6' : 'secondary'}
                                color={"success"}
                                sx={{
                                  backgroundColor: "#e8f5e9",
                                  color: "#004d40",
                                  ml: -0.6,
                                  "& .MuiChip-label": {
                                    color: "#004d40",
                                    fontWeight: 560,
                                    letterSpacing: 1,
                                  },
                                }}
                              />
                            </>
                          ) : (
                            <>{payor.rental_fee}</>
                          )}
                        </TableCell>
                        <TableCell align="start">
                          {status === "Paid" ? (
                            <Chip
                              label={status}
                              variant="contained"
                              // backgroundColor={item.status === 'Available' ? '#ede7f6' : 'secondary'}
                              color={"success"}
                              sx={{
                                backgroundColor: "#e8f5e9",
                                color: "#004d40",
                                ml: -0.6,
                                "& .MuiChip-label": {
                                  color: "#004d40",
                                  fontWeight: 560,
                                  letterSpacing: 1,
                                },
                              }}
                            />
                          ) : (
                            <Checkbox color="primary" checked={isSelected} />
                          )}
                        </TableCell>
                        <TableCell align="start">
                          <Select
                            value={advancePayments[payor.tenant.id] || 0}
                            onChange={(e) =>
                              handleAdvancePaymentChange(
                                payor.tenant.id,
                                e.target.value
                              )
                            }
                            size="small"
                            // disabled={status === "Paid"}
                            disabled={
                              isAdvancePaymentDisabled ||
                              !isSelected ||
                              status === "Paid"
                            }
                          >
                            <MenuItem value={0}>No advance</MenuItem>
                            <MenuItem value={1}>1 month</MenuItem>
                            <MenuItem value={2}>2 months</MenuItem>
                            <MenuItem value={3}>3 months</MenuItem>
                            <MenuItem value={6}>6 months</MenuItem>
                            <MenuItem value={12}>12 months</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell sx={{ cursor: "pointer" }}>
                          {status === "Paid" ? (
                            <Typography
                              variant="body2"
                              onClick={handleWarning}
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                color: "#2196f3",
                                fontSize: "0.9rem",
                              }}
                            >
                              <SecurityTwoToneIcon /> Security Deposit Options
                            </Typography>
                          ) : (
                            <Typography
                              variant="body2"
                              onClick={() => handleShowDeposit(payor.tenant.id)}
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                color: "#2196f3",
                                fontSize: "0.9rem",
                              }}
                            >
                              <SecurityTwoToneIcon /> Security Deposit Options
                            </Typography>
                          )}
                        </TableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <TableCell
                          colSpan={4}
                          sx={{
                            py: 0,
                            borderBottom: isExpanded
                              ? "1px solid rgba(224, 224, 224, 1)"
                              : "none",
                          }}
                        >
                          <Collapse
                            in={isExpanded}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box
                              sx={{
                                m: 2,
                                backgroundColor: "#fafafa",
                                borderRadius: 1,
                                p: 2,
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{ color: "#455a64" }}
                              >
                                Select months to mark as paid:
                              </Typography>
                              <FormGroup
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  flexWrap: "wrap",
                                  gap: 2,
                                }}
                              >
                                {tenantOverdueData.map((item, index) => {
                                  const date = new Date(item.month_overdue);
                                  const formattedMonth = date.toLocaleString(
                                    "default",
                                    { month: "long" }
                                  );
                                  const day = date.getDate();
                                  const year = date.getFullYear();
                                  const monthYear = `${formattedMonth} ${day}, ${year}`;
                                  return (
                                    <FormControlLabel
                                      key={index}
                                      control={
                                        <Checkbox
                                          checked={tenantSelectedMonths.includes(
                                            monthYear
                                          )}
                                          onChange={() =>
                                            handleMonthSelection(
                                              payor.tenant.id,
                                              monthYear
                                            )
                                          }
                                          size="small"
                                        />
                                      }
                                      label={monthYear}
                                      sx={{
                                        "& .MuiFormControlLabel-label": {
                                          fontSize: "0.875rem",
                                          color: "#455a64",
                                        },
                                      }}
                                    />
                                  );
                                })}
                              </FormGroup>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </StyledTableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleSave}
            variant="contained"
            size="medium"
            sx={{ mr: 2, mt: 0.5, mb: 0.5 }}
          >
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <SnackbarProvider maxSnack={3}>
        <Box sx={{ display: "none" }}>
          <SecurityDepositDialog
            open={isShowSecurityDeposit}
            handleClose={handleCloseDeposit}
            tenantId={tenantId}
            setLoading={setLoading}
            loading={loading}
          />
        </Box>
      </SnackbarProvider>
    </React.Fragment>
  );
}
