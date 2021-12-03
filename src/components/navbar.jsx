import React from "react"
import {
    AppBar, 
    Box,
    Toolbar,
    Typography,
    Button, 
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {useLocation } from 'react-router-dom'

export default function Navbar(props) {
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
            <IconButton
                onClick={() => props.setDrawerOpen(true)}
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h4" component="div" align = "center" sx={{ flexGrow: 1 }}>
                {capitalize(useLocation().pathname.split("/")[1])}
            </Typography>
            </Toolbar>
        </AppBar>
        </Box>
    );
}