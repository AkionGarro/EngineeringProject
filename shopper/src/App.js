import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import PedidoOnline from "./Pages/PedidoOnline/PedidoOnline";
import Login from "./Pages/Login/Login";
import HomePageAdmin from "./Pages/HomePageAdmin/HomePageAdmin";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <AuthProvider>
      <Router className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/HomePageAdmin" element={<HomePageAdmin />} />
          <Route path="/PedidoOnline" element={<PedidoOnline />} />
        </Routes>
      </Router>
      </AuthProvider>
  );
}

export default App;
