"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  MenuItem,
  Menu,
  InputAdornment,
  Avatar,
  Chip,
  Toolbar,
  Typography,
  Box,
  Tooltip,
  InputBase,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha, useTheme, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import TuneIcon from "@mui/icons-material/Tune";
import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Checkbox from "@mui/material/Checkbox";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import * as XLSX from "xlsx";
import { parseISO, format, addMonths, setDate, getDate } from "date-fns";
import useSWR from "swr";
import { useSnackbar } from "notistack";
import NoResultUI from "../Labraries/NoResults";

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
  letterSpacing: "1px",
  fontSize: "15px",
  color: "#212121",
});

const StyledTablebody = styled(TableCell)({
  fontSize: "15px",
  color: "#212121",
  letterSpacing: "0.5px",
});

const StyledTableRow = styled(TableRow)(({ theme, isSelected }) => ({
  backgroundColor: isSelected
    ? alpha(theme.palette.primary.main, 0.2)
    : "inherit", // Apply background color if selected
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1), // Lighter on hover
  },
  color: "#212121",
}));

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#e57373", // Background color of the tooltip
    color: "#ffffff", // Text color
    borderRadius: "4px",
  },
});

const AcceptToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#4caf50", // Background color of the tooltip
    color: "#ffffff", // Text color
    borderRadius: "4px",
  },
});

const GeneralTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#263238", // Background color of the tooltip
    color: "#ffffff", // Text color
    borderRadius: "4px",
  },
});

const fetcher = async ([url, token, selectedMonth, selectedYear]) => {
  console.log(url, token, selectedMonth, selectedYear);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      month: selectedMonth,
      year: selectedYear,
    }),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

