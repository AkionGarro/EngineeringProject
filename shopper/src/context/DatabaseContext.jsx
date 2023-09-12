import React, { useState, useEffect, createContext, useContext } from "react";
import { firestore } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

/* Creating a context object. */
export const databaseContext = createContext();

/**
 * UseAuth() is a function that returns the context object that was created by the useContext() hook.
 */
export const useFirebase = () => {
  const context = useContext(databaseContext);
  if (!context) {
    console.log("error creating auth context");
  }
  return context;
};

export function DatabaseProvider({ children }) {

  const registerDataUser = async (fullnameF,emailF,passwordF,phoneF) => {
    const ref = collection(firestore, "users");
    let data = {
      fullName: fullnameF,
      email: emailF,
      password: passwordF,
      phone: phoneF,
    };

    try {
      const docRef = await addDoc(ref, data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <databaseContext.Provider
      value={{
        registerDataUser,
      }}
    >
      {children}
    </databaseContext.Provider>
  );
}
