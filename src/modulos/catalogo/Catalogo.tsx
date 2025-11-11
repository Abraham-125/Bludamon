import "./Catalogo.css";
import logo from "../../assets/logo.png";
import Carrusel from "./componentes/Carrusel";
function Catalogo() {
  return (
    <>
      <div className="catalogo-container">
        <div className="row navbar-container">
          <div className="bloque-1">
            <a href="">
              <img src={logo} className="logo" alt="logo bludamon" />
            </a>

            <button className="boton-carrito">Carrito</button>
          </div>
        </div>
        <div className="row menu-container">
          <div className="bloque-2 col-12 col-sm-2 ">
            <button className="menu-boton">Poleras</button>
            <button className="menu-boton boton-desactivado">Polerones</button>
            <button className="menu-boton boton-desactivado">Visor</button>
          </div>
          <div className="bloque-3 col-12 col-sm-10 ">
            <Carrusel />
          </div>
        </div>
      </div>
    </>
  );
}

export default Catalogo;
