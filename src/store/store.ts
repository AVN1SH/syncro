import { configureStore } from "@reduxjs/toolkit";
import createConnectionSlice, { CreateConnection } from "@/features/modelSlice";
import createChatNavSlice, { ChatNav } from "@/features/chatNavigateSlice";
import createNotificationSlice from "@/features/notificationSlice"

export interface RootState {
  createConnectionSlice : CreateConnection;
  createChatNavSlice : ChatNav;
}

const store = configureStore({
  reducer: {
    createConnectionSlice,
    createChatNavSlice,
    createNotificationSlice
  }
})

export default store;