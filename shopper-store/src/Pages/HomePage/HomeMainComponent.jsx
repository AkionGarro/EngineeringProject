import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header.js"
import Footer from "./Footer.js"


//Imports del HomePage
import Blog from "./HomePage.js"

//Lo del carrito
import Carrito from "./../../components/CarritoCompras/Carrito"
import { useGlobalContext } from "./../../GlobalContext/GlobalContext.js"


//Componente Principal de la Página
//Acá se renderiza el Navbar, el componente principal y el footer
const HomeMainComponent = () => {

  //Este State contiene el Componente que se está renderizando 
  // el cambio se hace en el Header
  const {componentToRender, setComponentToRender} = useGlobalContext();
  console.log(componentToRender)



  const auth = useAuth();
  const navigate = useNavigate();

  //Método que se encarga de cambiar el componente a renderizar
  //(se le pasa por props al header)
  const navigatorOptions = (route, tittle) => {
    setComponentToRender(route);
  };


  //Carrito de compras 

  const [carritoVisible, setCarritoVisible] = useState(false);

  const toggleCarrito = () => {
    setCarritoVisible(!carritoVisible);
  };

  const cantidadEnCarrito = 6;

  return (
    <>
      {/* //NavBar de la Pagina. Siempre va a estar presente. */}
      <Header title="NAVBAR" onClickCarrito={toggleCarrito}/>


      {/* Carrito de la Pagina */}
      {carritoVisible && <Carrito />}

  

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
