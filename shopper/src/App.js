import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import PedidoOnline from "./Pages/PedidoOnline/PedidoOnline";

{/* Paginas de Categorias y Productos del Administrador - Josue US08 */}
import AdminCategoriesContainer from "./components/AdminProducts/Containers/AdminCategoriesContainer";
import AdminProductsContainer from "./components/AdminProducts/Containers/AdminProductsContainer";
{/* ---------------------------------------------------------------- */}


function App() {
  return (
    <Router className="App">
      <Routes>
        {/*Acá van las rutas en este estilo:
<Route path="/" element={<MainPage />}/>
*/}
        <Route path="/" element={<Login />} />
        <Route path="/PedidoOnline" element={<PedidoOnline />} />
        <Route path="/PedidoOnline" element={<PedidoOnline />} />
        
        {/* Paginas de Categorias y Productos del Administrador - Josue US08 */}
        //Route for adminCategoriesContainer
        <Route path="/adminCategories" element={<AdminCategoriesContainer />} />
        //Route for adminProductsContainer
        <Route path="/adminProducts" element={<AdminProductsContainer />} />
        {/* ---------------------------------------------------------------- */}


      </Routes>
    </Router>
  );
}

export default App;
