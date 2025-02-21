import { createSlice } from "@reduxjs/toolkit";

export interface ChatNav {
  activeName : string;
}

const initialState : ChatNav = {
  activeName : "online"
}

const createChatNavSlice = createSlice({
  name : "createChatNav",
  initialState,
  reducers : {
    onChange : (state, action) => {
      state.activeName = action.payload;
    },
    onReset : (state) => {
      state.activeName = "online"
    }
  }
});

export const { onChange, onReset } = createChatNavSlice.actions;
export default createChatNavSlice.reducer;