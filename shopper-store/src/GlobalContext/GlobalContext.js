import React, { createContext, useContext, useState } from 'react';
import Blog from '../Pages/HomePage/HomePage';
import ProductsPage from '../Pages/Categories/ProductsPage';


const GlobalContext = createContext();

export function GlobalProvider({ children }) {

  const [componentToRender, setComponentToRender] = useState(<Blog />)
  

  return (
    <GlobalContext.Provider value={{ componentToRender, setComponentToRender }}>
      {children}
    </GlobalContext.Provider>
  );

}

export function useGlobalContext() {
  return useContext(GlobalContext);
}

