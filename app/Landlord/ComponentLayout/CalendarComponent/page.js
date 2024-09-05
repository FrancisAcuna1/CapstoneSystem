'use client'
import React, { useState } from 'react';
import { Grid, Box, Paper, Typography, Button, Fade,   Link, Breadcrumbs, TextField, FormControl, InputLabel, Select, MenuItem, } from '@mui/material';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ModalComponent from '../ModalComponent/page';
import '/app/style.css';
// import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
// import enUS from 'date-fns/locale/en-US';

// const locales = {
//   'en-US': enUS,
// };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

const events = [
  {
    title: 'Lunch',
    start: new Date(2024, 8, 1, 13, 0),
    end: new Date(2024, 8, 1, 14, 0),
    allDay: false,
  },
  {
    title: 'Long Event',
    start: new Date(2024, 8, 2),
    end: new Date(2024, 8, 4),
  },
  {
    title: 'Conference',
    start: new Date(2024, 8, 4),
    end: new Date(2024, 8, 5),
  },
  {
    title: 'Meeting',
    start: new Date(2024, 8, 7, 14, 30),
    end: new Date(2024, 8, 7, 15, 30),
  },
  {
    title: 'Birthday Party',
    start: new Date(2024, 8, 25, 10, 30),
    end: new Date(2024, 8, 25, 11, 30),
  },
  {
    title: 'Repaint of Wall',
    start: new Date(2024, 8, 20),
    end: new Date(2024, 8, 25),
  },
  {
    title: 'Meeting New Tenant',
    start: new Date(2024, 8, 19, 13,),
    end: new Date(2024, 8, 19, 15),
  },
];



const CalendarComponent = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [view, setView] = useState('month');
  // const handleDateClick = (arg) => {
  //   alert(arg.dateStr)
  // }

  return (
    <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
        <Typography variant="h5" letterSpacing={3} sx={{marginLeft: '5px', fontSize: '24px', fontWeight: 'bold',  mt:5}}>
                Schedule of All Maintenace
            </Typography>
            <Grid item xs={12} sx={{marginLeft: '5px', mt:2}}>
                <Breadcrumbs aria-label="breadcrumb"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>
                    {/* <Typography color="inherit">Navigation</Typography> */}
                    <Link letterSpacing={2} underline="hover" color="inherit" href="/Landlord/Home">
                        Home
                    </Link>
                    <Typography letterSpacing={2} color="text.primary"  sx={{ fontSize: { xs: '14px', sm: '15px', md: '15px' } }}>Maintenance Schedule</Typography>
                </Breadcrumbs>
            </Grid>
            <Box sx={{mt:'4rem'}}>
            </Box>

            <Grid  container spacing={1} sx={{ mt: '-0.9rem', display:'flex', justifyContent:' center',  }}>
              <Grid item xs={12} >
                <Paper elevation={3} style={{'@media (max-width: 100px)' : {width: 'auto'}, padding: '25px', marginTop: '15px', borderRadius: '15px',  justifyContent: "center", alignItems: "center",}}>
                  <Grid container sx={{display: 'flex', justifyContent:{xs:'start', sm: 'space-between', lg:'space-between',}}}>
                    <Grid item>
                      <Typography variant="h6" letterSpacing={2} sx={{marginLeft: '5px', mt:1}} >
                          Shedule of Maintenace
                      </Typography>
                    </Grid>
                    <Grid item>
                      {/* modal dini */}
                      <ModalComponent
                        handleOpen={handleOpen}
                        open={open}
                        handleClose={handleClose}
                        
                      />
                    </Grid>
                  </Grid>
                  <Fullcalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    dateClick={handleOpen}
                    open={open}
                    initialView={"dayGridMonth"}
                    events={events}
                    headerToolbar={{
                      start: "today prev,next", // will normally be on the left. if RTL, will be on the right
                      center: "title",
                      end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
                    }}
                    height={{ xs: '45vh', sm: '60vh', md: '70vh' }}
                    contentHeight={"auto"}
                    dayMaxEventRows={true}
                    expandRows={true}
                    eventDisplay={"block"}
                    eventTextColor="#000"
                    eventBackgroundColor="#b6bdf1"
                    eventBorderColor="#b6bdf1"
                    headerToolbarCls='fc-header-toolbar'
                    
            
                  />
                </Paper>

                  
              </Grid>


            </Grid>
    </Box>
    // <div style={{ height: '100vh', padding: '20px' }}>
      
    // </div>
    
  );
};

export default CalendarComponent;
