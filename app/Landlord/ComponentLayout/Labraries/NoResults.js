'use client';

import React from "react";
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Paper, 
  Stack, 
  useTheme,
  useMediaQuery
} from "@mui/material";
import Image from "next/image";
// import { Refresh, Search } from "lucide-react";

export default function NoResultUI() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container 
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent:'center',
        alignItems: 'center',
        textAlign: 'center',
        py: 3
      }}
    >
        <Box 
          sx={{ 
            position: 'relative', 
            width: '100%',
            maxWidth: 320,  // Increased from 300
            height: 320,
            mb: 3,
          }}
        >
          <Image
            src="/Search-amico.svg"
            alt="No Result Illustration"
            fill
            quality={400}
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ 
              objectFit: 'contain',
              filter: 'grayscale(20%) opacity(90%)',
              animation: 'float 3s ease-in-out infinite'
            }}
          />
        </Box>

        <Typography 
          variant="h4" 
          sx={{ 
            mb: 2, 
            fontWeight: 600, 
            color: theme.palette.text.primary 
          }}
        >
          Oops!...No Results Found
        </Typography>

        <Typography 
          variant="body1" 
          color="textSecondary" 
          sx={{ 
            mb: 3, 
            px: 2,
            maxWidth: 400 
          }}
        >
          We couldn&apos;t find any results matching your search criteria. 
          Please try adjusting your search or filters.
        </Typography>
      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </Container>
  );
}