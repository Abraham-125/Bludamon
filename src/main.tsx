import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Catalogo from "./modulos/catalogo/Catalogo.tsx";
import Pago from "./modulos/pago/pago.tsx";

import { CartProvider } from "./modulos/catalogo/componentes/CartContext.tsx";
// 👆 IMPORTA BIEN EL PROVIDER — ESTE PATH DEBE SER EXACTO

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/Bludamon">
      <CartProvider>
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/pago" element={<Pago />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);
