import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store";
import { Icon } from "../icons";
import PhoneCard from "./PhoneCard";

const FIELDS = [
  ["titular", "Titular"],
  ["bio", "Bio corta"],
  ["whatsapp", "WhatsApp"],
  ["correo", "Correo"],
  ["instagram", "Instagram"],
  ["facebook", "Facebook"],
  ["linkedin", "LinkedIn"],
  ["tiktok", "TikTok"],
  ["calendly", "Calendly"],
  ["web", "Sitio web"],
];

export default function CardEditor() {
  const { user, updateProfile } = useStore();
  const [form, setForm] = useState({ ...user });
  const [saved, setSaved] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    const result = await updateProfile({
      nombre: form.nombre,
      titular: form.titular,
      bio: form.bio,
      whatsapp: form.whatsapp,
      correo: form.correo,
      instagram: form.instagram,
      facebook: form.facebook,
      linkedin: form.linkedin,
      tiktok: form.tiktok,
      calendly: form.calendly,
      web: form.web,
      ciudad: form.ciudad,
    });
    setSaved(result.ok);
  };

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">WhatsApp, redes y textos de tus páginas</p>
          <h1>Datos</h1>
        </div>
        <Link to={`/c/${user.username}`} className="btn ghost slim" target="_blank">
          <Icon name="eye" size={18} />
          Ver
        </Link>
      </header>

      <div className="editor-layout">
        <form className="stack" onSubmit={save}>
          {FIELDS.map(([key, label]) => (
            <label className="field" key={key}>
              <span>{label}</span>
              {key === "bio" ? (
                <textarea rows={3} value={form[key] || ""} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
              ) : (
                <input
                  value={form[key] || ""}
                  inputMode={key === "whatsapp" ? "tel" : "text"}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      [key]: key === "whatsapp" ? event.target.value.replace(/[^\d]/g, "") : event.target.value,
                    })
                  }
                />
              )}
            </label>
          ))}
          <div className="actions">
            <button className="btn primary" type="submit">
              {saved ? "Guardado" : "Guardar datos"}
            </button>
          </div>
        </form>
        <aside className="preview-col">
          <p className="eyebrow">Vista de teléfono</p>
          <PhoneCard person={form} compact />
        </aside>
      </div>
    </div>
  );
}
