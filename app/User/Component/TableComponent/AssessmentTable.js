"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableContainer,
  TableRow,
  Toolbar,
  TableCell,
  TablePagination,
  Tooltip,
  Typography,
  IconButton,
  InputBase,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { styled, alpha } from "@mui/system";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import * as XLSX from "xlsx";
import { format, parseISO, addMonths, setDate, getDate} from "date-fns";
import useSWR from "swr";
import NoResultUI from "@/app/Landlord/ComponentLayout/Labraries/NoResults";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,

  // backgroundColor: alpha(theme.palette.common.black, 0.1), // Semi-transparent background
  // '&:hover': {
  //   backgroundColor: alpha(theme.palette.common.black, 0.15),
  // },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(2),
    width: "100%",
  },
  border: `1px solid ${alpha(theme.palette.common.black, 0.5)}`, // Border color
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: alpha(theme.palette.common.black, 0.5), // Icon color
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(0.7, 1, 0.7, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "25ch",
    },
    color: theme.palette.common.black, // Text color
    fontSize: "14px",
  },
}));

const StyledTableCell = styled(TableCell)({
  fontWeight: "bold",
  letterSpacing: "2px",
  fontSize: "15px",
  color: "#263238",
});

const StyledTableRow = styled(TableRow)(({ theme, isSelected }) => ({
  backgroundColor: isSelected
    ? alpha(theme.palette.primary.main, 0.2)
    : "inherit",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  color: "#263238",
}));

const GeneralTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#263238",
    color: "#ffffff",
    borderRadius: "4px",
  },
});

const transactionColorMap = {
  "Advance Payment": "#4CAF50", // Green
  "Security Deposit": "#ffc107", // Cyan
  "Rental Fee": "#2196F3", // Blue
  'Penalties': "#F44336", // Red
  "Extra Amenities": "#ff5722", // Purple
  "Damage Compensation": "#FF9800", // Orange
  "Replacement Fee": "#795548", // Brown
};

