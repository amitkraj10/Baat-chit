// aiChatSlice.js
import { createSlice } from "@reduxjs/toolkit"

const aiChatSlice = createSlice({
  name: "aiChat",
  initialState: {
    isAIChat: false,
    aiMessages: [],
  },
  reducers: {
    selectAIChat: (state) => {
      state.isAIChat = true; // ✅ updates properly
    },
    deSelectAIChat: (state) => {
      state.isAIChat = false; // ✅ updates properly
    },
    addAIMessage: (state, action) => {
      state.aiMessages.push(action.payload)
    },
    clearAIChat: (state) => {
      state.isAIChat = false     // reset AI chat flag
      state.aiMessages = []        // clear messages array
    },
  },
})

export const { selectAIChat, deSelectAIChat, addAIMessage, clearAIChat} = aiChatSlice.actions
export default aiChatSlice.reducer
