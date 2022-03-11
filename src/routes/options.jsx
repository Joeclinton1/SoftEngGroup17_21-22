import React, { Component} from 'react';
import Card from '@mui/material/Card';
import {OptionsContext} from "../components/OptionsContext"
import {DynamicSelect} from "../components/DynamicSelect"

class Options extends Component {
    constructor(props) {
        super(props);
        this.setOptions = this.props.setOptions
        this.cookies = this.props.cookies
        console.log(this.context)
        this.state = {
            fontSize: 0,
            chatColour: 0,
            showConf: 0,
            // lang: this.cookies.get('lang'),
            numResults: 0,
            isSummarised: 0
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount = ()=>{
        this.setState(this.context)
    }
    handleChange = (id, event)=>{
        this.setState({[id]: event.target.value}, ()=>{this.setOptions(this.state)});
    }
    
    changeCookie = (id, value)=>{
        this.cookies.set(id, value, { path: '/' })
    }

    render() {
        return (
            <Card sx={{ 
                minWidth: 400,
                display:"flex",
                flexDirection: "column",
                rowGap: "30px",
                outline: "1px solid #ccc",
                padding: "20px",
            }}>

                <DynamicSelect 
                    id = "fontSize"
                    label = "Font Size"
                    state = {this.state}
                    handleChange = {this.handleChange}
                    changeCookie = {this.changeCookie}
                    MenuItems = {[
                        [0,"Small"],
                        [1,"Normal"],
                        [2,"Large"],
                        [3,"Very Large"]
                    ]}
                />

                <DynamicSelect 
                    id = "chatColour"
                    label = "Chat Colour"
                    state = {this.state}
                    handleChange = {this.handleChange}
                    changeCookie = {this.changeCookie}
                    MenuItems = {[
                        ['r',"Red"],
                        ['g',"Green"],
                        ['b',"Blue"],
                        ['y',"Yellow"]
                    ]}
                />

                <DynamicSelect 
                    id = "showConf"
                    label = "Show Confidence score?"
                    state = {this.state}
                    handleChange = {this.handleChange}
                    changeCookie = {this.changeCookie}
                    MenuItems ={[
                        [1,"Yes"],
                        [0, "No"]
                    ]}
                />

                <DynamicSelect 
                    id = "numResults"
                    label = "Number of Results to Display"
                    state = {this.state}
                    handleChange = {this.handleChange}
                    changeCookie = {this.changeCookie}
                    MenuItems = {[1,2,3,4,5].map(x => [x, x])}
                />

                <DynamicSelect 
                    id = "isSummarised"
                    label = "Summarise Results?"
                    state = {this.state}
                    handleChange = {this.handleChange}
                    changeCookie = {this.changeCookie}
                    MenuItems ={[
                        [1,"Yes"],
                        [0, "No"]
                    ]}
                />

            </Card>
        )
    }
}
Options.contextType = OptionsContext;
export default Options;