const fetcher = async([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  if(!response.ok){
    throw new Error(response.statusText)
  }
  return response.json();
}

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable

export default function PaymentHistoryTable({ TenantId, setLoading, loading }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = [
    "all",
    "Advance Payment",
    "Rental Fee",
    "Penalties",
    "Extra Amenties",
    "Damage Compensation",
    "Replacement Fee",
    "Security Deposit",
  ];

  console.log(paymentDetails);
  console.log("Id:", TenantId);
  console.log(selectedCategory);

  const getUserToken = () => {
    const userDataString = localStorage.getItem("userDetails");
    const userData = JSON.parse(userDataString);
    const accessToken = userData.accessToken;
    return accessToken;
  }
  const getUserId = () => {
    const userDataString = localStorage.getItem("userDetails");
    const userData = JSON.parse(userDataString);
    const userId = userData.user.id;
    return userId;
  }

  const userId = getUserId();
  const token = getUserToken();
  const endpoint = selectedCategory === 'all'
    ? `${API_URL}/show_payment/${userId}`
    : `${API_URL}/filter_payment_history/${userId}/${selectedCategory}`;

  const {data: response, error, isLoading} = useSWR(
    token && userId && selectedCategory ? [endpoint, token] : null,
    fetcher, {
      refreshInterval: 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  )
  console.log(loading)
  console.log(error)
  console.log(response)
  console.log(loading)
  useEffect(() => {
    if (response?.message === "No payment found for the specified filters!") {
      // Clear the state if no payments are found
      setPaymentDetails([]);
      setLoading(false);
      return;
    }

    if(response){
      const updatedDetails = response?.data.map((payment) => {
        if (
            payment.transaction_type === "Initial Payment" ||
            payment.transaction_type === "Advance Payment" ||
            payment.transaction_type === "Rental Fee"
        ) {
            const startDate = payment.paid_for_month 
            ? parseISO(payment.paid_for_month) 
            : null;
            const monthsCovered = payment.months_covered || 0;

            // Check if Advance Payment and there's an Initial Payment to calculate from
            if (payment.transaction_type === "Advance Payment") {
              const initialPayment = response?.data.find(
              (p) =>
                  p.transaction_type === "Initial Payment" &&
                  p.tenant_id === payment.tenant_id
              );
      
              if (initialPayment) {
              const initialPaymentEndDate = addMonths(
                  parseISO(initialPayment.paid_for_month),
                  initialPayment.months_covered || 0
              );
      
              // Adjust the start date of Advance Payment to the end date of Initial Payment
              const adjustedStartDate = setDate(initialPaymentEndDate, getDate(initialPaymentEndDate));
              // Advance payments include an extra month
              const endDate = addMonths(adjustedStartDate, monthsCovered);
      
              try {
                payment.date_coverage = {
                  start_date: format(adjustedStartDate, "yyyy-MM-dd"),
                  end_date: format(endDate, "yyyy-MM-dd"),
                };
              } catch (error) {
                console.error("Date formatting error:", error);
                console.log(payment.date_coverage)
                payment.date_coverage = null;
              }
      
              return payment;
              }
            }

            
            // Get lease start date from rental agreement
            const leaseStartDate = payment.tenant.rental_agreement?.[0]?.lease_start_date 
              ? parseISO(payment.tenant.rental_agreement[0].lease_start_date) 
              : null;

            if (leaseStartDate) {
                // Adjust the day of startDate to match leaseStartDate's day
              const adjustedStartDate = setDate(startDate, getDate(leaseStartDate));
              
              // Calculate the end date using the adjusted start date and months covered
              const endDate = addMonths(adjustedStartDate, monthsCovered);

              // Add date coverage to the payment object
              payment.date_coverage = {
                  start_date: format(adjustedStartDate, "yyyy-MM-dd"),
                  end_date: format(endDate, "yyyy-MM-dd"),
              };
            } else {
              // Fallback if no lease start date is found
              const endDate = addMonths(startDate, monthsCovered);
              payment.date_coverage = {
                  start_date: format(startDate, "yyyy-MM-dd"),
                  end_date: format(endDate, "yyyy-MM-dd"),
              };
            }
        } else {
            payment.date_coverage = null;
        }
        return payment;
      });
      setPaymentDetails(updatedDetails || '');
      setLoading(false)
    }else if(isLoading){
      setLoading(true)
    }
  }, [response, isLoading, setLoading])


  const formatDate = (dateString) => {
    if (!dateString) {
      return null;
    }

    try {
      const parseDate = parseISO(dateString);
      return format(parseDate, "MMMM d, yyyy");
    } catch (error) {
      console.log("Error formating Date:", error);
      return dateString;
    }
  };

  // filter
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryChange = (category) => {
    // const category = event.target.value;
    setSelectedCategory(category);
    setAnchorEl(null);
  };

  const handleSort = (columnKey) => {
    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(paymentDetails);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "payment_history.xlsx");
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAndSortedData = useMemo(() => {
    // Check if paymentTransaction is an array
    if (!Array.isArray(paymentDetails)) {
      console.error("paymentTransaction is not an array:", paymentDetails);
      return []; // Return an empty array if paymentTransaction is not an array
    }

    const filteredPayment = paymentDetails.filter((payment) => {
      const searchLower = searchTerm.toLowerCase();
      const tenantName = `${payment.tenant?.firstname || ""} ${
        payment.tenant?.lastname || ""
      }`.toLowerCase();
      const amount = payment.amount.toString();
      const status = payment.status.toLowerCase();
      const date = payment?.date || "";
      const formatedDate = formatDate(date);
      const type = payment?.transaction_type.toLowerCase() || "";

      return (
        tenantName.includes(searchLower) ||
        amount.includes(searchLower) ||
        status.includes(searchLower) ||
        formatedDate.toLowerCase().includes(searchLower) ||
        type.includes(searchLower)
      );
    });

    if (sortConfig.key) {
      filteredPayment.sort((a, b) => {
        // Handle nested sorting for different columns
        let aValue, bValue;

        switch (sortConfig.key) {
          case "firstname":
            aValue = `${a.tenant?.firstname || ""} ${
              a.tenant?.lastname || ""
            }`.toLowerCase();
            bValue = `${b.tenant?.firstname || ""} ${
              b.tenant?.lastname || ""
            }`.toLowerCase();
            break;
          case "amount":
            aValue = a.amount;
            bValue = b.amount;
            break;
          case "date":
            aValue = new Date(a.date);
            bValue = new Date(b.date);
            break;
          case "transaction_type":
            aValue = a.transaction_type.toLowerCase();
            bValue = b.transaction_type.toLowerCase();
            break;
          default:
            aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
            bValue = b[sortConfig.key]?.toString().toLowerCase() || "";
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredPayment;
  }, [paymentDetails, searchTerm, sortConfig]);

  const paginatedPayments = filteredAndSortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ maxWidth: 1400, margin: "auto", overflowX: "auto" }}>
      <Paper
        elevation={2}
        sx={{
          maxWidth: { xs: 350, sm: 767, md: 1000, lg: 1490 },
          borderRadius: "12px",
        }}
      >
        <TableContainer>
          <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
            <Typography
              sx={{
                flex: "1 1 100%",
                mt: "0.4rem",
                mb: "0.4rem",
                fontSize: { xs: "18px", sm: "18px", md: "18px", lg: "22px" },
              }}
              variant="h6"
              id="tableTitle"
              component="div"
              letterSpacing={2}
            >
              Payment History
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                mt: "1rem",
                mb: "0.5rem",
              }}
            >
              <Search
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: { xs: "95%", sm: "auto" }, mt: 1 }}
              >
                <SearchIconWrapper>
                  <SearchIcon fontSize="small" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
              <GeneralTooltip title="Filter Table">
                <IconButton onClick={handleMenuOpen} sx={{ mt: 1, mr: 2 }}>
                  <TuneIcon fontSize="medium" />
                </IconButton>
              </GeneralTooltip>
              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category}
                    selected={category === selectedCategory}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
          <Table size="medium" sx={{ mt: 2 }}>
            <TableHead sx={{ backgroundColor: "whitesmoke", p: 2 }}>
              <TableRow>
                <StyledTableCell onClick={() => handleSort("date")}>
                  Payment Date{" "}
                  {sortConfig.key === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <NorthIcon fontSize="extrasmall" />
                    ) : (
                      <SouthIcon fontSize="extrasmall" />
                    ))}
                </StyledTableCell>
                <StyledTableCell>Date Coverage</StyledTableCell>
                <StyledTableCell onClick={() => handleSort("transaction_type")}>
                  Transaction Type{" "}
                  {sortConfig.key === "transaction_type" &&
                    (sortConfig.direction === "asc" ? (
                      <NorthIcon fontSize="extrasmall" />
                    ) : (
                      <SouthIcon fontSize="extrasmall" />
                    ))}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort("amount")}>
                  Amount{" "}
                  {sortConfig.key === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <NorthIcon fontSize="extrasmall" />
                    ) : (
                      <SouthIcon fontSize="extrasmall" />
                    ))}
                </StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPayments.length > 0 ?
                (paginatedPayments.map((item) => (
                <StyledTableRow key={item.id}>
                  <TableCell>{formatDate(item.date || "N/A")}</TableCell>
                  {item.date_coverage ? (
                    <GeneralTooltip title={`The Payment Coverage start's in the month of 
                      ${formatDate(item?.date_coverage?.start_date)} 
                      unitl ${formatDate(item?.date_coverage?.end_date)}`}
                      placement="top-start"
                    >
                      <TableCell>
                        {item.date_coverage
                          ? `${formatDate(item?.date_coverage?.start_date)} - ${formatDate(
                              item?.date_coverage?.end_date)}`
                          : "N/A"}
                      </TableCell>
                    </GeneralTooltip>
                  ):(
                    <TableCell>N/A</TableCell>
                  )}
                  <TableCell>
                    <Chip
                      label={item.transaction_type}
                      variant="contained"
                      sx={{
                        backgroundColor:
                          transactionColorMap[item.transaction_type] + "2A", // 10% opacity
                        color: transactionColorMap[item.transaction_type],
                        "& .MuiChip-label": {
                          color: transactionColorMap[item.transaction_type],
                          fontWeight: 560,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {Number(item.amount)?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      variant="contained"
                      sx={{
                        backgroundColor: "#e8f5e9", // 10% opacity
                        color: "#4caf50",
                        "& .MuiChip-label": {
                          color: "#4caf50",
                          fontWeight: 560,
                        },
                      }}
                    />
                  </TableCell>
                </StyledTableRow>
              ))):(
                <StyledTableRow>
                  <TableCell 
                    colSpan={12} 
                    sx={{ 
                    p: 0, // Remove padding
                    backgroundColor: "transparent", // Remove background
                    borderBottom: "none", // Optional: Remove table row bottom border
                    }}
                  >
                    <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        minHeight: "300px",
                        textAlign: "center",
                    }}
                    >
                      <NoResultUI/>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 25]}
          component="div"
          count={filteredAndSortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
