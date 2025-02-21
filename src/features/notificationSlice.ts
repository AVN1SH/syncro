import { PlainInboxWithUser } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

export interface Notification {
  newInboxMessages : PlainInboxWithUser[];
}

const initialState : Notification = {
  newInboxMessages : []
}

const createNotificationSlice = createSlice({
  name : "createNotification",
  initialState,
  reducers : {
    setNotification : (state, action) => {
      state.newInboxMessages = action.payload;
    },
    deleteNotification : (state) => {
      state.newInboxMessages = []
    }
  }
});

export const { setNotification, deleteNotification } = createNotificationSlice.actions;
export default createNotificationSlice.reducer;