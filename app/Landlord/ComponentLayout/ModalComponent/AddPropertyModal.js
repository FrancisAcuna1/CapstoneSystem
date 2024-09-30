'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Typography, Box, Fab, Button, Fade, FormControl, InputLabel, Select, MenuItem, Grid, Autocomplete, Checkbox} from '@mui/material';
import { styled, useTheme, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


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

const equipment = [
  {name: 'Aircon'},
  {name: 'Elictri Pan'},
  {name: 'Kitchen'},
  {name: 'Comfort Room'},
  {name: 'Stove'},
  {name: 'Gas Tank'},
  {name: 'Sala Set'},
]

export default function AddPropertyType({ open, handleOpen, handleClose, }) {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [numRooms, setNumRooms] = useState(1);  // Default to 1 room
  const [rooms, setRooms] = useState([{ beds: 1 }]); // Default to 1 bed in the first room
  const [selectedInclusions, setSelectedInclusions] = useState([]);
  // const propsId = params.id;

  // console.log('id:', propsId);




  const handleChange = (e) => {
    setSelectedProperty(e.target.value);
  }
  console.log('selected:', selectedProperty)

  const handleInclusionChange = (event, value) => {
    // When the selection changes, update the selected inclusions
    const updatedInclusions = value.map((item) => {
      // Ensure that each item has a quantity (default to 1 if not set)
      const existing = selectedInclusions.find((incl) => incl.name === item.name);
      return existing ? existing : { ...item, quantity: 1 };
    });
    setSelectedInclusions(updatedInclusions);
  };

  const handleQuantityChange = (name, quantity) => {
    // Update the quantity for the specific inclusion
    setSelectedInclusions((prevState) =>
      prevState.map((item) =>
        item.name === name ? { ...item, quantity: quantity } : item
      )
    );
  };

  const handleNumRoomsChange = (e) => {
    const newNumRooms = parseInt(e.target.value);
    setNumRooms(newNumRooms);

    // Adjust the number of room objects
    const newRooms = [];
    for (let i = 0; i < newNumRooms; i++) {
        newRooms.push({ beds: 1 }); // Default each room to 1 bed
    }
    setRooms(newRooms);
  };

  // Handle bed number change for each room
  const handleBedChange = (index, e) => {
      const newRooms = [...rooms];
      newRooms[index].beds = parseInt(e.target.value);
      setRooms(newRooms);
  }

  const totalcapacity = rooms.reduce((acc, room) => acc + room.beds, 0);

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
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={open}>
          <ModalContent style={{ width: '90%', maxWidth: '720px' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight:560, letterSpacing: 1, textTransform: 'uppercase' }}>
              Add Property
            </Typography>
            
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
                <Grid item xs={12} lg={6} sx={{mt:'-1.3rem'}}>
                  <TextField
                    required
                    type='text'
                    id="apartment-name"
                    label="Property Name"
                    name="propertyname"
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
                    name="noofapartment"
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
                    margin="normal"
                    fullWidth
                  />

                </Grid>
                <Grid item xs={12} lg={6} sx={{mt:'-1rem'}}>
                  <TextField
                    required
                    id="payor"
                    label="Payor Name"
                    name="payor"
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
                      // value={age}
                      label="Status"
                      onChange={handleChange}
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
                  // value={newApartment.municipality}
                  // onChange={handleChange}
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
                    required
                    multiple
                    id="checkboxes-tags-demo"
                    options={equipment}
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
                  />

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
                    name="propertyname"
                    margin="normal"
                    fullWidth
                  />

                </Grid>
                
               
                {/* <Grid item xs={12} lg={4} sx={{mt:'-1.3rem'}}>
                  <TextField
                    required
                    type='number'
                    id="tenant-per-room"
                    label="Capacity"
                    name="tenantperroom"
                    margin="normal"
                    fullWidth
                  />

                </Grid> */}

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
                    type='text'
                    id="rental-fee"
                    label="Rental Fee"
                    name="rentalfee"
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
                      required
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      // value={age}
                      label="Status"
                      onChange={handleChange}
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
                    name="buildingNo"
                    margin="normal"
                    fullWidth
                  />

                </Grid>

                <Grid item xs={12} lg={3} sx={{mt:'-1rem'}}>
                  <TextField
                    id="street"
                    label="Street"
                    name="street"
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
                    // value={newApartment.municipality}
                    // onChange={handleChange}
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
                    required
                    
                    multiple
                    // value={selectedInclusions}
                    // onChange={handleInclusionChange}
                    id="checkboxes-tags-demo"
                    options={equipment}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option, { selected }) => {
                      const { key, ...optionProps } = props;
                      const selectedItem = selectedInclusions.find((incl) => incl.name === option.name);
                      return (
                        <li key={key} {...optionProps}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.name}

                          {/* {selected && (
                            <TextField
                              type="number"
                              size="small"
                              style={{ marginLeft: 10, width: '60px' }}
                              value={selectedItem?.quantity || 1}
                              onChange={(e) => handleQuantityChange(option.name, parseInt(e.target.value, 10))}
                              inputProps={{ min: 1 }} // Prevent negative or zero input
                            />
                          )} */}
                        </li>
                      );
                    }}
            
                    renderInput={(params) => (
                      <TextField {...params} label="Inclusion" placeholder="Inclusion" />
                    )}
                  />
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
                    name="rentalfee"
                    margin="normal"
                    fullWidth
                    value={totalcapacity}
                    InputProps={{ readOnly: true,}}
                  />

                </Grid>
                

                    {/* Dynamically render room inputs */}
                
                  {rooms.map((room, index) => (
                    <Grid item xs={12}> 
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
                      <TextField
                        sx={{mt:'0.4rem'}}
                        label={`Room ${index + 1} - Number of Beds`}
                        type="number"
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
          
            )}





            
            <Button
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
              onClick={handleClose}
            >
                Cancel
            </Button>
            
          </ModalContent>
        </Fade>
      </Modal>
    </Box>
  );
}
