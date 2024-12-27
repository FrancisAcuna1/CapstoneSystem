import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Popover,
  Fab,
  Badge,
  CircularProgress
} from "@mui/material";
import { Send, Person, SmartToy, Style } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from '@mui/system';
import Image from "next/image";

const generateDummyMessages = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    text: `Message ${
      i + 1
    }: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    sender: i % 2 === 0 ? "user" : "bot",
  }));
};

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      width: 10,
      height: 10,
      borderRadius: '50%',
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
    // Improved badge positioning
    '& .MuiBadge-anchorOriginBottomRightCircular': {
      bottom: '14%',
      right: '25%',
      transform: 'scale(1) translate(50%, 50%)',
      transformOrigin: '100% 100%'
    }
}));

const ActiveBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      width: 10,
      height: 10,
      borderRadius: '50%',
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
    // Improved badge positioning
    '& .MuiBadge-anchorOriginBottomRightCircular': {
      bottom: '14%',
      right: '67%',
      transform: 'scale(1) translate(50%, 50%)',
      transformOrigin: '100% 100%'
    }
}));

const Dot = styled('span')(({ theme }) => ({
    width: '10px',
    height: '10px',
    margin: '0 2px',
    borderRadius: '50%',
    backgroundColor: theme.palette.text.primary,
    opacity: 0,
    animation: 'blink 1.5s infinite',
    '@keyframes blink': {
        '0%': { opacity: 0 },
        '20%': { opacity: 1 },
        '100%': { opacity: 0 },
    },
}));

const Chatbot = ({
  anchorEl,
  isMenuOpen,
  handleProfileMenuOpen,
  handleMenuClose,
}) => {
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState([]);
    const [accessToken, setAccessToken] = useState([]);
    const [name, setName] = useState([]);
    const [messages, setMessages] = useState([]);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const messagesContainerRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Retrieve user access token
    useEffect(() => {
        const userDataString = localStorage.getItem("userDetails");
        if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData && userData.accessToken && userData.user) {
            setAccessToken(userData.accessToken);
            setUserId(userData.user.id);
            setName(userData.user.firstname);
        }
        }
    }, []);
    
    const handleGreetings = () => {
        const greetingMessage = {
            id: messages.length + 1,
            text: `Hi, Kamusta! 👋 Ikinagagalak kong makilala ka, ${name}!`,
            sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, greetingMessage]);
    }

    // const Services = () => {
    //      // Service offer message
    //      const serviceMessage = {
    //         id: messages.length + 2,
    //         text: "Puwede kitang matulungan sa mga sumusunod na serbisyo:\n1. Pag-check ng overdue balance\n2. Pagtulong sa mga katanungan ukol sa property\n3. Pagbigay ng impormasyon tungkol sa mga benepisyo at iba pa.",
    //         sender: "bot",
    //     };
    //     setMessages((prevMessages) => [...prevMessages, serviceMessage]);
    // }
    const fetchServices = async() => {
        if(accessToken){
            try{
                setLoading(true)
                const response = await fetch('http://127.0.0.1:8000/api/chatbot/services', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    }
                })
                const data = await response.json();
                console.log(data)
                if(response.ok){
                    const serviceMessage = {
                        id: messages.length + 2,
                        text: "Narito ang mga serbisyong inaalok ko:",
                        sender: "bot",
                        buttons: data.services.map((service) => ({
                        label: service.name,
                        value: service.id,
                        })),
                    };
                    setMessages((prevMessages) => [...prevMessages, serviceMessage]);
                    setLoading(false)
                }else{
                    const errorMessage = {
                        id: messages.length + 2,
                        text: "Sorry, I couldn't process your request.",
                        sender: "bot",
                    };
                    setMessages((prevMessages) => [...prevMessages, errorMessage]);
                    setLoading(false)
                }
            }catch(error){
                setLoading(false)
                console.error("Query error:", error);
                // Add error message to chat
                const errorMessage = {
                id: messages.length + 2,
                text: "An error occurred. Please try again.",
                sender: "bot",
                };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);
            }
        }
    }
    useEffect(() => {
        if(isMenuOpen){
            handleGreetings()
            // Services();
            fetchServices();
        }
    }, [isMenuOpen])



    const handleQuery = async (e) => {
        e.preventDefault();

        // Prevent sending empty messages
        if (!query.trim()) return;

        // Create user message
        const userMessage = {
        id: messages.length + 1,
        text: query,
        sender: "user",
        };

        // Add user message to chat
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setQuery("");
        
        if (accessToken) {
        try {
            setLoading(true);
            console.log(query)
            const response = await fetch("http://127.0.0.1:8000/api/chatbot/query",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    
                },
                body: JSON.stringify({ query: query }),
            });

            const data = await response.json();

            if (data && data.response) {
                console.log(data.response)
                console.log(data.error)
                if (typeof data.response === 'string') {
                    const textMessage = {
                        id: messages.length + 2,
                        text: data.response,
                        sender: "bot",
                    };
                    setMessages((prevMessages) => [...prevMessages, textMessage]);
                } 
                // Check if response is an object with intro and services
                else if (typeof data.response === 'object') {
                    const { intro, services } = data.response;
                    
                    // Add intro message if it exists
                    if (intro) {
                        const introMessage = {
                            id: messages.length + 2,
                            text: intro,
                            sender: "bot",
                        };
                        setMessages((prevMessages) => [...prevMessages, introMessage]);
                    }

                    // Add service buttons if they exist
                    if (services?.original?.services?.length > 0) {
                        const serviceButtonsMessage = {
                            id: messages.length + 3,
                            text: "", // Empty text since we already showed the intro
                            sender: "bot",
                            buttons: services.original.services.map((service) => ({
                                label: service.name,
                                value: service.id,
                            })),
                        };
                        setMessages((prevMessages) => [...prevMessages, serviceButtonsMessage]);
                    }
                }
            } else {
                const errorMessage = {
                    id: messages.length + 2,
                    text: "Sorry, I couldn't process your request.",
                    sender: "bot",
                };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);
            }
        } catch (error) {
            console.error("Query error:", error);

            // Add error message to chat
            const errorMessage = {
            id: messages.length + 2,
            text: "An error occurred. Please try again.",
            sender: "bot",
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
        }
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString(); // You can customize the date format
    };

    const menuId = "primary-chatbot-menu";
    return (
        <>
        <Box
            sx={{
            position: "fixed",
            bottom: 25,
            right: 30,
            zIndex: 10,
            }}
        >
            <motion.div
            whileHover={{
                scale: 1.1,
                rotate: [0, -5, 5, -5, 0],
                transition: {
                duration: 0.1,
                type: "spring",
                stiffness: 300,
                },
            }}
            whileTap={{ scale: 0.95 }}
            >
            <Fab
                sx={{
                    backgroundColor:' #512da8', 
                    '&:hover':{
                        backgroundColor:' #512da8', 
                    }
                }}
                aria-label="chat"
                onClick={handleProfileMenuOpen}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <ActiveBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Adjusted for proper alignment
                    variant="dot"
                    sx={{zIndex:20}}
                >
                    {/* <SmartToy sx={{ fontSize: "32px", color: "white" }} /> */}
                    <Box sx={{position:'relative'}}>
                    <Image
                        src='/probot.svg'
                        alt='Chatbot'
                        width={100} // Adjust the width for smaller size
                        height={100} // Adjust the height for smaller size
                        style={{
                            marginTop:'8px',
                            maxWidth: '45%',
                            height: 'auto',
                            objectFit: 'contain',
                            filter: 'grayscale(20%) opacity(100%)',
                            animation: 'float 3s ease-in-out infinite'
                        }}
                    />
                    </Box>
                </ActiveBadge>
            </Fab>
            </motion.div>
        </Box>
        <Popover
            open={isMenuOpen}
            anchorEl={anchorEl}
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
            }}
            transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
            }}
            id={menuId}
            keepMounted
            onClose={handleMenuClose}
        >
            <Paper
            elevation={3}
            sx={{
                width: 400,
                height: 600,
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                borderRadius: 1.2,
                overflow: "hidden",
            }}
            >
            {/* Header */}
            <Box
                sx={{
                backgroundColor: "#5e35b1",
                color: "white",
                padding: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                }}
            >
                <Box sx={{display:'inline-flex', alignItems:'center'}}>
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Adjusted for proper alignment
                    variant="dot"
                    >
                        <Avatar sx={{width: 40,  height: 40,  position: 'relative', marginRight: 1, bgcolor: "#673ab7" }}>
                            <Image
                                src='/probot.svg'
                                alt='Chatbot'
                                width={1000} // Adjust the width for smaller size
                                height={1000} // Adjust the height for smaller size
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    objectFit: 'contain',
                                    filter: 'grayscale(20%) opacity(100%)',
                                    animation: 'float 3s ease-in-out infinite'
                                }}
                            />
                        </Avatar>
                </StyledBadge>
                <Typography variant="h6">SmartLease Bot</Typography>                                   
                </Box>
                <Avatar
                sx={{ bgcolor: "green", width: 10, height: 10 }}
                variant="circular"
                />
            </Box>

            {/* Messages Container */}
            <Box
                ref={messagesContainerRef}
                sx={{
                flexGrow: 1,
                overflowY: "auto",
                padding: 2,
                backgroundColor: "#f9f9f9",
                }}
            >
                {messages.map((msg) => (
                <Box
                    key={msg.id}
                    sx={{
                    display: "flex",
                    justifyContent:
                        msg.sender === "user" ? "flex-end" : "flex-start",
                    marginBottom: 2,
                    }}
                >
                    {msg.sender === "bot" && (
                    <div>
                    <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Adjusted for proper alignment
                    variant="dot"
                    >
                        <Avatar sx={{width: 40,  height: 40,  position: 'relative', marginRight: 1, bgcolor: "#673ab7" }}>
                            <Image
                                src='/probot.svg'
                                alt='Chatbot'
                                width={1000} // Adjust the width for smaller size
                                height={1000} // Adjust the height for smaller size
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    objectFit: 'contain',
                                    filter: 'grayscale(20%) opacity(100%)',
                                    animation: 'float 3s ease-in-out infinite'
                                }}
                            />
                        </Avatar>
                    </StyledBadge>
                    </div>
                    )}
                    <Box
                    sx={{
                        maxWidth: "70%",
                        padding: 2,
                        borderRadius: 2,
                        fontSize:'15.6px',
                        backgroundColor:
                        msg.sender === "user" ? "#7e57c2" : "#eceff1",
                        color: msg.sender === "user" ? "white" : "black",
                        whiteSpace: "pre-line"
                    }}
                    >
                    {msg.text}
                    {msg.buttons && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: 1,
                        }}
                    >
                        {msg.buttons.map((button) => (
                            <Button
                                key={button.value}
                                variant="contained"
                                color="primary"
                                size="small"
                                sx={{
                                    margin: "4px 0",
                                    textTransform: "none",
                                }}
                                onClick={() => handleButtonClick(button.value)}
                            >
                                {button.label}
                            </Button>
                        ))}
                    </Box>
                    )}
                    </Box>
                    {/* {msg.sender === "user" && (
                    <Avatar sx={{ marginLeft: 1, bgcolor: "#512da8" }}>
                        <Person />
                    </Avatar>
                    )} */}
                </Box>
                ))}
                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
                        {/* <Typography variant="body2" gutterBottom>
                            Typing...
                        </Typography> */}
                        <Dot style={{ animationDelay: '0s' }} />
                        <Dot style={{ animationDelay: '0.5s' }} />
                        <Dot style={{ animationDelay: '1s' }} />
                    {/* <Typography variant="body2" sx={{ color: "#999" }}>
                        loading....
                    </Typography>
                    <CircularProgress size={24} sx={{ marginLeft: 1 }} /> */}
                    </Box>
                )}
            </Box>

            {/* Input Area */}
            <Box
                sx={{
                display: "flex",
                alignItems: "center",
                padding: 2,
                borderTop: "1px solid #ddd",
                }}
            >
                <TextField
                fullWidth
                multiline // Enables multiple lines
                maxRows={4} // Limits the height of the TextField
                variant="outlined"
                size="small"
                placeholder="Type your message..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleQuery(e)}
                disabled={loading}
                />
                <IconButton
                disabled={loading || !query.trim()}
                onClick={handleQuery}
                sx={{ marginLeft: 1, color: "#5e35b1" }}
                >
                <Send />
                </IconButton>
            </Box>
            </Paper>
        </Popover>
        </>
    );
};

export default Chatbot;
