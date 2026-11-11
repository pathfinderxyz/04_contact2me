import { Navigate } from "react-router-dom";
import { useStore } from "../store";
import { Back } from "../shell";

export default function Users() {
  const { user, db } = useStore();
  if (user.rol !== "admin") return <Navigate to="/app" replace />;

  return (
    <div className="page">
      <Back to="/app/mas" label="Más" />
      <header className="page-head">
        <div>
          <p className="eyebrow">Quienes usan Contact2me</p>
          <h1>Cuentas</h1>
        </div>
      </header>
      <div className="lead-table">
        <div className="lead-head users">
          <span>Persona</span>
          <span>Plan</span>
          <span>Campañas</span>
          <span>Leads</span>
        </div>
        {db.users.map((person) => (
          <div key={person.id} className="lead-row users">
            <span>
              <strong>{person.nombre}</strong>
              <small>@{person.username}</small>
            </span>
            <span>{person.membresia.replace("Contact2me ", "")}</span>
            <span>{db.campaigns.filter((item) => item.userId === person.id).length}</span>
            <span>{db.leads.filter((item) => item.userId === person.id).length}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
