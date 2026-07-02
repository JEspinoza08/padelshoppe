import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Palas from "./pages/Palas";
import Zapatillas from "./pages/Zapatillas";
import Accesorios from "./pages/Accesorios";
import Ropa from "./pages/Ropa";
import Ofertas from "./pages/Ofertas";
import Marcas from "./pages/Marcas";
import Contacto from "./pages/Contacto";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/palas" element={<Palas />} />
      <Route path="/zapatillas" element={<Zapatillas />} />
      <Route path="/accesorios" element={<Accesorios />} />
      <Route path="/ropa" element={<Ropa />} />
      <Route path="/ofertas" element={<Ofertas />} />
      <Route path="/marcas" element={<Marcas />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;