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
import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { OptionsContext } from '../components/OptionsContext';

//Initialize Watson instance
const DiscoveryV1 = require('ibm-watson/discovery/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const discovery = new DiscoveryV1({
    version: '2019-04-30',
    authenticator: new IamAuthenticator({
        apikey: '__Kp8R3pLrESr2vmVT4vRjsgBEo5ZKkWHPPar0pOOti2',
    }),
    serviceUrl: 'https://api.eu-gb.discovery.watson.cloud.ibm.com/instances/d874b546-9b02-4c6a-bc6c-3042fedb37be',
});

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

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMessages: initialMessages,
            typingIndicator: 0,
        }
    }
    getFile = async (e) => {
        e.preventDefault()
        const reader = new FileReader()

        reader.onload = async (e) => {
            const text = (e.target.result)
            let jsonParse = JSON.parse(text)
            let newMessages = []

            for (let i = 0; i < jsonParse.length; i++) {
                let messagesToAdd = []

                for (let j = 0; j < jsonParse[i].messages.length; j++) {
                    messagesToAdd.push(new ChatMessage(jsonParse[i].messages[j].id, jsonParse[i].messages[j].content))
                }

                newMessages.push(new ChatGroup(jsonParse[i].id, jsonParse[i].direction, messagesToAdd))
            }

            this.setState({ currentMessages: newMessages })
        };
        reader.readAsText(e.target.files[0])
    }

    receiveNextMessage = (resp) => {
        // if Watson returned no results
        if (resp === "empty") {
            this.setState({ typingIndicator: 0 });
            this.setState({
                currentMessages: [

                    ...this.state.currentMessages,
                    new ChatGroup(1, "incoming", [
                        new ChatMessage(0,
                            "I'm sorry, I couldn't understand. Could you please rephrase the question?"
                        )
                    ]),
                ]
            })
        } else {
            //Display answer in chat component
            this.setState({ typingIndicator: 0 });
            this.setState({
                currentMessages: [
                    ...this.state.currentMessages,
                    new ChatGroup(1, "incoming", [
                        new ChatMessage(0,
                            resp.substring(0, 300)
                        ),
                        new ChatMessage(1,
                            "Does this answer your question?"
                        )
                    ]),
                ]
            })
        }
    }

    saveFunction = () => {
        // get elemnt for saving file
        const element = document.createElement("a");
        // get data from object and use JSON.stringify to convert to text
        const file = new Blob([JSON.stringify(this.state.currentMessages)], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);

        // get current time and date for use in filename
        let currentTime = new Date().toLocaleString();
        console.log(currentTime.substring(0, 10))
        console.log(currentTime.substring(12))

        let timeFormatted = currentTime.substring(0, 10) + "_" + currentTime.substring(12)

        // download file to users local storage
        element.download = "transcipt_" + timeFormatted + ".json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

<<<<<<< HEAD
    handleSend = (text) => {
        //initialize query parameters
        const queryParams = {
            environmentId: '8b58da18-58c8-49eb-b5d4-4cbc7d7f58fa',
            collectionId: '2e651944-431c-4dbc-b407-716036caea75',
            configurationId: '90941570-b5c8-4d55-b39a-cd9b26cdf9a8',
            naturalLanguageQuery: text,
            passages: true,
            passagesFields: 'text, subtitles'
            };
        
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

                //send query to Watson and handle response
                discovery.query(queryParams)
                .then(queryResponse => {

                    var resp = queryResponse
                    console.log(resp)
                    console.log(resp.result.passages[0].passage_text)
                    
                    //resp_dict is a dictionary containting each result's id and it's respective confidence score (in decending order) - May be useful later
                    var resp_dict = new Map()
                    for(var i = 0; i < resp.result.results.length; i++) {
                        resp_dict.set(resp.result.results[i].id, resp.result.results[i].result_metadata.confidence)
                    }
                    console.log(resp_dict)
                    
                    var current = 0 //needed incase we loop through responses
=======
    //Get request to send query
    callWD(text) {
        fetch("/queryWD?qtext=".concat(text))
            .then(res => res.json())
            .then(res => {
                // If Watson returns no results
                // Need to be able to handle when Watson returns a JSON with different structure then usual (e.g. response to query: Who are you)
                if (res.result.matching_results == 0) {
                    setTimeout(this.receiveNextMessage('empty'), 1000)
                } else {
                    var resultWD = res.result.passages[0].passage_text

                    //Relevancy code
>>>>>>> 0ee7c734ab2ee99700d6ef1effab66d7cef51929
                    const createEventParams = {
                        type: 'click',
                        data: {
                            environment_id: '8b58da18-58c8-49eb-b5d4-4cbc7d7f58fa',
                            session_token: res.result.session_token,
                            collection_id: '2e651944-431c-4dbc-b407-716036caea75',
                            document_id: res.result.passages[0].document_id,
                        }
                    };

                    discovery.createEvent(createEventParams)
                        .then(createEventResponse => {
                            console.log(JSON.stringify(createEventResponse, null, 2));
                        })
                        .catch(err => {
                            console.log('error:', err);
                        });

                    //Send results to recieveNextMessage
                    setTimeout(this.receiveNextMessage(resultWD), 1000)
                }
            })
            .catch(err => err);
    }

    handleSend = (text) => {
        const msgs = this.state.currentMessages
        const id = msgs.length;
        const msg = new ChatMessage(id, text);
        const lastGroup = msgs[msgs.length - 1]
        if (lastGroup.direction === "outgoing") {
            lastGroup.messages.push(msg);
            this.setState({
                currentMessages: [
                    ...msgs.slice(0, -1),
                    lastGroup
                ]
            });
        } else {
            console.log(msgs)
            this.setState({
                currentMessages: [
                    ...msgs,
                    new ChatGroup(msgs.length, "outgoing", [msg])
                ]
            }, () => {
                //send query to Watson and handle response
                this.callWD(text)
            });
        }
        this.setState({ typingIndicator: <TypingIndicator content="IBM chatbot is typing" /> });
    };

    render() {
        const { currentMessages, typingIndicator } = this.state;
        return (
            <OptionsContext.Consumer>
                <Stack direction="column" spacing={2} style={{ display: "flex", maxWidth: "500px", minWidth: "300px" }}>
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" onClick={() => { this.saveFunction(); }}>Export Current Chat</Button>

                        <input type="file" accept="/*" style={{ display: 'none' }} id="contained-button-file" onChange={(e) => this.getFile(e)} />
                        <label htmlFor="contained-button-file">
                            <Button variant="outlined" component="span" > Load Previous Chat </Button>
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
            </OptionsContext.Consumer>
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