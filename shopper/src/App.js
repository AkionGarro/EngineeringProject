import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import PedidoOnline from "./Pages/PedidoOnline/PedidoOnline";
import Login from "./Pages/Login/Login";
import HomePageAdmin from "./Pages/HomePageAdmin/HomePageAdmin";

/* Paginas de Categorias y Productos del Administrador - Josue US08 */
import AdminCategoriesContainer from "./components/AdminProducts/Containers/AdminCategoriesContainer";
import AdminProductsContainer from "./components/AdminProducts/Containers/AdminProductsContainer";
/* ---------------------------------------------------------------- */


function App() {
  return (
      <Router className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/HomePageAdmin" element={<HomePageAdmin />} />
          <Route path="/PedidoOnline" element={<PedidoOnline />} />

          {/* Paginas de Categorias y Productos del Administrador - Josue US08 */}
          <Route path="/adminCategories" element={<AdminCategoriesContainer />} />
          <Route path="/adminProducts" element={<AdminProductsContainer />} />
          {/* ---------------------------------------------------------------- */}

        </Routes>
      </Router>
  );
}

export default App;
