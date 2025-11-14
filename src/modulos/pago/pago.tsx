import { useEffect, useState } from "react";
import { useCart } from "../catalogo/componentes/CartContext";
import { useNavigate } from "react-router-dom";
import "./pago.css";

const LINEAS = {
  "Línea 1": ["Los Dominicos", "Manquehue", "Tobalaba", "Baquedano"],
  "Línea 2": ["Vespucio Norte", "Zapadores", "Los Héroes"],
  "Línea 3": ["Los Libertadores", "Plaza Egaña", "Fernando Castillo Velasco"],
  "Línea 4": ["Tobalaba", "Príncipe de Gales", "Plaza de Maipú"],
  "Línea 5": ["Plaza de Maipú", "Vicente Valdés", "Bellavista de La Florida"],
};

export default function Pago() {
  const navigate = useNavigate();
  const { cart, getTotal, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showRedirectMsg, setShowRedirectMsg] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const [shouldStartCountdown, setShouldStartCountdown] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    celular: "",
    correo: "",
    alternoNombre: "",
    alternoCel: "",
    newsletter: true,
    terminos: false,
    retiro: "metro",
    linea: "Línea 5",
    estacion: "Vicente Valdés",
  });

  const tarifas: Record<string, number> = {
    "Vicente Valdés": 1200,
    "Plaza de Maipú": 1000,
  };
  const tarifaRetiro =
    form.retiro === "local" ? 0 : tarifas[form.estacion] ?? 0;

  // Overlay inicial
  useEffect(() => {
    setTimeout(() => setLoading(false), 400);
    const backdrops = document.querySelectorAll(".offcanvas-backdrop");
    backdrops.forEach((b) => b.remove());
    document.body.classList.remove("offcanvas-backdrop", "modal-open");
    document.body.style.overflow = "auto";
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && shouldStartCountdown) {
        setShowRedirectMsg(true);
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              clearCart();
              navigate("/");
            }
            return prev - 1;
          });
        }, 1000);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [shouldStartCountdown]);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const irStep2 = () => {
    const required = [form.nombre, form.apellido, form.celular, form.correo];
    if (required.some((v) => v.trim() === "") || !form.terminos) {
      alert("Completa los campos obligatorios (*) y acepta términos");
      return;
    }
    setStep(2);
  };

  const TU_NUMERO = "56957390514";

  const enviarWhatsapp = () => {
    const totalCompra = getTotal() + tarifaRetiro;
    const mensaje = `
Nuevo Pedido

Cliente:
${form.nombre} ${form.apellido}
Cel: ${form.celular}
Correo: ${form.correo}

Alterno:
${form.alternoNombre || "—"}
${form.alternoCel || "—"}

Revisar compra:
${cart
  .map(
    (item) =>
      `• ${item.nombre} (${item.cantidad}x) - $${item.precio} ${
        item.color ? `Color: ${item.color}` : ""
      } ${item.talla ? `Talla: ${item.talla}` : ""}`
  )
  .join("\n")}

Retiro: ${form.retiro === "metro" ? "Metro" : "Local"}
${
  form.retiro === "metro"
    ? `Línea: ${form.linea}\nEstación: ${form.estacion}`
    : ""
}
Total Final: $${totalCompra}
`;
    const url = `https://wa.me/${TU_NUMERO}?text=${encodeURIComponent(
      mensaje
    )}`;
    window.open(url, "_blank");
    setShouldStartCountdown(true);
  };

  return (
    <div className="pago-wrapper">
      {loading && (
        <div className="overlay-loading">
          <div className="spinner"></div>
        </div>
      )}

      <div className="stepper">
        {["Contacto", "Retiro", "Resumen", "Enviar"].map((label, i) => (
          <div key={i} className={`step ${step === i + 1 ? "active" : ""}`}>
            <div className="circle-base">{i + 1}</div>
            {step === i + 1 && <div className="circle-active">{i + 1}</div>}
            <span className="step-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="form-box scrollable-body">
        {step === 1 && (
          <>
            <h4>Datos de contacto</h4>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre *"
            />
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Apellido *"
            />
            <input
              type="text"
              name="celular"
              value={form.celular}
              onChange={handleChange}
              placeholder="Celular *"
            />
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="Correo *"
            />
            <h5>Destinatario alterno</h5>
            <input
              type="text"
              name="alternoNombre"
              value={form.alternoNombre}
              onChange={handleChange}
              placeholder="Nombre alterno"
            />
            <input
              type="text"
              name="alternoCel"
              value={form.alternoCel}
              onChange={handleChange}
              placeholder="Celular alterno"
            />
            <div className="form-check mt-2">
              <input
                type="checkbox"
                checked={form.newsletter}
                name="newsletter"
                onChange={(e) =>
                  setForm({ ...form, newsletter: e.target.checked })
                }
              />
              <label>Suscribirme a novedades</label>
            </div>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                checked={form.terminos}
                name="terminos"
                onChange={(e) =>
                  setForm({ ...form, terminos: e.target.checked })
                }
              />
              <label>
                Acepto términos y condiciones <span>*</span>
              </label>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h4>Tipo de retiro</h4>
            <div className="form-check">
              <input
                type="radio"
                checked={form.retiro === "metro"}
                onChange={() => setForm({ ...form, retiro: "metro" })}
              />
              <label>Retiro en Metro</label>
            </div>
            {form.retiro === "metro" && (
              <>
                <select
                  name="linea"
                  value={form.linea}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      linea: e.target.value,
                      estacion: LINEAS[e.target.value][0],
                    });
                  }}
                >
                  {Object.keys(LINEAS).map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <select
                  name="estacion"
                  value={form.estacion}
                  onChange={(e) =>
                    setForm({ ...form, estacion: e.target.value })
                  }
                >
                  {LINEAS[form.linea].map((est) => (
                    <option key={est} value={est}>
                      {est}
                    </option>
                  ))}
                </select>
              </>
            )}
            <div className="form-check">
              <input
                type="radio"
                checked={form.retiro === "local"}
                onChange={() => setForm({ ...form, retiro: "local" })}
              />
              <label>Retiro en Local (Costo $0)</label>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h4>Revisar compra</h4>
            <div className="contenedor-revisar-pedido">
              {cart.map((item, i) => (
                <div className="card card-carrito card-pedido mb-3" key={i}>
                  <div className="row g-0">
                    <div className="col-md-4 col-4 d-flex align-items-center ">
                      <img src={item.img} className="img-fluid rounded-start" />
                    </div>
                    <div className="col-md-8 col-8">
                      <div className="card-body ">
                        <div className="d-flex flex-column justify-content-between  align-items-start">
                          <p className="card-title">{item.nombre}</p>
                          <p className="card-text">
                            Color: {item.color ?? "-"}
                          </p>
                          <p className="card-text">
                            Talla: {item.talla ?? "-"}
                          </p>
                          <p className="card-text">Cantidad: {item.cantidad}</p>
                          <p className="card-text">{item.precio}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <p>Total productos: ${getTotal()}</p>
            <p>Tarifa retiro: ${tarifaRetiro}</p>
            <p>Total final: ${getTotal() + tarifaRetiro}</p>
          </>
        )}

        {step === 4 && (
          <div className="text-center">
            {showRedirectMsg && (
              <div className="redirect-msg">
                Serás redirigido al catálogo en <strong>{countdown}</strong>{" "}
                segundos...
              </div>
            )}
            <button className="btn btn-success w-100" onClick={enviarWhatsapp}>
              Enviar pedido por WhatsApp
            </button>
          </div>
        )}
      </div>

      <div className="footer-buttons">
        {step === 1 ? (
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            Volver al catálogo
          </button>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={() => setStep(step - 1)}
          >
            Anterior
          </button>
        )}

        {step < 4 && (
          <button
            className="btn btn-warning"
            onClick={() => (step === 1 ? irStep2() : setStep(step + 1))}
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}
