import { useEffect, useState } from "react";
import { useCart } from "../catalogo/componentes/CartContext";
import { useNavigate } from "react-router-dom";
import "./pago.css";
import { Modal } from "bootstrap";

const LINEAS: Record<string, string[]> = {
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
    estacion: "Vicente Valdés",
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
    "Vicente Valdés": 1200,
    "Plaza de Maipú": 1000,
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
            <h4>Datos de contacto</h4>
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
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolor quidem saepe maxime. Magnam ea doloribus debitis
                      illo modi necessitatibus repellendus quaerat unde, fugiat
                      veritatis repellat eligendi cupiditate similique! Tempora,
                      pariatur. Doloremque ipsa ut quam porro dolorem veniam,
                      enim quidem ex aut voluptatibus assumenda magni,
                      repellendus, rerum totam recusandae laboriosam cum nemo?
                      Eos rem atque cum incidunt ut, ratione nobis ipsum?
                      Perferendis soluta sapiente voluptas consectetur nisi
                      suscipit dolore. Quas asperiores cumque praesentium sed,
                      voluptas eum, ea alias aperiam, delectus non dolores
                      facere impedit recusandae ut adipisci dolore? Veniam, nemo
                      modi! Expedita cupiditate, quas laudantium ut aliquid
                      voluptatum quis in fugit voluptatem magnam iure. Delectus
                      quaerat ad nisi aspernatur voluptatum saepe sint harum
                      eius natus. Repellat nostrum ab culpa officiis illo! Quod
                      excepturi, magnam autem et, voluptatem magni, ipsa
                      molestias nisi quos cumque quisquam. Explicabo velit
                      eveniet nam aperiam tempore alias atque obcaecati, ex
                      sapiente modi earum reiciendis aspernatur corporis totam?
                      Nostrum eius perspiciatis nisi quas provident, magnam
                      autem labore nobis eaque illum suscipit blanditiis ipsum
                      totam distinctio consectetur et quis similique impedit
                      maiores rerum amet dolores. Assumenda ullam eum labore!
                      Illo voluptatem in quisquam provident, facilis sed, velit
                      rem magni minima ipsum ea, nesciunt molestias. Quibusdam
                      rem earum veritatis labore necessitatibus eveniet debitis.
                      At, ut cum aliquam possimus dolor voluptatem? Minima
                      maxime ipsum ratione rerum voluptates saepe, ex
                      repudiandae dolor amet ducimus veritatis, error fuga
                      asperiores, nulla nobis perferendis aliquid sapiente autem
                      molestias quam illo provident. Rem nihil dicta quod?
                      Voluptatem quod dolorum eius tenetur eveniet, dolor
                      incidunt mollitia vitae accusamus, modi ullam repellat
                      officiis adipisci optio earum dicta nulla iusto molestiae
                      fuga, consequatur eum. Impedit delectus atque quas vitae.
                      Quis, molestiae corrupti. Ipsum asperiores quo doloremque
                      quod harum expedita recusandae similique ipsam, itaque a
                      labore, in eius sunt tenetur quibusdam architecto
                      cupiditate alias doloribus vitae quaerat. Saepe, corrupti
                      beatae? Delectus illo, ducimus voluptate fugit
                      exercitationem minima iusto eius obcaecati animi
                      consectetur, inventore sunt possimus est quis consequuntur
                      numquam repellat accusamus ipsa dolores nam aut.
                      Praesentium dolores quae ut ex! Doloribus nulla id optio
                      sed voluptatum dicta doloremque repudiandae, pariatur
                      minima? Aspernatur, quam reiciendis rem fugiat at,
                      adipisci eum nulla totam vitae consectetur sit distinctio.
                    </p>
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
            <h4>Tipo de retiro</h4>

            {/* ✔️ PRIMERO: Retiro en Local */}
            <div className="form-check">
              <input
                type="radio"
                checked={form.retiro === "local"}
                onChange={() => setForm({ ...form, retiro: "local" })}
              />
              <label>Retiro en Local (Costo $0)</label>
            </div>

            {/* ✔️ SEGUNDO: Retiro en Metro (por defecto seleccionado) */}
            <div className="form-check mt-2">
              <input
                type="radio"
                checked={form.retiro === "metro"}
                onChange={() => setForm({ ...form, retiro: "metro" })}
              />
              <label>Retiro en Metro</label>
            </div>

            {/* Campos que aparecen solo cuando eliges Metro */}
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
            <div className="d-flex justify-content-start total-compra">
              <div className="col-9">
                <h5>Total Productos:</h5>
                <h5>Tarifa retiro:</h5>
                <h5>Total Final:</h5>
              </div>
              <div className="col-3">
                <h5>{formatoCLP.format(totalProductos)}</h5>
                <h5>{formatoCLP.format(tarifaRetiro)}</h5>
                <h5>{formatoCLP.format(totalFinal)}</h5>
              </div>
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
