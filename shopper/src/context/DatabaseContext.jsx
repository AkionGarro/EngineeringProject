import React, { createContext, useContext } from "react";
import { firestore } from "../firebase";
import {
  addDoc,
  getDocs,
  collection,
  where,
  query,
  deleteDoc,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

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
  const registerDataUser = async (fullnameF, emailF, phoneF) => {
    const ref = collection(firestore, "users");
    let data = {
      fullName: fullnameF,
      email: emailF,
      phone: phoneF,
      userType: "user",
    };

    try {
      const docRef = await addDoc(ref, data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const changeStateOrder = async (orderId, newState) => {
    const db = firestore;
    const ordersCollectionRef = collection(db, "pedidosTest");
  
    try {
      const querySnapshot = await getDocs(
        query(ordersCollectionRef, where("pedido.id", "==", orderId))
      );
  
      querySnapshot.forEach(async (doc) => {
        const orderRef = doc.ref;
        const currentData = doc.data();
        
        // Actualiza el estado de la orden en la copia local de los datos
        currentData.pedido.estado = newState;
  
        try {
          // Actualiza el documento en Firestore
          await updateDoc(orderRef, currentData);
  
          console.log(`Orden con ID ${orderId} actualizada correctamente`);
        } catch (error) {
          console.error("Error al actualizar la orden:", error);
        }
      });
  
      if (querySnapshot.empty) {
        console.log(`No se encontró ninguna orden con ID ${orderId}`);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error al actualizar la orden:", error);
      return false;
    }
  };  

  const getOrder = async (orderId) => {
    console.log("ORDER ID: ", orderId);
    let order = null;
    let ref = collection(firestore, "pedidosTest");
    let q = query(ref, where("pedido.id", "==", parseInt(orderId)));
    let querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {

      order = doc.data();
    });
    return order;
  };

  const getAllUsers = async () => {
    try {
      const ref = collection(firestore, "users");
      const snapshot = await getDocs(ref);
      const listUsers = snapshot.docs.map((doc) => doc.data());
      return listUsers;
    } catch (e) {
      console.log(e);
    }
  };

  const getUserData = async (email) => {
    const ref = collection(firestore, "users");
    const q = query(ref, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length === 0) {
      console.log("Usuario no encontrado.");
      return;
    }
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(firestore, "users", userDoc.id);
    const userData = await getDoc(userRef);
    return userData.data();
  };

  const updateUserData = async (data) => {
    console.log(data);
    const ref = collection(firestore, "users");
    const q = query(ref, where("email", "==", data.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length === 0) {
      console.log("Usuario no encontrado.");
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = doc(firestore, "users", userDoc.id);

    try {
      await updateDoc(userRef, {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        identification: data.identification,
        address: data.address,
        userType: data.role,
      });
      console.log("Usuario actualizado con éxito.");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const addNewAdmin = async (email) => {
    const ref = collection(firestore, "users");
    const q = query(ref, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length === 0) {
      console.log("Usuario no encontrado.");
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = doc(firestore, "users", userDoc.id);

    try {
      await updateDoc(userRef, {
        userType: "admin",
      });
      console.log("Usuario actualizado a tipo 'admin' con éxito.");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const changeToUser = async (email) => {
    const ref = collection(firestore, "users");
    const q = query(ref, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length === 0) {
      console.log("Usuario no encontrado.");
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = doc(firestore, "users", userDoc.id);

    try {
      await updateDoc(userRef, {
        userType: "user",
      });
      console.log("Admin actualizado a tipo 'user' con éxito.");
    } catch (error) {
      console.error("Error al actualizar el admin:", error);
    }
  };


  const getAllOrders = async (filtroParametro) => {
    let orders = [];
    let ref = collection(firestore, "pedidosTest");

    // Aplicar el filtro solo si el filtroParametro no es nulo
    if (filtroParametro !== "Todos") {
      ref = query(ref, where("pedido.estado", "==", filtroParametro));
    }

    const snapshot = await getDocs(ref);
  
    try {
      snapshot.forEach((doc) => {
        orders.push(doc.data());
      });
    } catch (error) {
      console.log("Error getting documents: ", error);
    }

    return orders;
  };

  const deleteOrder = async (orderId) => {
    const db = firestore; // Obtén la instancia de Firestore
    const ordersCollectionRef = collection(db, "pedidosTest"); // Referencia a la colección

    try {
      // Busca el documento con el campo personalizado "id" igual a orderId
      const querySnapshot = await getDocs(
        query(ordersCollectionRef, where("pedido.id", "==", orderId))
      );

      // Si se encuentra un documento, elimínalo
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
        return true;
      });

      // Si no se encuentra ningún documento con ese ID, muestra un mensaje
      if (querySnapshot.empty) {
        console.log(`No se encontró ninguna orden con ID ${orderId}`);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
      return false;
    }
  };

  return (
    <databaseContext.Provider
      value={{
        registerDataUser,
        getAllOrders,
        deleteOrder,
        getOrder,
        changeStateOrder,
        getAllUsers,
        addNewAdmin,
        changeToUser,
        getUserData,
        updateUserData,
      }}
    >
      {children}
    </databaseContext.Provider>
  );
}
