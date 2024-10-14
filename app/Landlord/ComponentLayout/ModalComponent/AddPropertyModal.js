'use client';
import React, { useState, useEffect} from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TextField, Typography, Box, Fab, Button, Fade, FormControl, InputLabel, Select, MenuItem, Grid, Autocomplete, Checkbox, IconButton} from '@mui/material';
import { styled, useTheme, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Backdrop = React.forwardRef((props, ref) => {
  const { open, ...other } = props;
  return (
    <Fade in={open}>
      <div ref={ref} {...other} />
    </Fade>
  );
});
Backdrop.displayName = 'Backdrop';

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  300: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
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
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
};

const ModalContent = styled('div')(
  ({ theme }) => css`
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 500;
      text-align: start;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
      background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      border-radius: 18px;
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      box-shadow: 0 4px 12px
          ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
      padding: 24px;
      color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};
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
      
  `,
);

const AddButton = styled(Fab)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// const equipment = [
//   {name: 'Aircon'},
//   {name: 'Elictri Pan'},
//   {name: 'Kitchen'},
//   {name: 'Comfort Room'},
//   {name: 'Stove'},
//   {name: 'Gas Tank'},
//   {name: 'Sala Set'},
// ]

export default function AddPropertyType({ open, handleOpen, handleClose, propertyId, setSuccessful, setError, editItem, setEditItem, setSelectedProperty, selectedProperty}) {
  const { data: session, status } = useSession();
  const [isLoading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [selectedProperty, setSelectedProperty] = useState('');
  const [numRooms, setNumRooms] = useState(1);  // Default to 1 room
  const [rooms, setRooms] = useState([{ beds: 1 }]); // Default to 1 bed in the first room
  // const [rooms, setRooms] = useState([{ room_number: 1, number_of_beds: 1 }]);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedInclusions, setSelectedInclusions] = useState([]);
  const [inclusion, setInclusion] = useState([])
  const propsid = propertyId;
  const [newApartment, setNewApartment] = useState({
    propertyid: propsid,
    apartmentname: '',
    numberofrooms: '',
    capacity: '',
    rentalfee: '',
    payorname:'none',
    apartmentstatus:'',
    buildingno: '' ,
    street: '',
    barangay: '' ,
    municipality: 'Sorsogon City' ,
  })

  const [newboardinghouse, setNewBoardinghouse] = useState({
    propertyid: propsid,
    boardinghousename: '',
    // numberofrooms: '',
    // capacity: '',
    rentalfee: '',
    payorname:'none',
    boardinghousestatus:'',
    buildingno: '' ,
    street: '',
    barangay: '' ,
    municipality: 'Sorsogon City' ,
  })

  console.log('Edit id:', editItem)
  console.log('id:', propsid);
  console.log('inclusion:', inclusion);
  console.log('selectedInclusion', selectedInclusions)
  console.log('Image:', selectedImage)
  console.log('Edit Apartment Value:', newApartment);
  console.log('Edit Boarding House Value:', newboardinghouse);
  console.log("image:", selectedImage)

  const handleChangeApartment = (e) => {
    const { name, value } = e.target;
    setNewApartment({
        ...newApartment,
        [name]: value || ''
    });
  }

  const handleChangeBoardinghouse = (e) => {
    const { name, value } = e.target;
    setNewBoardinghouse({
        ...newboardinghouse,
        [name]: value || ''
    });
  }

  useEffect(() =>{
    const fetchDataEdit = async() => {
      if (!editItem || !selectedProperty) {
        return; // Make sure both `editItem` and `selectedProperty` are available.
      }
      const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json 
      const accessToken = userData.accessToken;
      console.log('Token:', accessToken)

      if(accessToken){
        try{
          const endpoint = selectedProperty === "Apartment"
          ? `http://127.0.0.1:8000/api/edit_apartment/${editItem}`
          :  `http://127.0.0.1:8000/api/edit_boardinghouse/${editItem}`

          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          })

          const data = await response.json()
          console.log(data)
          console.log(response.status)

          if(response.ok){
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
              const inclusionsArray = data?.apartment?.inclusions?.map((item) => ({
                id: item.inclusion.id,
                name: item.inclusion.name,
                quantity: item.quantity,
              })) || [];
              setSelectedInclusions(inclusionsArray);
              setSelectedImage(data?.apartment?.image);
              setSelectedProperty(data?.apartment?.property_type)
            } else if (selectedProperty === "Boarding House") {
              setNewBoardinghouse({
                propertyid: data?.boardinghouse?.property_id,
                boardinghousename: data?.boardinghouse?.boarding_house_name,
                numberofrooms: data?.boardinghouse?.number_of_rooms,
                capacity: data?.boardinghouse?.capacity,
                rentalfee: data?.boardinghouse?.rental_fee,
                payorname: data?.boardinghouse?.payor_name,
                boardinghousestatus: data?.boardinghouse?.status,
                buildingno: data?.boardinghouse?.building_no,
                street: data?.boardinghouse?.street,
                barangay: data?.boardinghouse?.barangay,
                municipality: data?.boardinghouse?.municipality,
              });
            
              setSelectedImage(data?.boardinghouse?.image);
              setSelectedProperty(data?.boardinghouse?.property_type)
              
              const roomsArray = data?.boardinghouse?.rooms?.map((room) => ({
                room_number: room.room_number,
                beds: room.number_of_beds,
              })) || [];
              setRooms(roomsArray);

              const inclusionsArray = data?.boardinghouse?.inclusions?.map((item) => ({
                id: item.inclusion.id,
                name: item.inclusion.name,
                quantity: item.quantity,
              })) || [];
              setSelectedInclusions(inclusionsArray);
              console.log("Processed inclusions:", inclusionsArray);
            }
          }else{
            console.error("Error fetching property details:", data.message);
            setError(data.message)
          }
        }catch(error){
          console.log('Error:', error)
          setError(error.message)
        }finally{
          console.log('finally')
        }
      }
    }
    fetchDataEdit()
    
   
  }, [editItem])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json 
    const accessToken = userData.accessToken;
    console.log('Token:', accessToken)

    if (accessToken){
      console.log('authenticated', status)
      console.log("Value:", newApartment)
      console.log("Value:", newboardinghouse)

      try {
        const formData = new FormData()
        if (selectedProperty === 'Apartment'){
          formData.append('propertyid', propsid);
          formData.append('apartmentname', newApartment.apartmentname);
          formData.append('numberofrooms', newApartment.numberofrooms);
          formData.append('capacity', newApartment.capacity);
          formData.append('rentalfee', newApartment.rentalfee);
          formData.append('status', newApartment.apartmentstatus);
          formData.append('payorname', newApartment.payorname);
          formData.append('property_type', selectedProperty); 
          formData.append('buildingno', newApartment.buildingno);
          formData.append('street', newApartment.street);
          formData.append('barangay', newApartment.barangay);
          formData.append('municipality', newApartment.municipality);
          if(selectedImage && selectedImage instanceof File){
            formData.append('image', selectedImage)
          }

          if (selectedInclusions.length > 0) {
            const inclusionsJson = JSON.stringify(selectedInclusions.map(inclusion => ({
              id: inclusion.id,
              quantity: inclusion.quantity
            })));
            formData.append('inclusion', inclusionsJson);
          }
        }else if (selectedProperty === "Boarding House"){
          formData.append('propertyid', propsid);
          formData.append('boardinghousename', newboardinghouse.boardinghousename);
          formData.append('capacity', totalcapacity);
          formData.append('rentalfee', newboardinghouse.rentalfee);
          formData.append('status', newboardinghouse.boardinghousestatus);
          formData.append('payorname', newboardinghouse.payorname);
          formData.append('property_type', selectedProperty); 
          formData.append('buildingno', newboardinghouse.buildingno);
          formData.append('street', newboardinghouse.street);
          formData.append('barangay', newboardinghouse.barangay);
          formData.append('municipality', newboardinghouse.municipality);

          if(selectedImage && selectedImage instanceof File){
            formData.append('image', selectedImage)
          }
  
          if(numRooms){
            formData.append('numberofrooms', numRooms);
          }
          if (rooms && rooms.length > 0) {
            rooms.forEach((room, index) => {
              formData.append(`rooms[${index}][room_number]`, parseInt(room.room_number || index + 1, 10));
              formData.append(`rooms[${index}][number_of_beds]`, parseInt(room.beds, 10));
            });
          }        
          if (selectedInclusions.length > 0) {
            const inclusionsJson = JSON.stringify(selectedInclusions.map(inclusion => ({
              id: inclusion.id,
              quantity: inclusion.quantity
            })));
            formData.append('inclusion', inclusionsJson);
          }

        };

        let endpoint, method

        if (editItem) {
          // For updating, add '_method' field to FormData for method override
          formData.append('_method', 'PUT');
          endpoint = selectedProperty === 'Apartment'
            ? `http://127.0.0.1:8000/api/update_apartment/${editItem}`
            : `http://127.0.0.1:8000/api/update_boardinghouse/${editItem}`;
          method = 'POST'; // Since we're using '_method', use POST for sending
        } else {
          endpoint = selectedProperty === 'Apartment'
            ? 'http://127.0.0.1:8000/api/store_apartment'
            : 'http://127.0.0.1:8000/api/store_boardinghouse';
          method = 'POST';
        }

        const response = await fetch(endpoint, {
          method,
          headers:{
              'Authorization': `Bearer ${accessToken}`, 
              'Accept': 'application/json',
          },
          body: formData
        });

        const data = await response.json();

        console.log("Response data:", data);
        console.log("Response status:", response.status);

        if (response.ok) {
          handleClose();
          setNewApartment({});
          setNewBoardinghouse({})
          localStorage.setItem('successMessage', data.message || 'Operation successful!');
          window.location.reload();
          // const successMessage = data.message || 'Success!'; 
          // setSuccessful(successMessage);
        } else {
          if(data.error){
            // console.log(data.error)
            // setError(data.error)
            handleClose();
            localStorage.setItem('errorMessage', data.error || 'Operation Error!');
            window.location.reload();
          }else{
            // console.log(data.message);
            // setError(data.message);
            localStorage.setItem('errorMessage', data.message || 'Operation Error!');
            window.location.reload();
            handleClose();
          }
        }
      } catch (error) {
        console.error('An error occurred:', error);
        setLoading(false);
        setError(error.message);
        // setSuccessful(false)
      }
    }else{ 
      console.error('Authentication error: Token missing or invalid');
      setSuccessful(false)
      setError('Authentication error: Token missing or invalid');
    }
    
  };

  
  useEffect(() => {
    const successMessage = localStorage.getItem('successMessage');
    const errorMessage = localStorage.getItem('errorMessage')
    if (successMessage) {
      setSuccessful(successMessage);
      setTimeout(() => {
        localStorage.removeItem('successMessage');
      }, 3000);
    }
    if(errorMessage){
      setError(errorMessage);
      setTimeout(() => {
        localStorage.removeItem('errorMessage');
      }, 3000);
    }

   

  
  }, []);


  useEffect(() => {
    const fetchedInclusionData = async () => {
        const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
        const userData = JSON.parse(userDataString); // parse the datastring into json 
        const accessToken = userData.accessToken;
        if (accessToken){
            console.log('Access Token Found', accessToken)

            try{
                setLoading(true);
                const response = await fetch("http://127.0.0.1:8000/api/inclusion_list",{
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        "Accept": "application/json",
                    }
            
                })

                const data = await response.json();

                if(response.ok){
                    console.log('Data:', data)
                    // const inclusionArray = Array.isArray(data[0]) ? data[0] : data;
                    const inclusionArray = Array.isArray(data.data) ? data.data : [];
                    setInclusion(inclusionArray); // Ensure inclusionArray is an array
                    // setInclusion(data);
                    console.log('inclusionValue:', inclusionArray)
                 
                }
                else{
                    console.log('Error:', response.status)
                }

            }catch (error) {
                console.error("Error fetching data:", error);
                setError(error);

            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        }
        
    }
    fetchedInclusionData ();
    
  }, [])

  useEffect(() => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default behavior if needed
            // Trigger the submit function
            handleSubmit(e);
        }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
        window.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    setSelectedProperty(e.target.value);
  }
  console.log('selected:', selectedProperty)

  // const handleInclusionChange = (event, newValue) => {
  //   setSelectedInclusions(newValue.map(item => ({
  //     ...item,
  //     quantity: item.quantity || 1
  //   })));
  // };

  // const handleQuantityChange = (id, newQuantity) => {
  //   setSelectedInclusions(prevInclusions => 
  //     prevInclusions.map(item => 
  //       item.id === id ? { ...item, quantity: parseInt(newQuantity, 10) } : item
  //     )
  //   );
  // };
  const handleInclusionChange = (event, newValue) => {
    setSelectedInclusions(newValue.map(item => ({
      ...item,
      quantity: item.quantity && item.quantity > 1 ? item.quantity : 1 // Set default quantity to 1 if not provided or if less than 1
    })));
  };

  const handleQuantityChange = (id, newQuantity) => {
    setSelectedInclusions(prevInclusions =>
      prevInclusions.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, parseInt(newQuantity, 10)) } : item
      )
    );
  };


  const handleNumRoomsChange = (e) => {
    // const newNumRooms = Math.max(parseInt(e.target.value, 10));
    const newNumRooms = parseInt(e.target.value, 10);
    setNumRooms(newNumRooms);

    // Adjust the number of room objects with room_number and default number_of_beds
    const newRooms = Array.from({ length: newNumRooms }, (_, index) => ({
        room_number: index + 1,
        // beds: (rooms[index] && rooms[index].beds) || 1,
        beds: 1, // Default value
    }));
    setRooms(newRooms);
  };

  
  const handleBedChange = (index, e) => {
      const newRooms = [...rooms];
      newRooms[index].beds = parseInt(e.target.value,);
      setRooms(newRooms);
  }

  // const totalcapacity = rooms.reduce((acc, room) => acc + room.beds, 0);
  const totalcapacity = rooms.reduce((acc, room) => acc + (room.beds || 0), 0);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5, mb: 3 }}> 
      <AddButton variant="extended" aria-label="add" onClick={handleOpen} sx={{zIndex: 0}}>
        <AddCircleOutlineIcon sx={{ mr: 1 }} />
        Add Property
      </AddButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => {
          handleClose()
          setEditItem(null);
          setNewApartment({
            propertyid: propertyId,
            apartmentname: '',
            capacity: '',
            rentalfee: '',
            payorname:'none',
            apartmentstatus:'',
            buildingno: '' ,
            street: '',
            barangay: '' ,
            municipality: 'Sorsogon City' ,
          })
          setNewBoardinghouse({
            propertyid: propertyId,
            boardinghousename: '',
            rentalfee: '',
            payorname:'none',
            boardinghousestatus:'',
            buildingno: '' ,
            street: '',
            barangay: '' ,
            municipality: 'Sorsogon City' ,
          })
          setSelectedImage(null);
          setSelectedProperty('')
        }}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={open}>
          <ModalContent style={{ width: '90%', maxWidth: '720px' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight:560, letterSpacing: 1, textTransform: 'uppercase' }}>
              Add Property
            </Typography>
            <Box onSubmit={handleSubmit} component="form"  noValidate>
              
              <FormControl fullWidth margin="normal" sx={{mt:'-0.1rem'}}>
                <InputLabel id="property-type-label" required>Select Property Type</InputLabel>
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
              
              {selectedProperty === 'Apartment' && (
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {/* Information message */}
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt:'0.2rem', fontSize: '12px', color: 'gray'}}>
                    
                      ----- Apartment Information ------
                    </Typography>
                  </Grid>
                  <Grid item xs={12} lg={12} sx={{mt:'-1.3rem'}}>
                    <TextField
                      required
                      type='number'
                      id="props-id"
                      label="Property id"
                      name="propertyid"
                      margin="normal"
                      value={propertyId}
                      onChange={handleChangeApartment}
                      fullWidth
                      sx={{ display: 'none' }}
                    />

                  </Grid>
                  <Grid item xs={12} lg={6} sx={{mt:'-1rem'}}>
                    <TextField
                      required
                      type='text'
                      id="apartment-name"
                      label="Property Name"
                      name="apartmentname"
                      value={newApartment.apartmentname}
                      onChange={handleChangeApartment}
                      margin="normal"
                      fullWidth
                    />

                  </Grid>
                  
                  <Grid item xs={12} lg={6} sx={{mt:'-1rem'}}>
                    <TextField
                      required
                      type='number' 
                      id="no-of-rooms"
                      label="No. of Rooms"
                      name="numberofrooms"
                      value={newApartment.numberofrooms}
                      onChange={handleChangeApartment}
                      margin="normal"
                      fullWidth
                    />

                  </Grid>
                  <Grid item xs={12} lg={6} sx={{mt:'-1rem'}}>
                    <TextField
                      required
                      type='number'
                      id="rental-fee"
                      label="Rental Fee"
                      name="rentalfee"
                      value={newApartment.rentalfee}
                      onChange={handleChangeApartment}
                      margin="normal"
                      fullWidth
                    />

                  </Grid>
                  <Grid item xs={12} lg={6} sx={{mt:'-1rem'}}>
                    <TextField
                      required
                      type='number'
                      id="capacity"
                      label="Capacity"
                      name="capacity"
                      value={newApartment.capacity}
                      onChange={handleChangeApartment}
                      margin="normal"
                      fullWidth
                    />

                  </Grid>
                  <Grid item xs={12} lg={6} sx={{mt:'-1rem'}}>
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
                    />

                  </Grid>
                  <Grid item xs={12} lg={6} sx={{mt:'0rem'}}>
                    <FormControl required fullWidth>
                      <InputLabel id="demo-simple-select-label">Status</InputLabel>
                      <Select
                        required
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={newApartment.apartmentstatus}
                        name='apartmentstatus'
                        label="Status"
                        onChange={handleChangeApartment}
                      >
                        <MenuItem value="Available">Available</MenuItem>
                        {/* <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem> */}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    {/* Information message */}
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt:'0.2rem', fontSize: '12px', color: 'gray'}}>
                    
                      ----- Apartment Address ------
                    </Typography>
                  </Grid>

                  <Grid item xs={12} lg={3} sx={{mt:'-1rem'}}>
                    <TextField
                      required
                      type='text'
                      id="building-no"
                      label="Building No."
                      name="buildingno"
                      value={newApartment.buildingno}
                      onChange={handleChangeApartment}
                      margin="normal"
                      fullWidth
                    />

                  </Grid>
                  <Grid item xs={12} lg={3} sx={{mt:'-1rem'}}>
                  <TextField
                    required
                    type='text'
                    id="street"
                    label="Street"
                    name="street"
                    value={newApartment.street}
                      onChange={handleChangeApartment}
                    margin="normal"
                    fullWidth
                  />
                  </Grid>
                  <Grid item xs={12} lg={3} sx={{mt:'-1rem'}}>
                  <TextField
                    required
                    type='text'
                    id="barangay"
                    label="Barangay"
                    name="barangay"
                    value={newApartment.barangay}
                      onChange={handleChangeApartment}
                    margin="normal"
                    fullWidth
                  />
                  </Grid>
                  <Grid item xs={12} lg={3} sx={{mt:'-1rem'}}>
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
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt:'0.2rem', fontSize: '12px', color: 'gray'}}>
                      <InfoOutlinedIcon fontSize="small" sx={{ mr: 1,}} />
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
                      isOptionEqualToValue={(option, value) => option.id === value.id}
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
                        <TextField {...params} label="Inclusions" placeholder="Select inclusions" />
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
                      <Box key={item.id} sx={{ display: 'flex', alignItems: 'center',  justifyContent: 'flex-start', gap: 0.5, mb: 1 }}>
                        <Typography sx={{ mr: 2 }}>{item.name}:</Typography>
                        <Button
                          variant="outlined"
                          sx={{
                            color: '#a55555',
                            borderColor: '#a55555',
                            minWidth: '30px',
                            minHeight: '30px',
                            padding: '0 6px', // Smaller padding for reduced button size
                            '&:hover': {
                              backgroundColor: '#f7e0e0',
                              borderColor: '#a55555',
                            },
                            borderRadius: '8px', // Rounded but smaller than a full circle
                          }}
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </Button>

                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          InputProps={{
                            inputProps: { min: 1 },
                            readOnly: true,
                            sx: { textAlign: 'center', fontWeight: 'bold' },
                          }}
                          size="small"
                          sx={{
                            width: '45px',
                            mx: 0.5, // Horizontal margin for spacing between input and buttons
                            '& .MuiInputBase-input': {
                              textAlign: 'center',
                              padding: '4px 0', // Adjust padding to match button size
                            },
                          }}
                        />

                        <Button
                          variant="contained"
                          sx={{
                            color: '#fff',
                            backgroundColor: '#a55555',
                            minWidth: '30px',
                            minHeight: '30px',
                            padding: '0 6px', // Smaller padding for reduced button size
                            '&:hover': {
                              backgroundColor: '#8c4444',
                            },
                            borderRadius: '8px', // Rounded but not a full circle
                          }}
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <AddIcon fontSize="small" />
                        </Button>
                      </Box>
                    ))}
                  </Grid>

                  

                  <Grid item xs={12}>
                    {/* Information message */}
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt:'0.2rem', fontSize: '12px', color: 'gray'}}>
                      <InfoOutlinedIcon fontSize="small" sx={{ mr: 1,}} />
                      Please Select Image 
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
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
                        Drop or Select Image
                        </Typography>
                        )}
                        <IconButton component="label">
                          <CloudUploadOutlinedIcon fontSize="large" />
                          <input type="file" accept=".gif,.jpg,.jpeg,.png,.svg," name='image' hidden onChange={handleImageChange} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                  
                
                </Grid>
                
                
              )}

              {selectedProperty === 'Boarding House' && (
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {/* Information message */}
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt:'0.2rem', fontSize: '12px', color: 'gray'}}>
                    
                      ----- Boarding House Information ------
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} lg={4} sx={{mt:'-1.3rem'}}>
                    <TextField
                      required
                      type='text'
                      id="property-name"
                      label="Property Name"
                      name="boardinghousename"
                      value={newboardinghouse.boardinghousename}
                      onChange={handleChangeBoardinghouse}
                      margin="normal"
                      fullWidth
                    />

                  </Grid>

                  <Grid item xs={12} lg={4} sx={{mt:'-0.3rem'}}>
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
                    />
                  </Grid>

                  <Grid item xs={12} lg={4} sx={{mt:'-1.3rem'}}>
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

                  </Grid>
                  {/* <Grid item xs={12} lg={4} sx={{mt:'-1rem'}}>
                    <TextField
                      id="apartment-name"
                      label="Capacity"
                      name="rentalfee"
                      margin="normal"
                      fullWidth
                    />

                  </Grid> */}
                  <Grid item xs={12} lg={4} sx={{mt:'-1rem'}}>
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

                  </Grid>

                  <Grid item xs={12} lg={4} sx={{mt:'0rem'}}>
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
                        {/* <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem> */}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    {/* Information message */}
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt:'0.2rem', fontSize: '12px', color: 'gray'}}>
                    
                      ----- Boarding House Address ------
                    </Typography>
                  </Grid>

                  <Grid item xs={12} lg={3} sx={{mt:'-1rem'}}>
                    <TextField
                      required
                      type='text'
                      id="building-no"
                      label="Building No."
                      name="buildingno"
                      value={newboardinghouse.buildingno}
                      onChange={handleChangeBoardinghouse}
                      margin="normal"
                      fullWidth
                    />

                  </Grid>

                  <Grid item xs={12} lg={3} sx={{mt:'-1rem'}}>
                    <TextField
                      id="street"
                      label="Street"
                      name="street"
                      value={newboardinghouse.street}
                      onChange={handleChangeBoardinghouse}
                      margin="normal"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} lg={3} sx={{mt:'-1rem'}}>
                    <TextField
                      required
                      type='text'
                      id="barangay"
                      label="Barangay"
                      name="barangay"
                      value={newboardinghouse.barangay}
                      onChange={handleChangeBoardinghouse}
                      margin="normal"
                      fullWidth
                    />
                    </Grid>
                  <Grid item xs={12} lg={3} sx={{mt:'-1rem'}}>
                    <TextField
                      required
                      type='text'
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
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt:'0.2rem', fontSize: '12px', color: 'gray'}}>
                      <InfoOutlinedIcon fontSize="small" sx={{ mr: 1,}} />
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
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox style={{ marginRight: 8 }} checked={selected} />
                        {option.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Inclusions" placeholder="Select inclusions" />
                    )}
                  />
                  </Grid>
                  <Grid item xs={12}>
                  {selectedInclusions.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center',  justifyContent: 'flex-start', gap: 0.5, mb: 1 }}>
                      <Typography sx={{ mr: 2 }}>{item.name}:</Typography>
                      <Button
                        variant="outlined"
                        sx={{
                          color: '#a55555',
                          borderColor: '#a55555',
                          minWidth: '30px',
                          minHeight: '30px',
                          padding: '0 6px', // Smaller padding for reduced button size
                          '&:hover': {
                            backgroundColor: '#f7e0e0',
                            borderColor: '#a55555',
                          },
                          borderRadius: '8px', // Rounded but smaller than a full circle
                        }}
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon fontSize="small" />
                      </Button>

                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        InputProps={{
                          inputProps: { min: 1 },
                          readOnly: true,
                          sx: { textAlign: 'center', fontWeight: 'bold' },
                        }}
                        size="small"
                        sx={{
                          width: '45px',
                          mx: 0.5, // Horizontal margin for spacing between input and buttons
                          '& .MuiInputBase-input': {
                            textAlign: 'center',
                            padding: '4px 0', // Adjust padding to match button size
                          },
                        }}
                      />

                      <Button
                        variant="contained"
                        sx={{
                          color: '#fff',
                          backgroundColor: '#a55555',
                          minWidth: '30px',
                          minHeight: '30px',
                          padding: '0 6px', // Smaller padding for reduced button size
                          '&:hover': {
                            backgroundColor: '#8c4444',
                          },
                          borderRadius: '8px', // Rounded but not a full circle
                        }}
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </Box>
                  ))}
                  </Grid>

                  <Grid item xs={12}>
                    {/* Information message */}
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt:'0.2rem', fontSize: '12px', color: 'gray'}}>
                      <InfoOutlinedIcon fontSize="small" sx={{ mr: 1,}} />
                      Please specify the number of beds for each room.
                    </Typography>
                  </Grid>

                  <Grid item xs={12} lg={3} sx={{mt:'-1rem'}}>
                    <TextField
                      id="apartment-name"
                      label="Capacity"
                      name="capacity"
                      margin="normal"
                      fullWidth
                      value={totalcapacity}
                      InputProps={{ readOnly: true,}}
                    />

                  </Grid>
                  <Grid item xs={12}>
                      {/* Dynamically render room inputs */}
                    {rooms.map((room, index) => (
                      <Grid item xs={12}> 
                      <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
                        <TextField
                          sx={{mt:'0.4rem', }}
                          label={`Room ${index + 1} - Number of Beds`}
                          type="number"
                          name="room_number"
                          value={room.room_number || index + 1} 
                          // onChange={(e) => handleBedChange(index, e)}
                          inputProps={{ min: 1 }}
                          variant="outlined"
                          fullWidth
                          required
                        />
                        <TextField
                          sx={{mt:'0.4rem'}}
                          label={`Room ${index + 1} - Number of Beds`}
                          type="number"
                          name="number_of_beds"
                          value={room.beds}
                          onChange={(e) => handleBedChange(index, e)}
                          inputProps={{ min: 1 }}
                          variant="outlined"
                          fullWidth
                          required
                        />
                      </Box>
                      </Grid>
                    ))}  
                  </Grid>
                  <Grid item xs={12}>
                    {/* Information message */}
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt:'0.2rem', fontSize: '12px', color: 'gray'}}>
                      <InfoOutlinedIcon fontSize="small" sx={{ mr: 1,}} />
                      Please Select Image 
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
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
                        Drop or Select Image
                        </Typography>
                        )}
                        <IconButton component="label">
                          <CloudUploadOutlinedIcon fontSize="large" />
                          <input type="file" accept=".gif,.jpg,.jpeg,.png,.svg," name='image' hidden onChange={handleImageChange} />
                        </IconButton>
                      </Box>
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
                  fontSize: '16px',
                  marginTop: '16px',
                  borderRadius: '10px',
                  padding: '12px',
                  background: 'primary',
                  '&:hover': { backgroundColor: '#9575cd' },
                  letterSpacing: '2px'
                }}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                    fontSize: '16px',
                    marginTop: '10px',
                    borderRadius: '10px',
                    padding: '10px',
                    color: '#000',
                    borderColor: '#000',
                    '&:hover': {
                        backgroundColor: '#f5f5f5',
                        borderColor: '#000',
                    },
                }}
                onClick={() => {
                  handleClose()
                  setEditItem(null);
                  setNewApartment({
                    propertyid: propertyId,
                    apartmentname: '',
                    capacity: '',
                    rentalfee: '',
                    payorname:'none',
                    apartmentstatus:'',
                    buildingno: '' ,
                    street: '',
                    barangay: '' ,
                    municipality: 'Sorsogon City' ,
                  })
                  setNewBoardinghouse({
                    propertyid: propertyId,
                    boardinghousename: '',
                    rentalfee: '',
                    payorname:'none',
                    boardinghousestatus:'',
                    buildingno: '' ,
                    street: '',
                    barangay: '' ,
                    municipality: 'Sorsogon City' ,
                  })
                  setSelectedImage(null);
                  setSelectedProperty('')
                  setSelectedInclusions([''])
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
