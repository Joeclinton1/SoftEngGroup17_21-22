import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import React, { Component } from 'react';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageGroup,
    TypingIndicator,
    MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { OptionsContext } from "../components/OptionsContext";

export default class SimpleChat extends Component {
    constructor(props) {
        super(props);
        this.typingIndicator =

            this.fontSizes = {
                0: "0.8em",
                1: "1em",
                2: "1.35em",
                3: "1.7em"
            }

        this.chatColours = {
            'r': '#fac6c6',
            'b': '#c6e3fa',
            'g': '#c6facc',
            'y': '#faf8c6',
        }
    }

    componentDidMount = () => this.colourChat()

    colourChat() {
        const chatContainer = document.getElementsByClassName("cs-main-container")[0];
        const colour = chatContainer.getAttribute("data-colour")
        const selectors = [
            ".cs-message__content",
            ".cs-message-input__content-editor",
            ".cs-message-input__content-editor-wrapper"
        ]
        selectors.forEach((selector) => {
            const colourable = document.querySelectorAll(selector)
            for (const el of colourable) {
                el.style.backgroundColor = colour;
            }
        })
    }

    render() {
        return (
            <OptionsContext.Consumer>
                {options => (
                    <MainContainer
                        data-colour={this.chatColours[options.chatColour]}
                        data-num-results={options.numResults}
                        style={{
                            "fontSize": this.fontSizes[options.fontSize]
                        }}
                        data-show-conf={options.showConf}>
                        <ChatContainer>
                            <MessageList typingIndicator={this.props.typingIndicatorStatus ? <TypingIndicator content="IBM chatbot is typing" /> : null}>
                                {this.props.messages.map((grp, grp_id) => <MessageGroup key={grp_id} direction={grp.direction}>
                                    <MessageGroup.Messages>
                                        {grp.messages.map((msg, m_id) =>
                                            <Message key={m_id} model={{
                                                type: "html",
                                                payload: msg
                                            }} />
                                        )}
                                    </MessageGroup.Messages>
                                </MessageGroup>)}
                            </MessageList>
                            <MessageInput data-testid="message-input" onSend={this.props.handleSend} placeholder="Type message here" />
                        </ChatContainer>
                    </MainContainer>
                )}
            </OptionsContext.Consumer>
        )
    }
}