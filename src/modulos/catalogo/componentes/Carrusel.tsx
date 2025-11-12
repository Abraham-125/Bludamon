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
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    // Después del primer render, marcamos como "ya montado"
    setIsFirstRender(false);
  }, []);

  useEffect(() => {
    // 🚫 Bloquear click derecho (desktop)
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // 🚫 Bloquear selección y "mantener presionado" (mobile)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault(); // evita zoom con dos dedos
      }
    };

    const handleGestureStart = (e: Event) => e.preventDefault();

    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("gesturestart", handleGestureStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("gesturestart", handleGestureStart);
    };
  }, []);
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
            initial={isFirstRender ? false : "enter"} // 👈 sin animación en el primer render
            animate="center"
            exit="exit"
            className="grid-cards"
          >
            {productosPagina.map((producto) => (
              <motion.button
                key={producto.id}
                className="card"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <img
                  src={producto.img}
                  alt={`Producto ${producto.id}`}
                  className="card-img"
                />
                <h4 className="card-precio prosto-one-regular">
                  {producto.nombre}
                </h4>
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

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
          <div className="modal-content">
            {/* 🟠 Encabezado del modal */}
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Nombre del producto
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            {/* 🟠 Cuerpo principal */}
            <div className="modal-body">
              <div className="row align-items-center">
                {/* 🖼️ Imagen del producto */}
                <div className="col-12 col-md-6 text-center">
                  <img
                    src=".." // imagen del producto
                    alt="Imagen del producto"
                    className="img-fluid"
                  />
                </div>

                {/* 📝 Detalles del producto */}
                <div className="col-12 col-md-6">
                  <p className="descripcion-producto">
                    Descripción breve de la prenda, materiales o detalles
                    relevantes.
                  </p>

                  {/* 🎨 Botones de color */}
                  <div className="grupo-opciones">
                    <h6>Color:</h6>
                    {/* solo una selección posible */}
                    <div className="d-flex gap-2 flex-wrap">
                      {/* ejemplo: */}
                      <button className="btn btn-outline-dark btn-sm active">
                        Negro
                      </button>
                      <button className="btn btn-outline-dark btn-sm">
                        Blanco
                      </button>
                      <button className="btn btn-outline-dark btn-sm">
                        Azul
                      </button>
                    </div>
                  </div>

                  {/* 📏 Botones de talla */}
                  <div className="grupo-opciones mt-3">
                    <h6>Talla:</h6>
                    {/* selección única */}
                    <div className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-outline-secondary btn-sm active">
                        M
                      </button>
                      <button className="btn btn-outline-secondary btn-sm">
                        L
                      </button>
                      <button className="btn btn-outline-secondary btn-sm">
                        XL
                      </button>
                    </div>
                  </div>

                  {/* 💵 Precio */}
                  <h4 className="precio-producto mt-4">$19.990</h4>

                  {/* 🛒 Botón principal */}
                  <button className="btn btn-primary mt-3 w-100">
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="zona-tactil derecha"
        onTouchStart={() => {
          const flecha = document.querySelector(".flecha.derecha");
          flecha?.classList.add("activa");
        }}
        onTouchEnd={() => {
          const flecha = document.querySelector(".flecha.derecha");
          flecha?.classList.remove("activa");
          siguiente(); // tu función para avanzar
        }}
      ></div>

      <div
        className="zona-tactil izquierda"
        onTouchStart={() => {
          const flecha = document.querySelector(".flecha.izquierda");
          flecha?.classList.add("activa");
        }}
        onTouchEnd={() => {
          const flecha = document.querySelector(".flecha.izquierda");
          flecha?.classList.remove("activa");
          anterior(); // tu función para retroceder
        }}
      ></div>

      <div className="paginacion prosto-one-regular">
        {paginaActual} / {totalPaginas}
      </div>
    </div>
  );
}

export default Carrusel;
