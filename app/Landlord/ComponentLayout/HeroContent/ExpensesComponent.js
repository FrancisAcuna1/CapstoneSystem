"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Link,
  Breadcrumbs,
  InputLabel,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PaymentTransactionTable from "../TableComponent/PaymentTransactionTable";
import SuccessSnackbar from "../Labraries/snackbar";
import { SnackbarProvider } from "notistack";
import ErrorSnackbar from "../Labraries/ErrorSnackbar";
import CreatePaymentTransaction from "../ModalComponent/AddPaymentModal";
import AddExpensesTransaction from "../ModalComponent/AddExpenesesModal";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { router } from "next/client";
import ExpensesCard from "../Labraries/ExpensesCard";
import ExpenseChart from "../ChartComponent/expenseschart";
import ExpensesTable from "../TableComponent/ExpensesTable";
import AddRecurringExpenses from "../ModalComponent/AddRecurringExpensesModal";

export default function ExpensesComponent({ loading, setLoading }) {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState("all");
    const [selectedYear, setSelectedYear] = useState("2024");
    const [selectedMonth, setSelectedMonth] = useState("all");
    // const [selectedCategory, setSelectedCategory] = useState('');
    const [successful, setSuccessful] = useState(null);
    const [error, setError] = useState(null);
    const [editItemId, setEditItemId] = useState(null); //for editing manual expenses
    const [open, setOpen] = useState(false); // for modal of expenses
    const [openRecurringModal, setOpenRecurringModal] = useState(false); //for recurring modal
    const [isEditing, setIsEditing] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    console.log(selectedTab);
    console.log(refreshTrigger);

    const handleDataRefresh = useCallback(() => {
        setRefreshTrigger((prev) => prev + 1); // Increment to trigger refresh
    }, []);

    const handleOpen = () => setOpen(true); // for modal of expenses
    const handleClose = () => {
        setOpen(false);
        setEditItemId(null);
    }; // for modal of expenses

    const handleOpenModal = () => setOpenRecurringModal(true); //for recurring modal
    //for recurring modal\
    const handleCloseModal = () => {
        setOpenRecurringModal(false);
        setEditItemId(null);
    };

    const handleEdit = (id) => {
        console.log("Edit Property:", id);
        setEditItemId(id);
        setOpen(true);
        setIsEditing(true);
    };

    const months = [
        { value: "all", label: "All Months" },
        { value: "01", label: "January" },
        { value: "02", label: "February" },
        { value: "03", label: "March" },
        { value: "04", label: "April" },
        { value: "05", label: "May" },
        { value: "06", label: "June" },
        { value: "07", label: "July" },
        { value: "08", label: "August" },
        { value: "09", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
        // Add your year change logic here
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
        // Add your month change logic here
    };

    const generateYears = (startYear, futureYear) => {
        const years = [];
        const currentYear = new Date().getFullYear();
        for (let year = startYear; year <= currentYear + futureYear; year++) {
        years.push(year.toString());
        }
        return years;
    };
    // Example usage
    // const currentYear = new Date().getFullYear();
    const years = generateYears(1999, 20);

    const handleChangeTab = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{ maxWidth: 1400, margin: "auto" }}>
        <Typography
            variant="h5"
            letterSpacing={3}
            sx={{ marginLeft: "1px", fontSize: "24px", fontWeight: "bold", mt: 5 }}
        >
            Expenses Tracking
        </Typography>
        <Grid item xs={12} sx={{ marginLeft: "5px", mt: 2 }}>
            <Breadcrumbs
            separator={
                <NavigateNextIcon sx={{ fontSize: "22px", ml: -0.6, mr: -0.6 }} />
            }
            aria-label="breadcrumb"
            sx={{ fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
            >
            <Link
                letterSpacing={2}
                underline="hover"
                color="inherit"
                href="/Landlord/Home"
            >
               <HomeOutlinedIcon sx={{color:'#673ab7', mt:0.5}}/>
            </Link>
            <Typography
                letterSpacing={2}
                color="text.primary"
                sx={{color:'#263238', fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
            >
                Expenses Tracking
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
            <Box sx={{ display: "flex", justifyContent: "end", gap: 3 }}>
                <SnackbarProvider maxSnack={3}>
                <AddExpensesTransaction
                    loading={loading}
                    setLoading={setLoading}
                    setSuccessful={setSuccessful}
                    successful={successful}
                    setError={setError}
                    error={error}
                    editItemId={editItemId}
                    open={open}
                    handleOpen={handleOpen}
                    handleClose={handleClose}
                    handleEdit={handleEdit}
                    onRefresh={handleDataRefresh} // Add this prop
                />
                </SnackbarProvider>
            </Box>
            </Grid>
            <Grid item xs={12}>
            {/* Option 2: Styled Version with Icons and Better Visual Hierarchy */}
            <Box
                sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                bgcolor: "background.paper",
                p: 2,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                }}
            >
                <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "center",
                }}
                >
                <CalendarMonthIcon sx={{ color: "primary.main" }} />

                <FormControl
                    size="small"
                    sx={{
                    minWidth: 100,
                    "& .MuiOutlinedInput-root": {
                        bgcolor: "background.paper",
                    },
                    }}
                >
                    <InputLabel>Year</InputLabel>
                    <Select
                    value={selectedYear}
                    label="Year"
                    onChange={handleYearChange}
                    MenuProps={{
                        PaperProps: {
                        sx: { maxHeight: 300 },
                        },
                    }}
                    >
                    {years.map((year) => (
                        <MenuItem key={year} value={year}>
                        {year}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <FormControl
                    size="small"
                    sx={{
                    minWidth: 150,
                    "& .MuiOutlinedInput-root": {
                        bgcolor: "background.paper",
                    },
                    }}
                >
                    <InputLabel>Month</InputLabel>
                    <Select
                    value={selectedMonth}
                    label="Month"
                    onChange={handleMonthChange}
                    MenuProps={{
                        PaperProps: {
                        sx: { maxHeight: 300 },
                        },
                    }}
                    >
                    {months.map((month) => (
                        <MenuItem key={month.value} value={month.value}>
                        {month.label}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Box>

                <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    ml: { xs: 0, sm: "auto", lg: "51rem" }, // Reset margin left on mobile
                    fontSize: { xs: "15px", sm: "14px", lg: "inherit" },
                    lineHeight: { xs: "1.2", lg: "auto" },
                    overflow: "hidden",
                    wordWrap: "break-word",
                    width: { xs: "100%", sm: "auto" },
                    textOverflow: "ellipsis",
                    marginTop: { xs: 1, sm: 1, md: 0, lg: 0 },
                }}
                >
                {selectedMonth !== "all"
                    ? `Showing data for ${
                        months.find((m) => m.value === selectedMonth)?.label
                    } ${selectedYear}`
                    : `Showing all months for ${selectedYear}`}
                </Typography>
            </Box>
            </Grid>

            <Grid item xs={12} sx={{ mt: 4 }}>
            <ExpensesCard
                setLoading={setLoading}
                loading={loading}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
            />
            </Grid>

            <Grid item xs={12} sx={{ mt: 4 }}>
            <Paper
                elevation={2}
                sx={{
                maxWidth: { xs: 800, md: 940, lg: 1400 },
                height: { xs: "50vh", lg: "64vh" },
                padding: "1.8rem 1rem 4rem 1rem",
                borderRadius: "10px",
                justifyContent: "center",
                alignItems: "center",
                }}
            >
                <Typography
                variant="h5"
                color={"black"}
                sx={{ fontSize: "20px", marginTop: "0.6rem", ml: "1rem" }}
                letterSpacing={2}
                gutterBottom
                >
                Monthly Income
                </Typography>
                <ExpenseChart
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                />
            </Paper>
            </Grid>
            <Grid item xs={12}>
            <SnackbarProvider maxSnack={3}>
                <Paper
                elevation={2}
                sx={{
                    maxWidth: { xs: 312, sm: 741, md: 1200, lg: 1400 },
                    borderRadius: "8px",
                    height: "auto",
                    mt: 6,
                }}
                >
                <ExpensesTable
                    setError={setError}
                    setSuccessful={setSuccessful}
                    setLoading={setLoading}
                    handleEdit={handleEdit}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    open={open}
                    setOpen={setOpen}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    editItemId={editItemId}
                    setEditItemId={setEditItemId}
                    openRecurringModal={openRecurringModal}
                    setOpenRecurringModal={setOpenRecurringModal}
                    handleOpenModal={handleOpenModal}
                    handleCloseModal={handleCloseModal}
                    selectedTab={selectedTab}
                    refreshTrigger={refreshTrigger}
                />
                </Paper>
            </SnackbarProvider>
            </Grid>
        </Grid>
        </Box>
    );
}
