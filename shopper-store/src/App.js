import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { DatabaseProvider } from "./context/DatabaseContext";

import HomeMainComponent from "./Pages/HomePage/HomeMainComponent";
import Cuenta from "./Pages/Account/Account";
import VerPedidosPersonal from "./Pages/PersonalOrdersStore/PersonalOrderStore";
import CategoriesPage from "./Pages/Categories/CategoriesPage";


function App() {
  
  return (
    <AuthProvider>
      <DatabaseProvider>
        <Router className="App">
          <Routes>
            <Route path="/" element={<HomeMainComponent />} />
            <Route path="/Cuenta" element={<Cuenta />} />
            <Route path="/PedidosPersonal" element={<VerPedidosPersonal />} />
            <Route path="/Categorias" element={<CategoriesPage />} />
          </Routes>
        </Router>
      </DatabaseProvider>
    </AuthProvider>
  );
}

export default App;
