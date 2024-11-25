"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Typography,
  Box,
  Fab,
  Button,
  Fade,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Autocomplete,
  Checkbox,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import { styled, useTheme, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Image from "next/image";

const Backdrop = React.forwardRef((props, ref) => {
  const { open, ...other } = props;
  return (
    <Fade in={open}>
      <div ref={ref} {...other} />
    </Fade>
  );
});
Backdrop.displayName = "Backdrop";

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  300: "#B0B8C4",
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
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
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
    border-radius: 18px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};
    width: 100%;
    max-width: 5000px;
    max-height: 90vh; /* Ensures it does not overflow vertically */
    overflow-y: auto; /* Adds scrolling if content is too large */

    @media (min-width: 600px) {
      width: 400px;
      padding: 20px; /* Adjust padding for larger screens */
    }

    @media (max-width: 600px) {
      width: 95%; /* Adjusts the width for mobile screens */
      padding: 16px; /* Reduce padding for smaller screens */
    }
  `
);

const AddButton = styled(Fab)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
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

export default function AddPropertyType({
  open,
  handleOpen,
  handleClose,
  propertyId,
  setSuccessful,
  setError,
  editItem,
  setEditItem,
  setSelectedProperty,
  selectedProperty,
}) {
  const { data: session, status } = useSession();
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [numRooms, setNumRooms] = useState(1); // Default to 1 room
  const [rooms, setRooms] = useState([
    {
      beds: [{ price: "", status: "" }],
    },
  ]); // Default to 1 bed in the first room
  // const [rooms, setRooms] = useState([{ room_number: 1, number_of_beds: 1 }]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [deleteImage, setDeleteImage] = useState([]);
  const [selectedInclusions, setSelectedInclusions] = useState([]);
  const [inclusion, setInclusion] = useState([]);
  const propsid = propertyId;
  const [propAddress, setPropAddress] = useState([]);
  const [newApartment, setNewApartment] = useState({
    propertyid: propsid,
    apartmentname: "",
    numberofrooms: "",
    capacity: "",
    rentalfee: "",
    payorname: "none",
    apartmentstatus: "",
    buildingno: "",
    street: "",
    barangay: propAddress.barangay,
    municipality: "Sorsogon City",
  });

  const [newboardinghouse, setNewBoardinghouse] = useState({
    propertyid: propsid,
    boardinghousename: "",
    // rentalfee: '',
    // payorname:'none',
    // boardinghousestatus:'',
    buildingno: "",
    street: "",
    barangay: propAddress.barangay,
    municipality: "Sorsogon City",
  });

  console.log("Edit id:", editItem);
  console.log("id:", propsid);
  console.log("inclusion:", inclusion);
  console.log("selectedInclusion", selectedInclusions);
  console.log("Image:", selectedImage);
  console.log("Edit Apartment Value:", newApartment);
  console.log("Edit Boarding House Value:", newboardinghouse);
  console.log("image:", selectedImage);
  console.log("delete:", deleteImage);
  console.log("rooms:", rooms);

  const handleChangeApartment = (e) => {
    const { name, value } = e.target;

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setNewApartment({
      ...newApartment,
      [name]: value || "",
    });
  };

  const handleChangeBoardinghouse = (e) => {
    const { name, value } = e.target;

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setNewBoardinghouse({
      ...newboardinghouse,
      [name]: value || "",
    });
  };

  useEffect(() => {
    const fetchDataAddress = async () => {
      const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json
      const accessToken = userData.accessToken;

      if (accessToken) {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/property_address/${propsid}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const data = await response.json();
          console.log(data);

          if (response.ok) {
            setPropAddress(data.data);
            console.log(data);
          } else {
            console.log("Error fetching data");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchDataAddress();
  }, [propsid]);

  console.log("address:", propAddress);
  console.log("barangay:", propAddress.barangay);

  useEffect(() => {
    if (propAddress.barangay) {
      setNewApartment((prevState) => ({
        ...prevState,
        barangay: propAddress.barangay,
      }));

      setNewBoardinghouse((prevState) => ({
        ...prevState,
        barangay: propAddress.barangay,
      }));
    }
  }, [propAddress]); // this code is for updating the barangay in the form

  useEffect(() => {
    const fetchDataEdit = async () => {
      if (!editItem || !selectedProperty) {
        return; // Make sure both `editItem` and `selectedProperty` are available.
      }
      const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json
      const accessToken = userData.accessToken;
      console.log("Token:", accessToken);

      if (accessToken) {
        try {
          const endpoint =
            selectedProperty === "Apartment"
              ? `http://127.0.0.1:8000/api/edit_apartment/${editItem}`
              : `http://127.0.0.1:8000/api/edit_boardinghouse/${editItem}`;

          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();
          console.log(data);
          console.log(response.status);

          if (response.ok) {
            if (selectedProperty === "Apartment") {
              setNewApartment({
                propertyid: data?.apartment?.property_id,
                apartmentname: data?.apartment?.apartment_name,
                numberofrooms: data?.apartment?.number_of_rooms,
                capacity: data?.apartment?.capacity,
                rentalfee: data?.apartment?.rental_fee,
                payorname: data?.apartment?.payor_name,
                apartmentstatus: data?.apartment?.status,
                buildingno: data?.apartment?.building_no,
                street: data?.apartment?.street,
                barangay: data?.apartment?.barangay,
                municipality: data?.apartment?.municipality,
              });
              const inclusionsArray =
                data?.apartment?.inclusions?.map((item) => ({
                  id: item.equipment.id,
                  name: item.equipment.name,
                  quantity: item.quantity,
                })) || [];
              setSelectedInclusions(inclusionsArray);
              // setSelectedImage(data?.boardinghouse?.images);
              if (data?.apartment?.images) {
                const existingImages = data.apartment.images.map((img) => ({
                  id: img.id,
                  path: img.image_path,
                  preview: `http://127.0.0.1:8000/ApartmentImage/${img.image_path}`, // Adjust URL as needed
                }));
                setSelectedImage(existingImages);
              }
              setSelectedProperty(data?.apartment?.property_type);
            } else if (selectedProperty === "Boarding House") {
              setNewBoardinghouse({
                propertyid: data?.boardinghouse?.property_id,
                boardinghousename: data?.boardinghouse?.boarding_house_name,
                numberofrooms: data?.boardinghouse?.number_of_rooms,
                capacity: data?.boardinghouse?.capacity,
                // rentalfee: data?.boardinghouse?.rental_fee,
                // payorname: data?.boardinghouse?.payor_name,
                boardinghousestatus: data?.boardinghouse?.status,
                buildingno: data?.boardinghouse?.building_no,
                street: data?.boardinghouse?.street,
                barangay: data?.boardinghouse?.barangay,
                municipality: data?.boardinghouse?.municipality,
              });

              // setSelectedImage(data?.boardinghouse?.images);
              if (data?.boardinghouse?.images) {
                const existingImages = data.boardinghouse.images.map((img) => ({
                  id: img.id,
                  path: img.image_path,
                  preview: `http://127.0.0.1:8000/ApartmentImage/${img.image_path}`, // Adjust URL as needed
                }));
                setSelectedImage(existingImages);
              }
              setSelectedProperty(data?.boardinghouse?.property_type);

              // const roomsArray = data?.boardinghouse?.rooms?.map((room) => ({
              //   room_number: room.room_number,
              //   beds: room.number_of_beds,
              // })) || [];
              // setRooms(roomsArray);
              const roomsArray =
                data?.boardinghouse?.rooms?.map((room) => ({
                  room_number: room.room_number,
                  number_of_beds: room.number_of_beds,
                  beds:
                    room.beds?.map((bed) => ({
                      bed_number: bed.bed_number,
                      price: bed.price,
                      status: bed.status,
                    })) || "not specified", // Default to an empty array if beds is not defined
                })) || [];

              setRooms(roomsArray);
              console.log(rooms);

              const inclusionsArray =
                data?.boardinghouse?.inclusions?.map((item) => ({
                  id: item.equipment.id,
                  name: item.equipment.name,
                  quantity: item.quantity,
                })) || [];
              setSelectedInclusions(inclusionsArray);
              console.log("Processed inclusions:", inclusionsArray);
            }
          } else {
            console.error("Error fetching property details:", data.message);
            setError(data.message);
          }
        } catch (error) {
          console.log("Error:", error);
          setError(error.message);
        } finally {
          console.log("finally");
        }
      }
    };
    fetchDataEdit();
  }, [editItem, selectedProperty, rooms, setError, setSelectedProperty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json
    const accessToken = userData.accessToken;
    console.log("Token:", accessToken);

    if (accessToken) {
      console.log("authenticated", status);
      console.log("Value:", newApartment);
      console.log("Value:", newboardinghouse);
      console.log("rooms:", rooms);
      console.log("inclusion:", selectedInclusions);

      try {
        const formData = new FormData();
        let hasErrors = false;
        let newErrors = {};

        if (selectedProperty === "Apartment") {
          if (!newApartment.apartmentname?.trim()) {
            newErrors.apartmentname = "Property name is required";
            hasErrors = true;
          }
          if (!newApartment.numberofrooms) {
            newErrors.numberofrooms = "Number of rooms is required";
            hasErrors = true;
          }
          if (!newApartment.rentalfee) {
            newErrors.rentalfee = "Rental fee is required";
            hasErrors = true;
          }
          if (!newApartment.capacity) {
            newErrors.capacity = "Capacity is required";
            hasErrors = true;
          }
          if (!newApartment.buildingno?.trim()) {
            newErrors.buildingno = "Building number is required";
            hasErrors = true;
          }
          if (!newApartment.street?.trim()) {
            newErrors.street = "Street is required";
            hasErrors = true;
          }
          if (selectedInclusions.length === 0) {
            newErrors.inclusion = "Please select at least one inclusion";
            hasErrors = true;
          }
          // In your validation logic inside handleSubmit
          if (!newApartment.apartmentstatus) {
            newErrors.apartmentstatus = "Status is required";
            hasErrors = true;
          }
          if (!selectedImage || selectedImage.length === 0) {
            hasErrors = true;
            newErrors.images = "At least one image is required";
          }

          formData.append("propertyid", propsid);
          formData.append("apartmentname", newApartment.apartmentname);
          formData.append("numberofrooms", newApartment.numberofrooms);
          formData.append("capacity", newApartment.capacity);
          formData.append("rentalfee", newApartment.rentalfee);
          formData.append("status", newApartment.apartmentstatus);
          formData.append("payorname", newApartment.payorname);
          formData.append("property_type", selectedProperty);
          formData.append("buildingno", newApartment.buildingno);
          formData.append("street", newApartment.street);
          formData.append("barangay", propAddress.barangay); //get the state value of barangay
          formData.append("municipality", newApartment.municipality);

          if (hasErrors) {
            setErrors(newErrors);
            setLoading(false);
            return;
          }
          // if(selectedImage && selectedImage instanceof File){
          //   formData.append('image', selectedImage)
          // }
          // Handle multiple images
          // if (selectedImage && selectedImage.length > 0) {
          //   selectedImage.forEach((image, index) => {
          //       if (image instanceof File) {
          //           formData.append(`images[${index}]`, image);
          //       }
          //   });
          // }
          // Handle multiple images
          if (selectedImage && selectedImage.length > 0) {
            selectedImage.forEach((image, index) => {
              if (image.file) {
                formData.append(`images[${index}]`, image.file);
              }
            });
          }

          // Handle deleted images
          if (deleteImage && deleteImage.length > 0) {
            formData.append("deleted_images", JSON.stringify(deleteImage));
          }

          if (selectedInclusions.length > 0) {
            const inclusionsJson = JSON.stringify(
              selectedInclusions.map((inclusion) => ({
                id: inclusion.id,
                quantity: inclusion.quantity,
              }))
            );
            formData.append("inclusion", inclusionsJson);
          }
        } else if (selectedProperty === "Boarding House") {
          if (!newboardinghouse.boardinghousename?.trim()) {
            newErrors.boardinghousename = "Property name is required";
            hasErrors = true;
          }
          if (!numRooms) {
            newErrors.numRooms = "Number of rooms is required";
            hasErrors = true;
          }
          if (!newboardinghouse.buildingno?.trim()) {
            newErrors.buildingno = "Building number is required";
            hasErrors = true;
          }
          if (!newboardinghouse.street?.trim()) {
            newErrors.street = "Street is required";
            hasErrors = true;
          }
          if (selectedInclusions.length === 0) {
            newErrors.inclusion = "Please select at least one inclusion";
            hasErrors = true;
          }

          if (!newboardinghouse.buildingno?.trim()) {
            newErrors.buildingno = "Building number is required";
            hasErrors = true;
          }
          if (!newboardinghouse.street?.trim()) {
            newErrors.street = "Street is required";
            hasErrors = true;
          }
          if (selectedInclusions.length === 0) {
            newErrors.inclusion = "Please select at least one inclusion";
            hasErrors = true;
          }
          if (!selectedImage || selectedImage.length === 0) {
            hasErrors = true;
            newErrors.images = "At least one image is required";
          }

          // Validate rooms and beds
          rooms.forEach((room, roomIndex) => {
            if (!room.number_of_beds || room.number_of_beds < 1) {
              newErrors[`room_${roomIndex}_beds`] =
                "At least one bed is required";
              hasErrors = true;
            }
            room.beds.forEach((bed, bedIndex) => {
              if (!bed.price) {
                newErrors[`room_${roomIndex}_bed_${bedIndex}_price`] =
                  "Price is required";
                hasErrors = true;
              }
              if (!bed.status) {
                newErrors[`room_${roomIndex}_bed_${bedIndex}_status`] =
                  "Status is required";
                hasErrors = true;
              }
            });
          });

          if (hasErrors) {
            setErrors(newErrors);
            setLoading(false);
            return;
          }

          formData.append("propertyid", propsid);
          formData.append(
            "boardinghousename",
            newboardinghouse.boardinghousename
          );
          formData.append("capacity", totalcapacity);
          formData.append("status", "Available");
          formData.append("property_type", selectedProperty);
          formData.append("buildingno", newboardinghouse.buildingno);
          formData.append("street", newboardinghouse.street);
          formData.append("barangay", propAddress.barangay);
          formData.append("municipality", newboardinghouse.municipality);

          // Handle multiple images
          if (selectedImage && selectedImage.length > 0) {
            selectedImage.forEach((image, index) => {
              if (image.file) {
                formData.append(`images[${index}]`, image.file);
              }
            });
          }

          if (deleteImage && deleteImage.length > 0) {
            formData.append("deleted_images", JSON.stringify(deleteImage));
          }

          if (numRooms) {
            formData.append("numberofrooms", numRooms);
          }
          // if (rooms && rooms.length > 0) {
          //   rooms.forEach((room, index) => {
          //     formData.append(`rooms[${index}][room_number]`, parseInt(room.room_number || index + 1, 10));
          //     formData.append(`rooms[${index}][number_of_beds]`, parseInt(room.beds, 10));
          //   });
          // }
          // if (rooms && rooms.length > 0) {
          //   rooms.forEach((room, roomIndex) => {
          //     formData.append(`rooms[${roomIndex}][room_number]`, roomIndex + 1);
          //     formData.append(`rooms[${roomIndex}][number_of_beds]`, room.beds.length);

          //     room.beds.forEach((bed, bedIndex) => {
          //       formData.append(`rooms[${roomIndex}][beds][${bedIndex}][type]`, bed.type);
          //       formData.append(`rooms[${roomIndex}][beds][${bedIndex}][status]`, bed.status);
          //     });
          //   });
          // }
          rooms.forEach((room, roomIndex) => {
            formData.append(
              `rooms[${roomIndex}][room_number]`,
              parseInt(room.room_number || roomIndex + 1, 10)
            );
            formData.append(
              `rooms[${roomIndex}][number_of_beds]`,
              room.number_of_beds
            );

            room.beds.forEach((bed, bedIndex) => {
              formData.append(
                `rooms[${roomIndex}][beds][${bedIndex}][bed_number]`,
                parseInt(bed.bed_number || bedIndex + 1, 10)
              );
              formData.append(
                `rooms[${roomIndex}][beds][${bedIndex}][price]`,
                bed.price
              );
              formData.append(
                `rooms[${roomIndex}][beds][${bedIndex}][status]`,
                bed.status
              );
            });
          });

          if (selectedInclusions.length > 0) {
            const inclusionsJson = JSON.stringify(
              selectedInclusions.map((inclusion) => ({
                id: inclusion.id,
                quantity: inclusion.quantity,
              }))
            );
            formData.append("inclusion", inclusionsJson);
          }
        }

        let endpoint, method;

        if (editItem) {
          // For updating, add '_method' field to FormData for method override
          formData.append("_method", "PUT");
          endpoint =
            selectedProperty === "Apartment"
              ? `http://127.0.0.1:8000/api/update_apartment/${editItem}`
              : `http://127.0.0.1:8000/api/update_boardinghouse/${editItem}`;
          method = "POST"; // Since we're using '_method', use POST for sending
        } else {
          endpoint =
            selectedProperty === "Apartment"
              ? "http://127.0.0.1:8000/api/store_apartment"
              : "http://127.0.0.1:8000/api/store_boardinghouse";
          method = "POST";
        }

        const response = await fetch(endpoint, {
          method,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          body: formData,
        });

        const data = await response.json();

        console.log("Response data:", data);
        console.log("Response status:", response.status);

        if (response.ok) {
          handleClose();
          setNewApartment({});
          setNewBoardinghouse({});
          localStorage.setItem(
            "successMessage",
            data.message || "Operation successful!"
          );
          window.location.reload();
        } else {
          if (data.error) {
            handleClose();
            localStorage.setItem(
              "errorMessage",
              data.error || "Operation Error!"
            );
            window.location.reload();
          } else {
            localStorage.setItem(
              "errorMessage",
              data.message || "Operation Error!"
            );
            window.location.reload();
            handleClose();
          }
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setLoading(false);
        // setError(error.message);
        // setSuccessful(false)
      }
    } else {
      console.error("Authentication error: Token missing or invalid");
      setSuccessful(false);
      setError("Authentication error: Token missing or invalid");
    }
  };

  const alertMessage = useCallback(() => {
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

  useEffect(() => {
    alertMessage()
  }, [alertMessage]);

  useEffect(() => {
    const fetchedInclusionData = async () => {
      const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json
      const accessToken = userData.accessToken;
      if (accessToken) {
        console.log("Access Token Found", accessToken);

        try {
          setLoading(true);
          const response = await fetch(
            "http://127.0.0.1:8000/api/inclusion_list",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            console.log("Data:", data);
            // const inclusionArray = Array.isArray(data[0]) ? data[0] : data;
            const inclusionArray = Array.isArray(data.data) ? data.data : [];
            setInclusion(inclusionArray); // Ensure inclusionArray is an array
            // setInclusion(data);
            console.log("inclusionValue:", inclusionArray);
          } else {
            console.log("Error:", response.status);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(error);
        } finally {
          setLoading(false); // Set loading to false regardless of success or failure
        }
      }
    };
    fetchedInclusionData();
  }, [setError]);

 
  // useEffect(() => {
  //   const handleKeyPress = (e) => {
  //     if (e.key === "Enter") {
  //       e.preventDefault(); // Prevent default behavior if needed
  //       // Trigger the submit function
  //       handleSubmit(e);
  //     }
  //   };

  //   window.addEventListener("keypress", handleKeyPress);

  //   return () => {
  //     window.removeEventListener("keypress", handleKeyPress);
  //   };
  // }, [handleSubmit]);



  // const handleImageChange = (e) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setSelectedImage(e.target.files[0]);
  //   }
  // }; //this code is working for one image only

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      // Create preview URLs for new files
      const newPreviews = filesArray.map((file) => ({
        file: file,
        name: file.name,
        preview: URL.createObjectURL(file),
      }));
      setSelectedImage((prevImages) => {
        // Ensure prevImages is always an array using nullish coalescing
        // const currentImages = prevImages ?? [];
        const currentImages = Array.isArray(prevImages) ? prevImages : [];
        return [...currentImages, ...newPreviews];
      });
      // setSelectedImage((prevImages) => [...prevImages, ...newPreviews]);
    }
    // Clear image-related errors
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.images;
      return updatedErrors;
    });
  };
  console.log(selectedImage);

  const handleRemoveImage = (index) => {
    const removedImageId = selectedImage[index]?.id; // Assuming existingImages is an array of images with their IDs
    if (removedImageId) {
      setDeleteImage((prev) => [...prev, removedImageId]); // Store the ID of the removed image
    }
    setSelectedImage((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setSelectedProperty(e.target.value);
  };

  const handleInclusionChange = (event, newValue) => {
    setSelectedInclusions(
      newValue.map((item) => ({
        ...item,
        quantity: item.quantity && item.quantity > 1 ? item.quantity : 1, // Set default quantity to 1 if not provided or if less than 1
      }))
    );
    // Clear error when field is modified
    if (newValue.length > 0) {
      setErrors((prevErrors) => {
        console.log("Previous errors:", prevErrors);
        const updatedErrors = { ...prevErrors };
        delete updatedErrors.inclusion; // Assuming 'inclusion' is the key for this error
        console.log("Updated errors:", updatedErrors);
        return updatedErrors;
      });
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    setSelectedInclusions((prevInclusions) =>
      prevInclusions.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, parseInt(newQuantity, 10)) }
          : item
      )
    );
  };

  const handleNumRoomsChange = (e) => {
    const newNumRooms = Math.min(parseInt(e.target.value, 0), 10);
    setNumRooms(newNumRooms);

    // Adjust the number of room objects with room_number and default number_of_beds
    const newRooms = Array.from({ length: newNumRooms }, (_, index) => ({
      room_number: index + 1,
      number_of_beds: 1, // Set an initial value for number_of_beds
      beds: [{ bed_number: 1, price: "", status: "" }],
      // beds: 1  // Default value
    }));
    setRooms(newRooms);

    // Clear the error message when there's a valid value
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.numRooms; // Remove the error completely instead of setting to empty string
      return updatedErrors;
    });
  };

  //this code is working
  // const handleBedCountChange = (roomIndex, count) => {
  //   setRooms((prevRooms) => {
  //     const updatedRooms = [...prevRooms];
  //     const room = updatedRooms[roomIndex];
  //     const bedCount = count === '' ? 0 : Math.min(Math.max(parseInt(count, 10), 1), 5);

  //     const updatedBeds = Array.from({ length: bedCount }, (_, i) => ({
  //       bed_number: i + 1,
  //       price: '',
  //       status: ''
  //     }));

  //     updatedRooms[roomIndex] = {
  //       ...updatedRooms[roomIndex],
  //       number_of_beds: bedCount, // Update number_of_beds
  //       beds: updatedBeds
  //     };
  //     return updatedRooms;
  //   });
  // };
  const handleBedCountChange = (roomIndex, count) => {
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms];
      const room = updatedRooms[roomIndex];
      const currentBeds = room.beds || [];
      const newBedCount =
        count === "" ? 1 : Math.min(Math.max(parseInt(count, 10), 1), 8);

      let updatedBeds;
      if (newBedCount > currentBeds.length) {
        // Add new beds while preserving existing ones
        updatedBeds = [
          ...currentBeds,
          ...Array.from(
            { length: newBedCount - currentBeds.length },
            (_, i) => ({
              bed_number: currentBeds.length + i + 1,
              price: "",
              status: "",
            })
          ),
        ];
      } else if (newBedCount < currentBeds.length) {
        // Remove excess beds
        updatedBeds = currentBeds.slice(0, newBedCount);
      } else {
        // Bed count hasn't changed, keep existing beds
        updatedBeds = currentBeds;
      }

      updatedRooms[roomIndex] = {
        ...room,
        number_of_beds: newBedCount,
        beds: updatedBeds,
      };

      return updatedRooms;
    });

    // Clear the error message when there's a valid value
    if (count !== "" && parseInt(count, 10) >= 1 && parseInt(count, 10) <= 8) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[`room_${roomIndex}_beds`];
        return updatedErrors;
      });
    }

    // Clear errors related to bed count
  };

  const handleRemoveBed = (roomIndex) => {
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms];
      const room = updatedRooms[roomIndex];

      // Check if there are any occupied beds
      const hasOccupiedBeds = room.beds.some(
        (bed) => bed.status.toLowerCase() === "occupied"
      );

      // // If there are occupied beds, don't remove any beds
      if (hasOccupiedBeds) {
        console.log("Cannot remove beds when one or more beds are occupied.");

        const newAddedBed = room.beds.findIndex(
          (bed) => bed.status.toLowerCase() !== "occupied"
        );

        if (newAddedBed === -1) {
          console.log("Cannot be Deleted");
          return prevRooms;
        }
        // Proceed to remove the first unoccupied bed
        const updatedBeds = room.beds.filter(
          (bed, index) => index !== newAddedBed
        );

        updatedRooms[roomIndex] = {
          ...room,
          number_of_beds: updatedBeds.length,
          beds: updatedBeds.map((bed, i) => ({
            ...bed,
            bed_number: i + 1,
          })),
        };

        return updatedRooms; // Return the unchanged rooms array
      } else {
        const newBedCount = Math.max(room.number_of_beds - 1, 1); // Ensure at least one bed remains

        const updatedBeds = room.beds.slice(0, newBedCount).map((bed, i) => ({
          ...bed,
          bed_number: i + 1,
        }));

        updatedRooms[roomIndex] = {
          ...room,
          number_of_beds: newBedCount,
          beds: updatedBeds,
        };

        return updatedRooms;
      }
    });
  };

  const handleBedPrice = (roomIndex, bedIndex, newValue) => {
    const updatedRooms = [...rooms]; // Assuming `rooms` is the state variable holding your room data
    updatedRooms[roomIndex].beds[bedIndex].price = newValue;
    setRooms(updatedRooms); // Update state

    setErrors((prevErrors) => {
      console.log("old:", prevErrors);
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[`room_${roomIndex}_bed_${bedIndex}_price`];
      console.log("new:", updatedErrors);
      return updatedErrors;
    });
  };

  const handleBedStatusChange = (roomIndex, bedIndex, bedStatus) => {
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms];
      updatedRooms[roomIndex].beds[bedIndex].status = bedStatus;
      return updatedRooms;
    });

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[`room_${roomIndex}_bed_${bedIndex}_status`];
      return updatedErrors;
    });
  };

  // const totalcapacity = rooms.reduce((acc, room) => acc + room.beds, 0);
  const totalcapacity = rooms.reduce((acc, room) => {
    if (Array.isArray(room.beds)) {
      return acc + room.beds.length;
    }
    return acc;
  }, 0);
  // acc + (room.beds.bed_number || 0), 0);

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5, mb: 3 }}>
      <AddButton
        variant="extended"
        aria-label="add"
        onClick={handleOpen}
        sx={{ zIndex: 0 }}
      >
        <AddCircleOutlineIcon sx={{ mr: 1 }} />
        Add New Rental Units
      </AddButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => {
          setErrors({});
          handleClose();
          setEditItem(null);
          setNewApartment({
            propertyid: propertyId,
            apartmentname: "",
            capacity: "",
            rentalfee: "",
            payorname: "none",
            apartmentstatus: "",
            buildingno: "",
            street: "",
            // barangay: '' ,
            municipality: "Sorsogon City",
          });
          setNewBoardinghouse({
            propertyid: propertyId,
            boardinghousename: "",
            rentalfee: "",
            payorname: "none",
            boardinghousestatus: "",
            buildingno: "",
            street: "",
            // barangay: '' ,
            municipality: "Sorsogon City",
          });
          setSelectedImage(null);
          setSelectedProperty("");
        }}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={open}>
          <ModalContent style={{ width: "90%", maxWidth: "740px" }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 560,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Add Property
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <FormControl fullWidth margin="normal" sx={{ mt: "-0.1rem" }}>
                <InputLabel id="property-type-label" required>
                  Select Property Type
                </InputLabel>
                <Select
                  labelId="property-type-label"
                  id="property-type-select"
                  label="Select Property Type"
                  value={selectedProperty}
                  onChange={handleChange}
                >
                  {/* <MenuItem >clear</MenuItem> */}
                  <MenuItem value="Apartment">Apartment</MenuItem>
                  <MenuItem value="Boarding House">Boarding House</MenuItem>
                </Select>
              </FormControl>

              {selectedProperty === "Apartment" && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {/* Information message */}
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: "0.2rem",
                        fontSize: "16px",
                        color: "gray",
                      }}
                    >
                      ----- Apartment Information ------
                    </Typography>
                  </Grid>
                  <Grid item xs={12} lg={12} sx={{ mt: "-1.3rem" }}>
                    <TextField
                      required
                      type="number"
                      id="props-id"
                      label="Property id"
                      name="propertyid"
                      margin="normal"
                      value={propertyId}
                      onChange={handleChangeApartment}
                      fullWidth
                      sx={{ display: "none" }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6} sx={{ mt: "-1rem" }}>
                    <TextField
                      required
                      type="text"
                      id="apartment-name"
                      label="Property Name"
                      name="apartmentname"
                      value={newApartment.apartmentname}
                      onChange={handleChangeApartment}
                      margin="normal"
                      fullWidth
                      error={Boolean(errors.apartmentname)}
                      helperText={errors.apartmentname}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} sx={{ mt: "-1rem" }}>
                    <TextField
                      required
                      type="number"
                      id="no-of-rooms"
                      label="No. of Rooms"
                      name="numberofrooms"
                      value={newApartment.numberofrooms}
                      onChange={handleChangeApartment}
                      margin="normal"
                      fullWidth
                      error={Boolean(errors.numberofrooms)}
                      helperText={errors.numberofrooms}
                      onKeyDown={(e) => {
                        // Prevent 'e', 'E', '+', and '-' from being entered
                        if (
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "+" ||
                          e.key === "-"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6} sx={{ mt: "-1rem" }}>
                    <TextField
                      required
                      type="number"
                      id="rental-fee"
                      label="Rental Fee"
                      name="rentalfee"
                      value={newApartment.rentalfee}
                      onChange={handleChangeApartment}
                      margin="normal"
                      fullWidth
                      error={Boolean(errors.rentalfee)}
                      helperText={errors.rentalfee}
                      onKeyDown={(e) => {
                        // Prevent 'e', 'E', '+', and '-' from being entered
                        if (
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "+" ||
                          e.key === "-"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6} sx={{ mt: "-1rem" }}>
                    <TextField
                      required
                      type="number"
                      id="capacity"
                      label="Capacity"
                      name="capacity"
                      value={newApartment.capacity}
                      onChange={handleChangeApartment}
                      margin="normal"
                      fullWidth
                      error={Boolean(errors.capacity)}
                      helperText={errors.capacity}
                      onKeyDown={(e) => {
                        // Prevent 'e', 'E', '+', and '-' from being entered
                        if (
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "+" ||
                          e.key === "-"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={12} sx={{ mt: "-1rem" }}>
                    <TextField
                      required
                      id="payor"
                      label="Payor Name"
                      name="payorname"
                      value={newApartment.payorname}
                      onChange={handleChangeApartment}
                      margin="normal"
                      fullWidth
                      defaultValue="N/A"
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                      sx={{ display: "none" }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6} sx={{ mt: "0rem" }}>
                    <FormControl
                      required
                      fullWidth
                      error={Boolean(errors.apartmentstatus)}
                    >
                      <InputLabel
                        error={Boolean(errors.apartmentstatus)}
                        id="demo-simple-select-label"
                      >
                        Status
                      </InputLabel>
                      <Select
                        required
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={newApartment.apartmentstatus}
                        name="apartmentstatus"
                        label="Status"
                        error={Boolean(errors.apartmentstatus)}
                        onChange={handleChangeApartment}
                      >
                        <MenuItem value="Available">Available</MenuItem>
                        {/* <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem> */}
                      </Select>
                      {errors.apartmentstatus && (
                        <FormHelperText
                          error
                          sx={{
                            marginLeft: "14px",
                            marginRight: "14px",
                            fontSize: "0.75rem",
                          }}
                        >
                          {errors.apartmentstatus}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    {/* Information message */}
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: "0.2rem",
                        fontSize: "16px",
                        color: "gray",
                      }}
                    >
                      ----- Apartment Address ------
                    </Typography>
                  </Grid>

                  <Grid item xs={12} lg={3} sx={{ mt: "-1rem" }}>
                    <TextField
                      required
                      type="text"
                      id="building-no"
                      label="Building No."
                      name="buildingno"
                      value={newApartment.buildingno}
                      onChange={handleChangeApartment}
                      margin="normal"
                      fullWidth
                      error={Boolean(errors.buildingno)}
                      helperText={errors.buildingno}
                    />
                  </Grid>
                  <Grid item xs={12} lg={3} sx={{ mt: "-1rem" }}>
                    <TextField
                      required
                      type="text"
                      id="street"
                      label="Street"
                      name="street"
                      value={newApartment.street}
                      onChange={handleChangeApartment}
                      margin="normal"
                      fullWidth
                      error={Boolean(errors.street)}
                      helperText={errors.street}
                    />
                  </Grid>
                  <Grid item xs={12} lg={3} sx={{ mt: "-1rem" }}>
                    <TextField
                      required
                      type="text"
                      id="barangay"
                      label="Barangay"
                      name="barangay"
                      defaultValue={propAddress.barangay || ""}
                      value={newApartment.barangay}
                      onChange={handleChangeApartment}
                      margin="normal"
                      InputProps={{ readOnly: true }}
                      fullWidth
                      error={Boolean(errors.barangay)}
                      helperText={errors.barangay}
                    />
                  </Grid>
                  <Grid item xs={12} lg={3} sx={{ mt: "-1rem" }}>
                    <TextField
                      required
                      id="municipality"
                      label="Municipality"
                      defaultValue="Sorsogon City"
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      fullWidth
                      margin="normal"
                      name="municipality"
                      value={newApartment.municipality}
                      onChange={handleChangeApartment}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    {/* Information message */}
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: "0.2rem",
                        fontSize: "15px",
                        color: "gray",
                      }}
                    >
                      <InfoOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                      Please specify the inclusions for the apartment
                    </Typography>
                  </Grid>

                  <Grid item xs={12} lg={12}>
                    <Autocomplete
                      multiple
                      name="inclusion"
                      value={selectedInclusions}
                      onChange={handleInclusionChange}
                      options={inclusion}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Inclusions"
                          placeholder="Select inclusions"
                          error={Boolean(errors.inclusion)}
                          helperText={errors.inclusion}
                        />
                      )}
                    />
                    {/* <Autocomplete
                      required
                      multiple
                      value={selectedInclusions}
                      onChange={handleInclusionChange}
                      name="inclusion"
                      id="checkboxes-tags-demo"
                      options={inclusion}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.name}
                      renderOption={(props, option, { selected }) => {
                        const { key, ...optionProps } = props;
                        return (
                          <li key={key} {...optionProps}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.name}
                          </li>
                        );
                      }}
              
                      renderInput={(params) => (
                        <TextField required {...params} label="Inclusion" placeholder="inclusion" />
                      )}
                    /> */}
                  </Grid>
                  <Grid item xs={12}>
                    {selectedInclusions.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: 0.5,
                          mb: 1,
                        }}
                      >
                        <Typography sx={{ mr: 2 }}>{item.name}:</Typography>
                        <Button
                          variant="outlined"
                          sx={{
                            color: "#a55555",
                            borderColor: "#a55555",
                            minWidth: "30px",
                            minHeight: "30px",
                            padding: "0 6px", // Smaller padding for reduced button size
                            "&:hover": {
                              backgroundColor: "#f7e0e0",
                              borderColor: "#a55555",
                            },
                            borderRadius: "8px", // Rounded but smaller than a full circle
                          }}
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </Button>

                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                          InputProps={{
                            inputProps: { min: 1 },
                            readOnly: true,
                            sx: { textAlign: "center", fontWeight: "bold" },
                          }}
                          size="small"
                          sx={{
                            width: "45px",
                            mx: 0.5, // Horizontal margin for spacing between input and buttons
                            "& .MuiInputBase-input": {
                              textAlign: "center",
                              padding: "4px 0", // Adjust padding to match button size
                            },
                          }}
                        />

                        <Button
                          variant="contained"
                          sx={{
                            color: "#fff",
                            backgroundColor: "#a55555",
                            minWidth: "30px",
                            minHeight: "30px",
                            padding: "0 6px", // Smaller padding for reduced button size
                            "&:hover": {
                              backgroundColor: "#8c4444",
                            },
                            borderRadius: "8px", // Rounded but not a full circle
                          }}
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          <AddIcon fontSize="small" />
                        </Button>
                      </Box>
                    ))}
                  </Grid>

                  <Grid item xs={12}>
                    {/* Information message */}
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: "0.2rem",
                        fontSize: "15px",
                        color: "gray",
                      }}
                    >
                      <InfoOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                      Please Select Image
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        border: `2px dashed ${
                          errors.images ? "#d32f2f" : "#ccc"
                        }`,
                        borderRadius: "5px",
                        padding: "20px",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      <Box sx={{ marginBottom: "-10px" }}>
                        {selectedImage && selectedImage.length > 0 ? (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}
                          >
                            {selectedImage.map((image, index) => (
                              <Box
                                key={image.id || index}
                                sx={{
                                  position: "relative",
                                  width: 100,
                                  height: 100,
                                  marginBottom: 2,
                                }}
                              >
                                <Image
                                  src={
                                    image.preview ||
                                    `http://127.0.0.1:8000/ApartmentImage/${image.path}`
                                  }
                                  alt={image.name}
                                  width={500} // Add specific width
                                  height={300} // Add specific height
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    mt: 1,
                                    display: "block",
                                    maxWidth: "100%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {image.name}
                                </Typography>
                                <IconButton
                                  onClick={() => handleRemoveImage(index)}
                                  sx={{
                                    position: "absolute",
                                    top: -8,
                                    right: -8,
                                    backgroundColor: "white",
                                    "&:hover": { backgroundColor: "white" },
                                  }}
                                >
                                  <HighlightOffOutlinedIcon color="warning" />
                                </IconButton>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography
                            variant="body1"
                            gutterBottom
                            sx={{ color: "gray" }}
                          >
                            Select Apartment House Images
                          </Typography>
                        )}
                        <IconButton component="label">
                          <CloudUploadOutlinedIcon fontSize="large" />
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.svg,"
                            name="image"
                            hidden
                            multiple
                            onChange={handleImageChange}
                          />
                        </IconButton>
                      </Box>
                      {errors.images && (
                        <FormHelperText
                          error
                          sx={{
                            display: "block",
                            textAlign: "center",
                            marginTop: 1,
                          }}
                        >
                          {errors.images}
                        </FormHelperText>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              )}

              {selectedProperty === "Boarding House" && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {/* Information message */}
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: "0.9rem",
                        fontSize: "15px",
                        color: "#212121",
                      }}
                    >
                      Boarding House Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} lg={4} sx={{ mt: "-1.3rem" }}>
                    <TextField
                      required
                      type="text"
                      id="property-name"
                      label="Property Name"
                      name="boardinghousename"
                      value={newboardinghouse.boardinghousename}
                      onChange={handleChangeBoardinghouse}
                      margin="normal"
                      fullWidth
                      error={Boolean(errors.boardinghousename)}
                      helperText={errors.boardinghousename}
                    />
                  </Grid>

                  {/* <Grid item xs={12} lg={4} sx={{mt:'-1.3rem'}}>
                    <TextField
                      required
                      type='number'
                      id="rental-fee"
                      label="Rental Fee"
                      name="rentalfee"
                      value={newboardinghouse.rentalfee}
                      onChange={handleChangeBoardinghouse}
                      margin="normal"
                      fullWidth
                    />

                  </Grid> */}
                  {/* <Grid item xs={12} lg={4} sx={{mt:'-0.3rem'}}>
                    <FormControl required fullWidth>
                      <InputLabel id="demo-simple-select-label">Status</InputLabel>
                      <Select
                        value={newboardinghouse.boardinghousestatus}
                        name="boardinghousestatus"
                        onChange={handleChangeBoardinghouse}
                        required
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Status"
                      >
                        <MenuItem value="Available">Available</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid> */}
                  {/* <Grid item xs={12} lg={4} sx={{mt:'-1.3rem'}}>
                    <TextField
                      id="apartment-name"
                      label="Payor Name"
                      name="payroname"
                      value={newboardinghouse.payorname}
                      onChange={handleChangeBoardinghouse}
                      margin="normal"
                      fullWidth
                      defaultValue="N/A"
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                    />

                  </Grid> */}

                  {/* <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center', mt: '0.9rem', fontSize: '15px', color: 'gray' }}>
                    ------ Room Information ------
                    </Typography>
                  </Grid> */}

                  <Grid item xs={12} lg={4} sx={{ mt: "-0.3rem" }}>
                    <TextField
                      label="Number of Rooms"
                      type="number"
                      name="numRooms"
                      value={numRooms}
                      onChange={handleNumRoomsChange}
                      inputProps={{ min: 1 }}
                      variant="outlined"
                      fullWidth
                      required
                      error={Boolean(errors.numRooms)}
                      helperText={errors.numRooms}
                    />
                  </Grid>

                  <Grid item xs={12} lg={4} sx={{ mt: "-1.3rem" }}>
                    <TextField
                      id="apartment-name"
                      label="Boarding House Total Capacity"
                      name="capacity"
                      margin="normal"
                      fullWidth
                      value={totalcapacity}
                      InputProps={{ readOnly: true }}
                      // disabled
                    />
                  </Grid>

                  <Grid item xs={12}>
                    {/* Dynamically render room inputs */}
                    {rooms.map((room, roomIndex) => (
                      <Grid item xs={12} key={`grid-${roomIndex}`}>
                        <Typography
                          variant="h6"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: "0.2rem",
                            fontSize: "15px",
                            fontWeight: 550,
                            color: "black",
                          }}
                        >
                          Room {roomIndex + 1}
                        </Typography>
                        {/* <Divider/> */}
                        <Box
                          key={`box-${roomIndex}`}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            mt: 0.8,
                          }}
                        >
                          <Box sx={{ display: "flex", gap: 2 }}>
                            {/* <Grid xs={0}> */}
                            <TextField
                              sx={{ mt: "0.4rem", display: "none" }}
                              label={`Room ${roomIndex + 1}`}
                              type="number"
                              name="room_number"
                              value={room.room_number || roomIndex + 1}
                              // onChange={(e) => handleBedChange(index, e)}
                              inputProps={{ min: 1 }}
                              variant="outlined"
                              fullWidth
                              required
                            />
                            {/* </Grid> */}
                            <Grid xs={5}>
                              <TextField
                                sx={{ mt: "0.4rem" }}
                                label={`Room ${roomIndex + 1} - Number of Beds`}
                                type="number"
                                name="number_of_beds"
                                value={room.number_of_beds || 1}
                                // value={room.beds.length > 0 ? room.beds.length : ''}
                                // value={room.beds.length} //old
                                // onChange={(e) => handleBedCountChange(roomIndex, e.target.value)}
                                inputProps={{ min: 1, max: 8 }}
                                variant="outlined"
                                fullWidth
                                required
                                InputProps={{ readOnly: true }}
                                error={Boolean(
                                  errors[`room_${roomIndex}_beds`]
                                )}
                                helperText={errors[`room_${roomIndex}_beds`]}
                              />
                            </Grid>
                          </Box>

                          {/* Bed Type Input */}
                          <Grid container spacing={2} sx={{ mt: 0, mb: 1 }}>
                            {(Array.isArray(room.beds) ? room.beds : []).map(
                              (bed, bedIndex) => (
                                <Grid item xs={12} key={bedIndex}>
                                  <Typography
                                    gutterBottom
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      mt: "0.3rem",
                                      fontSize: "15px",
                                      color: "#212121",
                                      fontStyle: "revert-layer",
                                      letterSpacing: 1,
                                    }}
                                  >
                                    Bed {bed.bed_number} Information
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 1,
                                      borderRadius: "4px",
                                      mb: 1,
                                    }}
                                  >
                                    {/* <Grid item xs={4}> */}
                                    <TextField
                                      fullWidth
                                      label="Bed Number"
                                      type="number"
                                      defaultValue={
                                        bed.bed_number || bedIndex + 1
                                      }
                                      value={bed.bed_number || bedIndex + 1}
                                      InputProps={{ readOnly: true }}
                                      sx={{ mb: 1, display: "none" }}
                                    />
                                    {/* </Grid> */}
                                    <Grid item xs={5}>
                                      {/* <FormControl fullWidth sx={{ mb: 1 }}>
                                    <InputLabel>Bed Type</InputLabel>
                                    <Select
                                      value={bed.price || ''}
                                      onChange={(e) => handleBedTypeChange(roomIndex, bedIndex, e.target.value)}
                                      label="Bed Type"
                                      disabled={bed.status.toLowerCase() === 'occupied'}
                                     
                                    >
                                      <MenuItem value="single">Single</MenuItem>
                                      <MenuItem value="double">Double</MenuItem>
                                      <MenuItem value="bunk">Bunk</MenuItem>
                                    </Select>
                                  </FormControl> */}
                                      <TextField
                                        name="price"
                                        label="Price"
                                        type="number"
                                        fullWidth
                                        margin="auto"
                                        required
                                        inputProps={{ min: 1 }}
                                        onKeyDown={(e) => {
                                          // Prevent 'e', 'E', '+', and '-' from being entered
                                          if (
                                            e.key === "e" ||
                                            e.key === "E" ||
                                            e.key === "+" ||
                                            e.key === "-"
                                          ) {
                                            e.preventDefault();
                                          }
                                        }}
                                        value={bed.price}
                                        onChange={(e) =>
                                          handleBedPrice(
                                            roomIndex,
                                            bedIndex,
                                            e.target.value
                                          )
                                        }
                                        error={Boolean(
                                          errors[
                                            `room_${roomIndex}_bed_${bedIndex}_price`
                                          ]
                                        )}
                                        helperText={
                                          errors[
                                            `room_${roomIndex}_bed_${bedIndex}_price`
                                          ]
                                        }
                                      />
                                    </Grid>
                                    <Grid item xs={5}>
                                      <FormControl
                                        fullWidth
                                        error={Boolean(
                                          errors[
                                            `room_${roomIndex}_bed_${bedIndex}_status`
                                          ]
                                        )}
                                      >
                                        {bed.status.toLocaleLowerCase() ===
                                        "occupied" ? (
                                          <>
                                            <TextField
                                              value="Occupied"
                                              label="Bed Status"
                                              InputProps={{ readOnly: true }}
                                              fullWidth
                                            />
                                          </>
                                        ) : (
                                          <>
                                            <InputLabel>Bed Status</InputLabel>
                                            <Select
                                              value={bed.status || ""}
                                              onChange={(e) =>
                                                handleBedStatusChange(
                                                  roomIndex,
                                                  bedIndex,
                                                  e.target.value
                                                )
                                              }
                                              label="Bed Status"
                                            >
                                              <MenuItem value="available">
                                                Available
                                              </MenuItem>
                                              {/* <MenuItem value="occupied">Occupied</MenuItem>  */}
                                              {/* <MenuItem value="reserved">Reserved</MenuItem> */}
                                            </Select>
                                            {errors[
                                              `room_${roomIndex}_bed_${bedIndex}_status`
                                            ] && (
                                              <FormHelperText>
                                                {
                                                  errors[
                                                    `room_${roomIndex}_bed_${bedIndex}_status`
                                                  ]
                                                }
                                              </FormHelperText>
                                            )}
                                          </>
                                        )}
                                      </FormControl>
                                    </Grid>
                                    <AcceptToolTip title="Add Bed">
                                      <IconButton
                                        onClick={() =>
                                          handleBedCountChange(
                                            roomIndex,
                                            (room.number_of_beds || 0) + 1
                                          )
                                        }
                                      >
                                        <ControlPointOutlinedIcon color="success" />
                                      </IconButton>
                                    </AcceptToolTip>
                                    <CustomTooltip title="Remove Bed">
                                      <IconButton
                                        onClick={() =>
                                          handleRemoveBed(
                                            roomIndex,
                                            (room.number_of_beds || 0) - 1
                                          )
                                        }
                                      >
                                        <RemoveCircleOutlineOutlinedIcon color="warning" />
                                      </IconButton>
                                    </CustomTooltip>
                                  </Box>
                                </Grid>
                              )
                            )}
                          </Grid>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: "0.9rem",
                        fontSize: "15px",
                        color: "#212121",
                      }}
                    >
                      Boarding House Address
                    </Typography>
                  </Grid>

                  <Grid item xs={12} lg={3} sx={{ mt: "-1rem" }}>
                    <TextField
                      required
                      type="text"
                      id="building-no"
                      label="Building No."
                      name="buildingno"
                      value={newboardinghouse.buildingno}
                      onChange={handleChangeBoardinghouse}
                      margin="normal"
                      fullWidth
                      error={Boolean(errors.buildingno)}
                      helperText={errors.buildingno}
                    />
                  </Grid>

                  <Grid item xs={12} lg={3} sx={{ mt: "-1rem" }}>
                    <TextField
                      id="street"
                      label="Street"
                      name="street"
                      value={newboardinghouse.street}
                      onChange={handleChangeBoardinghouse}
                      margin="normal"
                      fullWidth
                      error={Boolean(errors.street)}
                      helperText={errors.street}
                    />
                  </Grid>

                  <Grid item xs={12} lg={3} sx={{ mt: "-1rem" }}>
                    <TextField
                      required
                      type="text"
                      id="barangay"
                      label="Barangay"
                      name="barangay"
                      defaultValue={propAddress.barangay}
                      value={newboardinghouse.barangay}
                      onChange={handleChangeBoardinghouse}
                      margin="normal"
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} lg={3} sx={{ mt: "-1rem" }}>
                    <TextField
                      required
                      type="text"
                      id="municipality"
                      label="Municipality"
                      defaultValue="Sorsogon City"
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      fullWidth
                      margin="normal"
                      name="municipality"
                      value={newboardinghouse.municipality}
                      onChange={handleChangeBoardinghouse}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    {/* Information message */}
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: "1rem",
                        fontSize: "15px",
                        color: "#212121",
                      }}
                    >
                      <InfoOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                      Please select the inclusions for the Boarding House
                    </Typography>
                  </Grid>

                  <Grid item xs={12} lg={12}>
                    <Autocomplete
                      multiple
                      name="inclusion"
                      value={selectedInclusions}
                      onChange={handleInclusionChange}
                      options={inclusion}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Inclusions"
                          placeholder="Select inclusions"
                          error={Boolean(errors.inclusion)}
                          helperText={errors.inclusion}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {selectedInclusions.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: 0.5,
                          mb: 1,
                        }}
                      >
                        <Typography sx={{ mr: 2 }}>{item.name}:</Typography>
                        <Button
                          variant="outlined"
                          sx={{
                            color: "#a55555",
                            borderColor: "#a55555",
                            minWidth: "30px",
                            minHeight: "30px",
                            padding: "0 6px", // Smaller padding for reduced button size
                            "&:hover": {
                              backgroundColor: "#f7e0e0",
                              borderColor: "#a55555",
                            },
                            borderRadius: "8px", // Rounded but smaller than a full circle
                          }}
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </Button>

                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                          InputProps={{
                            inputProps: { min: 1 },
                            readOnly: true,
                            sx: { textAlign: "center", fontWeight: "bold" },
                          }}
                          size="small"
                          sx={{
                            width: "45px",
                            mx: 0.5, // Horizontal margin for spacing between input and buttons
                            "& .MuiInputBase-input": {
                              textAlign: "center",
                              padding: "4px 0", // Adjust padding to match button size
                            },
                          }}
                        />

                        <Button
                          variant="contained"
                          sx={{
                            color: "#fff",
                            backgroundColor: "#a55555",
                            minWidth: "30px",
                            minHeight: "30px",
                            padding: "0 6px", // Smaller padding for reduced button size
                            "&:hover": {
                              backgroundColor: "#8c4444",
                            },
                            borderRadius: "8px", // Rounded but not a full circle
                          }}
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          <AddIcon fontSize="small" />
                        </Button>
                      </Box>
                    ))}
                  </Grid>
                  <Grid item xs={12}>
                    {/* Information message */}
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: "0.2rem",
                        fontSize: "15px",
                        color: "#212121",
                      }}
                    >
                      <InfoOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                      Please Select Image
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={12}>
                    <Box
                      sx={{
                        border: '2px dashed #ccc',
                        borderRadius: '5px',
                        padding: '20px',
                        textAlign: 'center',
                        width: '100%',
                      }}
                    >
                      <Box sx={{ marginBottom: '-10px' }}>
                        {selectedImage ? (
                          <Typography variant="body1" gutterBottom sx={{ color: 'gray', fontSize: '18px' }}>
                           {typeof selectedImage === 'string' ? selectedImage : selectedImage.name} 
                           <IconButton>
                            <HighlightOffOutlinedIcon color='warning' onClick={() => setSelectedImage(null)} />
                          </IconButton>
                          </Typography>
                        ):(
                        <Typography variant="body1" gutterBottom sx={{ color: 'gray' }}>
                        Select Boarding House Image
                        </Typography>
                        )}
                        <IconButton component="label">
                          <CloudUploadOutlinedIcon fontSize="large" />
                          <input type="file" accept=".gif,.jpg,.jpeg,.png,.svg," name='image' hidden onChange={handleImageChange} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid> */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        border: `2px dashed ${
                          errors.images ? "#d32f2f" : "#ccc"
                        }`,
                        borderRadius: "5px",
                        padding: "20px",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      <Box sx={{ marginBottom: "-10px" }}>
                        {selectedImage && selectedImage.length > 0 ? (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}
                          >
                            {selectedImage.map((image, index) => (
                              <Box
                                key={image.id || index}
                                sx={{
                                  position: "relative",
                                  width: 100,
                                  height: 100,
                                  marginBottom: 2,
                                }}
                              >
                                <Image
                                  src={
                                    image.preview ||
                                    `http://127.0.0.1:8000/ApartmentImage/${image.path}`
                                  }
                                  alt={image.name}
                                  width={500} // Add specific width
                                  height={300} // Add specific height
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    mt: 1,
                                    display: "block",
                                    maxWidth: "100%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {image.name}
                                </Typography>
                                <IconButton
                                  onClick={() => handleRemoveImage(index)}
                                  sx={{
                                    position: "absolute",
                                    top: -8,
                                    right: -8,
                                    backgroundColor: "white",
                                    "&:hover": { backgroundColor: "white" },
                                  }}
                                >
                                  <HighlightOffOutlinedIcon color="warning" />
                                </IconButton>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography
                            variant="body1"
                            gutterBottom
                            sx={{ color: "gray" }}
                          >
                            Select Boarding House Images
                          </Typography>
                        )}
                        <IconButton component="label">
                          <CloudUploadOutlinedIcon fontSize="large" />
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.svg,"
                            name="image"
                            hidden
                            multiple
                            onChange={handleImageChange}
                          />
                        </IconButton>
                      </Box>
                      {errors.images && (
                        <FormHelperText
                          error
                          sx={{
                            display: "block",
                            textAlign: "center",
                            marginTop: 1,
                          }}
                        >
                          {errors.images}
                        </FormHelperText>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={!selectedProperty}
                fullWidth
                sx={{
                  fontSize: "16px",
                  marginTop: "16px",
                  borderRadius: "10px",
                  padding: "12px",
                  background: "primary",
                  "&:hover": { backgroundColor: "#9575cd" },
                  letterSpacing: "2px",
                }}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                fullWidth
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
                  setErrors({});
                  handleClose();
                  setEditItem(null);
                  setNewApartment({
                    propertyid: propertyId,
                    apartmentname: "",
                    capacity: "",
                    rentalfee: "",
                    payorname: "none",
                    apartmentstatus: "",
                    buildingno: "",
                    street: "",
                    // barangay: '' ,
                    municipality: "Sorsogon City",
                  });
                  setNewBoardinghouse({
                    propertyid: propertyId,
                    boardinghousename: "",
                    rentalfee: "",
                    payorname: "none",
                    boardinghousestatus: "",
                    buildingno: "",
                    street: "",
                    // barangay: '' ,
                    municipality: "Sorsogon City",
                  });
                  setSelectedImage(null);
                  setSelectedProperty("");
                  setSelectedInclusions([""]);
                  setNumRooms(1);
                  setRooms([{ beds: [{ type: "", status: "" }] }]);
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
