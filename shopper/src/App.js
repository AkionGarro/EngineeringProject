import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import PedidoOnline from "./Pages/PedidoOnline/PedidoOnline";
import Login from "./Pages/Login/Login";
import HomePageAdmin from "./Pages/HomePageAdmin/HomePageAdmin";
import { AuthProvider } from "./context/AuthContext";
import { DatabaseProvider } from "./context/DatabaseContext";
import Register from "./Pages/Register/Register";
import Ver_pedido from "./Pages/ver_pedidos/ver_pedidos";
import VerPedidosOnline from "./Pages/VerPedidosOnline/VerPedidosOnline";
import PrivateRoutes from "./context/PrivateRoutes";
function App() {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <Router className="App">
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/HomePageAdmin" element={<HomePageAdmin />} />
              <Route path="/PedidoOnline" element={<PedidoOnline />} />
              <Route path="/Ver_pedido" element={<Ver_pedido />} />
              <Route path="/VerPedidosOnline" element={<VerPedidosOnline />} />
            </Route>
            <Route path="/" element={<Login />} />
            <Route path="/Register" element={<Register />} />
          </Routes>
        </Router>
      </DatabaseProvider>
    </AuthProvider>
  );
}

export default App;
