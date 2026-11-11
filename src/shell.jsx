import { NavLink } from "react-router-dom";
import { demoDaysLeft, useStore } from "./store";
import { Icon, Mark } from "./icons";

const TABS = [
  { to: "/app", label: "Inicio", icon: "home", end: true },
  { to: "/app/campanas", label: "Campañas", icon: "megaphone" },
  { to: "/app/leads", label: "Leads", icon: "users" },
  { to: "/app/datos", label: "Datos", icon: "card" },
  { to: "/app/mas", label: "Cuenta", icon: "more" },
];

function groupsFor(user) {
  const herramientas = [
    { to: "/app/chat", label: "Chat IA", icon: "chat" },
    { to: "/app/academia", label: "Academia", icon: "academy" },
    { to: "/app/integraciones", label: "Pixels y correo", icon: "link" },
  ];
  if (user.rol === "admin") {
    herramientas.unshift({ to: "/app/usuarios", label: "Cuentas", icon: "users" });
  }
  return [
    {
      label: "Operación",
      items: [
        { to: "/app", label: "Inicio", icon: "home", end: true },
        { to: "/app/campanas", label: "Campañas", icon: "megaphone" },
        { to: "/app/leads", label: "Leads", icon: "users" },
        { to: "/app/datos", label: "Datos", icon: "card" },
        { to: "/app/reportes", label: "Reportes", icon: "chart" },
      ],
    },
    { label: "Herramientas", items: herramientas },
    { label: "Cuenta", items: [{ to: "/app/mas", label: "Cuenta", icon: "more" }] },
  ];
}

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Back({ to, label = "Volver" }) {
  return (
    <NavLink to={to} className="back">
      <Icon name="back" size={18} />
      {label}
    </NavLink>
  );
}

export default function Shell({ children }) {
  const { user, leadsFor } = useStore();
  const fresh = leadsFor(user).filter((lead) => lead.estado === "nuevo").length;
  const days = demoDaysLeft(user);
  const groups = groupsFor(user);

  return (
    <div className="shell">
      <aside className="side">
        <div className="side-brand">
          <Mark size={34} />
          <div>
            <strong>Contact2me</strong>
            <small>Panel</small>
          </div>
        </div>
        <nav className="side-nav">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="side-label">{group.label}</p>
              {group.items.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className="side-link">
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                  {item.to === "/app/leads" && fresh > 0 && <em className="count">{fresh}</em>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="side-user">
          <span className="avatar">{initials(user.nombre)}</span>
          <div>
            <strong>{user.nombre}</strong>
            <small>{user.rol === "admin" ? "Administrador" : user.membresia}</small>
          </div>
        </div>
      </aside>

      <div className="stage">
        <header className="topbar">
          <div className="topbar-brand">
            <Mark size={28} />
            <span>Contact2me</span>
          </div>
          <div className="topbar-user">
            {days !== null && days > 0 && <span className="pill warn">Demo · {days} días</span>}
            {days === 0 && <span className="pill danger">Demo finalizada</span>}
            <span className="avatar sm">{initials(user.nombre)}</span>
          </div>
        </header>
        <main className="content">{children}</main>
        <nav className="tabbar">
          {TABS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="tab">
              <span className="tab-icon">
                <Icon name={item.icon} size={22} />
                {item.to === "/app/leads" && fresh > 0 && <i className="dot" />}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
