'use client';

import React from "react";
import { useEffect} from "react";
import { SnackbarProvider, useSnackbar } from 'notistack';

const ErrorSnackbar = ({error, setError}) => {
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (error) {
          enqueueSnackbar(error, {
            variant: 'error',
            autoHideDuration: 3000, // Snackbar disappears after 6 seconds
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            preventDuplicate: true, 
            // Prevent duplicate messages
          });
        }
      }, [error, enqueueSnackbar]);
    return null;

    

}

export default ErrorSnackbar;
