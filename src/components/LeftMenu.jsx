import React from "react";
import DrawerHeader from "./DrawerHeader";

import { ListItem, ListItemIcon, ListItemText, Divider, IconButton, List, Drawer } from '@mui/material';
import {Link} from "react-router-dom"
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const MenuListItem = ({ text, icon, to}) => {
    return (
        <ListItem button key={text} component={Link} to = {to}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={text} />
        </ListItem>
    )
}

export default function LetftMenu(props) {
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={props.open}
        >
            <DrawerHeader>
                <IconButton onClick={props.handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                <MenuListItem text="Chat" icon={<ChatIcon />} to="/" />
            </List>
            <Divider />
            <List>
                <MenuListItem text="Options" icon={<SettingsIcon />} to="options" />
            </List>
        </Drawer>
    );
}