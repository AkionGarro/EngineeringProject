import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import PedidoOnline from "./Pages/PedidoOnline/PedidoOnline";
import VerPedidosOnline from "./Pages/verPedidosOnline/VerPedidoOnline";

function App() {
  return (
    <Router className="App">
      <Routes>
        {/*Acá van las rutas en este estilo:
          <Route path="/" element={<MainPage />}/>
        */}
        <Route path="/PedidoOnline" element={<PedidoOnline />} />
        <Route path="/VerPedidosOnline" element={<VerPedidosOnline />} />
      </Routes>
    </Router>
  );
}

export default App;
