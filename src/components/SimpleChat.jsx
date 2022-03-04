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
import { OptionsContext } from "../components/OptionsContext";

export default function SimpleChat({currentMessages, typingIndicatorStatus, handleSend}){

    const typingIndicator = typingIndicatorStatus ? <TypingIndicator content="IBM chatbot is typing" /> : 0

    //  options of styles to be selected by option.
    const fontSizes = {
        0: "0.8em",
        1: "1em",
        2: "1.35em",
        3: "1.7em"
    }

    const chatColours = {
        'r': '#fac6c6',
        'b': '#c6e3fa',
        'g': '#c6facc',
        'y': '#faf8c6',
    }

    return(
        <OptionsContext.Consumer>
            {options => (
                <MainContainer
                    data-colour={chatColours[options.chatColour]}
                    data-num-results={options.numResults}
                    style={{
                        "fontSize": fontSizes[options.fontSize]
                    }}
                    >
                    <ChatContainer>
                        <MessageList typingIndicator={typingIndicator}>
                            {currentMessages.map((g) => <MessageGroup key={g.id} direction={g.direction}>
                                <MessageGroup.Messages>
                                    {g.messages.map((m) =>
                                        <Message key={m.id} model={{
                                            type: "html",
                                            payload: m.content
                                        }} />
                                    )}
                                </MessageGroup.Messages>
                            </MessageGroup>)}
                        </MessageList>
                        <MessageInput data-testid="message-input" onSend={handleSend} placeholder="Type message here" />
                    </ChatContainer>
                </MainContainer>
            )}
        </OptionsContext.Consumer>
    )
}