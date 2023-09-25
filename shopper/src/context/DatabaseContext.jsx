import React, { createContext, useContext } from "react";
import { firestore } from "../firebase";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  where,
  query,
  doc,
  updateDoc,  
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 



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



  /********************************************************* 
  * Categorias de productos para la Vista de Administrador *
  *********************************************************/

  //Trae los documentos de las categorias de productos
  const getAllCategories = async() =>{
    console.log("Get all categories")
    try{
      const ref = collection(firestore, "productCategories")
      const snapshot = await getDocs(ref)
      const listCategories = snapshot.docs.map(doc => ({id:doc.id, ...doc.data()}))
      return listCategories
    } catch(e){
      console.log(e)
    }
  }

  //Traer todos los documentos de categorias de productos donde el status sea 1 
  const getCategories_Status1= async() =>{
    console.los("Get all categories with Status 1 ");
    try{
      const ref = collection(firestore, "productCategories")
      const q = query(ref, where("status", "==", 1))
      const querySnapshot = await getDocs(q)
      const listCategories = querySnapshot.docs.map(doc => ({id:doc.id, ...doc.data()}))
      return listCategories
    } catch(e){
      console.log(e)
    }
  }

  //Elimina una categoria de productos por su id 
  //Cambia el estado de la categoria de 1 a 0
  const deactivateCategory = async(id) =>{
    console.trace("Try to delete category with id:", id)  
    try {
      const categoryRef = doc(firestore, "productCategories", id)
      await updateDoc(categoryRef, {
        status: 0
      })
      
    } catch (error) {
      console.error("Error al eliminar la categoria:", error)
    }
  }

  //Activa una categoria de productos por su id 
  //Cambia el estado de la categoria de 0 a 1
  const activateCategory = async(id) =>{
    console.trace("Delete category")
    try {
      const categoryRef = doc(firestore, "productCategories", id)
      await updateDoc(categoryRef, {
        status: 1
      })
      
    } catch (error) {
      console.error("Error al eliminar la categoria:", error)
    }
  }

  //Actualiza los datos de una categoria de productos
  const updateCategoryData = async (data) => {
    console.log("Update category data with:", data)
    // const ref = collection(firestore, "productCategories")
    // const q = query(ref, where("id", "==", data.id))
    // const querySnapshot = await getDocs(q);

    // if (querySnapshot.docs.length === 0) {
    //   console.log("Categoria no encontrada.")
    //   return;
    // }

    // const categoryDoc = querySnapshot.docs[0]
    const categoryRef = doc(firestore, "productCategories", data.id)

    try {
      await updateDoc(categoryRef, {
        name: data.name,
        description: data.description,
        icon: data.icon,
        backgroundImage: data.backgroundImage,
        personalizedFields: data.personalizedFields,
        status: data.status,
      });
      console.log("Categoria actualizada con éxito.")
    } catch (error) {
      console.error("Error al actualizar la categoria:", error)
    }
  }

  //Agrega una nueva categoria de productos
  const addNewCategory = async (data) => {
    const ref = collection(firestore, "productCategories")
    let categoryData = {
      name: data.name,
      description: data.description,
      icon: data.icon,
      backgroundImage: data.backgroundImage,
      personalizedFields: data.personalizedFields,
      status: data.status,
    };
    
    try {
      const docRef = await addDoc(ref, categoryData)
      console.log(" New Category Added: Document written with ID: ", docRef.id)
    } catch (e) {
      console.error("Error adding Category Document: ", e)
    }
  }

  //Para subir las imagenes de las categorias de productos
  const uploadCategoryImage = async(file, type) => {
    
    // Listen for state changes, errors, and completion of the upload.

      console.log("Upload category image")
      let storagePath = ""
      let imageUrl = ""
      const storage = getStorage()

      if (type === "icon") {
        storagePath = "productCategories/icons/" + file.name;
      } else if (type === "backgroundImage") {
        storagePath = "productCategories/backgroundImages/" + file.name;
      } else {
        console.error("Invalid 'type' parameter");
        return null; // Return early or handle the error as needed
      }

      const storageRef = ref(storage, storagePath)
      // const uploadTask = uploadBytes(storageRef, file)
      imageUrl = await uploadBytes(storageRef, file)
        .then(snapshot => {
          return getDownloadURL(snapshot.ref)
        })
        .then(downloadURL => {
        return downloadURL
      })

    return(imageUrl)

  }


  /**************************************************************** 
  * FIN de Categorias de productos para la Vista de Administrador *
  ****************************************************************/
  return (
    <databaseContext.Provider
      value={{
        registerDataUser,
        getAllUsers,
        addNewAdmin,
        changeToUser,
        getUserData,
        updateUserData,
        //Categorias de productos para la Vista de Administrador
        getAllCategories,
        getCategories_Status1,
        deactivateCategory,
        activateCategory,
        updateCategoryData,
        addNewCategory,
        uploadCategoryImage
      }}
    >
      {children}
    </databaseContext.Provider>
  );
}
