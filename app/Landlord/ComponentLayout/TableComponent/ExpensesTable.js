"use client";
import React, { useState, useEffect, useMemo, useCallback} from "react";
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
  Menu,
  MenuItem,
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
import { format, parseISO } from "date-fns";
import RecurringDialog from "../Labraries/RecurringDialog";
import { SnackbarProvider, useSnackbar } from "notistack";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditRecurringModal from "../ModalComponent/EditRecurringModal";
import AddExpensesTransaction from "../ModalComponent/AddExpenesesModal";
import ViewExpensesDialog from "../Labraries/ViewExpensesDialog";

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

const ViewToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#2196f3", // Background color of the tooltip
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

export default function ExpensesTable({
  openRecurringModal,
  setOpenRecurringModal,
  editItemId,
  setEditItemId,
  handleEdit,
  setSuccessful,
  setError,
  setLoading,
  selectedYear,
  selectedMonth,
  setIsEditing,
  isEditing,
  handleCloseModal,
  refreshTrigger
}) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = React.useState(false); // for recurring dialog
  const [dialogAlertOpen, setDialogAlertOpen] = useState(false); //for delete confirmation
  const [viewDialogOpen, setViewDialogOpen] = useState(false); //for view manual expenses dialog
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [selectedItem, setSelectedItem] = useState([]); //for check box
  const [selectedRecurringItem, setSelectedRecurringItem] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "name",direction: "asc",});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [recurringDetails, setRecurringDetails] = useState([]);
  // const [editItemId, setEditItemId] = useState([]); //for recurring data to edit;
  const [viewExpensesId, setViewExpensesId] = useState([]);
  const categories = ["all", "maintenance fee", "utility bill", "recurring"];

  console.log(recurringDetails);
  console.log(selectedCategory);
  console.log(selectedMonth)

  const handleClickOpen = () => {
  setOpenDialog(true);
  }; // for recurring dialog

  const handleClose = () => {
  setOpenDialog(false);
  }; // for recurring dialog

  const handleCategoryChange = (category) => {
      setSelectedCategory(category);
      setAnchorEl(null);
  };

  // filter
  const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
      setAnchorEl(null);
  };

  //for delete confirmation
  const handleDialogOpen = () => {
      setDialogAlertOpen(true)
  }
  const handleDialogClose = () => {
      setDialogAlertOpen(false)
  }

  // for viewing expenses
  const handleViewExpenses = (id) => {
    setViewDialogOpen(true)
    setViewExpensesId(id);
  }
  const handleCloseViewExpenses = () => {
    setViewDialogOpen(false)
    setViewExpensesId(null);
  }

  const handleEditRecurring = (id) => {
      setEditItemId(id)
      setOpenRecurringModal(true);
      setIsEditing(true);
  }

  const fetchedData = useCallback(async () => {
    const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json
    const accessToken = userData.accessToken;

    if (accessToken) {
      console.log(accessToken);
      try {
        setLoading(true);
        const url =
          selectedCategory === "all"
            ? "http://127.0.0.1:8000/api/get_all_expenses"
            : `http://127.0.0.1:8000/api/filter_expenses/${selectedCategory}`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            month: selectedMonth,
            year: selectedYear,
          }),
        });

        const data = await response.json();
        console.log("Data fetched:", data);

        if (response.ok) {
          setRecurringDetails(data.data);
          console.log("Data fetched:", data.data);
        } else {
          console.log("Error:", response.status);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  }, [selectedCategory, selectedMonth, selectedYear, setLoading]);

  useEffect(() => {
    fetchedData();
  }, [fetchedData, setError, setLoading, refreshTrigger, selectedCategory]);

  console.log(selectedItem)
  const handleDelete = async(e) => {
    e.preventDefault();

    const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json 
    const accessToken = userData.accessToken;

    if(accessToken){
        let success = true;
        let data 
        for(const deleteId of selectedItem){
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/delete_expenses/${deleteId}`,{
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                })
                data = await response.json();
                console.log(data);
                if(!response.ok){
                    console.log(data.error);
                    // localStorage.setItem('errorMessage', data.message || 'Operation Error!');
                    enqueueSnackbar(data.message, {variant: 'error'})
                    setSelectedItem([]);
                    handleClose();
                    handleDialogClose();
                    success = false
                }
            }catch(error){
                console.log(error);
            }
        }
        if(success){
            // localStorage.setItem('successMessage', data.message || 'Operation Error!');
            enqueueSnackbar('Successfully Expenses Deleted!', {variant: 'success'})
            fetchedData()
            setSelectedItem([]);
            handleClose();
            setLoading(false);
            handleDialogClose()
        }
    }
  }

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
  }, [setSuccessful, setError]);

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
      const newSelected = recurringDetails.map((n) => n.id);
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
    const exportData = recurringDetails.map((payment) => ({
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

  const sortedUnits =
    recurringDetails && Array.isArray(recurringDetails)
      ? [...recurringDetails].sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        })
      : [];

  // Get the first recurring expense for each `unit_id` and `category`
  // const firstRecurringExpenses = Object.values(
  //     recurringDetails.reduce((acc, expense) => {
  //     const key = `${expense.unit_id}-${expense.category}`;
  //     if (
  //         !acc[key] ||
  //         new Date(expense.expense_date) < new Date(acc[key].expense_date)
  //     ) {
  //         acc[key] = expense;
  //     }
  //     return acc;
  //     }, {})
  // );

  const processExpenses = () => {
    const nonRecurring = recurringDetails.filter((exp) => exp.recurring === 0);
    const recurring = recurringDetails.filter((exp) => exp.recurring === 1);

    // Group recurring expenses by unit, category, and type_of_bills
    const groupedRecurring = recurring.reduce((acc, expense) => {
      const key = `${expense.unit_id}-${expense.category}-${expense.type_of_bills}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(expense);
      return acc;
    }, {});

    // Get the first expense from each recurring group
    const summarizedRecurring = Object.values(groupedRecurring).map((group) => {
      const sortedGroup = group.sort(
        (a, b) => new Date(a.expense_date) - new Date(b.expense_date)
      );
      const firstExpense = sortedGroup[0];
      return {
        ...firstExpense,
        totalAmount: group.reduce(
          (sum, exp) => sum + parseFloat(exp.amount),
          0
        ),
        occurrences: group.length,
        relatedExpenses: group,
      };
    });

    const allExpenses = [...summarizedRecurring, ...nonRecurring];
    return allExpenses;
  };

  const processedExpenses = processExpenses();
  console.log(processedExpenses);
  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!Array.isArray(processedExpenses)) {
      return [];
    }

    const filteredExpenses = processedExpenses.filter((expenses) => {
      // Specific handling for recurring search
      const searchLower = searchTerm.toLowerCase();
      if (searchLower === 'recurring' || searchLower === 'yes') {
        return expenses.recurring === 1;
      }

      if (searchLower === 'not recurring' || searchLower === 'no') {
        return expenses.recurring === 0;
      }
      const category = expenses.category?.toLowerCase() || '';
      const description = expenses.description?.toLowerCase() || '';
      const bill_type = expenses.type_of_bills?.toLowerCase() || '';
      const frequency = expenses.frequency?.toLowerCase() || '';

      const rental_Unit =
        expenses.unit_type === "Apartment"
          ? expenses.unit?.apartment_name?.toLowerCase() || ""
          : expenses.unit?.boarding_house_name?.toLowerCase() || "";
      const amount = expenses.amount?.toString() || "";
      const date = expenses.expense_date;
      const formatedDate = formatDate(date);

      return (
        category.includes(searchLower) ||
        bill_type.includes(searchLower) ||
        rental_Unit.includes(searchLower) ||
        description.includes(searchLower) ||
        amount.includes(searchLower) ||
        frequency.includes(searchLower) ||
        formatedDate.toLowerCase().includes(searchLower)
      );
    });

    if (sortConfig.key) {
      filteredExpenses.sort((a, b) => {
        // Handle nested sorting for different columns
        let aValue, bValue;
        switch (sortConfig.key) {
          case "unit":
            aValue = a.unit?.apartment_name?.toLowerCase() || "";
            bValue = b.unit?.apartment_name?.toLowerCase() || "";
            break;
          case "amount":
            aValue = parseFloat(a.amount) || 0;
            bValue = parseFloat(b.amount) || 0;
            break;
          case "category": 
            aValue = a.category?.toLowerCase() || "";
            bValue = b.category?.toLowerCase() || "";
            break;
          case "type_of_bill":
            aValue = a.type_of_bills?.toLowerCase() || "";
            bValue = b.type_of_bills?.toLowerCase() || "";
            break;
          case "description":
            aValue = a.description?.toLowerCase() || '';
            bValue = b.description?.toLowerCase() || '';
            break;
          case "frequency":
            aValue = a.frequency?.toLowerCase() || "";
            bValue = b.frequency?.toLowerCase() || "";
            break;
          case "recurring":
            aValue = a.recurring ? 1 : 0; 
            bValue = b.recurring ? 1 : 0;
          case "date":
            aValue = new Date(a.expense_date);
            bValue = new Date(b.expense_date);
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

    return filteredExpenses;
  }, [processedExpenses, searchTerm, sortConfig]);

  console.log(filteredAndSortedData);
  const paginatedRecurringExpenses = filteredAndSortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  console.log(paginatedRecurringExpenses);

  // Open the dialog and set the selected item
  const handleViewClick = (item) => {
    const otherExpenses = recurringDetails.filter(
      (expense) =>
        expense.unit_id === item.unit_id &&
        expense.category === item.category &&
        expense.type_of_bills === item.type_of_bills &&
        // expense.description === expense.description &&
        expense.id !== item.id
    );
    setSelectedRecurringItem({ ...item, otherExpenses });
    setOpenDialog(true);
  };

  console.log(selectedRecurringItem)

  return (
    <Box sx={{ maxWidth: 1400, margin: "auto", overflowX: "auto" }}>
      <Paper
        elevation={2}
        sx={{
          maxWidth: {
            xs: 312,
            sm: 767,
            md: 1000,
            lg: 1490,
            borderRadius: "12px",
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
            {selectedItem.length > 0 ? (
              <Typography
                sx={{
                  color: "#263238",
                  flex: "1 1 100%",
                  mt: "1rem",
                  mb: "0.4rem",
                  fontSize: { xs: "18px", sm: "18px", md: "18px", lg: "18px" },
                }}
                variant="h4"
                id="tableTitle"
                component="div"
                letterSpacing={0.2}
              >
                {selectedItem.length} Selected Item
              </Typography>
            ) : (
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
                List of Recurring Expenses
              </Typography>
            )}
            {selectedItem.length > 0 ? (
              <CustomTooltip title="Delete">
                <IconButton
                  onClick={handleDialogOpen}
                  sx={{
                    mt: 2,
                    "&:hover": { backgroundColor: "#e57373" },
                    height: "35px",
                    width: "35px",
                  }}
                >
                  <DeleteForeverOutlinedIcon
                    fontSize="medium"
                    sx={{ color: "#e57373", "&:hover": { color: "#fafafa" } }}
                  />
                </IconButton>
              </CustomTooltip>
            ) : (
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
            )}
          </Toolbar>
          <Table size="small" sx={{ mt: 2 }}>
            <TableHead sx={{ backgroundColor: "whitesmoke", p: 2 }}>
              <TableRow>
                <StyledTableCell>
                  <Checkbox
                    color="primary"
                    onChange={handleSelectAllClick}
                    indeterminate={
                      selectedItem.length > 0 &&
                      selectedItem.length < processedExpenses.length
                    }
                    inputProps={{
                      "aria-label": "select all desserts",
                    }}
                    // checked={isSelected}
                    // inputProps={{
                    // 'aria-labelledby': labelId,
                    // }}
                  />
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort("date")}>
                  Date
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
                <StyledTableCell onClick={() => handleSort("unit")}>
                  Unit{" "}
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
                <StyledTableCell onClick={() => handleSort("category")}>
                  Category{" "}
                  {sortConfig.key === "category" &&
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
                <StyledTableCell onClick={() => handleSort("type_of_bill")}>
                  Type of Bills{" "}
                  {sortConfig.key === "type_of_bill" &&
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
                <StyledTableCell onClick={() => handleSort('description')}>
                  Description{" "}
                  {sortConfig.key === "description" &&
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
                <StyledTableCell onClick={() => handleSort('recurring')}>
                  Recurring{" "}
                  {sortConfig.key === "recurring" &&
                    (sortConfig.direction === "asc" ? (
                      <NorthIcon
                        fontSize="extrasmall"
                        justifyContent="center"
                        color="#bdbdbd"
                      />
                    ) : (
                      <SouthIcon fontSize="extrasmall" />
                    ))}
                </StyledTableCell >
                <StyledTableCell align="center" onClick={() => handleSort('frequency')}>
                  Frequency{""}
                  {sortConfig.key === "frequency" &&
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
              {paginatedRecurringExpenses &&
                paginatedRecurringExpenses.map((item, index) => {
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
                      <StyledTablebody>
                        <Checkbox
                          color="primary"
                          checked={isSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </StyledTablebody>
                      <StyledTablebody>
                        {formatDate(item.expense_date)}
                      </StyledTablebody>
                      <StyledTablebody>
                        {item.unit_type === "Apartment"
                          ? item.unit.apartment_name
                          : item.unit.boarding_house_name}
                      </StyledTablebody>
                      <StyledTablebody>₱ {item.amount}</StyledTablebody>
                      <StyledTablebody>{item.category || ""}</StyledTablebody>
                      <StyledTablebody>
                        {item.type_of_bills || "N/A"}
                      </StyledTablebody>
                      <StyledTablebody
                        sx={{
                          maxWidth: "200px", // adjust width as needed
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.description}
                      </StyledTablebody>
                      <StyledTablebody>
                        <Chip
                          label={item.recurring === 1 ? "Yes" : "No"} // You might want to add a status field in your payload
                          variant="contained"
                          color="success"
                          sx={{
                            backgroundColor: "#e8f5e9",
                            color: "#004d40",
                            "& .MuiChip-label": {
                              color: "#004d40",
                              fontWeight: 560,
                            },
                          }}
                        />
                      </StyledTablebody>
                      <StyledTablebody>
                        <Chip
                          label={item.frequency || "N/A"} // You might want to add a status field in your payload
                          variant="contained"
                          color="success"
                          sx={{
                            backgroundColor:
                              item.frequency === "monthly"
                                ? "#fff3e0"
                                : item.frequency === "daily"
                                ? "#fbe9e7"
                                : item.frequency === "weekly"
                                ? "#e3f2fd"
                                : item.frequency === "quarterly"
                                ? "#fff8e1"
                                : item.frequency === "yearly"
                                ? "#e8eaf6"
                                : "#cfd8dc",
                            color:
                              item.frequency === "monthly"
                                ? "#ffa726"
                                : item.frequency === "daily"
                                ? "#f4511e"
                                : item.frequency === "weekly"
                                ? "#1e88e5"
                                : item.frequency === "quarterly"
                                ? "#ffca28"
                                : item.frequency === "yearly"
                                ? "#3f51b5"
                                : "#37474f",
                            fontWeight: 550,
                          }}
                        />
                      </StyledTablebody>
                      <TableCell align="center">
                        {/* <Button
                          variant="outlined"
                          onClick={() => {
                            handleViewClick(item);
                          }}
                        >
                          view
                        </Button> */}
                        <ViewToolTip title="View">
                          <IconButton
                            onClick={() => {
                              item.recurring === 1 
                              ? handleViewClick(item) 
                              : handleViewExpenses(item.id)
                            }}
                            sx={{
                              "&:hover": { backgroundColor: "#2196f3" },
                              height: "35px",
                              width: "35px",
                            }}
                          >
                            <VisibilityOutlinedIcon
                              sx={{
                                color: "#2196f3",
                                "&:hover": { color: "#fafafa" },
                              }}
                            />
                          </IconButton>
                        </ViewToolTip>
                        <AcceptToolTip title="Edit">
                          <IconButton
                            onClick={() => item.recurring === 1 ? handleEditRecurring(item.id) : handleEdit(item.id)}
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
                        {/* <CustomTooltip title="Delete">
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
                        </CustomTooltip> */}
                      </TableCell>
                    </StyledTableRow>
                  );
                })}
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
      <Dialog
        open={dialogAlertOpen}
        onClose={handleDialogClose}
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
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarProvider maxSnack={3}>
        <RecurringDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
          selectedRecurringItem={selectedRecurringItem}
          setLoading={setLoading}
          setSuccessful={setSuccessful}
          setError={setError}
          refreshData={fetchedData}
          // setOpen={setOpen}
          // Open={Open}
          editItemId={editItemId}
          setEditItemId={setEditItemId}
          openRecurringModal={openRecurringModal}
          setOpenRecurringModal={setOpenRecurringModal}
          handleCloseModal={handleCloseModal}
        />
      </SnackbarProvider>
      <Box  sx={{display: 'none'}}>
        <EditRecurringModal
        setLoading={setLoading}  
        setSuccessful={setSuccessful}
        setError={setError}
        editItemId={editItemId}
        setEditItemId={setEditItemId}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        openRecurringModal={openRecurringModal}
        setOpenRecurringModal={setOpenRecurringModal}
        handleCloseModal={handleCloseModal}
        refreshData={fetchedData}
        />
        <ViewExpensesDialog
        handleOpen={handleViewExpenses}
        handleClose={handleCloseViewExpenses}
        viewExpensesId={viewExpensesId}
        open={viewDialogOpen}
        />
      </Box>
    </Box>
  );
}
