"use client";

import React from "react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Grid,
  Fab,
  Chip,
  Paper,
  Tooltip,
  IconButton,
  Divider,
  Button,
  CardMedia,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Toolbar,
  InputBase,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha, useTheme, css } from "@mui/system";
import TuneIcon from "@mui/icons-material/Tune";
import BedroomChildOutlinedIcon from "@mui/icons-material/BedroomChildOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import useSWR from "swr";
import NoResultUI from "../Labraries/NoResults";

// Enhanced Search Component
const GlobalSearchContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  marginTop: "50px",
  maxWidth: 600,
  //   margin: "0 auto 20px",
  borderRadius: "15px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,

  "&:hover": {
    boxShadow: "0 12px 25px rgba(0,0,0,0.1)",
    transform: "translateY(-2px)",
  },
}));
const SearchInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  padding: "10px 15px",
  fontSize: "16px",
  color: theme.palette.text.primary,

  "& ::placeholder": {
    color: alpha(theme.palette.text.primary, 0.6),
    opacity: 1,
  },
}));

const SearchButton = styled(IconButton)(({ theme }) => ({
  padding: "10px",
  color: theme.palette.primary.main,

  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const FilterButton = styled(IconButton)(({ theme }) => ({
  padding: "10px",
  color: theme.palette.text.secondary,

  "&:hover": {
    backgroundColor: alpha(theme.palette.text.secondary, 0.1),
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
    : "inherit", // Apply background color if selected
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1), // Lighter on hover
  },
  color: "#263238",
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

const fetcherTenantInfo = async ([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

const fetcherBhDetails = async ([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

export default function RoomsTable({
  boardinghouseId,
  propsId,
  loading,
  setLoading,
  handleOpenDrawer,
}) {
  const theme = useTheme();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({});
  const [details, setDetails] = useState([]);
  const [tenantInfo, setTenantInfo] = useState([]);
  const boardinghouseID = parseInt(boardinghouseId);
  const propsID = parseInt(propsId);
  const propertyType = details?.boardinghouse?.property_type;
  console.log(boardinghouseID);
  console.log(propsID);
  console.log(details);
  console.log(tenantInfo);

  const getUserToken = () => {
    const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json
    const accessToken = userData.accessToken;
    return accessToken;
  };
  const token = getUserToken();

  const {
    data: responseTenantInfo,
    error: errorTenantInfo,
    isLoading: isLoadingTenantInfo,
  } = useSWR(
    token && boardinghouseID && propsID
      ? [
          `http://127.0.0.1:8000/api/property/${propsID}/bhdetails/${boardinghouseID}`,
          token,
        ]
      : null,
    fetcherTenantInfo,
    {
      refreshInterval: 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
    }
  );
  console.log(errorTenantInfo);
  useEffect(() => {
    if (responseTenantInfo) {
      setDetails(responseTenantInfo);
      setLoading(false);
    } else if (isLoadingTenantInfo) {
      setLoading(true);
    }
  }, [responseTenantInfo, isLoadingTenantInfo, setLoading]);

  const {
    data: responseBhDetails,
    error: errorResponseDetails,
    isLoading: isLoadingResponseDetails,
  } = useSWR(
    token && boardinghouseID && propertyType
      ? [
          `http://127.0.0.1:8000/api/occupied_bed_info/${boardinghouseID}/type/${propertyType}`,
          token,
        ]
      : null,
    fetcherBhDetails,
    {
      refreshInterval: 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
    }
  );
  console.log(errorResponseDetails);
  useEffect(() => {
    if (responseBhDetails && Array.isArray(responseBhDetails?.data)) {
      setTenantInfo(responseBhDetails.data); // Set valid data array
    } else {
      setTenantInfo([]); // Fallback to empty array if data is not an array
    }
    setLoading(isLoadingResponseDetails);
  }, [responseBhDetails, isLoadingResponseDetails, setLoading]);

  if (tenantInfo && tenantInfo.length > 0) {
    const tenantId = tenantInfo[1]?.tenant_id; // Safely access tenant_id
    console.log("Tenant ID:", tenantId);
  }

  const handleClick = (tenantId) => {
    setLoading(true);
    router.push(
      `/Landlord/Property/${propsID}/occupiedboardinghouse/${boardinghouseID}/tenant/${tenantId}`
    );
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterAndPaginateBeds = (room) => {
    // Ensure pagination state exists for this room
    if (!pagination[room.id]) {
      setPagination((prev) => ({
        ...prev,
        [room.id]: {
          page: 0,
          rowsPerPage: 5,
        },
      }));
    }

    // Filter beds based on search term
    const filteredBeds = room.beds.filter((bed) =>
      Object.values(bed).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Get current room's pagination settings
    const roomPagination = pagination[room.id] || { page: 0, rowsPerPage: 5 };

    // Paginate filtered beds
    const paginatedBeds = filteredBeds.slice(
      roomPagination.page * roomPagination.rowsPerPage,
      (roomPagination.page + 1) * roomPagination.rowsPerPage
    );

    return {
      filteredBeds,
      paginatedBeds,
    };
  };

  const handleChangePage = (roomId) => (event, newPage) => {
    setPagination((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        page: newPage,
      },
    }));
  };

  const handleChangeRowsPerPage = (roomId) => (event) => {
    setPagination((prev) => ({
      ...prev,
      [roomId]: {
        page: 0,
        rowsPerPage: parseInt(event.target.value, 10),
      },
    }));
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Box sx={{ maxWidth: 1400, margin: "auto", overflowX: "auto" }}>
      <GlobalSearchContainer elevation={2}>
        <SearchButton aria-label="search">
          <SearchIcon />
        </SearchButton>

        <SearchInput
          placeholder="Search across all rooms..."
          inputProps={{ "aria-label": "search rooms" }}
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
        />
      </GlobalSearchContainer>
      {details?.boardinghouse?.rooms?.map((room) => {
        const { filteredBeds, paginatedBeds } = filterAndPaginateBeds(room);
        const roomPagination = pagination[room.id] || {
          page: 0,
          rowsPerPage: 5,
        };
        return (
          <Paper
            key={room.id}
            elevation={2}
            sx={{
              maxWidth: {
                xs: 360,
                sm: 767,
                md: 1000,
                lg: 1490,
              },
              borderRadius: "12px",
              borderTop: '4px solid', 
              borderTopColor: '#7e57c2',
              padding: "30px",
              marginTop: "15px",
              // background: 'linear-gradient(145deg, #f4f4f8 0%, #ffffff 100%)',
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? (
              <>
                <Box display="flex" alignItems="center" mb={2}>
                  {/* Text Skeleton */}
                  <Box flex={1}>
                    <Skeleton
                      animation="wave"
                      variant="text"
                      width="50%"
                      height={60}
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    width={60}
                    height={60}
                    sx={{ marginLeft: 2 }}
                  />
                </Box>
                <Box>
                  <Skeleton
                    animation="wave"
                    variant="text"
                    width="100%"
                    height={35}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton
                    animation="wave"
                    variant="text"
                    width="100%"
                    height={35}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton
                    animation="wave"
                    variant="text"
                    width="100%"
                    height={35}
                    sx={{ mb: 1 }}
                  />
                </Box>
              </>
            ) : (
              <>
                <Grid
                  container
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Grid item>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: theme.palette.primary.main,
                        letterSpacing: 2,
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                        pb: 1,
                      }}
                    >
                      Room: {room.room_number}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Box
                      sx={{
                        background: "linear-gradient(145deg, #8785d0, #6c65b3)",
                        borderRadius: "12px",
                        height: "65px",
                        width: "65px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 5px 15px rgba(135,133,208,0.3)",
                      }}
                    >
                      <BedroomChildOutlinedIcon
                        fontSize="large"
                        sx={{ color: "white" }}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <TableContainer>
                  <Table size="medium" sx={{ mt: 2 }}>
                    <TableHead sx={{ backgroundColor: "whitesmoke", p: 2 }}>
                      <TableRow>
                        {/* <StyledTableCell>Room Number</StyledTableCell> */}
                        <StyledTableCell>Bed Number</StyledTableCell>
                        <StyledTableCell>Price</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell>Tenant Name</StyledTableCell>
                        <StyledTableCell>Lease Start Date</StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedBeds.length > 0 ? 
                        (paginatedBeds.map((bed) => {
                        // const tenant = tenantInfo.find((tenant) =>
                        //   tenant.occupied_beds?.some((occupiedBed) => occupiedBed.bed_id === bed.id)
                        // );
                        const tenant = tenantInfo?.find(
                          (t) => t?.bed_id === bed.id
                        );

                        return (
                          <StyledTableRow
                            key={`room-${room.room_number}-bed-${bed.bed_number}`}
                            tabIndex={-1}
                          >
                            {/* <TableCell>{room.room_number}</TableCell> */}
                            <TableCell>{bed.bed_number}</TableCell>
                            <TableCell>{bed.price}</TableCell>
                            <TableCell>
                              <Chip
                                label={capitalizeFirstLetter(bed.status)}
                                variant="contained"
                                sx={{
                                  backgroundColor:
                                    bed.status === "Occupied"
                                      ? "#ffebee"
                                      : "#e8f5e9",
                                  color:
                                    bed.status === "Occupied"
                                      ? "#f44336"
                                      : "#388e3c",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              {tenant
                                ? `${tenant.rental_agreement?.tenant?.firstname} ${
                                    tenant.rental_agreement?.tenant?.middlename || ""
                                  } ${tenant.rental_agreement?.tenant?.lastname || ""}`.trim()
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              {tenant?.rental_agreement?.lease_start_date
                                ? formatDate(tenant?.rental_agreement?.lease_start_date)
                                : "N/A"}
                            </TableCell>
                            <TableCell align="center">
                              {tenant ? ( // Check if tenant exists for the specific bed
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  sx={{
                                    borderRadius: "8px",
                                    mt: 1,
                                  }}
                                  onClick={() => handleClick(tenant?.rental_agreement?.tenant_id)}
                                >
                                  View Tenant
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  sx={{
                                    borderRadius: "8px",
                                    mt: 1,
                                  }}
                                  onClick={handleOpenDrawer}
                                >
                                  Register Tenant
                                </Button>
                              )}
                            </TableCell>
                          </StyledTableRow>
                        );
                      })):(
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
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredBeds.length}
                  rowsPerPage={roomPagination.rowsPerPage}
                  page={roomPagination.page}
                  onPageChange={handleChangePage(room.id)}
                  onRowsPerPageChange={handleChangeRowsPerPage(room.id)}
                />
              </>
            )}
          </Paper>
        );
      })}
    </Box>
  );
}
