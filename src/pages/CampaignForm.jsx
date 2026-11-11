import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { slugify, useStore } from "../store";
import { Back } from "../shell";

const empty = {
  tipo: "",
  nombre: "",
  slug: "",
  titular: "",
  mensaje: "",
  whatsapp: "",
  estado: "activa",
};

function CampaignForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, db, saveCampaign, removeCampaign } = useStore();
  const existing = id ? db.campaigns.find((item) => String(item.id) === id) : null;
  const [form, setForm] = useState(() =>
    existing
      ? { ...existing }
      : { ...empty, whatsapp: user.whatsapp || "" }
  );
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  if (id && !existing) {
    return (
      <div className="page">
        <Back to="/app/campanas" label="Campañas" />
        <div className="empty">
          <h2>No encontramos esa campaña</h2>
        </div>
      </div>
    );
  }

  if (existing && user.rol !== "admin" && existing.userId !== user.id) {
    return (
      <div className="page">
        <Back to="/app/campanas" label="Campañas" />
        <div className="empty">
          <h2>Esta campaña no es tuya</h2>
        </div>
      </div>
    );
  }

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = async (event) => {
    event.preventDefault();
    let slug = slugify(form.slug || form.nombre);
    if (!form.nombre || !form.tipo || !slug) return;
    const taken = db.campaigns.some((item) => item.slug === slug && item.id !== form.id);
    if (taken) slug = `${slug}-${String(user.id).slice(0, 4)}`;
    setError("");
    const result = await saveCampaign({
      id: form.id,
      userId: form.userId || user.id,
      tipo: form.tipo,
      nombre: form.nombre,
      slug,
      titular: form.titular,
      mensaje: form.mensaje,
      whatsapp: form.whatsapp,
      estado: form.estado,
      visitas: form.visitas || 0,
    });
    if (!result.ok) {
      setError("No se pudo guardar. Prueba con otro enlace.");
      return;
    }
    navigate("/app/campanas");
  };

  const copy = async () => {
    const url = `${window.location.origin}/c/${form.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="page narrow">
      <Back to="/app/campanas" label="Campañas" />
      <header className="page-head">
        <div>
          <p className="eyebrow">{existing ? "Editar" : "Nueva campaña"}</p>
          <h1>{existing ? form.nombre : "Elige el tipo"}</h1>
        </div>
      </header>

      {!form.tipo && (
        <div className="type-grid">
          <button type="button" className="type-card" onClick={() => set("tipo", "video")}>
            <strong>Video</strong>
            <span>Una presentación corta y un formulario para que te escriban.</span>
          </button>
          <button type="button" className="type-card" onClick={() => set("tipo", "audiencia")}>
            <strong>Audiencia</strong>
            <span>Una invitación directa: cupo, clase o conversación.</span>
          </button>
        </div>
      )}

      {form.tipo && (
        <form className="stack" onSubmit={save}>
          <div className="type-switch">
            <button type="button" className={form.tipo === "video" ? "on" : ""} onClick={() => set("tipo", "video")}>
              Video
            </button>
            <button
              type="button"
              className={form.tipo === "audiencia" ? "on" : ""}
              onClick={() => set("tipo", "audiencia")}
            >
              Audiencia
            </button>
          </div>
          <label className="field">
            <span>Nombre interno</span>
            <input
              value={form.nombre}
              onChange={(event) => {
                const nombre = event.target.value;
                setForm((prev) => ({
                  ...prev,
                  nombre,
                  slug: prev.id ? prev.slug : slugify(nombre),
                }));
              }}
              required
            />
          </label>
          <label className="field">
            <span>Enlace</span>
            <input value={form.slug} onChange={(event) => set("slug", slugify(event.target.value))} required />
          </label>
          <label className="field">
            <span>Titular público</span>
            <input value={form.titular} onChange={(event) => set("titular", event.target.value)} required />
          </label>
          <label className="field">
            <span>Mensaje</span>
            <textarea rows={4} value={form.mensaje} onChange={(event) => set("mensaje", event.target.value)} />
          </label>
          <label className="field">
            <span>WhatsApp</span>
            <input
              inputMode="tel"
              value={form.whatsapp}
              onChange={(event) => set("whatsapp", event.target.value.replace(/[^\d]/g, ""))}
              placeholder="50688881234"
            />
          </label>
          <label className="field">
            <span>Estado</span>
            <select value={form.estado} onChange={(event) => set("estado", event.target.value)}>
              <option value="activa">Activa</option>
              <option value="pausada">Pausada</option>
            </select>
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="actions">
            <button className="btn primary" type="submit">
              Guardar
            </button>
            {form.slug && (
              <button className="btn ghost" type="button" onClick={copy}>
                {copied ? "Enlace copiado" : "Copiar enlace"}
              </button>
            )}
            {existing && (
              <button
                className="btn danger"
                type="button"
                onClick={() => {
                  if (window.confirm("¿Eliminar esta campaña?")) {
                    removeCampaign(existing.id);
                    navigate("/app/campanas");
                  }
                }}
              >
                Eliminar
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default function CampaignFormRoute() {
  const { id } = useParams();
  return <CampaignForm key={id || "nueva"} />;
}
