import { useParams } from "react-router-dom";
import { useStore } from "../store";
import { Back } from "../shell";

const STATES = [
  { id: "nuevo", label: "Nuevo" },
  { id: "contactado", label: "Contactado" },
  { id: "cerrado", label: "Cerrado" },
];

export default function LeadDetail() {
  const { id } = useParams();
  const { db, user, updateLead } = useStore();
  const lead = db.leads.find((item) => String(item.id) === id);

  if (!lead || (user.rol !== "admin" && lead.userId !== user.id)) {
    return (
      <div className="page">
        <Back to="/app/leads" label="Leads" />
        <div className="empty">
          <h2>No encontramos ese lead</h2>
        </div>
      </div>
    );
  }

  const campaign = db.campaigns.find((item) => item.id === lead.campaignId);
  const phone = lead.telefono.replace(/[^\d]/g, "");

  return (
    <div className="page narrow">
      <Back to="/app/leads" label="Leads" />
      <header className="page-head">
        <div>
          <p className="eyebrow">{campaign?.nombre || "Contacto"}</p>
          <h1>{lead.nombre}</h1>
        </div>
      </header>
      <section className="panel stack">
        <p>
          <span className="muted">Correo</span>
          <br />
          <a href={`mailto:${lead.correo}`}>{lead.correo}</a>
        </p>
        <p>
          <span className="muted">Teléfono</span>
          <br />
          {lead.telefono}
        </p>
        <p>
          <span className="muted">Llegó el</span>
          <br />
          {new Date(lead.fecha).toLocaleString("es-CR")}
        </p>
        <div className="chips">
          {STATES.map((state) => (
            <button
              key={state.id}
              type="button"
              className={lead.estado === state.id ? "chip on" : "chip"}
              onClick={() => updateLead(lead.id, { estado: state.id })}
            >
              {state.label}
            </button>
          ))}
        </div>
        <a className="btn whatsapp" href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">
          Escribir por WhatsApp
        </a>
      </section>
    </div>
  );
}
