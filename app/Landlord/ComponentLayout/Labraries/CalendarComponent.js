'use client'
import React, { useState } from 'react';
import { Grid, Box, Paper, Typography, Button, Fade,   Link, Breadcrumbs, TextField, FormControl, InputLabel, Select, MenuItem, } from '@mui/material';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ModalComponent from '../ModalComponent/AddMaintenanceSchedule';
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



const CalendarComponent = ({open, handleOpen,}) => {
  // const [open, setOpen] = useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  const [view, setView] = useState('month');
  // const handleDateClick = (arg) => {
  //   alert(arg.dateStr)
  // }

  return (
    <Box>
    
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
  
    </Box>
    // <div style={{ height: '100vh', padding: '20px' }}>
      
    // </div>
    
  );
};

export default CalendarComponent;
