import { useState } from "react";
import { useStore } from "../store";
import { Mark } from "../icons";

const DEMOS = [
  { usuario: "ana", clave: "ana1234", rol: "Cliente Pro" },
  { usuario: "lucas", clave: "lucas1234", rol: "Cliente demo" },
  { usuario: "admin", clave: "admin123", rol: "Administrador" },
];

export default function Login() {
  const { login } = useStore();
  const [form, setForm] = useState({ usuario: "", clave: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const result = await login(form.usuario, form.clave);
    if (!result.ok) setError("Usuario o clave incorrectos.");
  };

  return (
    <div className="login">
      <aside className="login-aside">
        <div className="login-aside-inner">
          <div className="brand-row light">
            <Mark size={42} />
            <span>Contact2me</span>
          </div>
          <h2>El panel, en el teléfono y en el escritorio.</h2>
          <p>
            Contact2me sigue siendo el panel para administrar campañas, leads y datos.
            En el celular se usa como app. En tablet y PC el menú queda al costado.
          </p>
          <ul>
            <li>Campañas de video y de audiencia</li>
            <li>Leads y reportes</li>
            <li>Datos, pixels y correo</li>
          </ul>
        </div>
      </aside>

      <main className="login-main">
        <div className="login-card">
          <div className="brand-row mobile-only">
            <Mark size={40} />
            <span>Contact2me</span>
          </div>
          <h1>Entrar</h1>
          <p className="muted">Entra al panel. Estas cuentas son de demostración hasta conectar el acceso real.</p>
          <form onSubmit={submit} className="stack">
            <label className="field">
              <span>Usuario</span>
              <input
                name="usuario"
                autoComplete="username"
                value={form.usuario}
                onChange={(event) => setForm({ ...form, usuario: event.target.value })}
              />
            </label>
            <label className="field">
              <span>Clave</span>
              <input
                name="clave"
                type="password"
                autoComplete="current-password"
                value={form.clave}
                onChange={(event) => setForm({ ...form, clave: event.target.value })}
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button className="btn primary" type="submit">
              Entrar
            </button>
          </form>
          <div className="demo-list">
            <p>Cuentas de prueba</p>
            {DEMOS.map((demo) => (
              <button
                key={demo.usuario}
                type="button"
                className="demo-chip"
                onClick={() => {
                  setError("");
                  setForm({ usuario: demo.usuario, clave: demo.clave });
                }}
              >
                <strong>{demo.usuario}</strong>
                <span>{demo.rol}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
