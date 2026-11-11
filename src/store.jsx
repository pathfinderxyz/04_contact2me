import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";

const StoreContext = createContext(null);

const PROFILE_FIELDS = {
  nombre: "nombre",
  correo: "correo",
  whatsapp: "whatsapp",
  ciudad: "ciudad",
  titular: "titular",
  bio: "bio",
  instagram: "instagram",
  facebook: "facebook",
  linkedin: "linkedin",
  tiktok: "tiktok",
  calendly: "calendly",
  web: "web",
  pixel: "pixel",
  clarity: "clarity",
  brevo: "brevo",
};

function mapPerfil(row) {
  return {
    id: row.id,
    usuario: row.usuario,
    nombre: row.nombre,
    username: row.username,
    rol: row.rol,
    membresia: row.membresia,
    codigo: row.codigo || "",
    correo: row.correo || "",
    whatsapp: row.whatsapp || "",
    ciudad: row.ciudad || "",
    titular: row.titular || "",
    bio: row.bio || "",
    instagram: row.instagram || "",
    facebook: row.facebook || "",
    linkedin: row.linkedin || "",
    tiktok: row.tiktok || "",
    calendly: row.calendly || "",
    web: row.web || "",
    pixel: row.pixel || "",
    clarity: row.clarity || "",
    brevo: row.brevo || "",
    fechaCreacion: row.fecha_creacion,
  };
}

function mapCampana(row) {
  return {
    id: row.id,
    userId: row.user_id,
    tipo: row.tipo,
    nombre: row.nombre,
    slug: row.slug,
    titular: row.titular || "",
    mensaje: row.mensaje || "",
    whatsapp: row.whatsapp || "",
    estado: row.estado,
    visitas: row.visitas || 0,
  };
}

function mapLead(row) {
  return {
    id: row.id,
    userId: row.user_id,
    campaignId: row.campaign_id,
    nombre: row.nombre,
    correo: row.correo || "",
    telefono: row.telefono || "",
    estado: row.estado,
    fecha: row.fecha,
  };
}

async function readSessionData() {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  if (!session) return { user: null, db: { users: [], campaigns: [], leads: [] } };

  const [perfiles, campanas, leads] = await Promise.all([
    supabase.from("perfiles").select("*"),
    supabase.from("campanas").select("*").order("created_at", { ascending: false }),
    supabase.from("leads").select("*").order("fecha", { ascending: false }),
  ]);

  if (perfiles.error) throw perfiles.error;
  const users = (perfiles.data || []).map(mapPerfil);
  return {
    user: users.find((item) => item.id === session.user.id) || null,
    db: {
      users,
      campaigns: (campanas.data || []).map(mapCampana),
      leads: (leads.data || []).map(mapLead),
    },
  };
}

export function demoDaysLeft(user) {
  if (!user || user.membresia !== "Contact2me Demo" || !user.fechaCreacion) return null;
  const start = new Date(user.fechaCreacion);
  if (Number.isNaN(start.getTime())) return null;
  const elapsed = Math.floor((Date.now() - start.getTime()) / 86400000);
  return Math.max(0, 15 - elapsed);
}

