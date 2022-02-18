import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageGroup,
    TypingIndicator,
    MessageInput,
} from "@chatscope/chat-ui-kit-react";
import React, { Component, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';


class ChatGroup {
    constructor(id, direction, messages) {
        this.id = id;
        this.direction = direction;
        this.messages = messages;
    }
}

class ChatMessage {
    constructor(id, content) {
        this.id = id;
        this.content = content;
    }
}

const initialMessages = [new ChatGroup(0, "incoming", [
    new ChatMessage(0, "Hello, thank you for using IBM's chatbot assistance tool."),
    new ChatMessage(1, "What would you like to know about IBM Cloud for Financial Services?")
])]

const fakeMessages = [
    new ChatGroup(1, "incoming", [
        new ChatMessage(0,
            "The IBM Cloud for Financial Services is a cloud designed to build trust and enable a transparent public cloud ecosystem with the specific features for security, compliance and resiliency that financial institutions require."
        ),
        new ChatMessage(1,
            "Does this answer your question?"
        )
    ]),
    new ChatGroup(2, "incoming", [
        new ChatMessage(0,
            "You're welcome. Any other questions?"
        )
    ]),
    new ChatGroup(3, "incoming", [
        new ChatMessage(0,
            "Good to hear. Have a great day!"
        )
    ])
]

class Chat extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentMessages: initialMessages,
            typingIndicator: 0,
        }
    }

    receiveNextMessage = () => {
        this.setState({typingIndicator: 0});
        this.setState({currentMessages: [
                ...this.state.currentMessages,
                fakeMessages.shift()
            ]
        })
    }
    
    saveFunction = () => {
        // get elemnt for saving file
        const element = document.createElement("a");
        // get data from object and use JSON.stringify to convert to text
        const file = new Blob([JSON.stringify(this.state.currentMessages)], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        
        // get current time and date for use in filename
        let currentTime = new Date().toLocaleString();
    
        // download file to users local storage
        element.download = "transcipt_" + currentTime +".txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    handleSend = (text) => {
        console.log(text)
        const DiscoveryV1 = require('ibm-watson/discovery/v1');
        const { IamAuthenticator } = require('ibm-watson/auth');

        const discovery = new DiscoveryV1({
        version: '2019-04-30',
        authenticator: new IamAuthenticator({
            apikey: '__Kp8R3pLrESr2vmVT4vRjsgBEo5ZKkWHPPar0pOOti2',
        }),
        serviceUrl: 'https://api.eu-gb.discovery.watson.cloud.ibm.com/instances/d874b546-9b02-4c6a-bc6c-3042fedb37be',
        });

        const queryParams = {
        environmentId: '8b58da18-58c8-49eb-b5d4-4cbc7d7f58fa',
        collectionId: '2e651944-431c-4dbc-b407-716036caea75',
        configurationId: '90941570-b5c8-4d55-b39a-cd9b26cdf9a8',
        Query: text
        };

        discovery.query(queryParams)
        .then(queryResponse => {
            console.log(JSON.stringify(queryResponse, null, 2));
        })
        .catch(err => {
            console.log('error:', err);
        });

        const {currentMessages} = this.state
        const id = currentMessages.length;
        const msg = new ChatMessage(id, text);
        const lastGroup = currentMessages[currentMessages.length - 1]
        if (lastGroup.direction === "outgoing") {
            lastGroup.messages.push(msg);
            this.setState({currentMessages: [
                ...currentMessages.slice(0, -1),
                lastGroup
            ]});
        } else {
            this.setState({currentMessages: [
                ...currentMessages,
                new ChatGroup(currentMessages.length, "outgoing", [msg])
            ]}, () =>{
                setTimeout(this.receiveNextMessage, 1000);
            });
        }
        this.setState({typingIndicator: new TypingIndicator("IBM chatbot is typing")});
    };

    render(){
        const {currentMessages, typingIndicator} = this.state;
        return (
            <Stack direction="column" spacing={2} style={{ display: "flex", maxWidth: "500px", minWidth: "300px" }}>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" onClick={() => {this.saveFunction();}}>Export Current Chat</Button>

                    <input type="file" accept="text/*" style={{ display: 'none' }} id="contained-button-file"/>
                    <label htmlFor="contained-button-file">
                        <Button variant="outlined" component="span"> Load Previous Chat </Button>
                    </label>
                </Stack>
                <MainContainer>
                    <ChatContainer>
                        <MessageList typingIndicator={typingIndicator}>
                            {currentMessages.map((g) => <MessageGroup key={g.id} direction={g.direction}>
                                <MessageGroup.Messages>
                                    {g.messages.map((m) => <Message key={m.id} model={{
                                        type: "html",
                                        payload: m.content
                                    }} />)}
                                </MessageGroup.Messages>
                            </MessageGroup>)}
                        </MessageList>
                        <MessageInput onSend={this.handleSend} placeholder="Type message here" />
                    </ChatContainer>
                </MainContainer>
            </Stack>
        )
    }
}

export default Chat;


// const item = window.localStorage.getItem('currentMessages');
// const getInitialMessages = () =>{
//     if(item !== null){
//         return JSON.parse(item);
//     }else return(
//         new ChatGroup(0, "incoming", [
//             new ChatMessage(0, "Hi"),
//             new ChatMessage(1, "What would you like to know about IBM Cloud for Financial Services?")
//         ])
//     );
// }

// useEffect(() => {
//     setCurrentMessages();
//   }, []);

// useEffect(() => {
//     window.localStorage.setItem('currentMessages', currentMessages);
// }, [currentMessages]);