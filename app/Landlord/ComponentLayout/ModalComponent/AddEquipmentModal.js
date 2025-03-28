"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  Fade,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Modal as BaseModal } from "@mui/base/Modal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PropTypes from "prop-types";
import { styled, css } from "@mui/system";
import { useSnackbar } from "notistack";
import useSWR from "swr";

const Backdrop = React.forwardRef((props, ref) => {
  const { open, ...other } = props;
  return (
    <Fade in={open}>
      <div ref={ref} {...other} />
    </Fade>
  );
});
Backdrop.displayName = "Backdrop";
// Backdrop.propTypes = {
//   open: PropTypes.bool,
// };

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
};

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);

const TriggerButton = styled(Button)(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
    }

    &:active {
      background: ${theme.palette.mode === "dark" ? grey[700] : grey[100]};
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px
        ${theme.palette.mode === "dark" ? blue[300] : blue[200]};
      outline: none;
    }
  `
);

const fetcher = async([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  })
  if(!response.ok){
    throw new Error('Failed to Fetch Equipment');
  }
  return response.json();
}

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable

export default function AddEquipmentModal({
  open,
  handleOpen,
  handleClose,
  setLoading,
  loading,
  editItem,
  setEditItem,
  onRefresh,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [formError, setFormError] = useState([]);
  const [addEquipment, setAddEquipment] = useState({
    name: "",
  });

  console.log("ID:", editItem);
  console.log("EditItem:".addEquipment);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddEquipment({
      ...addEquipment,
      [name]: value,
    });
  };

  const getUserToken = () => {
    const userDataString = localStorage.getItem('userDetails');
    const userData = JSON.parse(userDataString);
    return userData?.accessToken;
  };

  const {data: equipmentDetails, error} = useSWR(
    editItem ? [`${API_URL}/edit_inclusion/${editItem}`, getUserToken()] : null,
    fetcher, {
      refreshInterval: 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
    }
  )

  console.log('Error:', error)

  useEffect(() => {
    if(equipmentDetails?.data){
      const data = equipmentDetails.data;
      setAddEquipment({
        name: data.name || '',
      });
    }
  }, [equipmentDetails])



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userDataString = localStorage.getItem("userDetails");
    const userData = JSON.parse(userDataString);
    const accessToken = userData.accessToken;

    if (accessToken) {
      try {
        let hasErrors = false;
        let newErrors = {};

        if (!addEquipment.name) {
          hasErrors = true;
          newErrors.name = "Name of equipment is required";
        } else if (addEquipment.name.length < 2) {
          hasErrors = true;
          newErrors.name =
            "Name of equipment must be at least 2 characters long";
        }

        if (hasErrors) {
          setFormError(newErrors);
          setLoading(false);
          return;
        }

        const method = editItem ? "PUT" : "POST";
        const endpoint = editItem
          ? `${API_URL}/update_inclusion/${editItem}`
          : `${API_URL}/store_inclusion`;

        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          body: JSON.stringify(addEquipment),
        });

        const data = await response.json();

        if (response.ok) {
          setAddEquipment({
            name: "",
          });
          enqueueSnackbar(data.message, { variant: "success" });
          onRefresh();
          handleClose();
          setEditItem(null);
        } else {
          setLoading(false);
          enqueueSnackbar(data.message, { variant: "error" });
        }
      } catch (error) {
        console.error("Error to Submit", error);
      } finally {
        setLoading(false);
        console.log("Error");
      }
    }
  };

  // useEffect(() => {
  //   const successMessage = localStorage.getItem("successMessage");
  //   const errorMessage = localStorage.getItem("errorMessage");
  //   if (successMessage) {
  //     setSuccessful(successMessage);
  //     setTimeout(() => {
  //       localStorage.removeItem("successMessage");
  //     }, 3000);
  //   }

  //   if (errorMessage) {
  //     setError(errorMessage);
  //     setTimeout(() => {
  //       localStorage.removeItem("errorMessage");
  //     }, 3000);
  //   }
  // }, [setSuccessful, setError]);

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ borderRadius: "10px", p: 1.1, mb: 2,pr:1.1 }}
      >
        <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
        Add
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"  
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => {
          if (loading) return;
          handleClose();
          setEditItem(null);
        }}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={open}>
          <ModalContent sx={style}>
            <Typography
              variant="h1"
              letterSpacing={3}
              sx={{ fontSize: "20px" }}
            >
              Add New Amenities
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                id="taskname"
                label="Amenities name"
                name="name"
                variant="outlined"
                fullWidth
                margin="normal"
                sx={{ mt: 1 }}
                value={addEquipment.name || ""}
                onChange={handleChange}
                error={Boolean(formError.name)}
                helperText={formError.name}
              />
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  width: "100%",
                  background: "primary",
                  "&:hover": { backgroundColor: "#b6bdf1" },
                  padding: "8px",
                  fontSize: "16px",
                  mt: 4,
                }}
              >
                {loading ? <CircularProgress sx={{ color: "white" }} /> : "Add"}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                disabled={loading}
                sx={{
                  fontSize: "16px",
                  marginTop: "10px",
                  borderRadius: "10px",
                  padding: "10px",
                  color: "#000",
                  borderColor: "#000",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#000",
                  },
                }}
                onClick={() => {
                  handleClose();
                  setAddEquipment({});
                  setEditItem(null);
                }}
              >
                Cancel
              </Button>
            </Box>
          </ModalContent>
        </Fade>
      </Modal>
    </Box>
  );
}
 


