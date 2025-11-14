import { useState } from "react";
import { useCart } from "../catalogo/componentes/CartContext";
import "./pago.css";

export default function Pago() {
  const { cart, getTotal } = useCart();

  // STEP CONTROL
  const [step, setStep] = useState(1);

  // FORM DATA
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    celular: "",
    correo: "",
    alternoNombre: "",
    alternoCel: "",
    retiro: "metro",
    linea: "5",
    estacion: "Vicente Valdés",
    newsletter: true,
    terminos: false,
  });

  // TARIAS DE RETIRO SEGÚN ESTACIÓN
  const tarifas = {
    "Vicente Valdés": 1200,
    "Plaza de Maipú": 1000,
  };

  const tarifaRetiro = tarifas[form.estacion] ?? 0;

  // HANDLER
  const update = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // VALIDACIÓN DEL STEP 1
  const camposObligatorios = [
    form.nombre,
    form.apellido,
    form.celular,
    form.correo,
    form.terminos ? "ok" : "",
  ];

  const puedeContinuar = camposObligatorios.every((v) => v.trim() !== "");

  const irStep2 = () => {
    if (!puedeContinuar) {
      alert("Por favor completa todos los campos obligatorios (*)");
      return;
    }
    setStep(2);
  };

  const irStep3 = () => {
    setStep(3);
  };

  // WHATSAPP — DEBE USAR TU NÚMERO, NO EL DEL USUARIO
  const TU_NUMERO = "56957390514"; // ← CAMBIA AQUÍ TU NÚMERO REAL

  const enviarWhatsapp = () => {
    const totalCompra = getTotal() + tarifaRetiro;

    const mensaje = `
💙 NUEVO PEDIDO BLUDAMON 💙

👤 *Datos del Cliente*
Nombre: ${form.nombre} ${form.apellido}
Celular: ${form.celular}
Correo: ${form.correo}

👥 *Destinatario alterno (opcional)*
Nombre: ${form.alternoNombre || "—"}
Celular: ${form.alternoCel || "—"}

📦 *Carrito:*
${cart
  .map(
    (item) =>
      `• ${item.nombre} (${item.cantidad}x) - $${item.precio}  ${
        item.color ? `Color: ${item.color}` : ""
      } ${item.talla ? `Talla: ${item.talla}` : ""}`
  )
  .join("\n")}

🚇 Metodo de retiro: ${
      form.retiro === "metro" ? "Retiro en Metro" : "Retiro en Local"
    }
Línea: ${form.linea}
Estación: ${form.estacion}

💰 Tarifa retiro: $${tarifaRetiro}
🧮 Total final: $${totalCompra}

¿Confirmas el pedido?
    `;

    const url = `https://wa.me/${TU_NUMERO}?text=${encodeURIComponent(
      mensaje
    )}`;

    window.open(url, "_blank");
  };

  // ---------------------------- UI -------------------------- //

  return (
    <div className="pago-container">
      {/* ---------- STEPPER ---------- */}
      <div className="stepper">
        <div className={`step ${step === 1 ? "active" : ""}`}>
          <div className="circle">1</div>
          <span>Datos de Contacto</span>
        </div>

        <div className="line"></div>

        <div className={`step ${step === 2 ? "active" : ""}`}>
          <div className="circle">2</div>
          <span>Confirmar Pedido</span>
        </div>

        <div className="line"></div>

        <div className={`step ${step === 3 ? "active" : ""}`}>
          <div className="circle">3</div>
          <span>Pago y Entrega</span>
        </div>
      </div>

      {/* STEP 1 -------------------------------------------------------*/}
      {step === 1 && (
        <div className="form-box">
          <div className="row">
            {/* COL 1 */}
            <div className="col-6 d-flex flex-column">
              <label>
                Primer Nombre <span className="asterisco">*</span>
              </label>
              <input
                className="form-control"
                value={form.nombre}
                onChange={(e) => update("nombre", e.target.value)}
              />

              <label>
                Primer Apellido <span className="asterisco">*</span>
              </label>
              <input
                className="form-control"
                value={form.apellido}
                onChange={(e) => update("apellido", e.target.value)}
              />

              <label>
                Celular <span className="asterisco">*</span>
              </label>
              <input
                className="form-control"
                value={form.celular}
                onChange={(e) => update("celular", e.target.value)}
              />

              <label>
                Correo <span className="asterisco">*</span>
              </label>
              <input
                className="form-control"
                value={form.correo}
                onChange={(e) => update("correo", e.target.value)}
              />

              <label>Nombre destinatario alterno</label>
              <input
                className="form-control"
                value={form.alternoNombre}
                onChange={(e) => update("alternoNombre", e.target.value)}
              />

              <label>Celular destinatario alterno</label>
              <input
                className="form-control"
                value={form.alternoCel}
                onChange={(e) => update("alternoCel", e.target.value)}
              />
            </div>

            {/* COL 2 */}
            <div className="col-6 d-flex flex-column">
              <label>
                Tipo de Retiro <span className="asterisco">*</span>
              </label>

              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  checked={form.retiro === "metro"}
                  onChange={() => update("retiro", "metro")}
                />
                <label className="form-check-label">Retiro en Metro</label>
              </div>

              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  checked={form.retiro === "local"}
                  onChange={() => update("retiro", "local")}
                />
                <label className="form-check-label">Retiro en Local</label>
              </div>

              <label>
                Selecciona la Línea <span className="asterisco">*</span>
              </label>
              <select
                className="form-select"
                value={form.linea}
                onChange={(e) => update("linea", e.target.value)}
              >
                <option value="1">Línea 1</option>
                <option value="4">Línea 4</option>
                <option value="5">Línea 5</option>
              </select>

              <label>
                Selecciona la Estación <span className="asterisco">*</span>
              </label>
              <select
                className="form-select"
                value={form.estacion}
                onChange={(e) => update("estacion", e.target.value)}
              >
                <option>Vicente Valdés</option>
                <option>Plaza de Maipú</option>
              </select>

              <div className="form-check mt-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={form.newsletter}
                  onChange={(e) => update("newsletter", e.target.checked)}
                />
                <label className="form-check-label">
                  Suscribirme al Newsletter
                </label>
              </div>

              <div className="form-check mt-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={form.terminos}
                  onChange={(e) => update("terminos", e.target.checked)}
                />
                <label className="form-check-label">
                  Acepto los <a href="#">Términos y Condiciones</a>{" "}
                  <span className="asterisco">*</span>
                </label>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <button className="col-6 btn btn-secondary" disabled>
              Atrás
            </button>
            <button
              className="col-6 btn btn-warning next-btn"
              onClick={irStep2}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 ------------------------------------------------------- */}
      {step === 2 &&
        (console.log("CARRITO EN STEP 2:", cart),
        (
          <div className="form-box">
            <h3>Resumen del Pedido</h3>

            <div>
              {cart.map((item, i) => (
                <div key={i} style={{ marginBottom: "10px" }}>
                  <strong>{item.nombre}</strong> — {item.cantidad}x — $
                  {item.precio}
                  {item.color && <> — Color: {item.color}</>}
                  {item.talla && <> — Talla: {item.talla}</>}
                </div>
              ))}

              <hr />

              <p>
                <strong>Total productos:</strong> ${getTotal()}
              </p>
              <p>
                <strong>Tarifa retiro:</strong> ${tarifaRetiro}
              </p>
              <p>
                <strong>Total final:</strong> ${getTotal() + tarifaRetiro}
              </p>
            </div>

            <div className="row mt-4">
              <button
                className="col-6 btn btn-secondary"
                onClick={() => setStep(1)}
              >
                Atrás
              </button>
              <button
                className="col-6 btn btn-warning next-btn"
                onClick={irStep3}
              >
                Confirmar
              </button>
            </div>
          </div>
        ))}

      {/* STEP 3 ------------------------------------------------------ */}
      {step === 3 && (
        <div className="form-box text-center">
          <h3>Enviar Pedido</h3>
          <p>Haz clic para enviar toda la información a nuestro WhatsApp.</p>

          <button className="btn btn-success" onClick={enviarWhatsapp}>
            Enviar a WhatsApp
          </button>

          <div className="mt-4">
            <button className="btn btn-secondary" onClick={() => setStep(2)}>
              Atrás
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
