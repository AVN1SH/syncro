import { configureStore } from "@reduxjs/toolkit";
import createConnectionSlice, { onOpen, onClose, CreateConnection } from "@/features/modelSlice";
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

// export const makeStore = () => {
//   return configureStore({
//     reducer : {
//       createConnectionSlice
//     }
//   })
// }

// export type AppStore = ReturnType<typeof makeStore>;
// export type RootState = ReturnType<AppStore['getState']>
// export type AppDispatch = AppStore['dispatch'];

export default store;