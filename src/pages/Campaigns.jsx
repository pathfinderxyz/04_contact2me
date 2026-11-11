import { Link } from "react-router-dom";
import { useStore } from "../store";
import { Icon } from "../icons";

export default function Campaigns() {
  const { user, campaignsFor, db } = useStore();
  const campaigns = campaignsFor(user);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Enlaces públicos</p>
          <h1>Campañas</h1>
        </div>
        <Link to="/app/campanas/nueva" className="btn primary slim">
          <Icon name="plus" size={18} />
          Nueva
        </Link>
      </header>

      <div className="card-grid">
        {campaigns.map((item) => {
          const owner = db.users.find((person) => person.id === item.userId);
          return (
            <Link key={item.id} to={`/app/campanas/${item.id}`} className="campaign-card">
              <div className="campaign-top">
                <span className={`badge ${item.tipo}`}>{item.tipo === "video" ? "Video" : "Audiencia"}</span>
                <em className={item.estado}>{item.estado}</em>
              </div>
              <h2>{item.nombre}</h2>
              <p>{item.titular}</p>
              <div className="campaign-meta">
                <span>{item.visitas} visitas</span>
                <span>/c/{item.slug}</span>
              </div>
              {user.rol === "admin" && <small className="owner">De {owner?.nombre}</small>}
            </Link>
          );
        })}
      </div>
      {campaigns.length === 0 && (
        <div className="empty">
          <h2>Sin campañas</h2>
          <p>Crea una de video o una de audiencia para empezar a recibir contactos.</p>
        </div>
      )}
    </div>
  );
}
