import React, { createContext, useContext, useState } from 'react';
import Blog from '../Pages/HomePage/HomePage';


const GlobalContext = createContext();

export function GlobalProvider({ children }) {

  const [componentToRender, setComponentToRender] = useState(<Blog goTo={1} />)
  

  return (
    <GlobalContext.Provider value={{ componentToRender, setComponentToRender }}>
      {children}
    </GlobalContext.Provider>
  );

}

export function useGlobalContext() {
  return useContext(GlobalContext);
}

