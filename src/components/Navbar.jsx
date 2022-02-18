import MuiAppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import {useLocation } from 'react-router-dom'

const Title = () =>{
    switch(useLocation().pathname){
        case "/":
            return "Chat";
        case "/options":
            return "Options";
        default:
            return "";
    }
    
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open, drawerWidth }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

export default function NavBar(props){
    return(
        <AppBar position="fixed" drawerWidth={props.drawerWidth} open={props.open}>
            <Toolbar>
                <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={props.handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(props.open && { display: 'none' }) }}
                >
                <MenuIcon />
                </IconButton>
                <Typography variant="h4" noWrap  component="div" align = "center" sx={{ flexGrow: 1 }}>
                    <Title/>
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
