import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { DatabaseProvider } from "./context/DatabaseContext";

import HomeMainComponent from "./Pages/HomePage/HomeMainComponent";
import Cuenta from "./Pages/Account/Account";
import VerPedidosPersonal from "./Pages/PersonalOrdersStore/PersonalOrderStore";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
//import HomePage from "./Pages/HomePage/HomePage";
import ProductsPage from "./Pages/Categories/ProductsPage";
import { GlobalProvider } from "./GlobalContext/GlobalContext";

function App() {
  
  return (
    <AuthProvider>
      <DatabaseProvider>

        <GlobalProvider>
          <Router className="App">
            <Routes>
              <Route path="/" element={<HomeMainComponent />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Login" element={< Login/>} />
              <Route path="/Cuenta" element={<Cuenta />} />
              <Route path="/PedidosPersonal" element={<VerPedidosPersonal />} />
              <Route path="/Products" element={<ProductsPage />} />
            </Routes>
          </Router>
        </GlobalProvider>

        
      </DatabaseProvider>
    </AuthProvider>
  );
}

export default App;
