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

class Chat extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentMessages: initialMessages,
            typingIndicator: 0,
        }
    }

    receiveNextMessage = (resp) => {
        if(resp === "error"){
            this.setState({typingIndicator: 0});
            this.setState({currentMessages: [
                
                ...this.state.currentMessages,
                new ChatGroup(1, "incoming", [
                    new ChatMessage(0,
                        "I'm sorry, I couldn't understand. Could you please rephrase the question?"
                    )
                ]),
            ]
        })
        } else {
            this.setState({typingIndicator: 0});
            this.setState({currentMessages: [
                
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
        const file = new Blob([JSON.stringify(this.state.currentMessages)], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        
        // get current time and date for use in filename
        let currentTime = new Date().toLocaleString();
    
        // download file to users local storage
        element.download = "transcipt_" + currentTime +".json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    handleSend = (text) => {
        console.log(text)
        //initialize query parameters
        const queryParams = {
            environmentId: '8b58da18-58c8-49eb-b5d4-4cbc7d7f58fa',
            collectionId: '2e651944-431c-4dbc-b407-716036caea75',
            configurationId: '90941570-b5c8-4d55-b39a-cd9b26cdf9a8',
            naturalLanguageQuery: text,
            passagesFields: 'text, subtitles, titles'
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
                    
                    //resp_dict is a dictionary containting each result's id and it's respective confidence score (in decending order) - May be useful later
                    var resp_dict = new Map()
                    for(var i = 0; i < resp.result.results.length; i++) {
                        resp_dict.set(resp.result.results[i].id, resp.result.results[i].result_metadata.confidence)
                    }
                    console.log(resp_dict)
                    console.log(resp.result.session_token)
                    
                    var current = 0 //needed incase we loop through responses
                    const createEventParams = {
                        type: 'click',
                        data: {
                          environment_id: '8b58da18-58c8-49eb-b5d4-4cbc7d7f58fa',
                          session_token: resp.result.session_token,
                          collection_id: '2e651944-431c-4dbc-b407-716036caea75',
                          document_id: resp.result.results[current].id,
                        }
                      };
                      
                    discovery.createEvent(createEventParams)
                        .then(createEventResponse => {
                          console.log(JSON.stringify(createEventResponse, null, 2));
                        })
                        .catch(err => {
                          console.log('error:', err);
                        });

                    //Take first result (result with highest conf score)
                    resp = JSON.stringify(queryResponse.result.results[0].text.replace(/\n/g, " "))

                    //Print all results
                    console.log(JSON.stringify(queryResponse.result.results, null, 2));

                    //Currently result is a massive extract with very little value, need to figure out how to summarize in to a sentence. Also, conf scores are very low (<0.1) so need to improve that too.
                    setTimeout(this.receiveNextMessage(resp), 1000);

                })
                .catch(err => {
                    //Handle when Watson couldn't understand query
                    setTimeout(this.receiveNextMessage("error"), 1000);
                    console.log('error:', err);
                });
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