'use client';

import React from "react";
import { useEffect} from "react";
import { SnackbarProvider, useSnackbar } from 'notistack';

const SuccessSnackbar = ({successful, setSuccessful}) => {
    const { enqueueSnackbar } = useSnackbar();


    useEffect(() => {
        if (successful) {
          enqueueSnackbar('Created Successfully!', {
            variant: 'success',
            autoHideDuration: 3000, // Snackbar disappears after 6 seconds
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            preventDuplicate: true, // Prevent duplicate messages
          });
        }else{
            setSuccessful(false)
        }
      }, [successful, setSuccessful, enqueueSnackbar]);

    

}

export default SuccessSnackbar;
