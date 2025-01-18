"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  Paper,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Skeleton,
  Grid,
  Chip,
  Card,
  CardMedia,
  IconButton,
  styled,
  Modal,
} from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
// import LocalPostOfficeOutlinedIcon from "@mui/icons-material/LocalPostOfficeOutlined";
import { format, parseISO } from "date-fns";
import { SnackbarProvider, useSnackbar } from "notistack";
import AddRemarksForm from "../ModalComponent/AddRemarkModal";
import useSWR from "swr";

import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  CalendarToday as CalendarIcon,
  Schedule as ClockIcon,
  LocationOn as MapPinIcon,
  CheckCircle as CheckCircleIcon,
  Error as AlertCircleIcon,
  Image as ImageIcon,
  Fullscreen as MaximizeIcon,
  Home as HomeSharpIcon
} from "@mui/icons-material";
import Image from "next/image";
const GradientHeader = styled(Box)(({ theme }) => ({
    background: `linear-gradient(to right, ${theme.palette.primary[50]}, ${theme.palette.primary[100]}, ${theme.palette.primary[50]})`,
    padding: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.primary[100]}`,
}));

const InfoCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${theme.palette.grey[100]}`,
    transition: "box-shadow 0.3s",
    "&:hover": {
    boxShadow: theme.shadows[4],
    },
}));

const ContactBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
    backgroundColor: theme.palette.grey[100],
    },
}));

const fetchUnitAddress = async([url, token]) => {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if(!response.ok){
        throw new Error(response.statusText)
      }
      return response.json()
}


