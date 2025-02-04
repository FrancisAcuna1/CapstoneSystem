"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  CircularProgress,
} from "@mui/material";
import { styled, useTheme, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
// import CheckBoxIcon from "@mui/icons-material/CheckBox";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Image from "next/image";
import { useSnackbar } from "notistack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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
  onRefresh,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isMovingOut, setIsMovingOut] = useState(false);
  const [moveOutDate, setMoveOutDate] = useState(null);
  const [numRooms, setNumRooms] = useState(1);
  const [rooms, setRooms] = useState([
    {
      beds: [{ price: "", status: "" }],
    },
  ]);
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
    buildingno: "",
    street: "",
    barangay: propAddress.barangay,
    municipality: "Sorsogon City",
  });

  const [moveOutStatus, setMoveOutStatus] = useState(
    rooms.map((room) => (room.beds ? room.beds.map(() => false) : [])) // Ensure bed array exists for bh
  );

  const [bhMoveOutDates, setBhMoveOutDates] = useState(
    rooms.map((room) => (room.beds ? room.beds.map(() => null) : [])) // Ensure bed array exists for bh
  );

  console.log("Edit id:", editItem);
  console.log("id:", propsid);
  console.log("inclusion:", inclusion);
  console.log("selectedInclusion", selectedInclusions);
  console.log("Image:", selectedImage);
  console.log("Edit Apartment Value:", newApartment);
  console.log("Edit Boarding House Value:", newboardinghouse);
  console.log("delete:", deleteImage);
  console.log("rooms:", rooms);
  console.log(moveOutDate);
  console.log(bhMoveOutDates);

  const handleChangeApartment = (e) => {
    const { name, value } = e.target;
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setNewApartment({
      ...newApartment,
      municipality: "Sorosgon City",
      [name]: value || "",
    });
  };

  const handleChangeBoardinghouse = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setNewBoardinghouse({
      ...newboardinghouse,
      municipality: "Sorosgon City",
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
        return;
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
            console.log(data);
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
              if (data?.apartment?.images || "") {
                const existingImages = data.apartment.images.map((img) => ({
                  id: img.id,
                  path: img.image_path,
                  preview: `http://127.0.0.1:8000/ApartmentImage/${img.image_path}`, // Adjust URL as needed
                }));
                setSelectedImage(existingImages);
              }
              setSelectedProperty(data?.apartment?.property_type);
              setMoveOutDate(data?.apartment?.move_out_date);
            } else if (selectedProperty === "Boarding House") {
              setNewBoardinghouse({
                propertyid: data?.boardinghouse?.property_id,
                boardinghousename: data?.boardinghouse?.boarding_house_name,
                numberofrooms: data?.boardinghouse?.number_of_rooms,
                capacity: data?.boardinghouse?.capacity,
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

              const moveOutDatesArray =
                data?.boardinghouse?.rooms?.map(
                  (room) =>
                    room.beds?.map((bed) =>
                      bed.move_out_date ? new Date(bed.move_out_date) : null
                    ) || []
                ) || [];

              setBhMoveOutDates(moveOutDatesArray);

              const inclusionsArray =
                data?.boardinghouse?.inclusions?.map((item) => ({
                  id: item.equipment.id,
                  name: item.equipment.name,
                  quantity: item.quantity,
                })) || [];
              setSelectedInclusions(inclusionsArray);
              console.log("Processed inclusions:", inclusionsArray);
              setNumRooms(data?.boardinghouse?.number_of_rooms);
            }
          } else {
            console.error("Error fetching property details:", data.message);
          }
        } catch (error) {
          console.log("Error:", error);
        } finally {
          console.log("finally");
        }
      }
    };
    fetchDataEdit();
  }, [editItem, selectedProperty, setSelectedProperty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json
    const accessToken = userData.accessToken;
    console.log("Token:", accessToken);

    const determinePropertyStatus = (originalStatus, rooms) => {
      // Count total beds and available beds
      const totalBeds = rooms.reduce(
        (acc, room) => acc + (room.number_of_beds || 0),
        0
      );

      const availableBeds = rooms.reduce(
        (acc, room) =>
          acc + room.beds.filter((bed) => bed.status === "Available").length,
        0
      );

      const occupiedBeds = rooms.reduce(
        (acc, room) =>
          acc + room.beds.filter((bed) => bed.status === "Occupied").length,
        0
      );

      // If there are no beds at all
      if (totalBeds === 0) {
        return "Available";
      }

      // If all beds are occupied
      if (occupiedBeds === totalBeds) {
        return "Occupied";
      }

      // If there are some available beds
      if (availableBeds > 0) {
        return "Available";
      }

      // Fallback to the original status if something unexpected happens
      return originalStatus;
    };

    if (accessToken) {
      console.log("Value:", newApartment);
      console.log("Value:", newboardinghouse);
      console.log("rooms:", rooms);
      console.log("inclusion:", selectedInclusions);

      try {
        const formData = new FormData();
        let hasErrors = false;
        let newErrors = {};

        const updatedStatus = determinePropertyStatus(
          newboardinghouse.boardinghousestatus,
          rooms
        );

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
          } else {
            // Check if the file size exceeds the limit (3050 KB = 3.05 MB)
            const maxSize = 3050 * 1024; // Convert 3050 KB to bytes
            if (selectedImage[0].size > maxSize) {
              hasErrors = true;
              newErrors.images = "Image size should not exceed 3MB";
            }
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

          const formattedMoveOutDate = moveOutDate
            ? dayjs(moveOutDate).format("MM/DD/YYYY")
            : null;

          console.log("📝 moveoutdate being sent:", formattedMoveOutDate);

          if (formattedMoveOutDate) {
            formData.append("moveoutdate", formattedMoveOutDate);
          } else {
            formData.append("moveoutdate", ""); // Laravel will convert this to null
          }

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
          } else {
            // Check if the file is an image and check the type
            // const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            // if (!validImageTypes.includes(selectedImage[0].type)) {
            //   hasErrors = true;
            //   newErrors.images = "Invalid image type. Only jpeg, png, jpg, or gif are allowed";
            // }

            // Check if the file size exceeds the limit (3050 KB = 3.05 MB)
            const maxSize = 3050 * 1024; // Convert 3050 KB to bytes
            if (selectedImage[0].size > maxSize) {
              hasErrors = true;
              newErrors.images = "Image size should not exceed 3MB";
            }
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
          // formData.append("status", newboardinghouse.boardinghousestatus);
          formData.append("status", updatedStatus);
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
              const moveOutDate = bhMoveOutDates[roomIndex]?.[bedIndex];
              if (moveOutDate) {
                // Convert the dayjs object to a formatted string
                const formattedMoveOutDate =
                  dayjs(moveOutDate).format("MM/DD/YYYY");
                formData.append(
                  `rooms[${roomIndex}][beds][${bedIndex}][move_out_date]`,
                  formattedMoveOutDate
                );
              }
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
          setEditItem(null);
          onRefresh();
          setSelectedImage(null);
          setSelectedInclusions([]);
          setErrors({});
          setRooms([{ beds: [{ price: "", status: "" }] }]);
          setSelectedProperty("");
          enqueueSnackbar(data.message, { variant: "success" });
          setLoading(false);
        } else {
          // handleClose();
          // setSelectedProperty('')
          // setSelectedImage(null);
          // setSelectedInclusions([])
          // setNewApartment({});
          // setNewBoardinghouse({});
          // setRooms([{beds: [{ price: "", status: "" }],}])
          // setEditItem(null);
          setLoading(false);
          enqueueSnackbar(data.message, { variant: "error" });
          console.log(data.error);
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setLoading(false);
      }
    } else {
      console.error("Authentication error: Token missing or invalid");
    }
  };

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
        // const currentImages = prevImages ?? [];
        const currentImages = Array.isArray(prevImages) ? prevImages : [];
        return [...currentImages, ...newPreviews];
      });
    }

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
    const newNumRooms = Math.min(parseInt(e.target.value, 10), 10);

    // Check if any room has an occupied bed before decreasing numRooms
    const roomsWithOccupiedBeds = rooms.some((room) =>
      room.beds.some((bed) => bed.status === "Occupied")
    );

    // If we are decreasing the number of rooms
    if (newNumRooms < numRooms) {
      // Filter out rooms with occupied beds
      const roomsWithOccupiedBeds = rooms.filter((room) =>
        room.beds.some((bed) => bed.status === "Occupied")
      );

      // If there are rooms with occupied beds, we can't decrease the room count
      if (
        roomsWithOccupiedBeds.length > 0 &&
        newNumRooms < roomsWithOccupiedBeds.length
      ) {
        enqueueSnackbar(
          "Cannot decrease the number of rooms with occupied beds",
          { variant: "error" }
        );
        return; // Prevent reducing the number of rooms if there are occupied beds
      }
    }

    // If no occupied beds, proceed with updating the number of rooms
    setNumRooms(newNumRooms);
    setRooms((prevRooms) => {
      const currentRooms = [...prevRooms];

      if (newNumRooms > currentRooms.length) {
        // Add new rooms
        const additionalRooms = Array.from(
          { length: newNumRooms - currentRooms.length },
          (_, index) => ({
            room_number: currentRooms.length + index + 1,
            number_of_beds: 1,
            beds: [{ bed_number: 1, price: "", status: "" }],
          })
        );
        return [...currentRooms, ...additionalRooms];
      } else if (newNumRooms < currentRooms.length) {
        // Remove rooms, but ensure that rooms with occupied beds are never removed
        const roomsWithOccupiedBeds = currentRooms.filter((room) =>
          room.beds.some((bed) => bed.status === "Occupied")
        );

        // If there are more rooms than newNumRooms, we will slice off the non-occupied rooms.
        const availableRoomsToRemove = currentRooms.filter(
          (room) => !room.beds.some((bed) => bed.status === "Occupied")
        );

        // Take the rooms that have occupied beds and add as many non-occupied rooms as possible
        const remainingRooms = [
          ...roomsWithOccupiedBeds,
          ...availableRoomsToRemove.slice(
            0,
            newNumRooms - roomsWithOccupiedBeds.length
          ),
        ];

        return remainingRooms;
      }

      // No change in room count
      return currentRooms;
    });

    // Clear the error message when there's a valid value
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.numRooms;
      return updatedErrors;
    });
  };

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

  // this is for apartment
  const handleIsMoveOut = (event) => {
    setIsMovingOut(event.target.checked);
  };

  const handleDateChange = (value) => {
    setMoveOutDate(value);
  };

  //this is for boarding house
  const handleIsMoveOutBh = (roomIndex, bedIndex, event) => {
    setMoveOutStatus((prevState) => {
      const updatedState = [...prevState];
      updatedState[roomIndex][bedIndex] = event.target.checked;
      return updatedState;
    });
  };

  const handleDateChangeBh = (roomIndex, bedIndex, newValue) => {
    setBhMoveOutDates((prevState) => {
      const updatedState = [...prevState];
      updatedState[roomIndex][bedIndex] = newValue;
      return updatedState;
    });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5, mb: 3 }}>
      <AddButton
        variant="extended"
        aria-label="add"
        onClick={handleOpen}
        sx={{ zIndex: 0 }}
      >
        <AddCircleOutlineIcon sx={{ mr: 1 }} />
        Add Rental Units
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
          setMoveOutStatus([[false]]); // Reset to initial state with one room and one bed
          setBhMoveOutDates([[null]]); // Reset to initial state with one room and one bed
        }}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={open}>
          <ModalContent style={{ width: "90%", maxWidth: "800px" }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 560,
                letterSpacing: 1,
                textTransform: "uppercase",
                mb: 3,
              }}
            >
              {editItem ? "Edit Unit Information" : "Add Rental Unit"}
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
                  <MenuItem
                    disabled={editItem && selectedProperty === "Boarding House"}
                    value="Apartment"
                  >
                    Apartment
                  </MenuItem>
                  <MenuItem
                    disabled={editItem && selectedProperty === "Apartment"}
                    value="Boarding House"
                  >
                    Boarding House
                  </MenuItem>
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
                      label="Unit Name"
                      name="apartmentname"
                      value={newApartment.apartmentname || ""}
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
                      value={newApartment.numberofrooms || ""}
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
                      value={newApartment.rentalfee || ""}
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
                      value={newApartment.capacity || ""}
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
                      value={newApartment.payorname || ""}
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
                      disabled={
                        editItem && newApartment.apartmentstatus === "Occupied"
                      }
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
                        value={newApartment.apartmentstatus || ""}
                        name="apartmentstatus"
                        label="Status"
                        error={Boolean(errors.apartmentstatus)}
                        onChange={handleChangeApartment}
                      >
                        <MenuItem value="Available">Available</MenuItem>
                        {editItem &&
                          newApartment.apartmentstatus === "Occupied" && (
                            <MenuItem value="Occupied" disabled>
                              Occupied
                            </MenuItem>
                          )}
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

                  {newApartment.apartmentstatus === "Occupied" && (
                    <Grid item xs={12} sx={{ mb: 1 }}>
                      <Box
                        sx={{ display: "inline-flex", alignItems: "center" }}
                      >
                        <Checkbox
                          checked={isMovingOut}
                          onChange={handleIsMoveOut}
                        />
                        <Typography
                          sx={{
                            fontSize: "0.995rem",
                            color: "#263238",
                            fontWeight: 500,
                          }}
                        >
                          Tenan&apos;t is moving out?
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {isMovingOut && (
                    <Grid item xs={12}>
                      <LocalizationProvider
                        error={Boolean(errors.payment_date)}
                        dateAdapter={AdapterDayjs}
                      >
                        <DatePicker
                          label="Move Out Date"
                          name="move_out_date"
                          sx={{ width: "100%" }}
                          value={moveOutDate}
                          onChange={(newValue) => handleDateChange(newValue)}
                          fullWidth
                        />
                      </LocalizationProvider>
                    </Grid>
                  )}

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
                      value={newApartment.buildingno || ""}
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
                      value={newApartment.street || ""}
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
                      value={newboardinghouse.boardinghousename || ""}
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
                      onChange={handleNumRoomsChange || ""}
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
                                        value={bed.price || ""}
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
                                              <MenuItem value="Available">
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
                                  {bed.status.toLocaleLowerCase() ===
                                    "occupied" && (
                                    <Grid item xs={12} sx={{ mb: 1 }}>
                                      <Box
                                        sx={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Checkbox
                                          checked={
                                            moveOutStatus[roomIndex]?.[
                                              bedIndex
                                            ] ||
                                            bhMoveOutDates[roomIndex]?.[
                                              bedIndex
                                            ] !== null ||
                                            false
                                          }
                                          onChange={(e) =>
                                            handleIsMoveOutBh(
                                              roomIndex,
                                              bedIndex,
                                              e
                                            )
                                          }
                                        />
                                        <Typography
                                          sx={{
                                            fontSize: "0.995rem",
                                            color: "#263238",
                                            fontWeight: 500,
                                          }}
                                        >
                                          Tenant is moving out?
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  )}

                                  {/* Move-out Date Picker */}
                                  {(moveOutStatus[roomIndex]?.[bedIndex] ||
                                    bhMoveOutDates[roomIndex]?.[bedIndex]) && (
                                    <Grid item xs={12}>
                                      {bhMoveOutDates[roomIndex]?.[bedIndex] ? (
                                        <Box
                                          sx={{
                                            backgroundColor: "#e3f2fd", // Light gray-blue background
                                            border:
                                              "1px solidrgb(213, 227, 247)", // Subtle border
                                            borderRadius: "8px", // Rounded corners
                                            padding: "12px 16px", // Comfortable padding
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            mb: 3, // Space between icon and text
                                            boxShadow:
                                              "0 1px 2px rgba(0, 0, 0, 0.05)", // Subtle shadow
                                            marginTop: "8px",
                                            width: "fit-content", // Only take up necessary width
                                            "&:hover": {
                                              backgroundColor: "#f1f5f9", // Slightly darker on hover
                                            },
                                          }}
                                        >
                                          {/* Calendar Icon */}
                                          <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ color: "#64748b" }} // Icon color
                                          >
                                            <rect
                                              x="3"
                                              y="4"
                                              width="18"
                                              height="18"
                                              rx="2"
                                              ry="2"
                                            ></rect>
                                            <line
                                              x1="16"
                                              y1="2"
                                              x2="16"
                                              y2="6"
                                            ></line>
                                            <line
                                              x1="8"
                                              y1="2"
                                              x2="8"
                                              y2="6"
                                            ></line>
                                            <line
                                              x1="3"
                                              y1="10"
                                              x2="21"
                                              y2="10"
                                            ></line>
                                          </svg>

                                          <Typography
                                            sx={{
                                              fontSize: "0.925rem",
                                              fontWeight: 500,
                                              color: "#334155", // Dark gray text
                                              letterSpacing: "0.01em",
                                              lineHeight: 1.5,
                                            }}
                                          >
                                            <span
                                              style={{
                                                color: "#64748b",
                                                marginRight: "4px",
                                              }}
                                            >
                                              Move-out date:
                                            </span>
                                            {new Date(
                                              bhMoveOutDates[roomIndex][
                                                bedIndex
                                              ]
                                            ).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                            })}
                                          </Typography>
                                        </Box>
                                      ) : (
                                        <LocalizationProvider
                                          dateAdapter={AdapterDayjs}
                                        >
                                          <DatePicker
                                            label="Move Out Date"
                                            value={
                                              bhMoveOutDates[roomIndex][
                                                bedIndex
                                              ]
                                            }
                                            onChange={(newValue) =>
                                              handleDateChangeBh(
                                                roomIndex,
                                                bedIndex,
                                                newValue
                                              )
                                            }
                                            fullWidth
                                          />
                                        </LocalizationProvider>
                                      )}
                                    </Grid>
                                  )}
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
                      value={newboardinghouse.buildingno || ""}
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
                      value={newboardinghouse.street || ""}
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
                {isLoading ? (
                  <CircularProgress sx={{ color: "white" }} />
                ) : (
                  "Submit"
                )}
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
                  setMoveOutStatus([[false]]);
                  setBhMoveOutDates([[null]]);
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
