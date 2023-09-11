import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login";
import PedidoOnline from "./pages/PedidoOnline/PedidoOnline";
import PedidoPersonal from "./pages/pedido_personal/perdido_personal";
import VerPedidos from "./pages/ver_pedidos/ver_pedidos";

function App() {
  return (
    <Router className="App">
      <Routes>
        {/*Acá van las rutas en este estilo:
          <Route path="/" element={<MainPage />}/>
        */}
        <Route path="/" element={<Login />} />
        <Route path="/PedidoOnline" element={<PedidoOnline />} />
        <Route path="/PedidoPersonal" element={<PedidoPersonal />} />
        <Route path="/VerPedidos" element={<VerPedidos />} />
      </Routes>
    </Router>
  );
}

export default App;