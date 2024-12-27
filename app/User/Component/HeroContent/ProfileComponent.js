"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  styled,
  Paper,
  Container,
  Dialog,
  DialogContent,
  Breadcrumbs,
  Link
} from "@mui/material";
import {
  AddAPhotoOutlined as AddAPhotoOutlinedIcon,
  PersonOutlined as PersonOutlineOutlinedIcon,
  LockOutlined as LockOutlinedIcon,
  MailOutlined as MailOutlineOutlinedIcon,
  PhoneOutlined as PhoneOutlinedIcon,
  LocationOnOutlined as LocationOnOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  NavigateNext as NavigateNextIcon,
  HomeOutlined as HomeOutlinedIcon,
} from "@mui/icons-material";
import useSWR from "swr";
import Image from "next/image";
import { useSnackbar } from "notistack";
import Swal from "sweetalert2";

// Enhanced Styled Components
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  backgroundColor: "#5a4acd",
  fontSize: "3.5rem",
  boxShadow: "0 15px 30px rgba(90,74,205,0.4)",
  border: "5px solid white",
  fontWeight: "bold",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
  marginLeft: "-18px",
  borderLeft: "4px solid #3498db",
}));

const ProfileInfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const fetcherProfileImage = async ([url, token]) => {
  console.log(url, token);
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

const fetcherProfileInfo = async ([url, token]) => {
  console.log(url, token);
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

const ProfilePage = ({ setLoading, loading }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState([]);
  const [accessToken, setAccessToken] = useState([]);
  const [formError, setFormError] = useState([]);
  const [editUsername, setEditUsername] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(0);
  const [otpInput, setOtpInput] = useState(new Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [profileImage, setProfileImage] = useState([]);
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [newUsername, setNewUsername] = useState({
    new_username: "",
  });

  console.log(profileImage);
  console.log(formData);
  console.log(userInfo);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.replace(/\s/g, ""),
    }));

    if (formError[name]) {
      setFormError((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleChangeUsername = (e) => {
    const { name, value } = e.target;
    setNewUsername((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (formError[name]) {
      setFormError((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

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

  const {
    data: responseImage,
    error: errorImage,
    isLoading: isLoadingImage,
    mutate,
  } = useSWR(
    accessToken && userId
      ? [`http://127.0.0.1:8000/api/profile_image/${userId}`, accessToken]
      : null,
    fetcherProfileImage,
    {
      refreshInterval: 3000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  );
  console.log(errorImage);
  useEffect(() => {
    if (responseImage) {
      setProfileImage(responseImage?.data);
      setLoading(false);
    } else if (isLoadingImage) {
      setLoading(true);
    }
  }, [responseImage, isLoadingImage, setLoading]);

  const {
    data: responseUserInfo,
    error: errorUserInfo,
    isLoading: isLoadingUserInfo,
  } = useSWR(
    accessToken && userId
      ? [`http://127.0.0.1:8000/api/tenant_information/${userId}`, accessToken]
      : null,
    fetcherProfileInfo,
    {
      refreshInterval: 3000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  );

  console.log(errorUserInfo);
  useEffect(() => {
    if (responseUserInfo) {
      setUserInfo(responseUserInfo?.data);
      setLoading(false);
    } else if (isLoadingUserInfo) {
      setLoading(true);
    }
  }, [responseUserInfo, isLoadingUserInfo, setLoading]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      if (accessToken) {
        const formData = new FormData();
        formData.append("profile_image", file);
        formData.append("tenant_id", userId); // Ensure you have `userId` defined
        setLoading(true);
        try {
          const response = await fetch(
            "http://127.0.0.1:8000/api/add_profile_image",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`, // Only include Authorization
                Accept: "application/json", // Accept JSON response
              },
              body: formData, // Send FormData directly
            }
          );

          const data = await response.json();
          if (response.ok) {
            console.log(
              "Profile image uploaded successfully:",
              data.image_path
            );
            enqueueSnackbar(data.message, { variant: "success" });
            setLoading(false);
            mutate();
          } else {
            setLoading(false);
            console.error("Error uploading profile image:", data.error);
            enqueueSnackbar(data.message, { variant: "error" });
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        console.error("User not authenticated or ID missing.");
      }
    }
  };

  console.log(formData);
  const handleGenerateOtp = async (e) => {
    e.preventDefault();
    if (accessToken) {
      setLoading(true);
      let hasErrors = false;
      let newErrors = {};
      if (!formData.current_password) {
        hasErrors = true;
        newErrors.current_password = "Current Password is requied!";
      }

      if (!formData.new_password) {
        hasErrors = true;
        newErrors.new_password = "New Password is requied!";
      } else if (formData.new_password.length < 8) {
        hasErrors = true;
        newErrors.new_password = "Password atleast more than 8 characters!";
      } else if (/\s/.test(formData.new_password)) {
        hasErrors = true;
        newErrors.new_password = "Password cannot contain spaces!";
      }

      if (!formData.new_password_confirmation) {
        hasErrors = true;
        newErrors.new_password_confirmation = "Confirm Password is requied!";
      } else if (formData.new_password_confirmation.length < 8) {
        hasErrors = true;
        newErrors.new_password_confirmation =
          "Password atleast more than 8 characters!";
      } else if (/\s/.test(formData.new_password_confirmation)) {
        hasErrors = true;
        newErrors.new_password_confirmation = "Password cannot contain spaces!";
      }

      if (hasErrors) {
        setFormError(newErrors);
        setLoading(false);
        return;
      }
      const response = await fetch(`http://127.0.0.1:8000/api/generate_otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json", // Accept JSON response
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpStep(1);
        setLoading(false);
        console.log(data);
      } else {
        setOtpStep(0);
        setLoading(false);
        if (
          data.error === "The new password field confirmation does not match."
        ) {
          enqueueSnackbar(
            "The new password field confirmation does not match.",
            { variant: "error" }
          );
        } else {
          enqueueSnackbar(data.message, { variant: "error" });
        }

        console.error("Error:", data.error);
      }
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    if (accessToken) {
      setLoading(true);
      try {
        const otpValue = otpInput.join("");
        const response = await fetch(
          `http://127.0.0.1:8000/api/change_password`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json", // Accept JSON response
            },
            body: JSON.stringify({
              ...formData,
              otp: otpValue, // Include OTP in the request payload
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          console.log(data.message, data.data);
          // enqueueSnackbar(data.message, {variant: 'success'})
          setLoading(false);
          setFormData({});
          setOtpStep(0);
          setEditPassword(false);
          Swal.fire({
            title: "Success!",
            text: "The Password Changed Successfully!",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          console.log(data.error);
          enqueueSnackbar(data.message, { variant: "error" });
          setLoading(false);
          setOtpStep(1);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    if (accessToken) {
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/resend-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          console.log(data.message, data.data);
          enqueueSnackbar(data.message, { variant: "success" });
          setLoading(false);
        } else {
          console.log(data.error);
          enqueueSnackbar(data.message, { variant: "error" });
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  console.log(newUsername);
  const handleChaneUsername = async (e) => {
    e.preventDefault();
    if (accessToken) {
      setLoading(true);
      try {
        let hasErrors = false;
        let newErrors = {};

        if (!newUsername.new_username) {
          hasErrors = true;
          newErrors.new_username = "User name is requied!";
        } else if (newUsername.new_username.length < 8) {
          hasErrors = true;
          newErrors.new_username = "Username atleast more than 8 characters!";
        } else if (/\s/.test(newUsername.new_username)) {
          // Check if the username contains spaces
          hasErrors = true;
          newErrors.new_username = "Username cannot contain spaces!";
        }

        if (hasErrors) {
          setFormError(newErrors);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://127.0.0.1:8000/api/change_username`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json", // Accept JSON response
            },
            body: JSON.stringify(newUsername),
          }
        );
        const data = await response.json();
        if (response.ok) {
          console.log(data.message, data.data);
          enqueueSnackbar(data.message, { variant: "success" });
          setLoading(false);
          setEditUsername(false);
          setNewUsername({});
          setFormError({});
        } else {
          console.log(data.error);
          enqueueSnackbar(data.message, { variant: "error" });
          setLoading(false);
          setEditUsername(false);
          setNewUsername({});
          setFormError({});
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // OTP Handling Functions
  const handleOtpChange = (index, value) => {
    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  console.log(otpInput);
  const renderOtpInputs = () => {
    return otpInput.map((digit, index) => (
      <TextField
        key={index}
        id={`otp-${index}`}
        variant="outlined"
        size="small"
        type="text"
        inputProps={{
          maxLength: 1,
          style: { textAlign: "center", fontSize: "20px" },
        }}
        value={digit}
        onChange={(e) => handleOtpChange(index, e.target.value)}
        sx={{
          width: "50px",
          mx: 1,
          "& input": {
            padding: "10px",
          },
        }}
      />
    ));
  };

  const avatarSrc = profileImage
    ? `http://127.0.0.1:8000/ProfileImages/${profileImage.image_path}`
    : null;

  return (
    <Box sx={{ maxWidth: 1400, margin: "auto" }}>
      <Typography
        variant="h5"
        letterSpacing={3}
        sx={{ marginLeft: "5px", fontSize: "24px", fontWeight: "bold", mt: 5 }}
      >
        My Account
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{mt:2}}>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon sx={{fontSize:'22px'}} />}
            sx={{alignItems:'center', fontSize: { xs: "14px", sm: "15px", md: "15px" }, marginLeft: 'auto' }} // Align breadcrumbs to the end
          >
            <Link
              letterSpacing={2}
              underline="hover"
              color="inherit"
              href="/User/Home"
                
            >
              <HomeOutlinedIcon color="primary" sx={{mt:0.5}}/>
            </Link>
            <Typography
              letterSpacing={0.6}
              color="text.primary"
              sx={{ fontSize: { xs: "14px", sm: "14px", md: "15px" } }}
            >
              My Account
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Container maxWidth="md" sx={{mt:10}}>
        <Box sx={{ py: 4 }}>
          {otpStep === 0 && (
            <>
              <SectionPaper elevation={3}>
                {/* Profile Image Section */}
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mb={4}
                >
                  <Box position="relative">
                    {avatarSrc ? (
                      <ProfileAvatar
                        onClick={handleOpen}
                        src={avatarSrc}
                        alt="Profile"
                        // alt={`${userInfo?.firstname?.charAt(0).toUpperCase()}
                        // ${userInfo?.lastname?.charAt(0).toUpperCase()}`}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 120,
                          height: 120,
                          backgroundColor: "#3f51b5",
                          // backgroundColor: 'linear-gradient(145deg, #6a5acd 0%, #5a4acd 100%)',
                          fontSize: "3.5rem",
                          boxShadow: "0 10px 20px rgba(90,74,205,0.3)",
                          border: "4px solid white",
                        }}
                        aria-label="tenant-avatar"
                      >
                        {userInfo?.firstname?.charAt(0).toUpperCase()}
                        {userInfo?.lastname?.charAt(0).toUpperCase()}
                      </Avatar>
                    )}

                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="profileImageUpload"
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="profileImageUpload">
                      <IconButton
                        color="primary"
                        component="span"
                        sx={{
                          position: "absolute",
                          bottom: -10,
                          right: -10,
                          backgroundColor: "white",
                          boxShadow: 2,
                          "&:hover": {
                            backgroundColor: "white",
                          },
                        }}
                      >
                        <AddAPhotoOutlinedIcon />
                      </IconButton>
                    </label>
                  </Box>
                  <Typography
                    variant="h4"
                    align="center"
                    sx={{
                      mt: 5,
                      fontWeight: 700,
                      color: "#2c3e50",
                      marginBottom: "5px",
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
                    {userInfo.firstname} {userInfo.lastname}
                  </Typography>
                </Box>

                {/* Personal Information Section */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <ProfileInfoItem>
                      <Box mr={2} color="primary.main">
                        <PersonOutlineOutlinedIcon />
                      </Box>
                      <div>
                        <Typography variant="body2" color="text.secondary">
                          First Name
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {userInfo.firstname}
                        </Typography>
                      </div>
                    </ProfileInfoItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ProfileInfoItem>
                      <Box mr={2} color="primary.main">
                        <PersonOutlineOutlinedIcon />
                      </Box>
                      <div>
                        <Typography variant="body2" color="text.secondary">
                          Last Name
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {userInfo.lastname}
                        </Typography>
                      </div>
                    </ProfileInfoItem>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <ProfileInfoItem>
                      <Box mr={2} color="primary.main">
                        <MailOutlineOutlinedIcon />
                      </Box>
                      <div>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {userInfo.email}
                        </Typography>
                      </div>
                    </ProfileInfoItem>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <ProfileInfoItem>
                      <Box mr={2} color="primary.main">
                        <PhoneOutlinedIcon />
                      </Box>
                      <div>
                        <Typography variant="body2" color="text.secondary">
                          Contact
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {userInfo.contact}
                        </Typography>
                      </div>
                    </ProfileInfoItem>
                  </Grid>

                  <Grid item xs={12}>
                    <ProfileInfoItem>
                      <Box mr={2} color="primary.main">
                        <LocationOnOutlinedIcon />
                      </Box>
                      <div>
                        <Typography variant="body2" color="text.secondary">
                          Address
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {userInfo.street}, {userInfo.barangay},{" "}
                          {userInfo.municipality}
                        </Typography>
                      </div>
                    </ProfileInfoItem>
                  </Grid>
                </Grid>
              </SectionPaper>

              {/* Username Section */}
              <SectionPaper elevation={3}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" alignItems="center">
                    <Box mr={2} color="primary.main">
                      <PersonOutlineOutlinedIcon />
                    </Box>

                    <div>
                      <Box
                        component="form"
                        onSubmit={handleChaneUsername}
                        noValidate
                      >
                        <Typography variant="body2" color="text.secondary">
                          Username
                        </Typography>

                        {!editUsername ? (
                          <Typography variant="body1" fontWeight="bold">
                            {userInfo.username}
                          </Typography>
                        ) : (
                          <Box display="flex" alignItems="center">
                            <TextField
                              variant="outlined"
                              size="small"
                              name="new_username"
                              value={newUsername.new_username}
                              onChange={handleChangeUsername}
                              error={Boolean(formError.new_username)}
                              helperText={formError.new_username}
                              fullWidth
                              sx={{ mt: 1 }}
                            />
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              type="submit"
                              sx={{ ml: 2 }}
                            >
                              Save
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </div>
                  </Box>

                  {/* Edit button aligned to the top right */}
                  {!editUsername && (
                    <Button
                      onClick={() => setEditUsername(true)} // Open text field for editing
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<EditOutlinedIcon />}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
              </SectionPaper>

              {/* Change Password Section */}
              <SectionPaper elevation={3}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" alignItems="center">
                    <Box mr={2} color="primary.main">
                      <LockOutlinedIcon />
                    </Box>
                    <Typography variant="body1" fontWeight="bold">
                      Change Password
                    </Typography>
                  </Box>
                  <Button
                    onClick={() => setEditPassword(!editPassword)}
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<EditOutlinedIcon />}
                  >
                    {editPassword ? "Cancel" : "Change"}
                  </Button>
                </Box>

                {editPassword && (
                  <Box
                    mt={3}
                    component="form"
                    onSubmit={handleGenerateOtp}
                    noValidate
                  >
                    <TextField
                      variant="outlined"
                      size="small"
                      type="password"
                      label="Current Password"
                      name="current_password"
                      value={formData.current_password}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      error={Boolean(formError.current_password)}
                      helperText={formError.current_password}
                    />
                    <TextField
                      variant="outlined"
                      size="small"
                      type="password"
                      label="New Password"
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      error={Boolean(formError.new_password)}
                      helperText={formError.new_password}
                    />
                    <TextField
                      variant="outlined"
                      size="small"
                      type="password"
                      label="Confirm New Password"
                      name="new_password_confirmation"
                      value={formData.new_password_confirmation}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      error={Boolean(formError.new_password_confirmation)}
                      helperText={formError.new_password_confirmation}
                    />
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mr: 2 }}
                      >
                        {loading ? "sending..." : "Save Changes"}
                      </Button>
                      <Button
                        onClick={() => {
                          setEditPassword(false);
                          setFormData({});
                          setFormError({});
                        }}
                        variant="outlined"
                        color="primary"
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                )}
              </SectionPaper>
            </>
          )}

          {otpStep === 1 && (
            <SectionPaper>
              <Box component="form" onSubmit={handleOtpVerification} noValidate>
                <Typography variant="h6" align="center" gutterBottom>
                  OTP Verification
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  color="textSecondary"
                  gutterBottom
                >
                  Enter the 6-digit code sent to {userInfo?.email}
                </Typography>

                <Box display="flex" justifyContent="center" my={3}>
                  {renderOtpInputs()}
                </Box>

                {otpError && (
                  <Typography
                    variant="body2"
                    color="error"
                    align="center"
                    gutterBottom
                  >
                    {otpError}
                  </Typography>
                )}

                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={otpInput.some((digit) => digit === "")}
                  >
                    Verify OTP
                  </Button>
                </Box>
              </Box>
            </SectionPaper>
          )}
        </Box>
        <React.Fragment>
          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
              sx: {
                backgroundColor: "rgba(0, 0, 0, 0)", // Fully transparent background
                boxShadow: "none", // Remove shadow for a clean look
              },
            }}
          >
            <DialogContent
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0)", // Fully transparent content background
                padding: 0,
              }}
            >
              {profileImage?.image_path ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "500px",
                  }}
                >
                  <Image
                    src={`http://127.0.0.1:8000/ProfileImages/${profileImage.image_path}`}
                    alt="Profile"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              ) : (
                <p style={{ textAlign: "center", margin: "20px" }}>
                  No Image Available
                </p>
              )}
            </DialogContent>
          </Dialog>
        </React.Fragment>
      </Container>
    </Box>
  );
};

export default ProfilePage;
