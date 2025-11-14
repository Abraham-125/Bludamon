import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Carrusel.css";
import Elementos from "./Elementos.json";
import iconoLupa from "../../../assets/icono-lupa.png";
import * as bootstrap from "bootstrap";

interface Producto {
  id: number;
  img: string;
  precio: string;
  nombre: string;
}

const productosData: Producto[] = Elementos;

function Carrusel() {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modalInstanceRef = useRef<bootstrap.Modal | null>(null);

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [mostrarImagen, setMostrarImagen] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string>("");

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina, setProductosPorPagina] = useState(6);
  const [direccion, setDireccion] = useState<"next" | "prev">("next");

  // Crear instancia del modal de Bootstrap solo una vez
  useEffect(() => {
    if (modalRef.current) {
      modalInstanceRef.current = new bootstrap.Modal(modalRef.current, {
        backdrop: true,
        keyboard: true,
      });

      // Eliminar backdrop cuando Bootstrap termine realmente de cerrar
      modalRef.current.addEventListener("hidden.bs.modal", () => {
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();
      });
    }
  }, []);

  const abrirModal = () => {
    modalInstanceRef.current?.show();
  };

  const cerrarModal = () => {
    modalInstanceRef.current?.hide();
  };

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

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
      setPaginaActual((prev) => prev + 1);
    }
  };

  const anterior = () => {
    if (paginaActual > 1) {
      setDireccion("prev");
      setPaginaActual((prev) => prev - 1);
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

  const agregarCarrito = () => {
    cerrarModal();

    setMostrarConfirmacion(true);

    setTimeout(() => {
      setMostrarConfirmacion(false);
    }, 1400);
  };

  return (
    <div className="carrusel">
      {/* FLECHA IZQUIERDA */}
      <button
        className={`flecha izquierda ${
          paginaActual === 1 ? "desactivada" : ""
        }`}
        onClick={anterior}
        disabled={paginaActual === 1}
      ></button>

      {/* GRID */}
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
                onClick={abrirModal}
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

      {/* FLECHA DERECHA */}
      <button
        className={`flecha derecha ${
          paginaActual === totalPaginas ? "desactivada" : ""
        }`}
        onClick={siguiente}
        disabled={paginaActual === totalPaginas}
      ></button>

      {/* MODAL PRODUCTO — CONTROLADO CON BOOTSTRAP */}
      <div
        className="modal fade"
        id="exampleModal"
        ref={modalRef}
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Nombre del producto
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={cerrarModal}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="row align-items-center">
                {/* IMAGEN */}
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
                    <img src={iconoLupa} className="lupa" alt="Ampliar" />
                  </button>

                  <img
                    src="https://cycorecords.cl/cdn/shop/files/exploited-skull-serigrafia-1ee01a45-a692-4bb4-aef3-639136ad11c8.jpg?v=1743535743&width=1920"
                    alt="Imagen del producto"
                    className="img-fluid img-producto"
                  />
                </div>

                {/* INFO */}
                <div className="col-12 col-md-6">
                  <p className="descripcion-producto">
                    Descripción breve de la prenda, materiales o detalles
                    relevantes.
                  </p>

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

                  <h4 className="precio-producto mt-4">$19.990</h4>

                  <button
                    className="btn btn-primary mt-3 w-100 btn-agregar"
                    onClick={agregarCarrito}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL FULLSCREEN IMAGEN */}
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

      {/* ZONAS TÁCTILES */}
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

      {/* PAGINACIÓN */}
      <div className="paginacion prosto-one-regular">
        {paginaActual} / {totalPaginas}
      </div>

      {/* POP-UP CONFIRMACIÓN */}
      <AnimatePresence>
        {mostrarConfirmacion && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="popup-confirmacion"
            style={{ zIndex: 3000, width: "300px" }}
          >
            <h5>¡Producto agregado!</h5>
            <p>Se añadió al carrito correctamente.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Carrusel;
