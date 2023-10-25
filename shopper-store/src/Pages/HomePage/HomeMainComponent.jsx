import React, { Component, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


import Header from "./Header.js"
import Footer from "./Footer.js"

//Imports del HomePage
import Blog from "./HomePage.js"



const HomeMainComponent = () => {
  
  //Este State contiene el Componente que se está renderizando 
  // el cambio se hace en el Header
  const [componentToRender, setComponentToRender] = useState(<Blog goTo={1}/>)
  const auth = useAuth();
  const navigate = useNavigate();

  //Método que se encarga de cambiar el componente a renderizar
  //(se le pasa por props al header)
  const navigatorOptions = (route, tittle) => {
    setComponentToRender(route);
  };

	return (
		<>

    {/* //NavBar de la Pagina. Siempre va a estar presente. */}
    <Header title="NAVBAR" navOptions={navigatorOptions} />


    {/* //Acá es dónde se va a renderizar el componente que se quiere mostrar al usuario */}
    {componentToRender}


    {/* //Footer de la Pagina. Siempre va a estar presente. */}
    <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
			
		</>
	)
}

export default HomeMainComponent
