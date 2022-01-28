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

    handleSend = (text) => {
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
            <MainContainer style={{ display: "flex", maxWidth: "500px", minWidth: "300px" }}>
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