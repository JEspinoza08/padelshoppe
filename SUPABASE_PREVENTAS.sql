-- PREVENTAS PADELSHOP
-- Ejecutar una sola vez en Supabase > SQL Editor antes de desplegar el frontend.

alter table public.products
  add column if not exists is_preorder boolean not null default false,
  add column if not exists preorder_percentage numeric(5,2) not null default 50,
  add column if not exists preorder_note text;

alter table public.products
  drop constraint if exists products_preorder_percentage_check;
alter table public.products
  add constraint products_preorder_percentage_check
  check (preorder_percentage > 0 and preorder_percentage <= 100);

-- Datos de la reserva a nivel de orden. El RPC create_complete_order puede recibir
-- estas claves adicionales dentro de p_order; si tu función hace inserts columna por
-- columna, agrega estas 4 asignaciones al INSERT de orders.
alter table public.orders
  add column if not exists fulfillment_type text not null default 'delivery',
  add column if not exists is_preorder boolean not null default false,
  add column if not exists full_retail_total numeric(12,2),
  add column if not exists outstanding_balance numeric(12,2) not null default 0;

comment on column public.products.is_preorder is 'Producto disponible como preventa/reserva.';
comment on column public.products.preorder_percentage is 'Porcentaje del precio total cobrado online para reservar.';
comment on column public.orders.outstanding_balance is 'Saldo pendiente a cancelar en tienda al recoger una preventa.';
