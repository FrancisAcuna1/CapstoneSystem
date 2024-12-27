"use client";
import React from "react";
import { useState } from "react";
import {
  Box,
  Grid,
  Container,
  Typography,
  Link,
  Stack,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import Image from "next/image";

export default function FAQSComponent() {
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    return (
        <Box
        sx={(theme) => ({
            width: "100%",
            height: { xs: "auto", sm: "100vh" },
            backgroundImage:
            theme.palette.mode === "light"
                ? "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(270, 100%, 94%), transparent)"
                : "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(270, 100%, 20%), transparent)",
            backgroundSize: "100%",
            backgroundRepeat: "no-repeat",
        })}
        >
        <Container
            maxWidth="lg"
            sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // margin: 'auto',
            pt: { xs: 14, sm: 20 },
            pb: { xs: 8, sm: 12 },
            }}
        >
            <Stack spacing={4}>
            <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
                FAQ&apos;S
                </Typography>
                <Box
                sx={{
                    width: "50%", // Adjust the width as needed
                    height: "3px", // Thickness of the line
                    backgroundColor: "#7e57c2", // Color of the line
                    margin: "0 auto", // Center the line
                }}
                />
            </Box>
            </Stack>
            <Stack
            //   direction="row"
            spacing={2}
            sx={{
                mt: "4rem",
                alignItems: "center",
            }}
            >
            <Box>
                <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel5-content"
                    id="panel5-header"
                    >
                    <Typography variant="h6" letterSpacing={0.6} sx={{fontWeight:550}}>How can I request a property viewing?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="subtile">
                    You can request a property viewing by contacting the property owner directly. Once we receive your request, we will coordinate with you to schedule a viewing at a time that is most convenient for you.
                    </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
                >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Typography variant="h6" letterSpacing={0.6} sx={{fontWeight:550}}>
                    How do I submit a maintenance request?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="subtile">
                    You can submit a maintenance request through our portal or
                    contact the property owner. We will ensure
                    that the issue is addressed in a timely manner.
                    </Typography>
                </AccordionDetails>
                </Accordion>

                <Accordion
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
                >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                >
                    <Typography variant="h6" letterSpacing={0.6} sx={{fontWeight:550}}>How do I pay my rent?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="subtile">
                    Rent payments can be made directly to the property owner, who will collect them in person.
                    {/* Rent payments can be made online through our payment gateway,
                    by cheque, or via bank transfer. You will receive all the
                    necessary details once you sign the lease agreement. */}
                    </Typography>
                </AccordionDetails>
                </Accordion>

                <Accordion
                expanded={expanded === "panel4"}
                onChange={handleChange("panel4")}
                >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4-content"
                    id="panel4-header"
                >
                    <Typography variant="h6" letterSpacing={0.6} sx={{fontWeight:550}}>
                    What do I do if I have a question not covered here?
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="subtile">
                    If you have any questions that aren&apos;t addressed in this FAQ, don&apos;t hesitate to contact the property owner directly, or engage with our chatbot for instant assistance. Our team is ready to provide you with prompt and helpful support to ensure all your inquiries are answered.
                    </Typography>
                </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel7-content"
                    id="panel7-header"
                    >
                    <Typography variant="h6" letterSpacing={0.6} sx={{fontWeight:550}}>What should I do if I need to move out?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="subtile">
                        If you need to move out, please notify us at least 30 days before your intended move-out date. Be sure to return the keys and schedule a final inspection.
                    </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'panel8'} onChange={handleChange('panel8')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel8-content"
                    id="panel8-header"
                    >
                    <Typography variant="h6" letterSpacing={0.6} sx={{fontWeight:550}}>What utilities are included in the rent?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="subtile">
                    The utilities included in your rent will be specified in your lease agreement. If you&apos;re unsure, feel free to reach out to the property owner to clarify which utilities are covered and which are your responsibility.
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel9'} onChange={handleChange('panel9')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel9-content"
                    id="panel9-header"
                    >
                    <Typography variant="h6" letterSpacing={0.6} sx={{fontWeight:550}}>Am i responsible for repairing damages in the unit?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="subtile">
                    As a tenant, you are responsible for any damage caused by negligence or misuse and it will charge in you. However, damages that occur due to normal wear and tear will generally not be your responsibility. If you&apos;re unsure whether a particular issue qualifies as wear and tear or damage, contact the property owner for clarification. We strive to ensure a fair and transparent process in dealing with any damage issues.
                    </Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>
            </Stack>
        </Container>
        </Box>
    );
}
