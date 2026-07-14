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
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MyAccount from "./pages/auth/MyAccount";
import CheckoutPage from "./pages/CheckoutPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import About from "./pages/About";
import Faq from "./pages/Faq";
import ClaimsBook from "./pages/ClaimsBook";
import AdminProtectedRoute from "../src/components/AdminProtectedRoute";


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

      <Route path="/nosotros" element={<About />} />
      <Route path="/preguntas-frecuentes" element={<Faq />} />
      <Route path="/terminos-y-condiciones" element={<Terms />} />
      <Route path="/politica-de-privacidad" element={<Privacy />} />
      <Route path="/politica-de-envios" element={<Shipping />} />
      <Route path="/cambios-y-devoluciones" element={<Returns />} />
      <Route path="/libro-de-reclamaciones" element={<ClaimsBook />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/mi-cuenta" element={<MyAccount />} />

      <Route path="/checkout" element={<CheckoutPage />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
      </Route>
    </Routes>
  );
}

export default App;