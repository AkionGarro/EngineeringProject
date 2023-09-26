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



  /********************************************************* 
  * Categorias de productos para la Vista de Administrador *
  *********************************************************/


  const getCategoryByID = async (categoryRef) => {
    try {
      
      let querySnapshot = await getDoc(categoryRef)
      const category = querySnapshot.data()
      return category;
    } catch (error) {
      console.log("Error getting documents: ", error)
    }
  };

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
        storagePath = "productCategories/icons/" + Date.now() + "-" + file.name;
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

    return imageUrl
  }

  /**************************************************************** 
  * FIN de Categorias de productos para la Vista de Administrador *
  ****************************************************************/


  /********************************************************* 
  * Productos para la Vista de Administrador               *
  *********************************************************/

    //Trae los documentos de las categorias de productos
    const getAllProducts = async() =>{
      console.log("Get all products")
      try{
        const ref = collection(firestore, "products")
        const snapshot = await getDocs(ref)
        const productList = snapshot.docs.map(doc => ({id:doc.id, ...doc.data()}))
        return productList
      } catch(e){
        console.log(e)
      }
    }
  
    //Traer todos los documentos de categorias de productos donde el status sea 1 
    const getProducts_Status1= async() =>{
      console.los("Get all Products with Status 1 ");
      try{
        const ref = collection(firestore, "products")
        const q = query(ref, where("status", "==", 1))
        const querySnapshot = await getDocs(q)
        const productList = querySnapshot.docs.map(doc => ({id:doc.id, ...doc.data()}))
        return productList
      } catch(e){
        console.log(e)
      }
    }
  
    //Elimina una categoria de productos por su id 
    //Cambia el estado de la categoria de 1 a 0
    const deactivateProduct = async(id) =>{
      console.trace("Try to delete product with id:", id)  
      try {
        const productRef = doc(firestore, "products", id)
        await updateDoc(productRef, {
          status: 0
        })
        
      } catch (error) {
        console.error("Error al desactivar el producto:", error)
      }
    }
  
    //Activa una categoria de productos por su id 
    //Cambia el estado de la categoria de 0 a 1
    const activateProduct = async(id) =>{
      console.trace("Try to activate product with id:", id)  
      try {
        const productRef = doc(firestore, "products", id)
        await updateDoc(productRef, {
          status: 1
        })
        
      } catch (error) {
        console.error("Error al eliminar la categoria:", error)
      }
    }
  
    //Actualiza los datos de una categoria de productos
    const updateProductData = async (data) => {
      console.log("Update product data with:", data)
    
      const productRef = doc(firestore, "products", data.id)
  
      try {
        await updateDoc(productRef, {
          name: data.name,
          category: data.category,
          images: data.images,
          price: data.price,
          personalizedFields: data.personalizedFields,
          status: data.status
        });
        console.log("Producto actualizado con éxito.")
      } catch (error) {
        console.error("Error al actualizar el Producto:", error)
      }
    }
  
    //Agrega una nueva categoria de productos
    const addNewProduct = async (data) => {
      const ref = collection(firestore, "products")
      let productData = {
        name: data.name,
        category: data.category,
        images: data.images,
        price: data.price,
        personalizedFields: data.personalizedFields,
        status: data.status
      };
      
      try {
        const docRef = await addDoc(ref, productData)
        console.log(" New Product Added: Document written with ID: ", docRef.id)
      } catch (e) {
        console.error("Error adding product Document: ", e)
      }
    }

  /**************************************************************** 
  * FIN de Productos para la Vista de Administrador *
  ****************************************************************/


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
        //Categorias de productos para la Vista de Administrador
        getAllCategories,
        getCategories_Status1,
        deactivateCategory,
        activateCategory,
        updateCategoryData,
        addNewCategory,
        uploadCategoryImage,
        getCategoryByID,
        //Productos para la Vista de Administrador
        getAllProducts,
        getProducts_Status1,
        deactivateProduct,
        activateProduct,
        updateProductData,
        addNewProduct
      }}
    >
      {children}
    </databaseContext.Provider>
  );
}
