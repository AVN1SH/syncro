"use client" 
import { useRef } from "react";
import { Provider } from "react-redux";
// import { makeStore, AppStore } from "@/store/store";
import store from "@/store/store";

const StoreProvider = ({ children } : { children: React.ReactNode }) => {

  // const storeRef = useRef<AppStore>();
  // if(!storeRef.current) {
  //   storeRef.current = makeStore();
  // }

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

export default StoreProvider;