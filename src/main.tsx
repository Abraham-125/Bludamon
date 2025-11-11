import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Catalogo from "./modulos/catalogo/Catalogo.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Catalogo />
  </StrictMode>
);
