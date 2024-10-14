import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

export default function FAQSection() {
  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#121212',
        py: { xs: 8, sm: 12 },
        px: 3,
      })}
    >
      <Container maxWidth="md">
        <Stack spacing={4}>
          {/* Header */}
          <Box>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
              Questions?
              <br />
              We've got answers.
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 1 }}
            >
              Something else to ask?{' '}
              <Link href="/contact" underline="hover">
                Contact us
              </Link>
            </Typography>
          </Box>

          {/* FAQ Section */}
          <Box>
            {/* Question 1 */}
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
              What is [Your Service Name]?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              [Your Service Name] is a digital platform that connects renters and property managers. We provide efficient search capabilities, verified property listings, and tools for seamless communication between tenants and landlords, making renting and managing properties as easy as possible.
            </Typography>
          </Box>

          {/* Question 2 */}
          <Box>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
              Who owns [Your Service Name]?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              [Your Service Name] was founded by experienced property managers and developers who wanted to create a better, more efficient rental experience for all. Backed by a team of dedicated professionals, we are privately owned and continually striving to improve our services.
            </Typography>
          </Box>

          {/* Question 3 */}
          <Box>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
              Do I need to pay to use [Your Service Name]?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Our platform is free for renters to browse properties, contact landlords, and schedule visits. Some advanced property management tools for landlords may have associated costs. Please contact us to learn more about our premium services.
            </Typography>
          </Box>

          {/* Question 4 */}
          <Box>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
              How do you make sure listings are legitimate?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              We take your security seriously. All listings go through a rigorous verification process to ensure that they are genuine. Our team reviews every listing for authenticity to protect you from scams. Look for the "Verified" badge on trusted properties.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
