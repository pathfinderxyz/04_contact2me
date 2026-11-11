import { useState } from "react";
import { useStore } from "../store";

const FIELDS = [
  ["pixel", "Pixel de Facebook", "ID del pixel"],
  ["clarity", "Microsoft Clarity", "ID del proyecto"],
  ["brevo", "Brevo", "Clave o lista"],
];

export default function Integraciones() {
  const { user, updateProfile } = useStore();
  const [form, setForm] = useState({
    pixel: user.pixel || "",
    clarity: user.clarity || "",
    brevo: user.brevo || "",
  });
  const [saved, setSaved] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    const result = await updateProfile(form);
    setSaved(result.ok);
  };

  return (
    <div className="page narrow">
      <header className="page-head">
        <div>
          <p className="eyebrow">Medición y correo</p>
          <h1>Pixels y correo</h1>
        </div>
      </header>
      <form className="stack" onSubmit={save}>
        {FIELDS.map(([key, label, placeholder]) => (
          <label className="field" key={key}>
            <span>{label}</span>
            <input
              value={form[key]}
              placeholder={placeholder}
              onChange={(event) => {
                setSaved(false);
                setForm({ ...form, [key]: event.target.value });
              }}
            />
          </label>
        ))}
        <button className="btn primary" type="submit">
          {saved ? "Guardado" : "Guardar"}
        </button>
      </form>
    </div>
  );
}
