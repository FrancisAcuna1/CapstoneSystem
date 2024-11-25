'use client'
import React, { useEffect, useState} from "react";
import { Grid, Box, Paper, Typography, Button, Divider, Link, Fade, Breadcrumbs, TextField, Autocomplete, FormControl, FormHelperText, FormControlLabel, Switch, InputLabel, Select, MenuItem} from '@mui/material';
import { Modal as BaseModal } from '@mui/base/Modal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PropTypes from 'prop-types';
import { styled, css, } from '@mui/system'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';



const Backdrop = React.forwardRef((props, ref) => {
    const { open, ...other } = props;
    return (
      <Fade in={open}>
        <div ref={ref} {...other} />
      </Fade>
    );
  });
  Backdrop.displayName = 'Backdrop';
  // Backdrop.propTypes = {
  //   open: PropTypes.bool,
  // };
  
  const blue = {
    200: '#99CCFF',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0066CC',
  };
  
  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
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
    background-color: rgb(0 0 0 / 0.5);
    -webkit-tap-highlight-color: transparent;
  `;
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
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
      border-radius: 8px;
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      box-shadow: 0 4px 12px
        ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
      padding: 24px;
      color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};
  
      & .modal-title {
        margin: 0;
        line-height: 1.5rem;
        margin-bottom: 8px;
      }
  
      & .modal-description {
        margin: 0;
        line-height: 1.5rem;
        font-weight: 400;
        color: ${theme.palette.mode === 'dark' ? grey[400] : grey[800]};
        margin-bottom: 4px;
      }
    `,
  );
  
  const TriggerButton = styled(Button)(
    ({ theme }) => css`
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 600;
      font-size: 0.875rem;
      line-height: 1.5;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 150ms ease;
      cursor: pointer;
      background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  
      &:hover {
        background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
        border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
      }
  
      &:active {
        background: ${theme.palette.mode === 'dark' ? grey[700] : grey[100]};
      }
  
      &:focus-visible {
        box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
        outline: none;
      }
    `,
  );

  const ColorButton = ({ selected, color, onClick }) => (
    <Button
      onClick={onClick}
      sx={{
        minWidth: 'unset',
        width: 24,
        height: 24,
        borderRadius: '50%',
        padding: 0,
        backgroundColor: color,
        border: `2px solid ${selected ? '#1976d2' : '#e0e0e0'}`,
        marginRight: 1,
        marginBottom: 1,
        '&:hover': {
          backgroundColor: color,
        }
      }}
    />
  );

  const colors = [
    { id: 'default', value: '#2196f3' },
    { id: 'red', value: '#f44336' },
    { id: 'purple', value: '#9c27b0' },
    { id: 'indigo', value: '#c7d2fe' },
    { id: 'yellow', value: '#fef08a' },
    { id: 'orange', value: '#fed7aa' },
    { id: 'gray', value: '#e5e7eb' },
    { id: 'white', value: '#ffffff' },
    { id: 'pink', value: '#e91e63' },
    { id: 'green', value: '#bbf7d0' },
    { id: 'blue', value: '#bfdbfe' },
    { id: 'lavender', value: '#7e57c2' }
  ];

  const textColors = [
    { id: 'default', value: '#ffffff' },
    { id: 'black', value: '#000000' },
    { id: 'gray', value: '#6b7280' },
    { id: 'silver', value: '#cbd5e1' },
    { id: 'red', value: '#ef4444' },
    { id: 'yellow', value: '#eab308' },
    { id: 'green', value: '#22c55e' },
    { id: 'blue', value: '#3b82f6' },
    { id: 'indigo', value: '#6366f1' },
    { id: 'purple', value: '#a855f7' },
    { id: 'pink', value: '#ec4899' },
    { id: 'orange', value: '#f97316' }
  ];

