import * as React from 'react';
import Chat from "./routes/chat"
import Options from "./routes/options"
import NavBar from "./components/Navbar"
import LeftMenu from "./components/LeftMenu"
import DrawerHeader from "./components/DrawerHeader";
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { styled} from '@mui/material/styles';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom"

const drawerWidth = 240;

const Main = styled('main')(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);


function App() {
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Router>
            <Box sx={{ display: 'flex', height: '100vh'}}>
                <CssBaseline />
                <NavBar handleDrawerOpen={handleDrawerOpen} />
                <LeftMenu handleDrawerClose={handleDrawerClose} open={open} />

                <Main open={open} style = {{padding: '0px'}}>
                    <DrawerHeader />
                    <div style={{
                        display: "flex",
                        padding: '24px',
                        justifyContent: "center",
                        height: "calc(100vh - 64px)",
                        margin: "auto"
                        }}>
                        <Routes>
                            <Route path="/" element={<Chat />} />
                            <Route path="/options" element={<Options />} />
                        </Routes>
                    </div>
                </Main>
            </Box>
        </Router>
    );
}

export default App;