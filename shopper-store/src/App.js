import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { DatabaseProvider } from "./context/DatabaseContext";

import HomeMainComponent from "./Pages/HomePage/HomeMainComponent";
import Login from "./Pages/Login/Login";
import { GlobalProvider } from "./GlobalContext/GlobalContext";

function App() {
  
  return (
    <AuthProvider>
      <DatabaseProvider>

        <GlobalProvider>
          <Router className="App">
            <Routes>
              <Route path="/" element={<HomeMainComponent />} />
              <Route path="/Login" element={< Login/>} />
            </Routes>
          </Router>
        </GlobalProvider>

        
      </DatabaseProvider>
    </AuthProvider>
  );
}

export default App;
