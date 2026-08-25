-- ═══════════════════════════════════════════════
--  QUIKCART DATABASE SCHEMA
--  Run this in Supabase → SQL Editor
--  Run ONCE when setting up for the first time
-- ═══════════════════════════════════════════════

-- PRODUCTS TABLE
create table if not exists products (
  id               uuid default gen_random_uuid() primary key,
  name             text not null,
  description      text,
  price            numeric(10,2) not null,
  original_price   numeric(10,2),
  ali_product_id   text unique,
  ali_url          text,
  image_url        text,
  gallery          jsonb,
  emoji            text default '📦',
  category         text default 'General',
  badge            text,
  rating           numeric(3,1) default 4.5,
  reviews          integer default 0,
  condition        text default 'New',
  seller           text,
  in_stock         boolean default true,
  created_at       timestamp default now()
);

-- CUSTOMERS TABLE
create table if not exists customers (
  id           uuid default gen_random_uuid() primary key,
  email        text unique not null,
  name         text,
  created_at   timestamp default now()
);

-- ORDERS TABLE
create table if not exists orders (
  id                       uuid default gen_random_uuid() primary key,
  order_number             text unique,
  customer_id              uuid references customers(id),
  customer_email           text not null,
  customer_name            text not null,
  delivery_address         jsonb not null,
  items                    jsonb not null,
  subtotal                 numeric(10,2) not null,
  markup                   numeric(10,2) default 0,
  total                    numeric(10,2) not null,
  stripe_payment_intent    text unique,
  stripe_session_id        text,
  payment_status           text default 'pending',
  fulfillment_status       text default 'pending',
  refund_status            text default 'none',
  notes                    text,
  created_at               timestamp default now(),
  updated_at               timestamp default now()
);

-- ORDER ITEMS TABLE
create table if not exists order_items (
  id              uuid default gen_random_uuid() primary key,
  order_id        uuid references orders(id),
  product_id      uuid references products(id),
  product_name    text not null,
  product_emoji   text,
  ali_product_id  text,
  ali_url         text,
  quantity        integer not null default 1,
  unit_price      numeric(10,2) not null,
  total_price     numeric(10,2) not null
);

-- REFUND REQUESTS TABLE
create table if not exists refund_requests (
  id                  uuid default gen_random_uuid() primary key,
  order_id            uuid references orders(id),
  status              text default 'pending',
  reason              text,
  approved_by_owner   boolean default false,
  stripe_refund_id    text,
  created_at          timestamp default now()
);

-- AUTO-GENERATE ORDER NUMBER
create or replace function generate_order_number()
returns trigger as $$
begin
  new.order_number := 'QC-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(new.id::text, 1, 6));
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_order_number on orders;
create trigger set_order_number
  before insert on orders
  for each row execute function generate_order_number();

-- ROW LEVEL SECURITY
alter table orders   enable row level security;
alter table customers enable row level security;

drop policy if exists "Service role full access orders"   on orders;
drop policy if exists "Service role full access customers" on customers;

create policy "Service role full access orders"
  on orders for all using (auth.role() = 'service_role');

create policy "Service role full access customers"
  on customers for all using (auth.role() = 'service_role');
