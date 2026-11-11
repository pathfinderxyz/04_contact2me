import { readFileSync } from "node:fs";
import pg from "pg";

const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1)];
    })
);

const people = [
  {
    usuario: "ana",
    clave: "ana1234",
    email: "ana@contact2me.app",
    nombre: "Ana Solís",
    username: "anasolis",
    rol: "cliente",
    membresia: "Contact2me Pro",
    codigo: "C2M-2041",
    correo: "ana@contact2me.app",
    whatsapp: "50688881234",
    ciudad: "San José",
    titular: "Convierto conversaciones en clientes.",
    bio: "Mentora comercial. Respondo el mismo día.",
    instagram: "https://instagram.com/anasolis",
    facebook: "",
    linkedin: "https://linkedin.com/in/anasolis",
    tiktok: "",
    calendly: "https://calendly.com/anasolis",
    web: "https://anasolis.com",
    fecha_creacion: "2026-06-02",
  },
  {
    usuario: "lucas",
    clave: "lucas1234",
    email: "lucas@contact2me.app",
    nombre: "Lucas Vargas",
    username: "lucasv",
    rol: "cliente",
    membresia: "Contact2me Demo",
    codigo: "C2M-DEMO",
    correo: "lucas@contact2me.app",
    whatsapp: "50670001122",
    ciudad: "Heredia",
    titular: "Te muestro cómo armar tu primera tarjeta.",
    bio: "Estoy probando Contact2me con mi red cercana.",
    instagram: "",
    facebook: "",
    linkedin: "",
    tiktok: "",
    calendly: "",
    web: "",
    fecha_creacion: "2026-10-30",
  },
  {
    usuario: "admin",
    clave: "admin123",
    email: "diego@contact2me.app",
    nombre: "Diego Mora",
    username: "diego",
    rol: "admin",
    membresia: "Equipo",
    codigo: "C2M-ADMIN",
    correo: "diego@contact2me.app",
    whatsapp: "50660001000",
    ciudad: "San José",
    titular: "Equipo Contact2me",
    bio: "Administración de la plataforma.",
    instagram: "",
    facebook: "",
    linkedin: "",
    tiktok: "",
    calendly: "",
    web: "",
    fecha_creacion: "2026-01-15",
  },
];

const headers = {
  apikey: env.SUPABASE_SECRET_KEY,
  "Content-Type": "application/json",
};

async function api(path, options = {}) {
  const response = await fetch(`${env.VITE_SUPABASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${response.status} ${path} ${text.slice(0, 300)}`);
  }
  return text ? JSON.parse(text) : null;
}

async function ensureUser(person) {
  const created = await fetch(`${env.VITE_SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: person.email,
      password: person.clave,
      email_confirm: true,
    }),
  });
  if (created.ok) return (await created.json()).id;
  const listed = await api("/auth/v1/admin/users?page=1&per_page=200");
  const found = (listed.users || []).find((user) => user.email === person.email);
  if (!found) throw new Error(`No se pudo crear ${person.usuario}`);
  return found.id;
}

async function seed() {
  const ids = {};
  for (const person of people) {
    const id = await ensureUser(person);
    ids[person.usuario] = id;
    const { clave, email, ...profile } = person;
    await api("/rest/v1/perfiles?on_conflict=id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ ...profile, id, correo_login: email }),
    });
    console.log("perfil", person.usuario);
  }

  const campaigns = [
    {
      user_id: ids.ana,
      tipo: "video",
      nombre: "Presentación",
      slug: "anasolis",
      titular: "Mira esto antes de escribirme",
      mensaje: "Un video corto y, si te hace sentido, déjame tus datos. Te contacto por WhatsApp.",
      whatsapp: "50688881234",
      estado: "activa",
      visitas: 128,
    },
    {
      user_id: ids.ana,
      tipo: "audiencia",
      nombre: "Masterclass de cierre",
      slug: "masterclass-ana",
      titular: "Cupos para la masterclass de esta semana",
      mensaje: "Cuéntame tu nombre y te reservo el lugar. Sin formularios eternos.",
      whatsapp: "50688881234",
      estado: "activa",
      visitas: 86,
    },
    {
      user_id: ids.lucas,
      tipo: "video",
      nombre: "Hola, soy Lucas",
      slug: "lucasv",
      titular: "Así trabajo con mis primeros clientes",
      mensaje: "Si quieres que conversemos, déjame tu WhatsApp.",
      whatsapp: "50670001122",
      estado: "pausada",
      visitas: 14,
    },
  ];

  const saved = await api("/rest/v1/campanas?on_conflict=slug", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(campaigns),
  });
  console.log("campanas", saved.length);

  const bySlug = Object.fromEntries(saved.map((item) => [item.slug, item.id]));
  const samples = [
    ["anasolis", "María Chen", "maria.chen@correo.com", "+506 8888 1001", "nuevo", "2026-11-08T15:20:00.000Z"],
    ["masterclass-ana", "José Delgado", "jose.delgado@correo.com", "+506 7111 2244", "contactado", "2026-11-07T18:05:00.000Z"],
    ["anasolis", "Camila Rojas", "camila.rojas@correo.com", "+506 6222 9090", "nuevo", "2026-11-06T12:40:00.000Z"],
    ["lucasv", "Pedro Solano", "pedro.solano@correo.com", "+506 8333 4455", "cerrado", "2026-11-04T09:10:00.000Z"],
  ];

  for (const [slug, nombre, correo, telefono, estado, fecha] of samples) {
    const campaignId = bySlug[slug];
    const existing = await api(
      `/rest/v1/leads?select=id&campaign_id=eq.${campaignId}&correo=eq.${encodeURIComponent(correo)}`
    );
    if (existing.length) continue;
    const owner = saved.find((item) => item.id === campaignId).user_id;
    await api("/rest/v1/leads", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        user_id: owner,
        campaign_id: campaignId,
        nombre,
        correo,
        telefono,
        estado,
        fecha,
      }),
    });
  }
  console.log("leads listos");
}

if (!env.DATABASE_URL) {
  console.error("Falta DATABASE_URL en .env para crear las tablas.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await client.connect();
await client.query(readFileSync(new URL("../supabase/schema.sql", import.meta.url), "utf8"));
await client.end();
console.log("tablas listas");
await seed();
