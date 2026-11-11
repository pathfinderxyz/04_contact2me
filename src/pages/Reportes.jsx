import { useStore } from "../store";

const STATES = [
  { id: "nuevo", label: "Nuevos" },
  { id: "contactado", label: "Contactados" },
  { id: "cerrado", label: "Cerrados" },
];

export default function Reportes() {
  const { user, leadsFor, campaignsFor } = useStore();
  const leads = leadsFor(user);
  const campaigns = campaignsFor(user);
  const max = Math.max(1, ...STATES.map((state) => leads.filter((lead) => lead.estado === state.id).length));

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">{user.rol === "admin" ? "Todas las cuentas" : "Tu actividad"}</p>
          <h1>Reportes</h1>
        </div>
      </header>

      <section className="panel stack">
        <h2>Leads por estado</h2>
        {STATES.map((state) => {
          const count = leads.filter((lead) => lead.estado === state.id).length;
          return (
            <div className="bar-row" key={state.id}>
              <span>{state.label}</span>
              <div className="bar">
                <span style={{ width: `${(count / max) * 100}%` }} />
              </div>
              <strong>{count}</strong>
            </div>
          );
        })}
      </section>

      <section className="panel stack tight">
        <h2>Por campaña</h2>
        {campaigns.map((campaign) => {
          const count = leads.filter((lead) => lead.campaignId === campaign.id).length;
          return (
            <div className="row-item" key={campaign.id}>
              <span className={`badge ${campaign.tipo}`}>{campaign.tipo}</span>
              <div>
                <strong>{campaign.nombre}</strong>
                <small>{campaign.visitas} visitas</small>
              </div>
              <em>{count} leads</em>
            </div>
          );
        })}
        {campaigns.length === 0 && <p className="muted">Todavía no hay campañas para reportar.</p>}
      </section>
    </div>
  );
}
