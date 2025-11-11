import { useState, useEffect } from "react";
import "./Carrusel.css";
import Elementos from "./Elementos.json";

interface Producto {
  id: number;
  img: string;
  precio: string;
}

const productosData: Producto[] = Elementos;

function Carrusel() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina, setProductosPorPagina] = useState(6); // 🖥️ por defecto 6

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setProductosPorPagina(4); // 📱 móvil
      } else {
        setProductosPorPagina(6); // 🖥️ desktop
      }
    };

    handleResize(); // ejecutar al inicio
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPaginas = Math.ceil(productosData.length / productosPorPagina);

  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = productosData.slice(inicio, fin);

  const siguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const anterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  return (
    <div className="carrusel">
      <button
        className={`flecha izquierda ${
          paginaActual === 1 ? "desactivada" : ""
        }`}
        onClick={anterior}
        disabled={paginaActual === 1}
      ></button>

      <div className="carrusel-contenido">
        {productosPagina.map((producto) => (
          <button key={producto.id} className="card">
            <img
              src={producto.img}
              alt={`Producto ${producto.id}`}
              className="card-img"
            />
            <h4 className="card-precio">{producto.precio}</h4>
          </button>
        ))}
      </div>

      <button
        className={`flecha derecha ${
          paginaActual === totalPaginas ? "desactivada" : ""
        }`}
        onClick={siguiente}
        disabled={paginaActual === totalPaginas}
      ></button>

      <div className="paginacion">
        {paginaActual} / {totalPaginas}
      </div>
    </div>
  );
}

export default Carrusel;
