import { useEffect, useState } from "react";
import { useCart } from "../catalogo/componentes/CartContext";
import { useNavigate } from "react-router-dom";
import "./pago.css";
import { Modal } from "bootstrap";

const LINEAS: Record<string, string[]> = {
  "Línea 1": [
    "San Pablo",
    "Neptuno",
    "Pajaritos",
    "Las Rejas",
    "Ecuador",
    "San Alberto Hurtado",
    "U. de Santiago",
    "Estación Central",
    "U.L.A",
    "República",
    "Los Héroes",
    "La Moneda",
    "U. de Chile",
    "Santa Lucia",
    "U. Católica",
    "Baquedano",
    "Salvador",
    "Manuel Montt",
    "Pedro de Valdivia",
    "Los Leones",
    "Tobalaba",
    "El Golf",
    "Alcántara",
    "Escuela Militar",
    "Manquehue",
    "Hernando de Magallanes",
    "Los Dominicos",
  ],
  "Línea 5": [
    "Plaza de Maipú",
    "Santiago Bueras",
    "Del Sol",
    "Monte Tabor",
    "Las Parcelas",
    "Laguna Sur",
    "Barrancas",
    "Pudahuel",
    "San Pablo",
    "Lo Prado",
    "Blanqueado",
    "Gruta de Lourdes",
    "Quinta Normal",
    "Cumming",
    "Santa Ana",
    "Plaza de Armas",
    "Bellas Artes",
    "Baquedano",
    "Parque Bustamante",
    "Santa Isabel",
    "Irarrázaval",
    "Ñuble",
    "Rodrigo de Araya",
    "Carlos Valdovinos",
    "Camino Agrícola",
    "San Joaquín",
    "Pedrero",
    "Mirador",
    "Bellavista de la Florida",
    "Vicente Valdés",
  ],
  "Línea 6": [
    "Cerrillos",
    "Lo Valledor",
    "P.A.C",
    "Franklin",
    "Bio Bío",
    "Ñuble",
    "Estadio Nacional",
    "Ñuñoa",
    "Ines de Suarez",
    "Los Leones",
    "Isidora Goyenechea",
  ],
};

