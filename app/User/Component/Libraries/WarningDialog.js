"use client";

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, useTheme,} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

export default function WarningDialog({ open, handleClose }) {
  const theme = useTheme();

  return (
    <React.Fragment>
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1.3,
          padding: 2,
          background: "linear-gradient(135deg, hsla(28, 89%, 90%, 1) 0%, hsla(18, 100%, 97%, 1) 0%, hsla(0, 0%, 100%, 1) 100%)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.08)",
          position: "relative",
          overflow: "visible",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(90deg, #ff6b6b, #4ecdc4)",
            borderTopLeftRadius: theme.shape.borderRadius * 3,
            borderTopRightRadius: theme.shape.borderRadius * 3,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: 2,
          paddingBottom: 1,
        }}
      >
        <WarningAmberRoundedIcon
          sx={{
            color: 'white',
            fontSize: 40,
            background: theme.palette.error.light,
            borderRadius: "50%",
            padding: 1,
            mt:0.3
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Alert Message
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          paddingX: 3,
          paddingY: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            lineHeight: 1.6,
            marginBottom: 2,
            mt:2
          }}
        >
          Request Maintenance deletion is not permitted!.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.disabled,
            fontStyle: "italic",
          }}
        >
          Because maintenance request already accepted!
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          padding: 2,
          paddingTop: 0,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleClose}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            padding: "10px 24px",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
            },
          }}
        >
          Understood
        </Button>
      </DialogActions>
    </Dialog>
    </React.Fragment>
  );
}