export default function PaymentTransactionTable({
  handleEdit,
  setSuccessful,
  setLoading,
  loading,
  selectedMonth,
  selectedYear,
}) {
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [selectedItem, setSelectedItem] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc",});
    const [paymentTransaction, setPaymentTransaction] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [deletePayment, setDeletePayment] = useState();

    const categories = [
        "All",
        "Initial Payment",
        "Rental Fee",
        "Advance Payment",
        "Penalties",
        "Extra Amenities",
        "Damage Compensation",
        "Replacement Fee",
    ];
    console.log(paymentTransaction);
    console.log(selectedCategory);

    const endPoint =
        selectedCategory === "All"
        ? `http://127.0.0.1:8000/api/paymentdetails`
        : `http://127.0.0.1:8000/api/filter_payment/${selectedCategory}`;

    const getUserToken = () => {
        const userDataString = localStorage.getItem("userDetails"); // get the
        const userData = JSON.parse(userDataString); // parse the datastring into
        const accessToken = userData.accessToken;
        return accessToken;
    };

    const token = getUserToken();
    const {data: response, error, isLoading,} = useSWR(
        token && selectedMonth && selectedYear ? [endPoint, token, selectedMonth, selectedYear]: null,
        fetcher,{
            refreshInterval: 1000,
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            errorRetryCount: 3,
            onLoadingSlow: () => setLoading(true),
        }
    );
    console.log(error);
    console.log(response)
    console.log(paymentTransaction)
    useEffect(() => {
        if (response?.message === "No payment found for the specified filters!") {
            // Clear the state if no payments are found
            setPaymentTransaction([]);
            setLoading(false);
            return;
        }
        
        if (response?.data) {
            const updatedDetails = response?.data.map((payment) => {
                if (
                    payment.transaction_type === "Initial Payment" ||
                    payment.transaction_type === "Advance Payment" ||
                    payment.transaction_type === "Rental Fee"
                ) {
                    const startDate = parseISO(payment.date);
                    let monthsCovered = payment.months_covered || 0; 

                    // Check if Advance Payment and there's an Initial Payment to calculate from
                    if (payment.transaction_type === "Advance Payment") {
                        const initialPayment = response?.data.find(
                        (p) =>
                            p.transaction_type === "Initial Payment" &&
                            p.tenant_id === payment.tenant_id
                        );
                
                        if (initialPayment) {
                        const initialPaymentEndDate = addMonths(
                            parseISO(initialPayment.date),
                            initialPayment.months_covered || 0
                        );
                
                        // Adjust the start date of Advance Payment to the end date of Initial Payment
                        const adjustedStartDate = setDate(initialPaymentEndDate, getDate(initialPaymentEndDate));
                       // Advance payments include an extra month
                        const endDate = addMonths(adjustedStartDate, monthsCovered);
                
                        payment.date_coverage = {
                            start_date: format(adjustedStartDate, "yyyy-MM-dd"),
                            end_date: format(endDate, "yyyy-MM-dd"),
                        };
                
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
    
            setPaymentTransaction(updatedDetails);
            setLoading(false)
        } else if (isLoading) {
            setLoading(true);
        }
    }, [response, isLoading, setLoading]);

    // for Dialog alert for delete
    const handleClickOpen = (id) => {
        setDeletePayment(id);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    console.log(deletePayment);
    const handleDelete = async () => {
        const userDataString = localStorage.getItem("userDetails"); // get the
        const userData = JSON.parse(userDataString); // parse the datastring into
        const accessToken = userData.accessToken;
        console.log("Token:", accessToken);

        if (accessToken) {
        try {
            setLoading(true);
            const response = await fetch(
            `http://127.0.0.1:8000/api/delete_payment/${deletePayment}`,
            {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken},`,
                },
            }
            );

            const data = await response.json();
            console.log("Response data:", data);
            console.log("Response status:", response.status);

            if (response.ok) {
                setOpen(false);
                enqueueSnackbar(data.message, { variant: "success" });
                setLoading(false);
            } else {
                console.log(data.error);
                enqueueSnackbar(data.message, { variant: "error" });
                setOpen(false); // Close dialog after delete
                setLoading(false);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            setError(error.message);
            setOpen(false);
            setLoading(false);
        } finally {
            setOpen(false);
            setLoading(false);
        }
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

    const handleSort = (columnKey) => {
        let direction = "asc";
        if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
        direction = "desc";
        }
        setSortConfig({ key: columnKey, direction });
    };

    // Function to sort data
    // Handle sorting

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
        const newSelected = paymentTransaction.map((n) => n.id);
        setSelectedItem(newSelected);
        return;
        }
        setSelectedItem([]);
    };

    const handleCheckBoxChange = (event, id) => {
        const selectedIndex = selectedItem.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedItem, id);
        } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedItem.slice(1));
        } else if (selectedIndex === selectedItem.length - 1) {
        newSelected = newSelected.concat(selectedItem.slice(0, -1));
        } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
            selectedItem.slice(0, selectedIndex),
            selectedItem.slice(selectedIndex + 1)
        );
        }
        setSelectedItem(newSelected);
    };

    const handleExportToExcel = () => {
        const exportData = paymentTransaction.map((payment) => ({
        "Tenant Name": `${payment.tenant.firstname} ${payment.tenant.lastname}`,
        "Rented Unit":
            payment.tenant.rental_agreement[0].rented_unit.apartment_name,
        Amount: payment.amount,
        Date: payment.date,
        "Transaction Type": payment.transaction_type,
        Status: payment.status,
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Payments");
        XLSX.writeFile(wb, "payment_transactions.xlsx");
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

    // const sortedUnits = paymentTransaction && Array.isArray(paymentTransaction)
    // ? [...paymentTransaction].sort((a, b) => {
    //     if (a[sortConfig.key] < b[sortConfig.key]) {
    //     return sortConfig.direction === 'asc' ? -1 : 1;
    //     }
    //     if (a[sortConfig.key] > b[sortConfig.key]) {
    //     return sortConfig.direction === 'asc' ? 1 : -1;
    //     }
    //     return 0;
    // })
    // : [];

    // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        // Check if paymentTransaction is an array
        if (!Array.isArray(paymentTransaction)) {
        console.error("paymentTransaction is not an array:", paymentTransaction);
        return []; // Return an empty array if paymentTransaction is not an array
        }

        const filteredPayment = paymentTransaction.filter((payment) => {
        const searchLower = searchTerm.toLowerCase();
        const tenantName = `${payment.tenant?.firstname || ""} ${
            payment.tenant?.lastname || ""
        }`.toLowerCase();
        const contact = `${payment.tenant?.contact || ""}`.toLowerCase();
        const rentedUnit =
            payment.tenant?.rental_agreement[0]?.rented_unit?.apartment_name?.toLowerCase() ||
            "";
        const amount = payment.amount.toString();
        const status = payment.status.toLowerCase();
        const date = payment?.date || "";
        const formatedDate = formatDate(date);
        const type = payment?.transaction_type.toLowerCase() || "";

        return (
            tenantName.includes(searchLower) ||
            rentedUnit.includes(searchLower) ||
            contact.includes(searchLower) ||
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
            case "unit":
                aValue =
                a.tenant?.rental_agreement[0]?.rented_unit?.apartment_name?.toLowerCase() ||
                "";
                bValue =
                b.tenant?.rental_agreement[0]?.rented_unit?.apartment_name?.toLowerCase() ||
                "";
                break;
            case "amount":
                aValue = parseFloat(a.amount) || 0; // Convert to number, default to 0
                bValue = parseFloat(b.amount) || 0;
                break;
            case "date":
                aValue = new Date(a.date);
                bValue = new Date(b.date);
                break;
            case "transaction_type":
                aValue = a.transaction_type.toLowerCase();
                bValue = b.transaction_type.toLowerCase();
                break;
            // case 'status':
            //     aValue = a.status.toLowerCase();
            //     bValue = b.status.toLowerCase();
            //     break;
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
    }, [paymentTransaction, searchTerm, sortConfig]);

    console.log(filteredAndSortedData);

    const paginatedPayments = filteredAndSortedData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );
    // console.log(sortedUnits);

    return (
        <Box sx={{ maxWidth: 1400, margin: "auto", overflowX: "auto" }}>
        <Paper
            elevation={2}
            sx={{
            maxWidth: {
                xs: 320,
                sm: 767,
                md: 1000,
                lg: 1490,
                borderRadius: "12px",
                borderTop: '4px solid', 
                borderTopColor: '#7e57c2'
            },
            }}
        >
            <TableContainer>
            <Toolbar
                sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
                // numSelected > 0 && {
                //   bgcolor: (theme) =>
                //     alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                // },
                ]}
            >
                <Typography
                sx={{
                    color: "#263238",
                    flex: "1 1 100%",
                    mt: "0.4rem",
                    mb: "0.4rem",
                    fontSize: { xs: "18px", sm: "18px", md: "18px", lg: "22px" },
                }}
                variant="h4"
                id="tableTitle"
                component="div"
                letterSpacing={2}
                >
                List of {selectedCategory} Payment
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
                <Search value={searchTerm} onChange={handleSearchChange}>
                    <SearchIconWrapper>
                    <SearchIcon fontSize="small" />
                    </SearchIconWrapper>
                    <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                    />
                </Search>
                <GeneralTooltip title="Filter Table">
                    <IconButton
                    onClick={handleMenuOpen}
                    sx={{ ml: "-0.5rem", mr: "0.6rem" }}
                    >
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
                {/* <GeneralTooltip title="Download file">
                    <IconButton
                    sx={{ ml: "-0.5rem", mr: "0.6rem" }}
                    onClick={handleExportToExcel}
                    >
                    <CloudDownloadOutlinedIcon fontSize="medium" />
                    </IconButton>
                </GeneralTooltip> */}
                </Box>
            </Toolbar>
            <Table size="small" sx={{ mt: 2 }}>
                <TableHead sx={{ backgroundColor: "whitesmoke", p: 2 }}>
                <TableRow>
                    {/* <StyledTableCell>
                        <Checkbox
                            color="primary"
                            onChange={handleSelectAllClick}
                            indeterminate={
                            selectedItem.length > 0 &&
                            selectedItem.length < paymentTransaction.length
                            }
                            inputProps={{
                            "aria-label": "select all desserts",
                            }}
                            // checked={isSelected}
                            // inputProps={{
                            // 'aria-labelledby': labelId,
                            // }}
                        />
                        </StyledTableCell> */}
                    <StyledTableCell onClick={() => handleSort("firstname")}>
                    Tenant Name{" "}
                    {sortConfig.key === "firstname" &&
                        (sortConfig.direction === "asc" ? (
                        <NorthIcon
                            fontSize="extrasmall"
                            justifyContent="center"
                            color="#bdbdbd"
                        />
                        ) : (
                        <SouthIcon fontSize="extrasmall" />
                        ))}
                    </StyledTableCell>
                    <StyledTableCell onClick={() => handleSort("unit")}>
                    Rented Unit{" "}
                    {sortConfig.key === "unit" &&
                        (sortConfig.direction === "asc" ? (
                        <NorthIcon
                            fontSize="extrasmall"
                            justifyContent="center"
                            color="#bdbdbd"
                        />
                        ) : (
                        <SouthIcon fontSize="extrasmall" />
                        ))}
                    </StyledTableCell>
                    <StyledTableCell onClick={() => handleSort("amount")}>
                    Amount{" "}
                    {sortConfig.key === "amount" &&
                        (sortConfig.direction === "asc" ? (
                        <NorthIcon
                            fontSize="extrasmall"
                            justifyContent="center"
                            color="#bdbdbd"
                        />
                        ) : (
                        <SouthIcon fontSize="extrasmall" />
                        ))}
                    </StyledTableCell>
                    <StyledTableCell onClick={() => handleSort("date")}>
                    Payment Date{" "}
                    {sortConfig.key === "date" &&
                        (sortConfig.direction === "asc" ? (
                        <NorthIcon
                            fontSize="extrasmall"
                            justifyContent="center"
                            color="#bdbdbd"
                        />
                        ) : (
                        <SouthIcon fontSize="extrasmall" />
                        ))}
                    </StyledTableCell>
                    <StyledTableCell onClick={() => handleSort("date")}>
                        Date Coverage{" "}
                        {sortConfig.key === "date" &&
                            (sortConfig.direction === "asc" ? (
                            <NorthIcon fontSize="extrasmall" />
                            ) : (
                            <SouthIcon fontSize="extrasmall" />
                            ))}
                    </StyledTableCell>
                    <StyledTableCell onClick={() => handleSort("transaction_type")}>
                    Transaction Type{" "}
                    {sortConfig.key === "transaction_type" &&
                        (sortConfig.direction === "asc" ? (
                        <NorthIcon
                            fontSize="extrasmall"
                            justifyContent="center"
                            color="#bdbdbd"
                        />
                        ) : (
                        <SouthIcon fontSize="extrasmall" />
                        ))}
                    </StyledTableCell>
                    <StyledTableCell>
                    Status{" "}
                    {sortConfig.key === "status" &&
                        (sortConfig.direction === "asc" ? (
                        <NorthIcon
                            fontSize="extrasmall"
                            justifyContent="center"
                            color="#bdbdbd"
                        />
                        ) : (
                        <SouthIcon fontSize="extrasmall" />
                        ))}
                    </StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {paginatedPayments && paginatedPayments.length > 0 ? (
                    paginatedPayments &&
                    paginatedPayments.map((item, index) => {
                    const isSelected = selectedItem.includes(item.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                        <StyledTableRow
                        key={item.id}
                        tabIndex={-1}
                        selected={isSelected}
                        aria-checked={isSelected}
                        onChange={(event) => handleCheckBoxChange(event, item.id)}
                        >
                        {/* <StyledTablebody>
                                <Checkbox
                                color="primary"
                                checked={isSelected}
                                inputProps={{
                                    "aria-labelledby": labelId,
                                }}
                                />
                            </StyledTablebody> */}
                        <StyledTablebody>
                            {item.tenant.firstname} {item.tenant.lastname}
                            <Divider sx={{ width: "98%" }} />
                            <Typography
                            sx={{
                                fontSize: "13px",
                                color: "gray",
                                fontStyle: "italic",
                                mt: "0.3rem",
                            }}
                            >
                            Contact no. {item.tenant.contact}
                            </Typography>
                        </StyledTablebody>
                        <StyledTablebody>
                            {item.tenant.rental_agreement[0]?.rented_unit
                            ?.apartment_name ||
                            item.tenant.rental_agreement[0]?.rented_unit
                                ?.boarding_house_name ||
                            "N/A"}
                        </StyledTablebody>
                        <StyledTablebody>{item.amount}</StyledTablebody>
                        <StyledTablebody>{formatDate(item.date)}</StyledTablebody>
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
                        <StyledTablebody>{item.transaction_type}</StyledTablebody>
                        <StyledTablebody>
                            <Chip
                            label={item.status}
                            variant="contained"
                            // backgroundColor={item.status === 'Available' ? '#ede7f6' : 'secondary'}
                            color={
                                item.status === "Paid"
                                ? "success"
                                : item.status === "Ongoing"
                                ? "primary"
                                : "secondary"
                            }
                            icon={
                                item.status === "Paid" ? (
                                <CheckCircleOutlineSharpIcon />
                                ) : item.status === "Ongoing" ? (
                                <AutorenewOutlinedIcon fontSize="small" />
                                ) : (
                                <PushPinOutlinedIcon fontSize="small" />
                                )
                            }
                            sx={{
                                backgroundColor:
                                item.status === "Paid"
                                    ? "#e8f5e9"
                                    : item.status === "Ongoing"
                                    ? "#ede7f6"
                                    : "#ffe0b2",
                                color:
                                item.status === "Paid"
                                    ? "#004d40"
                                    : item.status === "Ongoing"
                                    ? "#512da8"
                                    : "#e65100",
                                "& .MuiChip-label": {
                                color:
                                    item.status === "Paid"
                                    ? "#004d40"
                                    : item.status === "Ongoing"
                                    ? "#512da8"
                                    : "#e65100",
                                fontWeight: 560,
                                },
                            }}
                            />
                        </StyledTablebody>
                        <TableCell align="center">
                            <AcceptToolTip title="Edit">
                            <IconButton
                                onClick={() => handleEdit(item.id)}
                                sx={{
                                "&:hover": { backgroundColor: "#66bb6a" },
                                height: "35px",
                                width: "35px",
                                }}
                            >
                                <DriveFileRenameOutlineOutlinedIcon
                                sx={{
                                    color: "#4caf50",
                                    "&:hover": { color: "#fafafa" },
                                }}
                                />
                            </IconButton>
                            </AcceptToolTip>
                            <CustomTooltip title="Delete">
                            <IconButton
                                onClick={() => handleClickOpen(item.id)}
                                sx={{
                                "&:hover": { backgroundColor: "#e57373" },
                                height: "35px",
                                width: "35px",
                                }}
                            >
                                <DeleteForeverOutlinedIcon
                                sx={{
                                    color: "#e57373",
                                    "&:hover": { color: "#fafafa" },
                                }}
                                />
                            </IconButton>
                            </CustomTooltip>
                        </TableCell>
                        </StyledTableRow>
                    );
                    })
                ) : (
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
            rowsPerPageOptions={[10, 15, 25]}
            component="div"
            count={filteredAndSortedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        <React.Fragment>
            <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            >
            <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-dialog-description">
                Are you sure you want to delete this item? This action cannot be
                undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                Cancel
                </Button>
                <Button onClick={handleDelete} color="error" variant="contained">
                Delete
                </Button>
            </DialogActions>
            </Dialog>
        </React.Fragment>
        </Box>
    );
}
