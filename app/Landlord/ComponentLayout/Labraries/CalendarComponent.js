'use client'
import React, { useState, useEffect } from 'react';
import { Grid, Box, Paper, Typography, Button, Fade, 
  Link, Breadcrumbs, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { formatRange } from '@fullcalendar/core'
import AddMaintenanceSchedule from '../ModalComponent/AddMaintenanceSchedule';
import '/app/style.css';
import dayjs from 'dayjs'; // Make sure to import dayjs
import dynamic from 'next/dynamic';
// const Fullcalendar = dynamic(() => import('../Labraries/CalendarComponent'), {
//   ssr: false
// }) 

const CalendarComponent = ({ open, handleOpen, handleClose, setError, setSuccessful, setLoading, loading, handleEventClick}) => {
  const [events, setEvents] = useState([]);
  const [initialDateSelection, setInitialDateSelection] = useState(null);
  const [view, setView] = useState('month');

  useEffect(() => {
    const fetchedScheduled = async() => {
      const userDataString = localStorage.getItem('userDetails');
      const userData = JSON.parse(userDataString);
      const accessToken = userData?.accessToken;
      setLoading(true)
      if(accessToken){
        try{
          const response = await fetch(`http://127.0.0.1:8000/api/get_schedule`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-type': 'application/json'
            }
          });
          const data = await response.json();
          if(response.ok){
            // Transform the data to match FullCalendar's event object format
            const transformedEvents = data.data.map(schedule => {
              // Parse start and end dates
              const startDate = dayjs(schedule.start_date);
              const endDate = dayjs(schedule.end_date);
              
              // Add one day to end date for full day display in FullCalendar
              const adjustedEndDate = endDate.add(1, 'day');

              return {
                id: schedule.id,
                title: `${schedule.schedule_title} - ${schedule.maintenance_request.reported_issue}`,
                start: startDate.format('YYYY-MM-DD'),
                end: adjustedEndDate.format('YYYY-MM-DD'), // Add one day for full range display
                allDay: true, // Set as all-day event
                backgroundColor: schedule.bg_color,
                textColor: schedule.text_color,
                extendedProps: {
                  status: schedule.status,
                  issueDescription: schedule.maintenance_request.issue_description,
                  originalStartDate: startDate.format('YYYY-MM-DD'),
                  originalEndDate: endDate.format('YYYY-MM-DD')
                }
              };
            });
            setEvents(transformedEvents);
            setLoading(false)
          } else {
            console.log('Error');
            setLoading(false)
          }
        } catch(error) {
          console.log('Error', error);
          setLoading(false)
        }
      } else {
        console.log('no accessToken found!');
        setLoading(false)
      }
    }
    fetchedScheduled();
  }, [setLoading]);

  // Custom event render function
  const renderEventContent = (eventInfo) => {
    
    return (
      <div className="event-content" style={{ padding: '4px' }}>
        <div style={{ fontWeight: 'bold' }}>{eventInfo.event.title}</div>
        <div style={{ fontSize: '0.9em' }}>
          Status: {eventInfo.event.extendedProps.status}
        </div>
      </div>
    );
  };

  // const handleEventClick = (clickInfo) => {
  //   const scheduleId = clickInfo.event.id;
  //   setSelectedScheduleId(scheduleId);
  //   setIsEditMode(true);
  //   handleOpen();
  // };

  // Handle date click for adding new schedule
  // const handleDateClick = (arg) => {
  //   setSelectedScheduleId(null);
  //   setIsEditMode(false);
  //   handleOpen();
  // };

  return (
    <Box>
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        editable={true}
        // dateClick={handleDateClick}
        initialView={"dayGridMonth"}
        events={events} // Pass events directly here
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height={{ xs: '45vh', sm: '60vh', md: '70vh' }}
        contentHeight={"auto"}
        dayMaxEventRows={3}
        expandRows={true}
        eventDisplay={"block"}
        selectMirror={true}
        selectable={true}
        headerToolbarCls='fc-header-toolbar'
      />
    </Box>
  );
};

export default CalendarComponent;