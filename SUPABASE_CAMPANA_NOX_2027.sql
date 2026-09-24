-- PadelShop - Control de campaña NOX 2027 desde Admin
-- Ejecutar una sola vez en Supabase SQL Editor.

create table if not exists public.site_campaigns (
  id text primary key,
  is_active boolean not null default false,
  show_popup boolean not null default true,
  show_home_video boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.site_campaigns (id, is_active, show_popup, show_home_video)
values ('nox_2027', true, true, true)
on conflict (id) do nothing;

alter table public.site_campaigns enable row level security;

-- El Home necesita poder leer si la campaña está activa.
drop policy if exists "Public can read site campaigns" on public.site_campaigns;
create policy "Public can read site campaigns"
on public.site_campaigns for select
to anon, authenticated
using (true);

-- Solo usuarios cuyo profile sea admin pueden modificar la campaña.
drop policy if exists "Admins can update site campaigns" on public.site_campaigns;
create policy "Admins can update site campaigns"
on public.site_campaigns for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

grant select on public.site_campaigns to anon, authenticated;
grant update on public.site_campaigns to authenticated;
