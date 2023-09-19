import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import PedidoPersonal from "./Pages/Pedido_personal/pedido_personal";
import VerPedidos from './Pages/Ver_pedidos/ver_pedidos';

function App() {
  return (
    <Router className="App">
      <Routes>
        {/*Acá van las rutas en este estilo:
          <Route path="/" element={<MainPage />}/>
        */}
        <Route path="/" element={<PedidoPersonal />} />
        <Route path="/VerPedidos" element={<VerPedidos />} />
      </Routes>
    </Router>
  );
}

export default App;