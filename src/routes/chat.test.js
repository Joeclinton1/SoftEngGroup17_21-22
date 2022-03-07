import {cleanup, render, within, prettyDOM, screen, waitFor, fireEvent} from '@testing-library/react';
import Chat from './chat.jsx';
import userEvent from '@testing-library/user-event'
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("After pressing the submit button", ()=>{
    let chatDom;
    let messageInput;
    let sendSpy;
    let callWDSpy;

    jest.spyOn(Object.getPrototypeOf(localStorage), "getItem");
    jest.spyOn(Object.getPrototypeOf(localStorage), "setItem");

    beforeEach(()=>{
        //mock timeouts
        jest.useFakeTimers();

        //mock call to api
        fetch.resetMocks()
        fetch.mockResponseOnce(JSON.stringify({result: {
            passages:[{passage_text:"test result", passage_score: 0.123, document_id: "636ff4045f78006df87ef7cd7f12572c"}],
            results:[{extracted_metadata:{filename: 'Data sheet.pdf'}}],
            matching_results: 1,
            session_token: ""
        }}))
        .mockResponseOnce(0)

        render(<Chat/>);
        chatDom = document.getElementsByClassName("cs-chat-container")[0]
        messageInput = chatDom.querySelector(".cs-message-input__content-editor")
    
        // type message
        userEvent.click(messageInput)
        userEvent.keyboard("test message")
    
        //click on send button
        userEvent.click(within(chatDom).getAllByRole("button")[1])
    })

    afterEach(() => {
        jest.useRealTimers()
    })
   
    describe("the outgoing", ()=>{
        test("group has been created", async ()=>{
            await waitFor(() => {
                expect(chatDom.querySelector(".cs-message-group--outgoing")).toBeVisible();
            })
        })

        test("message has been created", async ()=>{
            await waitFor(() => {
                expect(within(chatDom).getByText(/test message/i)).toBeVisible();
            })
        })
    });

    describe("the response answer", ()=>{
        test("contains a link", async ()=>{
            await waitFor(() => {
                const result = within(chatDom).getByText(/test result/i);
                expect(result.querySelector("a")).toBeTruthy()
                expect(result.querySelector("a").getAttribute("href")).toEqual("https://www.ibm.com/downloads/cas/1OLRGDBA?") 
            });
        });

        test("is created and visible", async ()=>{
            await waitFor(() => {
                expect(within(chatDom).getByText(/test result/i)).toBeVisible();
            });
        });
    });
});