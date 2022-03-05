import {cleanup, render, within, prettyDOM, screen, waitFor, fireEvent} from '@testing-library/react';
import Chat from './chat.jsx';
import userEvent from '@testing-library/user-event'
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("After pressing the submit button", ()=>{
    let chatDom;
    let messageInput;

    const enterInput = ()=>{
        render(<Chat/>);
        chatDom = document.getElementsByClassName("cs-chat-container")[0]
        messageInput = chatDom.querySelector(".cs-message-input__content-editor")

        // type message
        userEvent.click(messageInput)
        userEvent.keyboard("test message")

        //click on send button
        userEvent.click(within(chatDom).getAllByRole("button")[1])
    }

    afterEach(()=>{
        jest.restoreAllMocks();
        cleanup()
    })

    test("handleSend is called", async ()=>{
        const spy = jest.spyOn(Chat.prototype, 'handleSend').mockImplementation(()=>null);
        enterInput()
        await waitFor(() => {
            expect(spy).toHaveBeenCalled();
        });
    });

    test("An outgoing group and message is created", async ()=>{
        jest.spyOn(Chat.prototype, 'callWD').mockImplementation(()=>null);
        enterInput()
        await waitFor(() => {
            expect(chatDom.querySelector(".cs-message-group--outgoing")).toBeTruthy();
            expect(within(chatDom).getByText(/test message/i)).toBeVisible();
        });
    });

    // test("answers are displayed as incoming group and message", async ()=>{
    //     fetch.mockResponseOnce(
    //     fetchMock.mock("/queryWD")
    //     enterInput()
    //     await waitFor(() => {
    //         expect(chatDom.querySelector(".cs-message-group--outgoing")).toBeTruthy();
    //         expect(within(chatDom).getByText(/test message/i)).toBeVisible();
    //     });
    // });
});