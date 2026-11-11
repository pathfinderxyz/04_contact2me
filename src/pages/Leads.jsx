import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store";
import { Icon } from "../icons";

const FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "nuevo", label: "Nuevos" },
  { id: "contactado", label: "Contactados" },
  { id: "cerrado", label: "Cerrados" },
];

export default function Leads() {
  const { user, leadsFor, db } = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("todos");
  const leads = leadsFor(user);

  const visible = useMemo(() => {
    return leads.filter((lead) => {
      const matchesFilter = filter === "todos" || lead.estado === filter;
      const haystack = `${lead.nombre} ${lead.correo} ${lead.telefono}`.toLowerCase();
      return matchesFilter && haystack.includes(query.trim().toLowerCase());
    });
  }, [leads, filter, query]);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Personas que te escribieron</p>
          <h1>Leads</h1>
        </div>
      </header>

      <label className="search">
        <Icon name="search" size={18} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nombre, correo o teléfono"
        />
      </label>

      <div className="chips">
        {FILTERS.map((item) => (
          <button key={item.id} type="button" className={filter === item.id ? "chip on" : "chip"} onClick={() => setFilter(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="lead-table">
        <div className="lead-head">
          <span>Persona</span>
          <span>Campaña</span>
          <span>Fecha</span>
          <span>Estado</span>
        </div>
        {visible.map((lead) => {
          const campaign = db.campaigns.find((item) => item.id === lead.campaignId);
          return (
            <Link key={lead.id} to={`/app/leads/${lead.id}`} className="lead-row">
              <span>
                <strong>{lead.nombre}</strong>
                <small>{lead.telefono}</small>
              </span>
              <span>{campaign?.nombre || "—"}</span>
              <span>{new Date(lead.fecha).toLocaleDateString("es-CR")}</span>
              <em className={lead.estado}>{lead.estado}</em>
            </Link>
          );
        })}
      </div>
      {visible.length === 0 && (
        <div className="empty">
          <h2>Nada por aquí</h2>
          <p>Prueba otro filtro o comparte el enlace de una campaña.</p>
        </div>
      )}
    </div>
  );
}
