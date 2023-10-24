import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { DatabaseProvider } from "./context/DatabaseContext";

import HomePage from "./Pages/HomePage/HomePage";
import Cuenta from "./Pages/Account/Account";
import VerPedidosPersonal from "./Pages/PersonalOrdersStore/PersonalOrderStore";

function App() {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <Router className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Cuenta" element={<Cuenta />} />
            <Route path="/PedidosPersonal" element={<VerPedidosPersonal />} />
          </Routes>
        </Router>
      </DatabaseProvider>
    </AuthProvider>
  );
}

export default App;
