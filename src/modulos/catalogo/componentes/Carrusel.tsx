import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [productosPorPagina, setProductosPorPagina] = useState(6);
  const [direccion, setDireccion] = useState<"next" | "prev">("next");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setProductosPorPagina(4);
      } else {
        setProductosPorPagina(6);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPaginas = Math.ceil(productosData.length / productosPorPagina);

  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = productosData.slice(inicio, fin);

  const siguiente = () => {
    if (paginaActual < totalPaginas) {
      setDireccion("next");
      setPaginaActual(paginaActual + 1);
    }
  };

  const anterior = () => {
    if (paginaActual > 1) {
      setDireccion("prev");
      setPaginaActual(paginaActual - 1);
    }
  };

  const variants = {
    enter: (direction: "next" | "prev") => ({
      x: direction === "next" ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
    exit: (direction: "next" | "prev") => ({
      x: direction === "next" ? -100 : 100,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    }),
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
        <AnimatePresence mode="wait" custom={direccion}>
          <motion.div
            key={paginaActual}
            custom={direccion}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid-cards"
          >
            {productosPagina.map((producto) => (
              <motion.button
                key={producto.id}
                className="card"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={producto.img}
                  alt={`Producto ${producto.id}`}
                  className="card-img"
                />
                <h4 className="card-precio">{producto.precio}</h4>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
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
