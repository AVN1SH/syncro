"use client"
import React from 'react'
import { createContext, useContext, useState } from 'react';

const ActivateButtonContext = createContext<{ active: string; setActive: React.Dispatch<React.SetStateAction<string>> }>({ active: '', setActive: () => {} });

export const Navigate = ({ children } : {children : React.ReactNode}) => {
  const [active, setActive] = useState("online");
  return (
    <ActivateButtonContext.Provider value={{ active, setActive}}>
      {children}
    </ActivateButtonContext.Provider>
  )
}

export const useActive = () => useContext(ActivateButtonContext);