export default function Pago() {
  const navigate = useNavigate();
  const { cart, getTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  // Formateador CLP
  const formatoCLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  });
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
    estacion: "Plaza de Maipú",
  });
  const mostrarAlerta = (mensaje: string) => {
    const mensajeContenedor = document.getElementById("alertModalMensaje");
    if (mensajeContenedor) mensajeContenedor.innerText = mensaje;

    const modalEl = document.getElementById("alertModal");
    if (!modalEl) return;

    const modal = new Modal(modalEl); // 👈 SIN window.bootstrap
    modal.show();
  };

  const tarifas: Record<string, number> = {
    "San Pablo": 3000,
    Neptuno: 3500,
    Pajaritos: 3500,
    "Las Rejas": 4000,
    Ecuador: 4500,
    "San Alberto Hurtado": 4500,
    "U. de Santiago": 5000,
    "Estación Central": 5500,
    "U.L.A": 6000,
    República: 6000,
    "Los Héroes": 6500,
    "La Moneda": 7000,
    "U. de Chile": 7000,
    "Santa Lucia": 7500,
    "U. Católica": 8000,
    Baquedano: 8000,
    Salvador: 8500,
    "Manuel Montt": 9000,
    "Pedro de Valdivia": 9000,
    "Los Leones": 9500,
    Tobalaba: 10000,
    "El Golf": 10500,
    Alcántara: 10500,
    "Escuela Militar": 11000,
    Manquehue: 11500,
    "Hernando de Magallanes": 11500,
    "Los Dominicos": 12000,
    "Plaza de Maipú": 1500,
    "Santiago Bueras": 1500,
    "Del Sol": 2000,
    "Monte Tabor": 2000,
    "Las Parcelas": 2500,
    "Laguna Sur": 2500,
    Barrancas: 3000,
    Pudahuel: 3000,
    "Lo Prado": 5500,
    Blanqueado: 6000,
    "Gruta de Lourdes": 6000,
    "Quinta Normal": 6500,
    Cumming: 7000,
    "Santa Ana": 7500,
    "Plaza de Armas": 8000,
    "Bellas Artes": 8500,
    "Parque Bustamante": 9500,
    "Santa Isabel": 9500,
    Irarrázaval: 10000,
    Ñuble: 10500,
    "Rodrigo de Araya": 11000,
    "Carlos Valdovinos": 11500,
    "Camino Agrícola": 12000,
    "San Joaquín": 12500,
    Pedrero: 12500,
    Mirador: 13000,
    "Bellavista de la Florida": 13500,
    "Vicente Valdés": 14000,
    Cerrillos: 3000,
    "Lo Valledor": 4000,
    "P.A.C": 5000,
    Franklin: 6000,
    "Bio Bío": 6500,
    "Estadio Nacional": 8500,
    Ñuñoa: 9500,
    "Ines de Suarez": 10000,
    "Isidora Goyenechea": 12000,
  };
  const tarifaRetiro =
    form.retiro === "local" ? 0 : tarifas[form.estacion] ?? 0;

  const totalProductos = getTotal();
  const totalFinal = totalProductos + tarifaRetiro;

  // Overlay inicial
  useEffect(() => {
    setTimeout(() => setLoading(false), 400);
    const backdrops = document.querySelectorAll(".offcanvas-backdrop");
    backdrops.forEach((b) => b.remove());
    document.body.classList.remove("offcanvas-backdrop", "modal-open");
    document.body.style.overflow = "auto";
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "celular") {
      // Quitar caracteres no numéricos
      let num = value.replace(/\D/g, "");

      // Limitar a 8 números
      num = num.slice(0, 8);

      // Insertar espacio después de 4 dígitos: 1234 5678
      if (num.length > 4) {
        num = num.slice(0, 4) + " " + num.slice(4);
      }

      setForm({ ...form, celular: num });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const irStep2 = () => {
    if (form.nombre.trim() === "") return mostrarAlerta("Ingresa tu nombre");

    if (form.apellido.trim() === "")
      return mostrarAlerta("Ingresa tu apellido");

    if (form.celular.trim() === "")
      return mostrarAlerta("Ingresa tu número de celular");

    const rawCel = form.celular.replace(/\D/g, "");

    if (rawCel.length !== 8)
      return mostrarAlerta("El celular debe tener exactamente 8 dígitos");

    if (form.correo.trim() === "")
      return mostrarAlerta("Ingresa tu correo electrónico");

    if (!/\S+@\S+\.\S+/.test(form.correo))
      return mostrarAlerta("Ingresa un correo válido");

    if (!form.terminos)
      return mostrarAlerta("Debes aceptar los términos y condiciones");

    setStep(2);
  };

  const TU_NUMERO = "56957390514";

  const enviarWhatsapp = () => {
    const totalCompra = getTotal() + tarifaRetiro;
    const mensaje = `
Nuevo Pedido

Cliente:
${form.nombre} ${form.apellido}
Cel: +56 9 ${form.celular}
Correo: ${form.correo}
Newsletter: ${
      form.newsletter ? "Sí, desea recibir novedades" : "No desea suscribirse"
    }


Revisar compra:
${cart
  .map(
    (item) =>
      `• ${item.nombre} (${item.cantidad}x) - ${item.precio} ${
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
Tarifa Retiro: $${tarifaRetiro}
Total Final: $${totalCompra}
`;
    clearCart();
    navigate("/");
    const url = `https://wa.me/${TU_NUMERO}?text=${encodeURIComponent(
      mensaje
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="pago-wrapper">
      {loading && (
        <div className="overlay-loading">
          <div className="spinner"></div>
        </div>
      )}

      <div className="stepper">
        {["Contacto", "Retiro", "Resumen"].map((label, i) => (
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
            <h4>Datos de Contacto</h4>
            <label htmlFor="">
              Primer Nombre <span className="asterisco">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Francisco"
            />
            <label htmlFor="">
              Primer Apellido <span className="asterisco">*</span>
            </label>
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Ej: Hernandez"
            />
            <label htmlFor="">
              Celular <span className="asterisco">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">+56 9</span>
              <input
                type="text"
                name="celular"
                className="form-control"
                placeholder="9999 9999"
                value={form.celular}
                onChange={handleChange}
              />
            </div>
            <label htmlFor="">
              Correo <span className="asterisco">*</span>
            </label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="Ej: correo@ejemplo.com"
            />

            <div className="form-check mt-2">
              <input
                type="checkbox"
                checked={form.newsletter}
                name="newsletter"
                className="form-check-input"
                onChange={(e) =>
                  setForm({ ...form, newsletter: e.target.checked })
                }
              />
              <label>
                Acepto suscribir mi correo al Newsletter para recibir novedades.
              </label>
            </div>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                checked={form.terminos}
                name="terminos"
                onChange={(e) =>
                  setForm({ ...form, terminos: e.target.checked })
                }
                className="form-check-input"
                id="checkbox-terminos"
              />
              <label className="form-check-label">
                Acepto{" "}
                <span
                  data-bs-toggle="modal"
                  data-bs-target="#terminosModal"
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  Términos y Condiciones
                </span>{" "}
                .<span className="asterisco">*</span>
              </label>
            </div>

            {/* Modal Bootstrap */}
            <div
              className="modal fade"
              id="terminosModal"
              tabIndex={-1}
              aria-labelledby="terminosModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5
                      className="modal-title terminos-text"
                      id="terminosModalLabel"
                    >
                      Términos y Condiciones
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Cerrar"
                    ></button>
                  </div>
                  <div className="modal-body terminos-text">
                    {/* Texto largo de términos */}
                    <article
                      className="terminos-tdc"
                      aria-labelledby="terminos-title"
                    >
                      <header>
                        <h1 id="terminos-title">
                          Términos y Condiciones – Bludamon
                        </h1>
                        <p className="breve">
                          Documento que regula la compra de poleras
                          serigrafiadas personalizadas. Al confirmar la compra
                          aceptas estos términos.
                        </p>
                      </header>

                      <section aria-labelledby="info-general">
                        <h2 id="info-general">1. Información general</h2>
                        <p>
                          El presente documento regula los términos y
                          condiciones aplicables a la compra de productos
                          ofrecidos por <strong>Bludamon</strong>. Al confirmar
                          tu compra declaras haber leído y aceptado estos
                          términos.
                        </p>
                      </section>

                      <section aria-labelledby="datos-comprador">
                        <h2 id="datos-comprador">2. Datos del comprador</h2>
                        <p>
                          El cliente debe proporcionar información veraz y
                          completa:
                        </p>
                        <ul>
                          <li>Nombre y apellido</li>
                          <li>Número de celular y correo electrónico</li>
                          <li>Dirección o punto de retiro (opcional)</li>
                          <li>
                            Nombre y número de destinatario alterno (si aplica)
                          </li>
                        </ul>
                        <p className="nota">
                          Bludamon no se responsabiliza por retrasos o entregas
                          fallidas causadas por datos incorrectos proporcionados
                          por el comprador.
                        </p>
                      </section>

                      <section aria-labelledby="formas-entrega">
                        <h2 id="formas-entrega">3. Formas de entrega</h2>

                        <article aria-labelledby="retiro-local">
                          <h3 id="retiro-local">Retiro en local (sin costo)</h3>
                          <p>
                            <strong>Dirección:</strong> El Huaso #2189, Maipú.
                          </p>
                          <ul>
                            <li>
                              Retiro disponible luego de la confirmación del
                              pago.
                            </li>
                            <li>Coordinar previamente día y hora.</li>
                            <li>
                              Se recomienda retirar dentro de los 30 días
                              posteriores al pago.
                            </li>
                          </ul>
                        </article>

                        <article aria-labelledby="retiro-metro">
                          <h3 id="retiro-metro">Retiro en estación de metro</h3>
                          <p>
                            Disponible en distintas estaciones dentro de la
                            Región Metropolitana. El cliente debe coordinar día,
                            hora y estación con el equipo de Bludamon.
                          </p>

                          <h4 id="plazos-coord">Plazos de coordinación</h4>
                          <ul>
                            <li>
                              Desde la confirmación del pago:{" "}
                              <strong>7 días corridos</strong> para coordinar y
                              realizar la entrega.
                            </li>
                            <li>
                              Si el cliente no puede asistir, el plazo se
                              extiende <strong>7 días adicionales</strong>.
                            </li>
                            <li>
                              Si fuera necesario, el compromiso puede renovarse
                              semana a semana hasta concretar la entrega.
                            </li>
                          </ul>
                        </article>
                      </section>

                      <section aria-labelledby="tarifas-lineas">
                        <h2 id="tarifas-lineas">
                          4. Tarifas por Línea de Metro
                        </h2>

                        {/* Ejemplo de tabla — puedes repetir la estructura para las demás líneas */}

                        <section aria-labelledby="linea-1">
                          <h3 id="linea-1">
                            Línea 1 (San Pablo – Los Dominicos)
                          </h3>
                          <table className="tabla-tarifas">
                            <thead>
                              <tr>
                                <th>Tipo</th>
                                <th>Tarifa</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Estación inicial (San Pablo)</td>
                                <td>$3.000</td>
                              </tr>
                              <tr>
                                <td>Estación final (Los Dominicos)</td>
                                <td>$12.000</td>
                              </tr>
                              <tr>
                                <td>Estaciones intermedias</td>
                                <td>$3.500 – $11.500</td>
                              </tr>
                            </tbody>
                          </table>
                        </section>
                        <section aria-labelledby="linea-5">
                          <h3 id="linea-5">
                            Línea 2 (Plaza de Maipú – Vicente Valdés)
                          </h3>
                          <table className="tabla-tarifas">
                            <thead>
                              <tr>
                                <th>Tipo</th>
                                <th>Tarifa</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Estación inicial (Plaza de Maipú)</td>
                                <td>$1.500</td>
                              </tr>
                              <tr>
                                <td>Estación final (Vicente Valdés)</td>
                                <td>$14.000</td>
                              </tr>
                              <tr>
                                <td>Estaciones intermedias</td>
                                <td>$2.000 – $11.500</td>
                              </tr>
                            </tbody>
                          </table>
                        </section>
                        <section aria-labelledby="linea-6">
                          <h3 id="linea-6">
                            Línea 6 (Cerrillos – Isidora Goyenechea)
                          </h3>
                          <table className="tabla-tarifas">
                            <thead>
                              <tr>
                                <th>Tipo</th>
                                <th>Tarifa</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Estación inicial (Cerrillos)</td>
                                <td>$3.000</td>
                              </tr>
                              <tr>
                                <td>Estación final (Isidora Goyenechea)</td>
                                <td>$12.000</td>
                              </tr>
                              <tr>
                                <td>Estaciones intermedias</td>
                                <td>$3.500 – $11.500</td>
                              </tr>
                            </tbody>
                          </table>
                        </section>

                        {/* Continúan todas las demás líneas igual… */}
                      </section>

                      <section aria-labelledby="envios-costos">
                        <h2 id="envios-costos">5. Envíos y costos</h2>
                        <p>
                          El costo de envío o retiro se suma al total de la
                          compra y debe pagarse junto con el pedido. Los tiempos
                          de entrega pueden variar según disponibilidad y
                          ubicación.
                        </p>
                      </section>

                      <section aria-labelledby="pagos">
                        <h2 id="pagos">6. Pagos</h2>
                        <p>
                          Los pagos se realizan mediante los medios habilitados
                          por Bludamon (transferencia, débito o crédito).
                        </p>
                        <p>
                          El pedido se procesa una vez confirmado el pago total.
                          No se realizan entregas con pago pendiente o parcial.
                        </p>
                      </section>

                      <section aria-labelledby="cambios">
                        <h2 id="cambios">7. Cambios y devoluciones</h2>
                        <p>
                          Debido a que las poleras se confeccionan por pedido y
                          con serigrafía personalizada, no se aceptan cambios
                          por talla, color o diseño. Solo se gestionarán cambios
                          por defectos atribuibles a Bludamon dentro de los{" "}
                          <strong>7 días hábiles</strong> posteriores a la
                          entrega.
                        </p>
                      </section>

                      <section aria-labelledby="propiedad">
                        <h2 id="propiedad">8. Propiedad intelectual</h2>
                        <p>
                          Los diseños, logotipos y elementos gráficos utilizados
                          por Bludamon son propiedad de la marca o de sus
                          autores. No está permitido reproducirlos sin
                          autorización.
                        </p>
                      </section>

                      <section aria-labelledby="comunicacion">
                        <h2 id="comunicacion">9. Comunicación y noticias</h2>
                        <p>
                          El cliente puede optar por recibir novedades marcando
                          la casilla correspondiente durante la compra. Puede
                          darse de baja escribiendo a:{" "}
                          <a href="mailto:bludamonserigrafia@gmail.com">
                            bludamonserigrafia@gmail.com
                          </a>
                        </p>
                      </section>

                      <footer aria-labelledby="aceptacion">
                        <h2 id="aceptacion">10. Aceptación</h2>
                        <p>
                          Al marcar la casilla “Acepto los términos y
                          condiciones” confirmas haber leído y aceptado estas
                          condiciones.
                        </p>
                      </footer>
                    </article>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary terminos-text"
                      data-bs-dismiss="modal"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h4>Tipo de Retiro</h4>

            {/* ✔️ Retiro en Local */}
            <div className="form-check">
              <input
                type="radio"
                checked={form.retiro === "local"}
                onChange={() => setForm({ ...form, retiro: "local" })}
              />
              <label style={{ marginLeft: 10 }}>
                Retiro en Local (Costo $0)
              </label>
            </div>

            {/* ✔️ Retiro en Metro */}
            <div className="form-check mt-2">
              <input
                type="radio"
                checked={form.retiro === "metro"}
                onChange={() => setForm({ ...form, retiro: "metro" })}
              />
              <label style={{ marginLeft: 10 }}>Retiro en Metro</label>
            </div>

            {/* ✔️ MOSTRAR SOLO SI ES METRO */}
            {form.retiro === "metro" && (
              <>
                {/* SELECT DE LINEA */}
                <select
                  name="linea"
                  value={form.linea}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      linea: e.target.value,
                      estacion: LINEAS[e.target.value][0], // primera estación de esa línea
                    })
                  }
                  className="form-select mt-3"
                >
                  {Object.keys(LINEAS).map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>

                {/* SELECT DE ESTACIÓN */}
                <select
                  name="estacion"
                  value={form.estacion}
                  onChange={(e) =>
                    setForm({ ...form, estacion: e.target.value })
                  }
                  className="form-select mt-2"
                >
                  {LINEAS[form.linea].map((est) => (
                    <option key={est} value={est}>
                      {est}
                    </option>
                  ))}
                </select>

                {/* ✔️ TARIFA DINÁMICA */}
                <div className="tarifa-box mt-3">
                  <strong>💰 Tarifa Retiro: </strong>
                  {formatoCLP.format(tarifas[form.estacion] ?? 0)}
                </div>
                <div className="mejores-tarifas-box mt-3">
                  <h6 className="mb-2">💡 Tarifas más convenientes</h6>

                  <ul className="lista-tarifas">
                    <li>
                      🔵 Línea 1 – San Pablo: <strong>$3.000</strong>
                    </li>
                    <li>
                      🟢 Línea 5 – Plaza Maipú: <strong>$1.500</strong>
                    </li>
                    <li>
                      🟣 Línea 6 – Cerrillos: <strong>$3.000</strong>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* ✔️ MOSTRAR MAPA SOLO SI ES RETIRO EN LOCAL */}
            {form.retiro === "local" && (
              <div className="mapa-box mt-3" style={{ position: "relative" }}>
                {/* Spinner sobre el mapa mientras carga */}
                {mapLoading && (
                  <div className="spinner-mapa-container">
                    <div className="spinner-mapa"></div>
                    <p className="text-center mt-2">Cargando mapa...</p>
                  </div>
                )}

                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3326.5006000169083!2d-70.79077832415828!3d-33.5143680007886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662dd4a7885feed%3A0xfc8f4052d8fea28b!2sEl%20Huaso%202189%2C%20Maip%C3%BA%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1763253857201!5m2!1ses-419!2scl"
                  width="100%"
                  height="350"
                  style={{ border: 0, borderRadius: "10px" }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setMapLoading(false)} // ✔️ Al terminar de cargar
                ></iframe>
              </div>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h4>Revisar Compra</h4>
            <div className="contenedor-revisar-pedido">
              {cart.map((item, i) => (
                <div className="card-pedido-resp" key={i}>
                  <div className="pedido-row">
                    {/* Imagen */}
                    <div className="pedido-img-box">
                      <img src={item.img} alt={item.nombre} />
                    </div>

                    {/* Texto */}
                    <div className="pedido-info">
                      <p className="pedido-nombre">{item.nombre}</p>

                      <div className="pedido-detalles">
                        <span>Color: {item.color ?? "-"}</span>
                        <span>Talla: {item.talla ?? "-"}</span>
                        <span>Cantidad: {item.cantidad}</span>
                      </div>
                    </div>

                    <div className="pedido-precio">{item.precio}</div>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="d-flex justify-content-start total-compra">
              <div className="col-9">
                <h5>Total Productos:</h5>
                <h5>Tarifa Retiro:</h5>
                <h5>Total Final:</h5>
              </div>
              <div className="col-3">
                <h5>{formatoCLP.format(totalProductos)}</h5>
                <h5>{formatoCLP.format(tarifaRetiro)}</h5>
                <h5>{formatoCLP.format(totalFinal)}</h5>
              </div>
            </div>
            <div className="mt-3">
              <button
                className="btn-info-como-funciona"
                data-bs-toggle="modal"
                data-bs-target="#modalComoFunciona"
              >
                ¿Cómo funciona esta compra?
              </button>
            </div>
          </>
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

        {step === 3 ? (
          <button className="btn btn-success w-100" onClick={enviarWhatsapp}>
            Enviar pedido por WhatsApp
          </button>
        ) : (
          <button
            className="btn btn-warning"
            onClick={() => (step === 1 ? irStep2() : setStep(step + 1))}
          >
            Siguiente
          </button>
        )}
      </div>
      <div
        className="modal fade"
        id="modalComoFunciona"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrolleable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title terminos-text">
                ¿Cómo funciona esta compra?
              </h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <p className="terminos-text">
                Esta compra se finaliza mediante <strong>WhatsApp</strong>. Al
                presionar el botón de finalizar compra, se abrirá una
                conversación directa con nuestro equipo de ventas.
              </p>

              <p className="terminos-text">
                En ese chat, tu mensaje será recibido por un vendedor, quien
                revisará tu pedido y te indicará los datos de pago.
              </p>

              <p className="terminos-text">
                Una vez realizado el pago, deberás enviar un
                <strong> screenshot o comprobante </strong> para validarlo.
              </p>

              <p className="terminos-text">
                Tras confirmar tu pago, coordinaremos contigo la entrega de tu
                prenda, ya sea en el local o en la estación de metro que hayas
                elegido.
              </p>

              <div className="alert alert-info mt-3 terminos-text">
                👍 Nuestro equipo te acompañará en todo el proceso y resolverá
                cualquier duda.
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary terminos-text"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de alertas personalizado */}
      <div
        className="modal fade terminos-text"
        id="alertModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title terminos-text">Aviso</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <p
                id="alertModalMensaje"
                className="terminos-text"
                style={{ fontSize: "1.1rem" }}
              ></p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary terminos-text"
                data-bs-dismiss="modal"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
