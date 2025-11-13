import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Carrusel.css";
import Elementos from "./Elementos.json";
import iconoLupa from "../../../assets/icono-lupa.png";

interface Producto {
  id: number;
  img: string;
  precio: string;
  nombre: string;
}

const productosData: Producto[] = Elementos;

function Carrusel() {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [mostrarImagen, setMostrarImagen] = useState(false); // ✅ Para controlar el zoom
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string>(""); // ✅ Imagen actual

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  useEffect(() => {
    // 🚫 Bloquear click derecho
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // 🚫 Bloquear gestos y zoom táctil
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
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
            initial={isFirstRender ? false : "enter"}
            animate="center"
            exit="exit"
            className="grid-cards"
          >
            {productosPagina.map((producto) => (
              <motion.button
                key={producto.id}
                className="card card-catalogo"
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

      {/* 🟠 Modal principal del producto */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
          <div className="modal-content">
            {/* Encabezado */}
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

            {/* Cuerpo del modal */}
            <div className="modal-body">
              <div className="row align-items-center">
                {/* 🖼️ Imagen del producto */}
                <div className="col-12 col-md-6 text-center position-relative">
                  <button
                    onClick={() => {
                      setImagenSeleccionada(
                        "https://cycorecords.cl/cdn/shop/files/exploited-skull-serigrafia-1ee01a45-a692-4bb4-aef3-639136ad11c8.jpg?v=1743535743&width=1920"
                      );
                      setMostrarImagen(true);
                    }}
                    className="btn btn-light position-absolute top-0 end-0 m-2"
                  >
                    <img
                      src={iconoLupa}
                      className="lupa"
                      alt="Ampliar imagen"
                    />
                  </button>

                  <img
                    src="https://cycorecords.cl/cdn/shop/files/exploited-skull-serigrafia-1ee01a45-a692-4bb4-aef3-639136ad11c8.jpg?v=1743535743&width=1920"
                    alt="Imagen del producto"
                    className="img-fluid img-producto"
                  />
                </div>

                {/* 📝 Detalles */}
                <div className="col-12 col-md-6">
                  <p className="descripcion-producto">
                    Descripción breve de la prenda, materiales o detalles
                    relevantes.
                  </p>

                  {/* Colores */}
                  <div className="grupo-opciones">
                    <h6>Color:</h6>
                    <div className="d-flex gap-2 flex-wrap">
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

                  {/* Tallas */}
                  <div className="grupo-opciones mt-3">
                    <h6>Talla:</h6>
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

                  {/* Precio y botón */}
                  <h4 className="precio-producto mt-4">$19.990</h4>
                  <button className="btn btn-primary mt-3 w-100 btn-agregar">
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 Modal de imagen fullscreen */}
      {mostrarImagen && (
        <div
          className="modal-imagen-fullscreen position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-90 d-flex justify-content-center align-items-center"
          onClick={() => setMostrarImagen(false)}
          style={{ zIndex: 2000 }}
        >
          <img
            src={imagenSeleccionada}
            alt="Vista ampliada"
            className="img-fluid"
            style={{ maxHeight: "90vh", cursor: "zoom-out" }}
          />
        </div>
      )}

      {/* 🟣 Zonas táctiles para deslizar */}
      <div
        className="zona-tactil derecha"
        onTouchStart={() => {
          const flecha = document.querySelector(".flecha.derecha");
          flecha?.classList.add("activa");
        }}
        onTouchEnd={() => {
          const flecha = document.querySelector(".flecha.derecha");
          flecha?.classList.remove("activa");
          siguiente();
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
          anterior();
        }}
      ></div>

      <div className="paginacion prosto-one-regular">
        {paginaActual} / {totalPaginas}
      </div>
    </div>
  );
}

export default Carrusel;
