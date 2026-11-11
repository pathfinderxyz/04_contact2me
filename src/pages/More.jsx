import { Link, useNavigate } from "react-router-dom";
import { demoDaysLeft, useStore } from "../store";
import { Icon } from "../icons";

const PLANS = [
  { name: "Contact2me Demo", detail: "15 días para probar el panel y una campaña.", price: "Gratis" },
  { name: "Contact2me Pro", detail: "Campañas ilimitadas, leads y tu enlace público.", price: "Pro" },
  { name: "Equipo", detail: "Varias cuentas y vista de todos los contactos.", price: "Equipo" },
];

export default function More() {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const days = demoDaysLeft(user);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{user.codigo}</p>
          <h1>{user.nombre}</h1>
        </div>
      </header>

      <section className="plan-card">
        <div>
          <p className="eyebrow">Membresía</p>
          <h2>{user.membresia}</h2>
          {days !== null && <p>{days > 0 ? `Te quedan ${days} días de prueba.` : "Tu prueba ya terminó."}</p>}
        </div>
      </section>

      <div className="plan-grid">
        {PLANS.map((plan) => (
          <article key={plan.name} className={plan.name === user.membresia ? "plan on" : "plan"}>
            <strong>{plan.price}</strong>
            <h3>{plan.name.replace("Contact2me ", "")}</h3>
            <p>{plan.detail}</p>
            <span>{plan.name === user.membresia ? "Plan actual" : "Disponible al conectar pagos"}</span>
          </article>
        ))}
      </div>

      <div className="menu-list">
        <Link to="/app/academia">
          <Icon name="academy" />
          Academia
        </Link>
        <Link to="/app/datos">
          <Icon name="card" />
          Datos de campaña
        </Link>
        <Link to="/app/reportes">
          <Icon name="chart" />
          Reportes
        </Link>
        <Link to="/app/integraciones">
          <Icon name="link" />
          Pixels y correo
        </Link>
        {user.rol === "admin" && (
          <Link to="/app/usuarios">
            <Icon name="users" />
            Cuentas
          </Link>
        )}
        <button
          type="button"
          onClick={async () => {
            await logout();
            navigate("/");
          }}
        >
          <Icon name="logout" />
          Salir
        </button>
      </div>
    </div>
  );
}
