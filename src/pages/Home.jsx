import { Link } from "react-router-dom";
import { useStore } from "../store";
import { Icon } from "../icons";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export default function Home() {
  const { user, campaignsFor, leadsFor, db } = useStore();
  const campaigns = campaignsFor(user);
  const leads = leadsFor(user);
  const fresh = leads.filter((lead) => lead.estado === "nuevo").length;
  const visits = campaigns.reduce((sum, item) => sum + item.visitas, 0);
  const first = user.nombre.split(" ")[0];

  const stats = [
    { label: "Leads", value: leads.length, hint: `${fresh} sin contactar` },
    { label: "Campañas", value: campaigns.length, hint: `${campaigns.filter((item) => item.estado === "activa").length} activas` },
    { label: "Visitas", value: visits, hint: "En tus enlaces" },
    {
      label: user.rol === "admin" ? "Cuentas" : "Plan",
      value: user.rol === "admin" ? db.users.length : user.membresia.replace("Contact2me ", ""),
      hint: user.rol === "admin" ? "En la plataforma" : user.ciudad,
    },
  ];

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{greeting()} · Panel</p>
          <h1>{first}</h1>
        </div>
        <Link to="/app/campanas/nueva" className="btn primary slim">
          <Icon name="plus" size={18} />
          Campaña
        </Link>
      </header>

      <section className="stats">
        {stats.map((stat) => (
          <article key={stat.label} className="stat">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>{stat.hint}</small>
          </article>
        ))}
      </section>

      <div className="split">
        <section className="panel">
          <div className="panel-head">
            <h2>Campañas</h2>
            <Link to="/app/campanas">Ver todas</Link>
          </div>
          <div className="stack tight">
            {campaigns.slice(0, 3).map((item) => (
              <Link key={item.id} to={`/app/campanas/${item.id}`} className="row-item">
                <span className={`badge ${item.tipo}`}>{item.tipo}</span>
                <div>
                  <strong>{item.nombre}</strong>
                  <small>{item.visitas} visitas</small>
                </div>
                <em className={item.estado}>{item.estado}</em>
              </Link>
            ))}
            {campaigns.length === 0 && <p className="muted">Todavía no tienes campañas.</p>}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Leads recientes</h2>
            <Link to="/app/leads">Ver todos</Link>
          </div>
          <div className="stack tight">
            {leads.slice(0, 4).map((lead) => (
              <Link key={lead.id} to={`/app/leads/${lead.id}`} className="row-item">
                <span className="avatar sm">{lead.nombre.slice(0, 1)}</span>
                <div>
                  <strong>{lead.nombre}</strong>
                  <small>{new Date(lead.fecha).toLocaleDateString("es-CR")}</small>
                </div>
                <em className={lead.estado}>{lead.estado}</em>
              </Link>
            ))}
            {leads.length === 0 && <p className="muted">Cuando alguien deje sus datos, aparece aquí.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
