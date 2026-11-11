create table if not exists public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  usuario text unique not null,
  nombre text not null,
  username text unique not null,
  rol text not null default 'cliente' check (rol in ('cliente', 'admin')),
  membresia text not null default 'Contact2me Demo',
  codigo text,
  correo text,
  correo_login text unique,
  whatsapp text default '',
  ciudad text default '',
  titular text default '',
  bio text default '',
  instagram text default '',
  facebook text default '',
  linkedin text default '',
  tiktok text default '',
  calendly text default '',
  web text default '',
  pixel text default '',
  clarity text default '',
  brevo text default '',
  fecha_creacion date default current_date
);

create table if not exists public.campanas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.perfiles (id) on delete cascade,
  tipo text not null check (tipo in ('video', 'audiencia')),
  nombre text not null,
  slug text unique not null,
  titular text default '',
  mensaje text default '',
  whatsapp text default '',
  estado text not null default 'activa' check (estado in ('activa', 'pausada')),
  visitas integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.perfiles (id) on delete cascade,
  campaign_id uuid not null references public.campanas (id) on delete cascade,
  nombre text not null,
  correo text default '',
  telefono text default '',
  estado text not null default 'nuevo' check (estado in ('nuevo', 'contactado', 'cerrado')),
  fecha timestamptz not null default now()
);

create index if not exists campanas_user_id_idx on public.campanas (user_id);
create index if not exists leads_user_id_idx on public.leads (user_id);
create index if not exists leads_campaign_id_idx on public.leads (campaign_id);

alter table public.perfiles enable row level security;
alter table public.campanas enable row level security;
alter table public.leads enable row level security;

create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfiles
    where id = auth.uid() and rol = 'admin'
  );
$$;

create or replace function public.email_por_usuario(p_usuario text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select correo_login
  from public.perfiles
  where lower(usuario) = lower(trim(p_usuario))
  limit 1;
$$;

create or replace function public.pagina_publica(p_slug text)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result json;
begin
  select json_build_object(
    'campaign', json_build_object(
      'id', c.id,
      'userId', c.user_id,
      'tipo', c.tipo,
      'nombre', c.nombre,
      'slug', c.slug,
      'titular', c.titular,
      'mensaje', c.mensaje,
      'whatsapp', c.whatsapp,
      'estado', c.estado,
      'visitas', c.visitas
    ),
    'person', json_build_object(
      'id', p.id,
      'nombre', p.nombre,
      'username', p.username,
      'titular', p.titular,
      'bio', p.bio,
      'whatsapp', p.whatsapp,
      'correo', p.correo,
      'instagram', p.instagram,
      'facebook', p.facebook,
      'linkedin', p.linkedin,
      'tiktok', p.tiktok,
      'calendly', p.calendly,
      'web', p.web
    )
  )
  into result
  from public.campanas c
  join public.perfiles p on p.id = c.user_id
  where c.slug = p_slug;

  if result is null then
    select json_build_object(
      'campaign', null,
      'person', json_build_object(
        'id', p.id,
        'nombre', p.nombre,
        'username', p.username,
        'titular', p.titular,
        'bio', p.bio,
        'whatsapp', p.whatsapp,
        'correo', p.correo,
        'instagram', p.instagram,
        'facebook', p.facebook,
        'linkedin', p.linkedin,
        'tiktok', p.tiktok,
        'calendly', p.calendly,
        'web', p.web
      )
    )
    into result
    from public.perfiles p
    where p.username = p_slug;
  end if;

  return result;
end;
$$;

create or replace function public.sumar_visita(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.campanas
  set visitas = visitas + 1
  where id = p_id;
end;
$$;

create or replace function public.crear_lead(
  p_campaign uuid,
  p_nombre text,
  p_correo text,
  p_telefono text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
  owner uuid;
begin
  if length(trim(coalesce(p_nombre, ''))) = 0
    or length(trim(coalesce(p_correo, ''))) = 0
    or length(trim(coalesce(p_telefono, ''))) = 0 then
    raise exception 'Datos incompletos';
  end if;

  select user_id into owner
  from public.campanas
  where id = p_campaign and estado = 'activa';

  if owner is null then
    raise exception 'Campaña no disponible';
  end if;

  insert into public.leads (user_id, campaign_id, nombre, correo, telefono)
  values (owner, p_campaign, trim(p_nombre), trim(p_correo), trim(p_telefono))
  returning id into new_id;

  return new_id;
end;
$$;

create or replace function public.proteger_perfil()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.es_admin() then
    new.rol := old.rol;
    new.usuario := old.usuario;
    new.username := old.username;
    new.membresia := old.membresia;
    new.codigo := old.codigo;
    new.correo_login := old.correo_login;
    new.fecha_creacion := old.fecha_creacion;
  end if;
  return new;
end;
$$;

drop trigger if exists proteger_perfil on public.perfiles;
create trigger proteger_perfil
before update on public.perfiles
for each row execute function public.proteger_perfil();

drop policy if exists "ver propio o admin" on public.perfiles;
create policy "ver propio o admin"
on public.perfiles
for select
to authenticated
using (id = auth.uid() or public.es_admin());

drop policy if exists "editar propio" on public.perfiles;
create policy "editar propio"
on public.perfiles
for update
to authenticated
using (id = auth.uid() or public.es_admin())
with check (id = auth.uid() or public.es_admin());

drop policy if exists "leer campanas" on public.campanas;
create policy "leer campanas"
on public.campanas
for select
to authenticated
using (user_id = auth.uid() or public.es_admin());

drop policy if exists "pagina publica" on public.campanas;
create policy "pagina publica"
on public.campanas
for select
to anon
using (true);

drop policy if exists "crear campanas" on public.campanas;
create policy "crear campanas"
on public.campanas
for insert
to authenticated
with check (user_id = auth.uid() or public.es_admin());

drop policy if exists "editar campanas" on public.campanas;
create policy "editar campanas"
on public.campanas
for update
to authenticated
using (user_id = auth.uid() or public.es_admin())
with check (user_id = auth.uid() or public.es_admin());

drop policy if exists "borrar campanas" on public.campanas;
create policy "borrar campanas"
on public.campanas
for delete
to authenticated
using (user_id = auth.uid() or public.es_admin());

drop policy if exists "leer leads" on public.leads;
create policy "leer leads"
on public.leads
for select
to authenticated
using (user_id = auth.uid() or public.es_admin());

drop policy if exists "editar leads" on public.leads;
create policy "editar leads"
on public.leads
for update
to authenticated
using (user_id = auth.uid() or public.es_admin())
with check (user_id = auth.uid() or public.es_admin());

revoke all on public.perfiles from anon;
revoke all on public.leads from anon;
grant select, update on public.perfiles to authenticated;
grant select, insert, update, delete on public.campanas to authenticated;
grant select on public.campanas to anon;
grant select, update on public.leads to authenticated;
grant select, insert, update, delete on public.perfiles to service_role;
grant select, insert, update, delete on public.campanas to service_role;
grant select, insert, update, delete on public.leads to service_role;

revoke all on function public.es_admin() from public;
grant execute on function public.es_admin() to authenticated;

revoke all on function public.email_por_usuario(text) from public;
grant execute on function public.email_por_usuario(text) to anon, authenticated;

revoke all on function public.pagina_publica(text) from public;
grant execute on function public.pagina_publica(text) to anon, authenticated;

revoke all on function public.sumar_visita(uuid) from public;
grant execute on function public.sumar_visita(uuid) to anon, authenticated;

revoke all on function public.crear_lead(uuid, text, text, text) from public;
grant execute on function public.crear_lead(uuid, text, text, text) to anon, authenticated;
