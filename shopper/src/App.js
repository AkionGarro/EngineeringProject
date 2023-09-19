import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login";
import PedidoOnline from "./pages/PedidoOnline/PedidoOnline";
import VerPedidosOnline from "./pages/verPedidosOnline/VerPedidoOnline";

function App() {
  return (
    <Router className="App">
      <Routes>
        {/*Acá van las rutas en este estilo:
          <Route path="/" element={<MainPage />}/>
        */}
        <Route path="/" element={<Login />} />
        <Route path="/PedidoOnline" element={<PedidoOnline />} />
        <Route path="/VerPedidosOnline" element={<VerPedidosOnline />} />
      </Routes>
    </Router>
  );
}

export default App;
