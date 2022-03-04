import {cleanup, render, within, prettyDOM, screen, waitFor, fireEvent} from '@testing-library/react';
import Chat from './chat.jsx';
import userEvent from '@testing-library/user-event'

describe("After pressing the submit button", ()=>{
    test("An outgoing group and message is created", async ()=>{
        render(<Chat/>);
        const chat = document.getElementsByClassName("cs-chat-container")[0]
        const messageInput = chat.querySelector(".cs-message-input__content-editor")

        // type message
        userEvent.click(messageInput)
        userEvent.keyboard("test message")

        //click on send button
        userEvent.click(within(chat).getAllByRole("button")[1])

        await waitFor(() => {
            expect(chat.querySelector(".cs-message-group--outgoing")).toBeTruthy();
            expect(within(chat).getByText(/test message/i)).toBeVisible();
        });

        screen.debug()
    });
});