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
  const registerDataUser = async (
    fullnameF,
    emailF,
    phoneF,
    identificationF,
    direccion
  ) => {
    const ref = collection(firestore, "users");
    let data = {
      fullName: fullnameF,
      email: emailF,
      phone: phoneF,
      userType: "user",
      identification: identificationF,
      direccionEnvio: direccion,
    };

    try {
      const docRef = await addDoc(ref, data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const userIsRegistered = async (data) => {
    const ref = collection(firestore, "users");
    const q = query(ref, where("email", "==", data.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length === 0) {
      console.log("Usuario se tuvo que registrar.");
      const direccion = {
        address: "empty",
        canton: "empty",
        country: "empty",
        district: "empty",
        email: data.email,
        province: "empty",
      };

      registerDataUser(
        data.displayName,
        data.email,
        "empty",
        "empty",
        direccion
      );
      addAddressToUser(direccion);
      return false;
    } else {
      return true;
    }
  };

  const checkUserIsAdmin = async (email) => {
    const ref = collection(firestore, "users");
    const q = query(ref, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.docs.length === 0) {
      console.log("Usuario no encontrado.");
      return;
    }else{
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(firestore, "users", userDoc.id);
      const userData = await getDoc(userRef);
      const userType = userData.data().userType;
      console.log("User type: ", userType);
      return userType;
    }
    
  };

  const checkCompleteUserInfo = async (email) => {
    const ref = collection(firestore, "users");
    const q = query(ref, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length === 0) {
    
      return false;

    } else {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
  
      
      if (
        userData.phone == "empty" ||
        userData.identification == "empty" ||
        userData.direccionEnvio.country == "empty" ||
        userData.direccionEnvio.province == "empty" ||
        userData.direccionEnvio.canton == "empty" ||
        userData.direccionEnvio.district == "empty" ||
        userData.direccionEnvio.address == "empty"
    
      ) {
        return false;
      } else {
        return true;
      }
    }
  };


  const addAddressToUser = async (data) => {
    const ref = collection(firestore, "users");
    const addressCollection = collection(firestore, "usersAddress");
    const q = query(ref, where("email", "==", data.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length === 0) {
      console.log("Usuario no encontrado.");
      return;
    } else {
      const docRef = await addDoc(addressCollection, data);
      console.log("Document written with ID: ", docRef.id);
    }
  };

  const changeStateOrder = async (orderId, newState) => {
    const db = firestore;
    const collections = ["pedidosTest", "pedidosPersonales", "pedidosOnline"];

    for (const collectionName of collections) {
      const ordersCollectionRef = collection(db, collectionName);

      try {
        const orderRef = doc(ordersCollectionRef, orderId);
        const orderDoc = await getDoc(orderRef);

        if (orderDoc.exists()) {
          const currentData = orderDoc.data();

          // Actualiza el estado de la orden en el documento existente
          const updatedData = { estado: newState };

          try {
            // Actualiza el documento en Firestore
            await updateDoc(orderRef, updatedData);

            console.log(
              `Orden con ID ${orderId} actualizada correctamente en la colección ${collectionName}`
            );
            return true;
          } catch (error) {
            console.error("Error al actualizar la orden:", error);
            return false;
          }
        }
      } catch (error) {
        console.error(
          `Error al buscar la orden en la colección ${collectionName}:`,
          error
        );
      }
    }

    console.log(
      `No se encontró ninguna orden con ID ${orderId} en ninguna de las colecciones`
    );
    return false;
  };

  const getOrder = async (orderId) => {
    let order = null;

    const collections = ["pedidosTest", "pedidosPersonales", "pedidosOnline"];

    for (const collectionName of collections) {
      const db = firestore; // Obtén la instancia de Firestore
      try {
        let orderRef = doc(db, collectionName, orderId); // Utiliza doc() para referenciar un documento específico

        const orderDoc = await getDoc(orderRef);
        // Obtiene la marca de tiempo de creación como un objeto Date

        if (orderDoc.exists()) {
          const timestamp = orderDoc._document.createTime.timestamp;
          const date = new Date(
            timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
          );
          const opcionesDeFormato = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          };
          const fechaFormateada = date.toLocaleDateString(
            "es-ES",
            opcionesDeFormato
          );

          order = {
            id: orderDoc.id,
            fecha: fechaFormateada,
            tabla: collectionName,
            ...orderDoc.data(),
          };
          break; // Si encontramos la orden en una colección, salimos del bucle
        }
      } catch (error) {
        console.error(
          "Error al obtener la orden en la colección " + collectionName + ":",
          error
        );
      }
    }

    if (!order) {
      console.log(
        `No se encontró ninguna orden con ID ${orderId} en ninguna de las colecciones`
      );
    }

    return order;
  };

  const getAdvertenciaMessage = async (docId) => {
    const advertenciaRef = doc(firestore, "advertencia", docId);
  
    try {
      const docSnapshot = await getDoc(advertenciaRef);
  
      if (docSnapshot.exists()) {
        const msgAdvertencia = docSnapshot.data().msgAdvertencia;
        console.log("Mensaje de advertencia:", msgAdvertencia);
        return msgAdvertencia;
      } else {
        console.log("Documento no encontrado en la colección 'advertencia'.");
        return null; // Puedes manejar esto según tus necesidades
      }
    } catch (error) {
      console.error("Error al obtener el mensaje de advertencia:", error);
      return null; // Puedes manejar esto según tus necesidades
    }
  };

  const getAllUsers = async () => {
    try {
      const ref = collection(firestore, "users");
      const snapshot = await getDocs(ref);
      const listUsers = snapshot.docs.map((doc) => doc.data());
      console.log("Usuarios: ", listUsers);
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
  const updateUserMessage = async (docId, msg) => {
    const advertenciaRef = doc(firestore, "advertencia", docId);
  
    try {
      await updateDoc(advertenciaRef, {
        msgAdvertencia: msg,
      });
      console.log("Mensaje de advertencia actualizado con éxito.");
    } catch (error) {
      console.error("Error al actualizar el mensaje de advertencia:", error);
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
      ref = query(ref, where("estado", "==", filtroParametro));
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

  const getAllOrdersWithID = async (filtroParametro, filtroParametro2) => {
    let orders = [];
  
    let collections = null;
    if (filtroParametro2 === "Todos") {
      collections = ["pedidosTest", "pedidosPersonales", "pedidosOnline"];
    } else {
      collections = [filtroParametro2];
    }
    console.log("Filtro 1: ", filtroParametro);
    console.log("Filtro 2: ", collections);
  
    // Realizar una única consulta a la colección "users" para obtener la información de todos los usuarios
    const usersQueryRef = collection(firestore, 'users');
    const usersQuerySnapshot = await getDocs(usersQueryRef);
    const usersData = {};
    usersQuerySnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      console.log("USER DATA: ", userData.email);
      usersData[userData.email] = userData;
    });


  
    for (const collectionName of collections) {
      const collectionRef = collection(firestore, collectionName);
    
      if (filtroParametro !== "Todos") {
        const queryRef = query(
          collectionRef,
          where("estado", "==", filtroParametro)
        );
        const snapshot = await getDocs(queryRef);
        for (const docSnapshot of snapshot.docs) {
          try {
            // Obtener información adicional del usuario desde el objeto usersData
            const userEmail = docSnapshot.data().usuario;
            const userData = usersData[userEmail];
    
            if (userData) {
              // Transformar el campo "direccion" a un string combinado
              const direccionObj = docSnapshot.data().direccion;
              let direccionString = "No disponible";
              //si direccionObj es undefined, no se puede acceder a sus propiedades
              if (direccionObj !== undefined) {
                direccionString = `${direccionObj.address}, ${direccionObj.canton}, ${direccionObj.country}, ${direccionObj.district}, ${direccionObj.province}`;
              }
    
              // Agregar información del usuario al objeto orders
              orders.push({
                id: docSnapshot.id,
                ...docSnapshot.data(),
                fullName: userData.fullName,
                phone: userData.phone,
                direccionString: direccionString,
                tabla: collectionName
                
              });
            } else {
              console.log(`No se encontró información de usuario para la orden con ID ${docSnapshot.id}`);
            }
          } catch (error) {
            console.error("Error al obtener información de usuario:", error);
          }
        }
      } else {
        const snapshot = await getDocs(collectionRef);
        for (const docSnapshot of snapshot.docs) {
          try {
            // Obtener información adicional del usuario desde el objeto usersData
            const userEmail = docSnapshot.data().usuario;
            const userData = usersData[userEmail];
    
            if (userData) {
              // Transformar el campo "direccion" a un string combinado
              const direccionObj = docSnapshot.data().direccion;
              console.log("DIRECCION OBJ: ", direccionObj)
              let direccionString = "No disponible";
              //si direccionObj es undefined, no se puede acceder a sus propiedades
              if (direccionObj !== undefined) {
                direccionString = `${direccionObj.address}, ${direccionObj.canton}, ${direccionObj.country}, ${direccionObj.district}, ${direccionObj.province}`;
              }
    
              orders.push({
                id: docSnapshot.id,
                ...docSnapshot.data(),
                fullName: userData.fullName,
                phone: userData.phone,
                direccionString: direccionString, // Reemplazar ...docSnapshot.data().direccion
                tabla: collectionName
              });
            } else {
              console.log(`No se encontró información de usuario para la orden con ID ${docSnapshot.id}`);
            }
          } catch (error) {
            console.error("Error al obtener información de usuario:", error);
          }
        }
      }
    }
  
    console.log("ORDERS: ", orders);
    return orders;
  };
    


  const deleteOrder = async (orderId, tabla) => {
    const db = firestore; // Obtén la instancia de Firestore
    const ordersCollectionRef = collection(db, tabla); // Referencia a la colección

    try {
      // Busca el documento con el campo personalizado "id" igual a orderId
      const orderDocRef = doc(ordersCollectionRef, orderId);
      const orderDocSnapshot = await getDoc(orderDocRef);

      // Verifica si el documento existe antes de intentar eliminarlo
      if (orderDocSnapshot.exists()) {
        await deleteDoc(orderDocRef);

        return true;
      } else {

        return false;
      }
    } catch (error) {

      return false;
    }
  };


  /*********************************************************
   * Categorias de productos para la Vista de Administrador *
   *********************************************************/

  const getCategoryReference = (category) => {
    const categoryRef = doc(firestore, "productCategories", category.id);

    return categoryRef;
  };

  const getCategoryByID = async (categoryRef) => {
    try {
      let querySnapshot = await getDoc(categoryRef);
      const category = querySnapshot.data();
      category.id = querySnapshot.id;
      return category;
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };

  //Trae los documentos de las categorias de productos
  const getAllCategories = async () => {
    console.log("Get all categories");
    try {
      const ref = collection(firestore, "productCategories");
      const snapshot = await getDocs(ref);
      const listCategories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return listCategories;
    } catch (e) {
      console.log(e);
    }
  };

  //Traer todos los documentos de categorias de productos donde el status sea 1
  const getCategoriesByStatus = async (status) => {
    console.log("Get all categories with Status: ", status);
    try {
      const ref = collection(firestore, "productCategories");
      const q = query(ref, where("status", "==", status));
      const querySnapshot = await getDocs(q);
      const listCategories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return listCategories;
    } catch (e) {
      console.log(e);
    }
  };

  //Elimina una categoria de productos por su id
  //Cambia el estado de la categoria de 1 a 0
  const deactivateCategory = async (id) => {
    console.trace("Try to delete category with id:", id);
    try {
      const categoryRef = doc(firestore, "productCategories", id);
      await updateDoc(categoryRef, {
        status: 0,
      });
    } catch (error) {
      console.error("Error al eliminar la categoria:", error);
    }
  };

  //Activa una categoria de productos por su id
  //Cambia el estado de la categoria de 0 a 1
  const activateCategory = async (id) => {
    console.trace("Delete category");
    try {
      const categoryRef = doc(firestore, "productCategories", id);
      await updateDoc(categoryRef, {
        status: 1,
      });
    } catch (error) {
      console.error("Error al eliminar la categoria:", error);
    }
  };

  //Actualiza los datos de una categoria de productos
  const updateCategoryData = async (data) => {
    console.log("Update category data with:", data);

    const categoryRef = doc(firestore, "productCategories", data.id);

    try {
      await updateDoc(categoryRef, {
        name: data.name,
        description: data.description,
        icon: data.icon,
        backgroundImage: data.backgroundImage,
        personalizedFields: data.personalizedFields,
        status: data.status,
      });
      console.log("Categoria actualizada con éxito.");
    } catch (error) {
      console.error("Error al actualizar la categoria:", error);
    }
  };

  //Agrega una nueva categoria de productos
  const addNewCategory = async (data) => {
    const ref = collection(firestore, "productCategories");
    let categoryData = {
      name: data.name,
      description: data.description,
      icon: data.icon,
      backgroundImage: data.backgroundImage,
      personalizedFields: data.personalizedFields,
      status: data.status,
    };

    try {
      const docRef = await addDoc(ref, categoryData);
      console.log(" New Category Added: Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding Category Document: ", e);
    }
  };

  //Para subir las imagenes de las categorias de productos
  const uploadCategoryImage = async (file, type) => {
    // Listen for state changes, errors, and completion of the upload.

    console.log("Upload category image");
    let storagePath = "";
    let imageUrl = "";
    const storage = getStorage();

    if (type === "icon") {
      storagePath = "productCategories/icons/" + Date.now() + "-" + file.name;
    } else if (type === "backgroundImage") {
      storagePath =
        "productCategories/backgroundImages/" + Date.now() + "-" + file.name;
    } else {
      console.error("Invalid 'type' parameter");
      return null; // Return early or handle the error as needed
    }

    const storageRef = ref(storage, storagePath);
    // const uploadTask = uploadBytes(storageRef, file)
    imageUrl = await uploadBytes(storageRef, file)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((downloadURL) => {
        return downloadURL;
      });

    return imageUrl;
  };

  /****************************************************************
   * FIN de Categorias de productos para la Vista de Administrador *
   ****************************************************************/

  /*********************************************************
   * Productos para la Vista de Administrador               *
   *********************************************************/

  //Trae los documentos de las categorias de productos
  const getAllProducts = async () => {
    console.log("Get all products");
    try {
      const ref = collection(firestore, "products");
      const snapshot = await getDocs(ref);
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Pruducs Fire: ", productList);
      return productList;
    } catch (e) {
      console.log(e);
    }
  };

  //Traer todos los documentos de categorias de productos donde el status sea 1
  const getProductsByStatus = async (status) => {
    console.log("Get all Products with Status: ", status);
    try {
      const ref = collection(firestore, "products");
      const q = query(ref, where("status", "==", status));
      const querySnapshot = await getDocs(q);
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return productList;
    } catch (e) {
      console.log(e);
    }
  };

  const getProductsByCategory = async (category) => {
    try {
      const ref = collection(firestore, "products");
      const q = query(ref, where("categoryName", "==", category));
      const querySnapshot = await getDocs(q);
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return productList;
    } catch (error) {
      console.log(error);
    }
  };

  //Elimina una categoria de productos por su id
  //Cambia el estado de la categoria de 1 a 0
  const deactivateProduct = async (id) => {
    console.trace("Try to delete product with id:", id);
    try {
      const productRef = doc(firestore, "products", id);
      await updateDoc(productRef, {
        status: 0,
      });
    } catch (error) {
      console.error("Error al desactivar el producto:", error);
    }
  };

  //Activa una categoria de productos por su id
  //Cambia el estado de la categoria de 0 a 1
  const activateProduct = async (id) => {
    console.trace("Try to activate product with id:", id);
    try {
      const productRef = doc(firestore, "products", id);
      await updateDoc(productRef, {
        status: 1,
      });
    } catch (error) {
      console.error("Error al eliminar la categoria:", error);
    }
  };

  //Actualiza los datos de una categoria de productos
  const updateProductData = async (data) => {
    console.log("Update product data with:", data);

    const productRef = doc(firestore, "products", data.id);

    try {
      await updateDoc(productRef, {
        name: data.name,
        category: data.category,
        images: data.images,
        price: data.price,
        personalizedFields: data.personalizedFields,
        status: data.status,
        categoryName: data.categoryName,
      });
      console.log("Producto actualizado con éxito.");
    } catch (error) {
      console.error("Error al actualizar el Producto:", error);
    }
  };

  //Agrega una nueva categoria de productos
  const addNewProduct = async (data) => {
    const ref = collection(firestore, "products");
    let productData = {
      name: data.name,
      category: data.category,
      images: data.images,
      price: data.price,
      personalizedFields: data.personalizedFields,
      status: data.status,
      categoryName: data.categoryName,
    };

    try {
      const docRef = await addDoc(ref, productData);
      console.log(" New Product Added: Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding product Document: ", e);
    }
  };

  const uploadProductImages = async (files) => {
    // Listen for state changes, errors, and completion of the upload.

    console.log("Uploading Product Images");
    let storagePath = "";
    let imageUrl = "";
    const storage = getStorage();

    //Upload files
    const promises = files.map(async (file) => {
      storagePath = "products/" + Date.now() + "-" + file.name;
      const storageRef = ref(storage, storagePath);
      // const uploadTask = uploadBytes(storageRef, file)
      imageUrl = await uploadBytes(storageRef, file)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          return downloadURL;
        });
      return imageUrl;
    });

    const urls = await Promise.all(promises);

    return urls;

    //   storagePath = "products/" + Date.now() + "-" + file.name;

    //   const storageRef = ref(storage, storagePath)
    //   // const uploadTask = uploadBytes(storageRef, file)
    //   imageUrl = await uploadBytes(storageRef, file)
    //     .then(snapshot => {
    //       return getDownloadURL(snapshot.ref)
    //     })
    //     .then(downloadURL => {
    //     return downloadURL
    //   })

    // return imageUrl
  };

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
        addAddressToUser,
        userIsRegistered,
        checkCompleteUserInfo,
        checkUserIsAdmin,
        //Categorias de productos para la Vista de Administrador
        getCategoryReference,
        getAllCategories,
        getCategoriesByStatus,
        deactivateCategory,
        activateCategory,
        updateCategoryData,
        addNewCategory,
        uploadCategoryImage,
        getAllOrdersWithID,
        getCategoryByID,
        //Productos para la Vista de Administrador
        getAllProducts,
        getProductsByStatus,
        deactivateProduct,
        activateProduct,
        updateProductData,
        addNewProduct,
        updateUserMessage,
        uploadProductImages,
        getProductsByCategory,
        getAdvertenciaMessage,

      }}
    >
      {children}
    </databaseContext.Provider>
  );
}
