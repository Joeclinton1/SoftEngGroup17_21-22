import React from "react";
import DrawerHeader from "./DrawerHeader";

import { ListItem, ListItemIcon, ListItemText, Divider, IconButton, List, Drawer } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import ChatIcon from '@mui/icons-material/Chat';
import FolderIcon from '@mui/icons-material/FolderSpecial';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const MenuListItem = ({ text, icon }) => {
    return (
        <ListItem button key={text}>
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
                <MenuListItem text="Chat" icon={<ChatIcon />} />
                <MenuListItem text="Admin" icon={<AdminIcon />} />
            </List>
            <Divider />
            <List>
                <MenuListItem text="Saved Chats" icon={<FolderIcon />} />
                <MenuListItem text="Options" icon={<SettingsIcon />} />
            </List>
        </Drawer>
    );
}