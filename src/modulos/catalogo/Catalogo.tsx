import { useEffect } from "react";
import "./Catalogo.css";
import logo from "../../assets/logo.png";
import Carrusel from "./componentes/Carrusel";
import { Popover } from "bootstrap";
import { CartProvider, useCart } from "./componentes/CartContext";
import CarritoLogo from "../../assets/carrito.png";

function CatalogoInner() {
  // This inner component uses the cart hook to render the offcanvas content
  const { cart, clearCart, removeFromCart, updateQuantity, getTotal } =
    useCart();
  function buildWhatsAppMessage(cart, total) {
    let message = "🛒 *Nuevo Pedido desde el catálogo*\n\n";

    cart.forEach((item, idx) => {
      message += `*Producto ${idx + 1}:*\n`;
      message += `• Nombre: ${item.nombre}\n`;
      message += `• Color: ${item.color ?? "-"}\n`;
      message += `• Talla: ${item.talla ?? "-"}\n`;
      message += `• Precio: ${item.precio}\n`;
      message += `• Cantidad: ${item.cantidad}\n\n`;
    });

    message += `----------------------------------\n`;
    message += `*TOTAL:* $${total.toLocaleString()}\n`;

    return encodeURIComponent(message);
  }
  useEffect(() => {
    const handleBackdropCleanup = () => {
      const backdrops = document.querySelectorAll(".offcanvas-backdrop");
      if (backdrops.length > 1) {
        // keep the last and fade out the previous ones
        for (let i = 0; i < backdrops.length - 1; i++) {
          const backdrop = backdrops[i] as HTMLElement;
          backdrop.style.transition = "opacity 0.3s ease";
          backdrop.style.opacity = "0";

          // remove after transition
          setTimeout(() => {
            if (backdrop.parentNode) {
              backdrop.remove();
            }
          }, 300);
        }
      }
    };

    document.addEventListener("shown.bs.offcanvas", handleBackdropCleanup);
    document.addEventListener("hidden.bs.offcanvas", handleBackdropCleanup);

    return () => {
      document.removeEventListener("shown.bs.offcanvas", handleBackdropCleanup);
      document.removeEventListener(
        "hidden.bs.offcanvas",
        handleBackdropCleanup
      );
    };
  }, []);

  useEffect(() => {
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );

    popoverTriggerList.forEach((el) => {
      const existingPopover = Popover.getInstance(el);
      if (existingPopover) existingPopover.dispose();
      new Popover(el);
    });
  }, []);

  return (
    <>
      <div className="catalogo-container">
        <div className="row navbar-container">
          <div className="bloque-1">
            <a href="#">
              <img src={logo} className="logo" alt="logo bludamon" />
            </a>

            <button
              className="boton-carrito prosto-one-regular"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
            >
              <img src={CarritoLogo} className="carrito-logo" alt="" />(
              {cart.length})
            </button>
          </div>
        </div>

        <div className="row menu-container">
          <div className="bloque-2 col-12 col-sm-2 ">
            <button className="menu-boton boton-poleras prosto-one-regular">
              Poleras
            </button>

            <button
              className="menu-boton boton-desactivado prosto-one-regular"
              type="button"
              tabIndex={0}
              data-bs-toggle="popover"
              data-bs-trigger="hover focus"
              data-bs-placement="top"
              data-bs-content="¡Próximamente disponible!"
            >
              Polerones
            </button>

            <button
              className="menu-boton boton-desactivado prosto-one-regular"
              type="button"
              tabIndex={0}
              data-bs-toggle="popover"
              data-bs-trigger="hover focus"
              data-bs-placement="top"
              data-bs-content="¡Próximamente disponible!"
            >
              Visor
            </button>
          </div>

          <div className="bloque-3 col-12 col-sm-7 ">
            <Carrusel />
          </div>
        </div>
      </div>

      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasRightLabel">
            Carrito
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="carrito-contenedor-superior">
            {cart.length === 0 && <p>Tu carrito está vacío.</p>}
            {cart.map((item, idx) => (
              <div className="card card-carrito mb-3" key={idx}>
                <div className="row g-0">
                  <div className="col-md-4 col-4 d-flex align-items-center ">
                    <img src={item.img} className="img-fluid rounded-start" />
                  </div>
                  <div className="col-md-8 col-8">
                    <div className="card-body ">
                      <div className="d-flex flex-column justify-content-between  align-items-start">
                        <h4 className="card-title">{item.nombre}</h4>
                        <p className="card-text">Color: {item.color ?? "-"}</p>
                        <p className="card-text">Talla: {item.talla ?? "-"}</p>
                      </div>

                      <div className="d-flex flex-column align-items-end">
                        <h5 className="card-text">{item.precio}</h5>
                        <div className="d-flex gap-2 align-items-center mt-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              updateQuantity(
                                idx,
                                Math.max(1, item.cantidad - 1)
                              )
                            }
                          >
                            -
                          </button>
                          <span>{item.cantidad}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              updateQuantity(idx, item.cantidad + 1)
                            }
                          >
                            +
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => removeFromCart(idx)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="carrito-contenedor-inferior">
            <div className="mb-2 d-flex justify-content-between align-items-center">
              <h2 className="prosto-one-regular">Total</h2>
              <h2 className="prosto-one-regular">
                ${getTotal().toLocaleString()}
              </h2>
            </div>
            <button
              className="btn btn-primary mt-2 w-100 btn-vaciar"
              onClick={() => clearCart()}
            >
              VACIAR CARRITO
            </button>
            <button
              className="btn btn-primary mt-2 w-100 btn-finalizar"
              onClick={() => {
                const total = getTotal();
                const message = buildWhatsAppMessage(cart, total);

                // Número de WhatsApp (formato internacional sin +)
                const phoneNumber = "56957390514";

                // Abrir mensaje directo a WhatsApp
                const url = `https://wa.me/${phoneNumber}?text=${message}`;
                window.open(url, "_blank");
              }}
            >
              FINALIZAR COMPRA
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Catalogo() {
  // envolver con provider para que todo el catálogo tenga acceso al carrito
  return (
    <CartProvider>
      <CatalogoInner />
    </CartProvider>
  );
}