const MaintenanceRequestDialog = ({
  open,
  handleClose,
  scroll = "paper",
  loading,
  setLoading,
  viewRequest,
  onRefresh,
}) => {
    const itemId = viewRequest.id;
    const { enqueueSnackbar } = useSnackbar();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [remarksOpen, setRemarksOpen] = useState(false);
    const [unitAddress, setUnitAddress] = useState([]);

    console.log(viewRequest);
    console.log(unitAddress);
    console.log(unitAddress?.tenant?.rented_unit?.boarding_house_name)
    const getUserToken = () => {
        const userDataString = localStorage.getItem('userDetails');
        const userData = JSON.parse(userDataString);
        const accessToken = userData.accessToken; // Access token
        return accessToken;
    }
    const token = getUserToken();

    const {data:UnitAddressResponse, error: responseError, isLoading: isLoadingResponse} = useSWR(
        token && [`http://127.0.0.1:8000/api/tenant_information_lease/${viewRequest.tenant_id}`, token] || null,
        fetchUnitAddress, {
            refreshInterval: 1000,
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            errorRetryCount: 3,
            onLoadingSlow: () => setLoading(true),
        }
    )

    console.log(responseError);

    useEffect(() => {
        if(UnitAddressResponse){
            setUnitAddress(UnitAddressResponse?.data || '');
            setLoading(false)
        }else if(isLoadingResponse){
            setLoading(true);
        }
    }, [UnitAddressResponse, isLoadingResponse, setLoading])


    const handleAcceptMaitenance = async () => {
        const userDataString = localStorage.getItem("userDetails");
        const userData = JSON.parse(userDataString); // Parse JSON
        const accessToken = userData.accessToken; //
        setLoading(true);
        if (accessToken) {
        try {
            const response = await fetch(
            `http://127.0.0.1:8000/api/accept_maintenance/${itemId}`,
            {
                method: "PUT",
                headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                },
            }
            );
            const data = await response.json();

            if (response.ok) {
            enqueueSnackbar(data.message, { variant: "success" });
            onRefresh();
            handleClose();
            setLoading(false);
            } else {
            handleClose();
            console.log(data.error);
            enqueueSnackbar(data.message, { variant: "error" });
            setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setLoading(false);
            handleClose();
        }
        } else {
        console.log("No user Found");
        setLoading(false);
        handleClose();
        }
    };

    const handleReject = () => {
        setRemarksOpen(true);
        handleClose();
    };
    
    console.log("Images:", viewRequest?.maintenance_images);

    const images =
        (viewRequest?.maintenance_images && viewRequest?.maintenance_images) || [];
    console.log("images:", images);
    const imageBaseUrl = "http://127.0.0.1:8000/MaintenanceImages/"; // Adjust this based on your API endpoint

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        });
    };

    const PriorityBadge = ({ priority = "medium" }) => {
        const colors = {
        high: { bg: "error.50", color: "error.700", border: "error.200" },
        medium: { bg: "warning.50", color: "warning.700", border: "warning.200" },
        low: { bg: "success.50", color: "success.700", border: "success.200" },
        };

        const style = colors[priority];

        return (
        <Chip
            icon={<AlertCircleIcon sx={{ fontSize: 14 }} />}
            label={`${
            priority.charAt(0).toUpperCase() + priority.slice(1)
            } Priority`}
            sx={{
            backgroundColor: style.bg,
            color: style.color,
            border: 1,
            borderColor: style.border,
            borderRadius: "16px",
            "& .MuiChip-label": {
                px: 1,
                py: 0.5,
                fontSize: "0.75rem",
                fontWeight: 500,
            },
            }}
        />
        );
    };

    return (
        <Box>
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
            elevation: 4,
            sx: { borderRadius: 2, overflow: "hidden" },
            }}
        >
            <GradientHeader>
            <Box
                sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                }}
            >
                <Box>
                <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
                >
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                    Maintenance Request Details
                    </Typography>
                    <Chip
                    label={`#${viewRequest?.id}`}
                    size="small"
                    sx={{
                        backgroundColor: "#e1f5fe",
                        color: "primary.700",
                        fontWeight: 600,
                    }}
                    />
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Submitted by {viewRequest?.tenant?.firstname}{" "}
                    {viewRequest?.tenant?.lastname}
                </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Chip
                    variant="contained"
                    label={viewRequest.status?.toUpperCase()}
                    sx={{
                    backgroundColor:
                        viewRequest.status === "Accepted"
                        ? "#c8e6c9"
                        : viewRequest.status === "Rejected" 
                        ? "#ffcdd2" 
                        : viewRequest.status === "Pending" 
                        ? '#e3f2fd'
                        : '#fff3e0',
                    "& .MuiChip-label": {
                        color:
                        viewRequest.status === "Accepted"
                            ? "#43a047"
                            : viewRequest.status === "Rejected" 
                            ? '#e53935'
                            : viewRequest.status === "Pending"
                            ? '#3f51b5'
                            : '#f57c00',
                        fontWeight: 560,
                    },
                    }}
                />
                <IconButton
                    onClick={handleClose}
                    sx={{
                    "&:hover": { backgroundColor: "white" },
                    transition: "all 0.2s",
                    }}
                >
                    <CloseIcon />
                </IconButton>
                </Box>
            </Box>
            </GradientHeader>

            <DialogContent dividers>
            {loading ? (
                <Box sx={{ py: 3, px: 2, "& > *": { mb: 3 } }}>
                <Skeleton variant="rectangular" height={60} />
                <Skeleton variant="rectangular" height={40} />
                <Skeleton variant="rectangular" height={100} />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                    <Skeleton variant="rectangular" height={200} />
                    </Grid>
                    <Grid item xs={6}>
                    <Skeleton variant="rectangular" height={200} />
                    </Grid>
                </Grid>
                </Box>
            ) : (
                <Box sx={{ py: 3, px: 2 }}>
                <InfoCard elevation={0}>
                    <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 3,
                    }}
                    >
                    <Box>
                        <Typography variant="h5" fontWeight={700} gutterBottom>
                        {viewRequest?.tenant?.firstname}{" "}
                        {viewRequest?.tenant?.lastname}
                        </Typography>
                        {/* <PriorityBadge
                        priority={viewRequest?.priority || "medium"}
                        /> */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 ,}}>
                            <HomeSharpIcon fontSize="small" color="action"/>
                            <Typography variant="body2" color="text.secondary">
                            {unitAddress[0]?.rented_unit?.boarding_house_name || 
                            unitAddress[0]?.rented_unit?.boarding_house_name || "Not specified"}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt:0.2}}>
                            <MapPinIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                            {unitAddress[0]?.rented_unit?.street} {unitAddress[0]?.rented_unit?.barangay} {unitAddress[0]?.rented_unit?.municipality}
                            </Typography>
                        </Box>
                    </Box>
                    <Paper sx={{ p: 2, backgroundColor: "grey.50" }}>
                        <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                        >
                        <CalendarIcon color="action" />
                        <Box>
                            <Typography
                            variant="caption"
                            fontWeight={500}
                            color="text.secondary"
                            >
                            Date Reported
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                            {formatDate(viewRequest?.date_reported)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                            {formatTime(viewRequest?.created_at)}
                            </Typography>
                        </Box>
                        </Box>
                    </Paper>
                    </Box>

                    <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <ContactBox>
                        <PhoneIcon color="action" />
                        <Box>
                            <Typography
                            variant="caption"
                            fontWeight={500}
                            color="text.secondary"
                            >
                            Phone
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                            {viewRequest?.tenant?.contact}
                            </Typography>
                        </Box>
                        </ContactBox>
                    </Grid>
                    <Grid item xs={6}>
                        <ContactBox>
                        <MailIcon color="action" />
                        <Box>
                            <Typography
                            variant="caption"
                            fontWeight={500}
                            color="text.secondary"
                            >
                            Email
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                            {viewRequest?.tenant?.email}
                            </Typography>
                        </Box>
                        </ContactBox>
                    </Grid>
                    </Grid>
                </InfoCard>

                <Box sx={{ mt: 4, "& > *": { mb: 3 } }}>
                    <Box>
                    <Typography
                        variant="subtitle2"
                        sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                        color:'#212121'
                        }}
                    >
                        <AlertCircleIcon fontSize="small" color="action"/>
                        MAINTENANCE DETAILS
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2.5, backgroundColor: "grey.50" }}>
                        <Typography>
                        <Box component="span" fontWeight={600}>
                            Reported Issue:{" "}
                        </Box>
                        {viewRequest?.reported_issue ||
                            viewRequest?.other_issue ||
                            ""}
                        </Typography>
                    </Paper>
                    </Box>

                    <Box>
                    <Typography
                        variant="subtitle2"
                        sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                        color:'#212121',
                        }}
                    >
                        <AlertCircleIcon fontSize="small" color="action"/>
                        DESCRIPTION
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2.5, backgroundColor: "grey.50" }}>
                        <Typography
                        sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                        >
                        {viewRequest?.issue_description}
                        </Typography>
                    </Paper>
                    </Box>

                    {viewRequest?.maintenance_images?.length > 0 && (
                    <Box>
                        <Typography
                        variant="subtitle2"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1.5,
                        }}
                        >
                        <ImageIcon fontSize="small" />
                        ATTACHED IMAGES
                        </Typography>
                        <Grid container spacing={2}>
                        {viewRequest.maintenance_images.map((image, index) => (
                            <Grid item xs={6} key={image.id}>
                            <Card
                                sx={{
                                position: "relative",
                                cursor: "pointer",
                                "&:hover .MuiCardMedia-root": {
                                    transform: "scale(1.05)",
                                },
                                "&:hover .image-overlay": {
                                    opacity: 1,
                                },
                                }}
                                onClick={() => {
                                setSelectedImage(image);
                                setImageViewerOpen(true);
                                }}
                            >
                                <CardMedia
                                component="img"
                                height="200"
                                image={`${imageBaseUrl}${image.image_path}`}
                                alt={`Maintenance Image ${index + 1}`}
                                sx={{
                                    transition: "transform 0.3s",
                                    objectFit: "cover",
                                }}
                                />
                                <Box
                                className="image-overlay"
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    bgcolor: "rgba(0, 0, 0, 0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    opacity: 0,
                                    transition: "opacity 0.3s",
                                }}
                                >
                                <MaximizeIcon
                                    sx={{ color: "white", fontSize: 30 }}
                                />
                                </Box>
                            </Card>
                            </Grid>
                        ))}
                        </Grid>
                    </Box>
                    )}
                </Box>
                </Box>
            )}
            </DialogContent>

            <DialogActions
            sx={{
                px: 3,
                py: 2,
                bgcolor: "grey.50",
                borderTop: 1,
                borderColor: "grey.100",
            }}
            >
            
            <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                variant="outlined"
                color="error"
                onClick={handleReject}
                disabled={loading}
                startIcon={<CloseIcon />}
                >
                Reject Request
                </Button>
                <Button
                variant="contained"
                color="success"
                onClick={handleAcceptMaitenance}
                disabled={loading}
                startIcon={<CheckCircleIcon />}
                >
                Accept Request
                </Button>
            </Box>
            </DialogActions>
        </Dialog>
        <Modal
        open={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(0, 0, 0, 0.9)'
        }}
      >
        <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <IconButton
                onClick={() => setImageViewerOpen(false)}
                sx={{
                position: 'absolute',
                top: -48,
                right: -48,
                color: 'white',
                '&:hover': { color: 'grey.300' }
                }}
            >
                <CloseIcon />
            </IconButton>
            <Image
                src={`${imageBaseUrl}${selectedImage?.image_path}`}
                alt="Full size maintenance image"
                objectFit="contain"
                width={800}
                height={700}
                style={{ objectFit: "contain" }}
            />
        </Box>
      </Modal>
        <SnackbarProvider maxSnack={3}>
            <AddRemarksForm
            open={remarksOpen}
            setLoading={setLoading}
            loading={loading}
            setRemarksOpen={setRemarksOpen}
            itemId={itemId}
            handleClose1={handleClose}
            />
        </SnackbarProvider>
        </Box>
    );
};

export default MaintenanceRequestDialog;
