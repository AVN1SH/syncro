import { configureStore } from "@reduxjs/toolkit";
import createConnectionSlice, { onOpen, onClose, CreateConnection } from "@/features/modelSlice";

export interface RootState {
  createConnectionSlice : CreateConnection;
}

const store = configureStore({
  reducer: {
    createConnectionSlice
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