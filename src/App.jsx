import * as React from 'react';
import Chat from "./routes/chat"
import Options from "./routes/options"
import Home from "./routes/home"
import NavBar from "./components/Navbar"
import LeftMenu from "./components/LeftMenu"
import DrawerHeader from "./components/DrawerHeader";
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import { defaultOptions, OptionsContext } from "./components/OptionsContext";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom"
import Cookies from 'universal-cookie';

const drawerWidth = 240;

const cookies = new Cookies();

// context options


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

    //initialize default cookie values
    if(cookies.get('fontSize') == null){
        cookies.set('fontSize', 1, { path: '/' });
    }
    if(cookies.get('lang') == null){
        cookies.set('lang', 0, { path: '/' });
    }
    if(cookies.get('chatColour') == null){
        cookies.set('chatColour', 'b', { path: '/' });
    }
    if(cookies.get('numResults') == null){
        cookies.set('numResults', 1, { path: '/' });
    }
    if(cookies.get('isSummarised') == null){
        cookies.set('isSummarised', 1, { path: '/' });
    }


    const cookieOptions = Object.fromEntries(['fontSize', 'chatColour', 'numResults', 'isSummarised'].map((optionName)=>(
        [optionName, cookies.get(optionName)]
    )))
    const [options, setOptions] = React.useState(cookieOptions)

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <OptionsContext.Provider value={options}>
            <Router>
                <Box sx={{ display: 'flex', height: '100vh' }}>
                    <CssBaseline />
                    <NavBar handleDrawerOpen={handleDrawerOpen} />
                    <LeftMenu handleDrawerClose={handleDrawerClose} open={open} />

                    <Main open={open} style={{ padding: '0px' }}>
                        <DrawerHeader />
                        <div style={{
                            display: "flex",
                            padding: '24px',
                            justifyContent: "center",
                            height: "calc(100vh - 64px)",
                            margin: "auto"
                        }}>
                            <Routes>
                                <Route path="/" element={<Chat cookies = {cookies}/>} />
                                <Route path="/options" element={<Options setOptions = {setOptions} cookies = {cookies} />} />
                                <Route path="/home" element={<Home />} />
                            </Routes>
                        </div>
                    </Main>
                </Box>
            </Router>
        </OptionsContext.Provider>
    );
}
export default App;