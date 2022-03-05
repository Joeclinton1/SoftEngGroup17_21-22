import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SimpleChat from "../components/SimpleChat"


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


window.localStorage.setItem('currentMessages', []);


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
        var text = ''

        if (!!(window.localStorage.getItem("currentMessages"))) {
            text = JSON.parse(window.localStorage.getItem("currentMessages"));
        }

        this.cookies = this.props.cookies
        this.state = {
            currentMessages: text || initialMessages,
            typingIndicatorStatus: false,
        }

        window.addEventListener('storage', (e) => this.storageChanged(e));

        this.storageChanged = this.storageChanged.bind(this);
        this.handleSend = this.handleSend.bind(this);
    }

    //ran if Storage changes
    storageChanged(e) {
        if (e.key === 'currentMessages') {
            this.setState({ currentMessages: e.newValue })
        }
    }

    colourChat = () => {
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
    componentDidMount = () => { this.colourChat() }
    componentDidUpdate = () => { this.colourChat() }

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

    receiveNextMessage = (resp, scores) => {
        // if Watson returned no results
        var key = this.state.currentMessages.length
        if (resp === "empty") {
            this.setState({ typingIndicatorStatus: false });
            this.setState({
                currentMessages: [
                    ...this.state.currentMessages,
                    new ChatGroup(key, "incoming", [
                        new ChatMessage(0,
                            "I'm sorry, I couldn't understand. Could you please rephrase the question?"
                        )
                    ]),
                ]
            })
        } else if (document.getElementsByClassName("cs-main-container")[0].getAttribute("data-show-conf") == 1){
            this.setState({ typingIndicatorStatus: false });
            for (let i = 0; i < resp.length; i++) {
                this.setState({
                    currentMessages: [
                        ...this.state.currentMessages,
                        new ChatGroup(key, "incoming", [
                            new ChatMessage(0,
                                resp[i].substring(0, 300)
                            ),
                            new ChatMessage(1,
                                "Confidence score: ".concat(String(Number((scores[i]).toFixed(2))))
                            ),
                        ]),
                    ]
                })
                key = key + 1
            }
            this.setState({
                currentMessages: [
                    ...this.state.currentMessages,
                    new ChatGroup(key, "incoming", [
                        new ChatMessage(0,
                            "Does this answer your question?"
                        )
                    ]),
                ]
            });
        } else {
            //Display answer in chat component
            this.setState({ typingIndicatorStatus: false });
            for (let i = 0; i < resp.length; i++) {
                this.setState({
                    currentMessages: [
                        ...this.state.currentMessages,
                        new ChatGroup(key, "incoming", [
                            new ChatMessage(0,
                                resp[i].substring(0, 300)
                            ),
                        ]),
                    ]
                })
                key = key + 1
            }
            this.setState({
                currentMessages: [
                    ...this.state.currentMessages,
                    new ChatGroup(key, "incoming", [
                        new ChatMessage(0,
                            "Does this answer your question?"
                        )
                    ]),
                ]
            });
        }
        window.localStorage.setItem("currentMessages", JSON.stringify(this.state.currentMessages))
    }

    saveFunction = () => {
        // get elemnt for saving file
        const element = document.createElement("a");
        // get data from object and use JSON.stringify to convert to text
        const file = new Blob([JSON.stringify(this.state.currentMessages)], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);

        // get current time and date for use in filename
        let currentTime = new Date().toLocaleString();
        ////console.log(currentTime.substring(0, 10))
        //console.log(currentTime.substring(12))

        let timeFormatted = currentTime.substring(0, 10) + "_" + currentTime.substring(12)

        // download file to users local storage
        element.download = "transcipt_" + timeFormatted + ".json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

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
                    var resultWD = res.result.passages
                    var resultST = res.result.session_token

                    const numRes = document.getElementsByClassName("cs-main-container")[0].getAttribute("data-num-results")

                    for(let i = 0; i<numRes; i++){
                        var resultDI = res.result.passages[i].document_id

                        var rtext_in = resultST.concat('^').concat(resultDI)
                        //Relevancy code (Moved to backend i.e. app.js)
                        fetch("/relev?rtext=".concat(rtext_in))
                            .then(res => console.log(res))
                    }

                    const scoreArray = res.result.passages.map((res) => res.passage_score).slice(0, numRes)
                    const resArray = resultWD.map((res) => res.passage_text).slice(0, numRes)

                    //Send results to recieveNextMessage
                    setTimeout(this.receiveNextMessage(resArray, scoreArray), 1000)
                }
            })
            .catch(err => err);
    }

    handleSend(text){
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
        window.localStorage.setItem("currentMessages", JSON.stringify(this.state.currentMessages))
        this.setState({ typingIndicatorStatus: true});
        //console.log(JSON.parse(window.localStorage.getItem("currentMessages")))
    };

    render() {
        return (
            <Stack direction="column" spacing={2} style={{ display: "flex", maxWidth: "500px", minWidth: "300px" }}>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" onClick={() => { this.saveFunction(); }}>Export Current Chat</Button>
                    <input type="file" accept="/*" style={{ display: 'none' }} id="contained-button-file" onChange={(e) => this.getFile(e)} />
                    <label htmlFor="contained-button-file">
                        <Button variant="outlined" component="span" > Load Previous Chat </Button>
                    </label>
                </Stack>
                <SimpleChat
                    currentMessages={this.state.currentMessages}
                    typingIndicatorStatus={this.state.typingIndicatorStatus}
                    handleSend = {this.handleSend}
                />
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

// useEffect(() => {ls
//     window.localStorage.setItem('currentMessages', currentMessages);
// }, [currentMessages]);