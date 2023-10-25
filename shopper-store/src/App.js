import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { DatabaseProvider } from "./context/DatabaseContext";

import HomeMainComponent from "./Pages/HomePage/HomeMainComponent";
import Cuenta from "./Pages/Account/Account";
import VerPedidosPersonal from "./Pages/PersonalOrdersStore/PersonalOrderStore";
import ProductsPage from "./Pages/Categories/ProductsPage";


function App() {
  
  return (
    <AuthProvider>
      <DatabaseProvider>
        <Router className="App">
          <Routes>
            <Route path="/" element={<HomeMainComponent />} />
            <Route path="/Cuenta" element={<Cuenta />} />
            <Route path="/PedidosPersonal" element={<VerPedidosPersonal />} />
            <Route path="/Products" element={<ProductsPage />} />
          </Routes>
        </Router>
      </DatabaseProvider>
    </AuthProvider>
  );
}

export default App;