export function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function StoreProvider({ children }) {
  const [db, setDb] = useState({ users: [], campaigns: [], leads: [] });
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const apply = useCallback((next) => {
    setUser(next.user);
    setDb(next.db);
  }, []);

  const reload = useCallback(async () => {
    const next = await readSessionData();
    apply(next);
    return next;
  }, [apply]);

  useEffect(() => {
    let active = true;
    reload()
      .catch((error) => console.error(error))
      .finally(() => {
        if (active) setReady(true);
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        apply({ user: null, db: { users: [], campaigns: [], leads: [] } });
        return;
      }
      setTimeout(() => {
        reload().catch((error) => console.error(error));
      }, 0);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [apply, reload]);

  const api = useMemo(() => {
    const login = async (usuario, clave) => {
      const { data: email, error: lookupError } = await supabase.rpc("email_por_usuario", {
        p_usuario: usuario.trim(),
      });
      if (lookupError || !email) return { ok: false };
      const { error } = await supabase.auth.signInWithPassword({ email, password: clave });
      if (error) return { ok: false };
      await reload();
      return { ok: true };
    };

    const logout = async () => {
      await supabase.auth.signOut();
      apply({ user: null, db: { users: [], campaigns: [], leads: [] } });
    };

    const campaignsFor = (person) => {
      if (!person) return [];
      if (person.rol === "admin") return db.campaigns;
      return db.campaigns.filter((item) => item.userId === person.id);
    };

    const leadsFor = (person) => {
      if (!person) return [];
      const list = person.rol === "admin" ? db.leads : db.leads.filter((item) => item.userId === person.id);
      return [...list].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    };

    const updateProfile = async (patch) => {
      if (!user) return { ok: false };
      const row = {};
      Object.entries(PROFILE_FIELDS).forEach(([key, column]) => {
        if (patch[key] !== undefined) row[column] = patch[key];
      });
      const { error } = await supabase.from("perfiles").update(row).eq("id", user.id);
      if (error) return { ok: false, error: error.message };
      const nextUser = { ...user, ...patch };
      setUser(nextUser);
      setDb((prev) => ({
        ...prev,
        users: prev.users.map((item) => (item.id === user.id ? nextUser : item)),
      }));
      return { ok: true };
    };

    const saveCampaign = async (campaign) => {
      const row = {
        user_id: campaign.userId,
        tipo: campaign.tipo,
        nombre: campaign.nombre,
        slug: campaign.slug,
        titular: campaign.titular || "",
        mensaje: campaign.mensaje || "",
        whatsapp: campaign.whatsapp || "",
        estado: campaign.estado || "activa",
      };
      const query = campaign.id
        ? supabase.from("campanas").update(row).eq("id", campaign.id)
        : supabase.from("campanas").insert(row);
      const { data, error } = await query.select("*").single();
      if (error) return { ok: false, error: error.message };
      const mapped = mapCampana(data);
      setDb((prev) => ({
        ...prev,
        campaigns: campaign.id
          ? prev.campaigns.map((item) => (item.id === mapped.id ? mapped : item))
          : [mapped, ...prev.campaigns],
      }));
      return { ok: true, campaign: mapped };
    };

    const removeCampaign = async (id) => {
      const { error } = await supabase.from("campanas").delete().eq("id", id);
      if (error) return { ok: false, error: error.message };
      setDb((prev) => ({
        ...prev,
        campaigns: prev.campaigns.filter((item) => item.id !== id),
        leads: prev.leads.filter((item) => item.campaignId !== id),
      }));
      return { ok: true };
    };

    const addLead = async (lead) => {
      const { data, error } = await supabase.rpc("crear_lead", {
        p_campaign: lead.campaignId,
        p_nombre: lead.nombre,
        p_correo: lead.correo,
        p_telefono: lead.telefono,
      });
      if (error) return { ok: false, error: error.message };
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) await reload();
      return { ok: true, id: data };
    };

    const updateLead = async (id, patch) => {
      const { error } = await supabase.from("leads").update({ estado: patch.estado }).eq("id", id);
      if (error) return { ok: false, error: error.message };
      setDb((prev) => ({
        ...prev,
        leads: prev.leads.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      }));
      return { ok: true };
    };

    const bumpVisits = async (campaignId) => {
      const { error } = await supabase.rpc("sumar_visita", { p_id: campaignId });
      if (error) return { ok: false };
      setDb((prev) => ({
        ...prev,
        campaigns: prev.campaigns.map((item) =>
          item.id === campaignId ? { ...item, visitas: item.visitas + 1 } : item
        ),
      }));
      return { ok: true };
    };

    return {
      ready,
      db,
      user,
      login,
      logout,
      campaignsFor,
      leadsFor,
      updateProfile,
      saveCampaign,
      removeCampaign,
      addLead,
      updateLead,
      bumpVisits,
    };
  }, [apply, db, ready, reload, user]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore debe usarse dentro de StoreProvider");
  return value;
}