export default function AddMaintenanceSchedule({open, handleOpen, handleClose, setSuccessful, setError, setLoading, loading, selectedScheduleId, isEditMode, initialDateSelection}){
  const [selectedBgColor, setSelectedBgColor] = useState('default');
  const [selectedTextColor, setSelectedTextColor] = useState('default');
  const [formError, setFormError] = useState({})
  const [acceptedRequest, setAcceptedRequest] = useState([]);
  const [edit, setEdit] = useState({
    id: '',
    title: ''
  })
  const [scheduleData, setScheduleData] = useState({
    maintenance_id: '',
    title: '',
    status: '',
    start_date: null,
    end_date: null,
  })
  // const [isAllDay, setIsAllDay] = useState(false);
  // const [startDate, setStartDate] = useState(dayjs());
  // const [endDate, setEndDate] = useState(dayjs().add(1, 'hour'));
  console.log(acceptedRequest);
  console.log(scheduleData);
  console.log(selectedTextColor);
  console.log(selectedBgColor);
  console.log(selectedScheduleId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({
        ...scheduleData,
        [name]: value
    });

    setFormError(prev => ({
        ...prev,
        [name]: ''
    }));
  }


  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!scheduleData.maintenance_id) {
        tempErrors.maintenance_id = 'Reported Issue is required';
        isValid = false;
    }
    if (!scheduleData.title) {
        tempErrors.title = 'Title of Schedule is required';
        isValid = false;
    }
    if (!scheduleData.status) {
        tempErrors.status = 'Status type is required';
        isValid = false;
    }
    if (!scheduleData.start_date) {
        tempErrors.start_date = 'Start date type is required';
        isValid = false;
    }
    if (!scheduleData.end_date) {
      tempErrors.end_date = 'End date type is required';
      isValid = false;
    }

    setFormError(tempErrors);
    return isValid;
  }

  useEffect(() => {
    const fethcedAccepted = async() => {
      const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json 
      const accessToken = userData.accessToken;
      if(accessToken){
        const response = await fetch(`http://127.0.0.1:8000/api/get_accepted`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        })
        const data = await response.json()
        if(response.ok){
          console.log(data.data);
          setAcceptedRequest(data.data);
        }else{
          console.log('error', error.message);
        }
      }else{
        console.log('No access token found!');
        
      }
    }
    fethcedAccepted()
  }, [])

   // Fetch schedule data for editing
  // In your useEffect for editing
  useEffect(() => {
    const fetchEditSchedule = async () => {
      try {
        // Extensive logging
        console.log('Edit Mode Triggered');
        console.log('Selected Schedule ID:', selectedScheduleId);
        console.log('Is Edit Mode:', isEditMode);

        if (!selectedScheduleId || !isEditMode) {
          console.log('No schedule ID or not in edit mode');
          return;
        }

        const userDataString = localStorage.getItem('userDetails');
        if (!userDataString) {
          console.error('No user data found');
          return;
        }

        const userData = JSON.parse(userDataString);
        const accessToken = userData?.accessToken;

        if (!accessToken) {
          console.error('No access token found');
          return;
        }

        const response = await fetch(`http://127.0.0.1:8000/api/edit_schedule/${selectedScheduleId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        });

        const responseData = await response.json();
        console.log('Full Response Data:', responseData);

        if (response.ok && responseData.data) {
          const scheduleDetails = responseData.data;
          const startDate = scheduleDetails.start_date ? dayjs(scheduleDetails.start_date) : null;
          const endDate = scheduleDetails.end_date ? dayjs(scheduleDetails.end_date) : null;

          console.log('Schedule Details Received:', scheduleDetails);

          // Set schedule data
          setScheduleData({
            maintenance_id: scheduleDetails.maintenance_request_id || '',
            title: scheduleDetails.schedule_title || '',
            status: scheduleDetails.status || '',
            start_date: startDate || '',
            end_date: endDate || '',
          });

          const bgColorId = colors.find(c => c.value === scheduleDetails.bg_color)?.id || 'default';
          const textColorId = textColors.find(c => c.value === scheduleDetails.text_color)?.id || 'default';
          
          console.log('Background Color ID:', bgColorId);
          console.log('Text Color ID:', textColorId);

          setSelectedTextColor(textColorId);
          setSelectedBgColor(bgColorId);

          // Set edit state if needed
          // setEdit({
          //   id: scheduleDetails.maintenance_request_id || '',
          //   title: scheduleDetails.schedule_title || '',
          // });
        } else {
          console.error('Failed to fetch schedule details', responseData);
        }
      } catch (error) {
        console.error('Error in fetchEditSchedule:', error);
      }
    };
    fetchEditSchedule();
  }, [selectedScheduleId, isEditMode]);

  const handleSubmit = async(e) => {
    e.preventDefault()

    if (!validateForm()) {
        return; // Stop submission if validation fails
    }

    const userDataString = localStorage.getItem('userDetails');
    const userData = JSON.parse(userDataString);
    const accessToken = userData?.accessToken;
    setLoading(true);

    const formattedFormData = {
      ...scheduleData,
      start_date: scheduleData.start_date ? scheduleData.start_date.format('MM/DD/YYYY') : null,
      end_date: scheduleData.end_date ? scheduleData.end_date.format('MM/DD/YYYY') : null,
      text_color: textColors.find(color => color.id === selectedTextColor)?.value || textColors[0].value,
      bg_color: colors.find(color => color.id === selectedBgColor)?.value || colors[0].value,
    };
    console.log(formattedFormData);

      

    if (accessToken) {
      try{
        const url = selectedScheduleId 
        ? `http://127.0.0.1:8000/api/update_schedule/${selectedScheduleId}`
        : 'http://127.0.0.1:8000/api/add_schedule'
      
        const method = selectedScheduleId ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method: method,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedFormData),
        });

        const data = await response.json();
        if (response.ok) {
          setScheduleData({
            maintenance_id: '',
            title: '',
            status: '',
            start_date: '',
            end_date: '',
            textColor: '',
            bg_color: '',
          });
          localStorage.setItem('successMessage', data.message || 'Operation Success!');
          window.location.reload();
          setLoading(false)
        } else {
          localStorage.setItem('errorMessage', data.error || 'Operation Error!');
          window.location.reload();
          setLoading(false)
          console.log(data.error)
        }
      }catch(error){
        console.log(error)
        console.log('Error to submit')
      }
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

  
  }, [setSuccessful, setError]);


  
  const handleReportedIssue = (selectedIssue) => {
    if (selectedIssue) {
      setScheduleData(prev => ({
        ...prev,
        maintenance_id: selectedIssue.id, // Set tenant_id
      }));
        
    }else{
      setScheduleData(prev => ({
        ...prev,
        maintenance_id: '', 
      }))
    }
    setFormError(prev => ({
      ...prev,
      maintenance_id: ''
    }));
  };

  const handleDateChange = (name, value) => {
    setScheduleData({
      ...scheduleData,
      [name]: value,
    });
    if (value) {
        setFormError(prev => ({ ...prev, [name]: '' })); // Clear error if valid
    }
  };

  console.log(scheduleData.title)
  console.log(scheduleData.maintenance_id)
  console.log(scheduleData.status)

  return (
    <Box sx={{ display: 'flex', justifySelf: 'end', mt:1.5, }}>
      <Button variant="contained"  onClick={handleOpen} sx={{background: 'primary','&:hover': {backgroundColor: '#b6bdf1',}, borderRadius: '15px', p:1.1, mb: 2 }}>
        <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
          {isEditMode ? 'Edit Schedule' : 'Add New Schedule'}
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => {
          handleClose()
          setScheduleData({
            maintenance_id: '',
            title: '',
            status: '',
            start_date: null,
            end_date: null,
          })
          setFormError({})
        }}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={open}>
          <ModalContent style={{ width: '90%', maxWidth: '600px' }}>
          <Box onSubmit={handleSubmit} component="form"  noValidate>
            <Typography variant='h1' letterSpacing={3} sx={{ fontSize: '20px' }}>
              {selectedScheduleId && selectedScheduleId ? 'Edit Schedule' : 'Add New Schedule'}
            </Typography>

            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              margin="normal"
              name="title"
              value={scheduleData.title || ''}  // Remove 'habo kona'
              onChange={handleChange}
              error={Boolean(formError.title)}
              helperText={formError.title}
            />
           
            <FormControl fullWidth required  error={Boolean(formError.maintenance_id)} sx={{mt:1}}> 
              <Autocomplete 
                  id="tenant-autocomplete"
                  options={acceptedRequest}
                  getOptionLabel={(option) => `${option.reported_issue}` || ''}
                  value={acceptedRequest.find(issue => issue.id === scheduleData.maintenance_id) || null}
                  onChange={(event, newValue) => {
                  
                    handleReportedIssue(newValue); // Pass the entire newValue
                  }}
                  renderInput={(params) => (
                      <TextField
                          {...params}
                          label="Reported issue"
                          required
                          error={Boolean(formError.maintenance_id)}
                          helperText={formError.maintenance_id}
                          InputProps={{
                              ...params.InputProps,
                              endAdornment: params.InputProps.endAdornment,
                          }}
                      />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id} // Compare IDs
                  renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                          {option.reported_issue}
                      </li>
                  )}
                  autoComplete
                  autoHighlight
                  clearOnEscape
              />
            </FormControl>
            
            <FormControl error={Boolean(formError.status)} fullWidth margin="normal" sx={{mt:2}}>
                <InputLabel error={Boolean(formError.status)} required>Status</InputLabel>
                <Select 
                error={Boolean(formError.status)} 
                label="Status"
                name="status"
                value={scheduleData.status || ''} // Add fallback
                onChange={handleChange}
                >
                  <MenuItem value='To do'>To Do</MenuItem>
                  <MenuItem value='In Progress'>In Progress</MenuItem>
                  <MenuItem value='Completed'>Completed</MenuItem>
                </Select>
                {formError.status && (
                  <FormHelperText 
                      error 
                      sx={{
                      marginLeft: '14px',
                      marginRight: '14px',
                      fontSize: '0.75rem',
                      }}
                  >
                      {formError.status}
                  </FormHelperText>
                )}
            </FormControl>

              {/* <FormControlLabel
                control={
                  <Switch
                    checked={isAllDay}
                    onChange={(e) => setIsAllDay(e.target.checked)}
                    color="primary"
                  />
                }
                label="All day"
                sx={{ my: 2 }}
              /> */}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2} sx={{mt:0.4}}>
                <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  name="start_date"
                  sx={{width: '100%'}}
                  value={scheduleData.start_date} 
                  onChange={(newValue) => handleDateChange('start_date', newValue)}
                  fullWidth
                  error={Boolean(formError.start_date)} 
                  slotProps={{
                      textField: {
                        error: Boolean(formError.start_date),
                        helperText: formError.start_date,
                        fullWidth: true
                      }
                  }}
                  // renderInput={(params) => <TextField {...params} fullWidth />}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  name="end_date"
                  sx={{width: '100%'}}
                  value={scheduleData.end_date} 
                  onChange={(newValue) => handleDateChange('end_date', newValue)}
                  fullWidth
                  error={Boolean(formError.end_date)} 
                  slotProps={{
                      textField: {
                        error: Boolean(formError.end_date),
                        helperText: formError.end_date,
                        fullWidth: true
                      }
                  }}
                  // renderInput={(params) => <TextField {...params} fullWidth />}
                />
                </Grid>
              </Grid>
                
            </LocalizationProvider>
              
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{mt:2}}> 
                Background Color
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2, mt:2}}>
                {colors.map((color) => (
                  <ColorButton
                    key={color.id}
                    color={color.value}
                    selected={selectedBgColor === color.id}
                    onClick={() => setSelectedBgColor(color.id)}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Text Color
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2, mt:2 }}>
                {textColors.map((color) => (
                  <ColorButton
                    key={color.id}
                    color={color.value}
                    selected={selectedTextColor === color.id}
                    onClick={() => setSelectedTextColor(color.id)}
                  />
                ))}
              </Box>
            </Box>
              
            <Button 
            variant='contained' 
            type="submit"
            sx={{
              width:'100%',
              background: 'primary',
              '&:hover': {backgroundColor: '#b6bdf1',}, 
              padding: '8px', 
              fontSize: '16px', 
              mt:4 
              }}
            >
              Add 
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
                setScheduleData({})
                setFormError({})
              }}
            >
              Cancel
            </Button>
          </Box>
          </ModalContent>
        </Fade>
      </Modal>
    </Box>
  )
}