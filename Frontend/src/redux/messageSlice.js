import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: "message",
    initialState: {
        messages: null,
    },
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        replaceMessage: (state, action) => {
            const { tempId, newMessage } = action.payload;
            const index = state.messages.findIndex(m => m._id === tempId);

            if (index !== -1) {
                state.messages[index] = {
                    ...state.messages[index], // keep blob image
                    ...newMessage,
                    realImageLoaded: false,        // 👈 new flag
                    isTemp: false,
                };
            }
        }

    }
})

export const { setMessages, addMessage, replaceMessage } = messageSlice.actions

export default messageSlice.reducer