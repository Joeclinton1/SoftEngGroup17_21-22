import React from "react"
import {Link} from 'react-router-dom'

import {
    AppBar, 
    Drawer,
    MenuItem,
} from '@mui/material';

export default function Sidebar(props) {
    return(
        <Drawer width={200} openSecondary={true} open={props.open} >
            <AppBar title="Menu" />
            <MenuItem component={Link} to = "/chat" onClick={() => props.setDrawerOpen(false)}>Chat</MenuItem>
            <MenuItem component={Link} to = "/admin" onClick={() => props.setDrawerOpen(false)}>Admin</MenuItem>
        </Drawer>
    )
}