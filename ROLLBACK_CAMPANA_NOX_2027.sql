-- ROLLBACK - elimina únicamente lo agregado para el control de campaña NOX 2027.
-- Ejecutar solo si deseas revertir esta implementación.

drop policy if exists "Admins can update site campaigns" on public.site_campaigns;
drop policy if exists "Public can read site campaigns" on public.site_campaigns;
drop table if exists public.site_campaigns;
