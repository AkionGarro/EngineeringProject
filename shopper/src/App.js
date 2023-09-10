import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import PedidoOnline from "./Pages/PedidoOnline/PedidoOnline";

function App() {
  return (
    <Router className="App">
      <Routes>
        {/*Acá van las rutas en este estilo:
<Route path="/" element={<MainPage />}/>
*/}
        <Route path="/" element={<Login />} />
        <Route path="/PedidoOnline" element={<PedidoOnline />} />
      </Routes>
    </Router>
  );
}

export default App;