-- ═══════════════════════════════════════════════
--  QUIKCART DATABASE SCHEMA
--  Run this in Supabase > SQL Editor
-- ═══════════════════════════════════════════════

-- PRODUCTS TABLE
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  amazon_asin text not null,
  amazon_url text not null,
  image_url text,
  emoji text,
  category text,
  badge text,
  rating numeric(3,1) default 4.5,
  reviews integer default 0,
  in_stock boolean default true,
  created_at timestamp default now()
);

-- CUSTOMERS TABLE
create table customers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  address_line1 text,
  address_line2 text,
  city text,
  postcode text,
  country text default 'GB',
  created_at timestamp default now()
);

-- ORDERS TABLE
create table orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  customer_id uuid references customers(id),
  customer_email text not null,
  customer_name text not null,
  delivery_address jsonb not null,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  markup numeric(10,2) not null,
  total numeric(10,2) not null,
  stripe_payment_intent text unique,
  stripe_session_id text,
  payment_status text default 'pending',
  fulfillment_status text default 'pending',
  amazon_order_id text,
  amazon_order_placed_at timestamp,
  refund_status text default 'none',
  refund_initiated_by text,
  notes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ORDER ITEMS (flat copy for receipts)
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id),
  product_id uuid references products(id),
  product_name text not null,
  product_emoji text,
  amazon_asin text not null,
  amazon_url text not null,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null,
  total_price numeric(10,2) not null
);

-- REFUND REQUESTS (blocked unless you initiate)
create table refund_requests (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id),
  requested_by text default 'customer',
  status text default 'blocked',
  reason text,
  approved_by_owner boolean default false,
  stripe_refund_id text,
  created_at timestamp default now()
);

-- ROW LEVEL SECURITY — customers can only read their own orders
alter table orders enable row level security;
alter table customers enable row level security;

create policy "Customers read own orders"
  on orders for select
  using (customer_email = auth.jwt()->>'email');

-- Only service role (your backend) can insert/update orders
create policy "Service role full access orders"
  on orders for all
  using (auth.role() = 'service_role');

-- Auto-generate order number
create or replace function generate_order_number()
returns trigger as $$
begin
  new.order_number := 'QC-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(new.id::text, 1, 6));
  return new;
end;
$$ language plpgsql;

create trigger set_order_number
  before insert on orders
  for each row execute function generate_order_number();

-- Sample products (add your own Amazon ASINs)
insert into products (name, description, price, original_price, amazon_asin, amazon_url, emoji, category, badge, rating, reviews) values
('Sony WH-1000XM5 Headphones', 'Industry-leading noise cancellation', 219.00, 349.00, 'B09XS7JWHH', 'https://www.amazon.co.uk/dp/B09XS7JWHH', '🎧', 'Electronics', 'Hot Deal', 4.8, 4821),
('Instant Pot Duo 7-in-1', '6Qt multi-use pressure cooker', 79.00, 129.00, 'B00FLYWNYQ', 'https://www.amazon.co.uk/dp/B00FLYWNYQ', '🍲', 'Home & Living', 'Best Seller', 4.7, 12043),
('Kindle Paperwhite 16GB', 'Waterproof e-reader with glare-free display', 109.00, 179.00, 'B08KTZ8249', 'https://www.amazon.co.uk/dp/B08KTZ8249', '📖', 'Electronics', 'Hot Deal', 4.8, 9432),
('Premium Yoga Mat 6mm', 'Non-slip, eco-friendly, thick cushioning', 27.00, 45.00, 'B0748DL4WW', 'https://www.amazon.co.uk/dp/B0748DL4WW', '🧘', 'Wellness', null, 4.6, 3201),
('Digital Air Fryer XL 5.8Qt', 'Smart touch display, rapid air technology', 79.00, 149.00, 'B07GJBBGHG', 'https://www.amazon.co.uk/dp/B07GJBBGHG', '🍟', 'Home & Living', 'Best Seller', 4.7, 23901),
('Atomic Habits', 'James Clear — life-changing habits', 9.00, 18.00, '0735211299', 'https://www.amazon.co.uk/dp/0735211299', '📚', 'Books', 'Best Seller', 4.9, 78432);
