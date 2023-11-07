import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/HomePage/Footer.jsx"
import Navbar from "../../components/HomePage/NavBar.jsx"
import ResponsiveAppBar from "../../components/Navigation/Navigation.jsx";


//Imports del HomePage
import Blog from "./HomePage.jsx"

//Lo del carrito
import Carrito from "./../../components/CarritoCompras/Carrito"
import { useGlobalContext } from "./../../GlobalContext/GlobalContext.js"


//Componente Principal de la Página
//Acá se renderiza el Navbar, el componente principal y el footer
const HomeMainComponent = () => {

  //Este State contiene el Componente que se está renderizando 
  // el cambio se hace en el Header
  const {componentToRender, setComponentToRender} = useGlobalContext();

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
      <ResponsiveAppBar />
      <Navbar/>

      {/* Carrito de la Pagina */}
      {carritoVisible && <Carrito />}

  

      {/* //Acá es dónde se va a renderizar el componente que se quiere mostrar al usuario */}
      {componentToRender}


      {/* //Footer de la Pagina. Siempre va a estar presente. */}
      <Footer
        title="Footer"
        description="Desarrollado por estudinates del TEC!"
      />
    </>
  )
}

export default HomeMainComponent
