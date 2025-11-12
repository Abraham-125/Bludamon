import { useEffect } from "react";
import "./Catalogo.css";
import logo from "../../assets/logo.png";
import Carrusel from "./componentes/Carrusel";
import { Popover } from "bootstrap";
function Catalogo() {
  useEffect(() => {
    const handleBackdropCleanup = () => {
      const backdrops = document.querySelectorAll(".offcanvas-backdrop");
      if (backdrops.length > 1) {
        // deja el último y desvanece los anteriores
        for (let i = 0; i < backdrops.length - 1; i++) {
          const backdrop = backdrops[i] as HTMLElement;
          backdrop.style.transition = "opacity 0.3s ease";
          backdrop.style.opacity = "0";

          // elimina el elemento después de que termine la transición
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
            <a href="">
              <img src={logo} className="logo" alt="logo bludamon" />
            </a>

            <button
              className="boton-carrito prosto-one-regular"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
            >
              Carrito
            </button>
          </div>
        </div>

        <div className="row menu-container">
          <div className="bloque-2 col-12 col-sm-2 ">
            <button className="menu-boton boton-poleras prosto-one-regular">
              Poleras
            </button>

            {/* ✅ Este popover ahora sí funcionará */}
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
            Offcanvas right
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">...</div>
      </div>
    </>
  );
}

export default Catalogo;
