import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useStore } from "../store";
import PhoneCard from "./PhoneCard";

export default function PublicPage() {
  const { slug } = useParams();
  const { addLead } = useStore();
  const [page, setPage] = useState(null);
  const [status, setStatus] = useState("loading");
  const [form, setForm] = useState({ nombre: "", correo: "", telefono: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setDone(false);
    supabase.rpc("pagina_publica", { p_slug: slug }).then(({ data, error: rpcError }) => {
      if (!active) return;
      if (rpcError || !data?.person) {
        setPage(null);
        setStatus("missing");
        return;
      }
      setPage(data);
      setStatus("ready");
    });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    const campaignId = page?.campaign?.id;
    if (!campaignId) return;
    const key = `c2m-visit-${campaignId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    supabase.rpc("sumar_visita", { p_id: campaignId });
  }, [page]);

  if (status === "loading") {
    return (
      <div className="public missing">
        <h1>Cargando…</h1>
      </div>
    );
  }

  if (status === "missing" || !page?.person) {
    return (
      <div className="public missing">
        <h1>Este enlace no existe</h1>
        <Link to="/">Ir a Contact2me</Link>
      </div>
    );
  }

  const { person, campaign } = page;
  const profile = campaign
    ? { ...person, titular: campaign.titular || person.titular, whatsapp: campaign.whatsapp || person.whatsapp }
    : person;

  const submit = async (event) => {
    event.preventDefault();
    if (!form.nombre.trim() || !form.correo.trim() || !form.telefono.trim()) {
      setError("Completa nombre, correo y teléfono.");
      return;
    }
    if (!campaign) {
      setError("Esta tarjeta todavía no tiene una campaña activa.");
      return;
    }
    const result = await addLead({
      campaignId: campaign.id,
      nombre: form.nombre.trim(),
      correo: form.correo.trim(),
      telefono: form.telefono.trim(),
    });
    if (!result.ok) {
      setError("No se pudo enviar. Intenta de nuevo.");
      return;
    }
    setError("");
    setDone(true);
  };

  return (
    <div className="public">
      <div className="public-wrap">
        <PhoneCard person={profile}>
          {campaign && <p className="campaign-note">{campaign.mensaje}</p>}
          {campaign?.estado === "pausada" && <p className="form-error">Esta campaña está en pausa.</p>}
          {done ? (
            <div className="thanks">
              <strong>Listo, {form.nombre.split(" ")[0]}.</strong>
              <p>{person.nombre.split(" ")[0]} ya tiene tus datos.</p>
            </div>
          ) : (
            <form className="stack" onSubmit={submit}>
              <label className="field">
                <span>Nombre</span>
                <input value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} />
              </label>
              <label className="field">
                <span>Correo</span>
                <input
                  type="email"
                  value={form.correo}
                  onChange={(event) => setForm({ ...form, correo: event.target.value })}
                />
              </label>
              <label className="field">
                <span>Teléfono</span>
                <input
                  inputMode="tel"
                  value={form.telefono}
                  onChange={(event) => setForm({ ...form, telefono: event.target.value })}
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button className="btn primary" type="submit" disabled={campaign?.estado === "pausada"}>
                Quiero que me contacten
              </button>
            </form>
          )}
        </PhoneCard>
        <p className="public-foot">
          Hecho con <Link to="/">Contact2me</Link>
        </p>
      </div>
    </div>
  );
}
