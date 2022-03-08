import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SimpleChat from "../components/SimpleChat"
import links from '../data/links.json'

window.localStorage.setItem('messages', []);
class ChatGroup {
    constructor(direction, messages) {
        this.direction = direction;
        this.messages = messages;
    }
}

const INCOMING = 0
const OUTGOING = 1
class Chat extends Component {
    constructor(props) {
        super(props);
        var text = ''

        if (!!(window.localStorage.getItem("messages"))) {
            text = JSON.parse(window.localStorage.getItem("messages"));
        }

        this.cookies = this.props.cookies
        this.state = {
            messages: text || [new ChatGroup(INCOMING, [
                "Hello, thank you for using IBM's chatbot assistance tool.",
                "What would you like to know about IBM Cloud for Financial Services?"
            ])],
            typingIndicatorStatus: false,
        }

        window.addEventListener('storage', (e) => this.storageChanged(e));

        this.storageChanged = this.storageChanged.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.lastDirection = INCOMING
    }

    //append messages to messages state
    appendMessages(direction, messageList) {
        const messages = this.state.messages
        const lastGroup = messages[this.state.messages.length - 1];
        if (lastGroup.direction === direction) {
            lastGroup.messages.push(...messageList)
        } else {
            messages.push(
                new ChatGroup(direction, messageList)
            )
        }
        this.setState({
            messages: messages
        });

        this.lastDirection = direction
    }

    toggleTypingIndicator() {
        if (this.state.typingIndicatorStatus === true) {
            this.setState({ typingIndicatorStatus: false });
        } else {
            this.setState({ typingIndicatorStatus: true });
        }
    }

    handleReceive = (resp, scores) => {
        this.toggleTypingIndicator()

        if (resp === "empty") {
            this.appendMessages(INCOMING, ["I'm sorry, I couldn't understand. Could you please rephrase the question?"])
        } else {
            const showConf = document.getElementsByClassName("cs-main-container")[0].getAttribute("data-show-conf") === '1'
            this.appendMessages(INCOMING, resp.map((msg, i) =>
                [
                    msg.substring(0, 1000),
                    ...showConf ? [`Confidence score: ${scores[i].toFixed(2)}`] : [],
                    
                ]
            ).flat().concat("Does this answer your question?"));
        }
        window.localStorage.setItem("messages", JSON.stringify(this.state.messages))
    }

    handleSend(text) {
        const lastReceivedQuestion = this.lastDirection === INCOMING && this.state.messages.length >= 2
        this.appendMessages(OUTGOING, [text])

        if (lastReceivedQuestion && (text.includes("yes") || text.includes("no"))) {
            this.appendMessages([text.includes("yes") ?
                "Happy to have helped. Have a good day!" :
                "I'm sorry that my response did not answer your question. Please try rephrasing your question or including more keywords and ask again."
            ])
        } else {
            this.toggleTypingIndicator()
            this.callWD(text)
        }

        window.localStorage.setItem("messages", JSON.stringify(this.state.messages))
        //console.log(JSON.parse(window.localStorage.getItem("messages")))
    };

    //Get request to send query
    callWD(text) {
        fetch("/queryWD?qtext=".concat(text))
            .then(res => res.json())
            .then(res => {
                // If Watson returns no results
                // Need to be able to handle when Watson returns a JSON with different structure then usual (e.g. response to query: Who are you)
                if (res.result.matching_results === 0) {
                    setTimeout(this.handleReceive('empty'), 1000)
                } else {
                    var resultWD = res.result.passages
                    // var resultST = res.result.session_token

                    const numRes = document.getElementsByClassName("cs-main-container")[0].getAttribute("data-num-results")

                    // for(let i = 0; i<numRes; i++){
                    //     var resultDI = res.result.passages[i].document_id

                    //     var rtext_in = resultST.concat('^').concat(resultDI)
                    //     //Relevancy code (Moved to backend i.e. app.js)
                    //     // fetch("/relev?rtext=".concat(rtext_in))
                    //     //     .then(res => console.log(res))
                    // }

                    const scoreArray = res.result.passages.map((res) => res.passage_score).slice(0, numRes)
                    const resArray = resultWD.map((res) => {
                        return res.passage_text
                    }).slice(0, numRes)

                    const responses = []
                    for (let i = 0; i < numRes; i++) {
                        var doc = res.result.passages[i].document_id
                        var doc_id = doc.slice(0, 32)//parent document IDs are always 32 characters long
                        var link = links[doc_id].url
                        responses.push(`${resArray[i]}\n <a href='${link}'>Link to document</a>`)
                    }
                    //Send results to recieveNextMessage
                    setTimeout(this.handleReceive(responses, scoreArray), 1000)
                }
            })
            .catch(err => err);
    }

    //run if Storage changes
    storageChanged(e) {
        if (e.key === 'messages') {
            this.setState({ messages: e.newValue })
        }
    }

    getFile = async (e) => {
        e.preventDefault()
        const reader = new FileReader()

        reader.onload = async (e) => {
            const text = (e.target.result)
            this.setState({ messages: JSON.parse(text) })
        };
        reader.readAsText(e.target.files[0])
    }

    saveFunction = () => {
        // get elemnt for saving file
        const element = document.createElement("a");
        // get data from object and use JSON.stringify to convert to text
        const file = new Blob([JSON.stringify(this.state.messages)], { type: 'text/plain' });
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
                    messages={this.state.messages}
                    typingIndicatorStatus={this.state.typingIndicatorStatus}
                    handleSend={this.handleSend}
                />
            </Stack>
        )
    }
}
export default Chat;