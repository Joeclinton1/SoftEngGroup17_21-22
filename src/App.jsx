import React from "react"
import Chat from "./routes/chat"
import Navbar from "./components/navbar"
import Sidebar from "./components/sidebar"
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom"

class App extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            drawerOpen: false
        }
    }
    setDrawerOpen = (isDrawerOpen) => {
        this.setState({
            drawerOpen: isDrawerOpen
        })
    }
    
    toggleDrawer = () => {
        this.setState((pstate) => ({ drawerOpen: !pstate.drawerOpen }))
    }
    
    render() {
        return (
            <Router>
                <Navbar setDrawerOpen={this.setDrawerOpen}/>
                <Sidebar setDrawerOpen={this.setDrawerOpen} open={this.state.drawerOpen} />
                <Routes>
                    <Route path = "/chat" element={<Chat/>}/>
                </Routes>
            </Router>
        );
    }
}

export default App;