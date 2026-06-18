-- Supabase SQL Schema
-- Run this in your Supabase SQL Editor

create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null default 0,
  category text not null default 'Free Fire',
  status text not null default 'Ready',
  image_url text,
  created_at timestamp with time zone default now()
);

create table if not exists partners (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  wa_channel_url text,
  image_url text,
  status text not null default 'Online',
  created_at timestamp with time zone default now()
);

create table if not exists site_config (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text not null,
  created_at timestamp with time zone default now()
);

-- Sample site_config rows
insert into site_config (key, value) values
  ('whatsapp_number', '6281234567890'),
  ('store_name', 'Pergam Store'),
  ('hero_title', 'Akun game premium, rental aman.'),
  ('hero_subtitle', 'Stock Free Fire, Mobile Legends, rental akun, dan layanan partner dalam satu pengalaman web yang cepat dari mobile.'),
  ('total_transactions', '5K+'),
  ('satisfaction_rate', '99%'),
  ('support_hours', '24/7')
on conflict (key) do nothing;

-- Enable Row Level Security (optional, read-only public access)
alter table products enable row level security;
alter table partners enable row level security;
alter table site_config enable row level security;

create policy "Public read products" on products for select using (true);
create policy "Public read partners" on partners for select using (true);
create policy "Public read site_config" on site_config for select using (true);
-- Supabase SQL Schema
-- Run this in your Supabase SQL Editor

create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null default 0,
  category text not null default 'Free Fire',
  status text not null default 'Ready',
  image_url text,
  created_at timestamp with time zone default now()
);

create table if not exists partners (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  wa_channel_url text,
  image_url text,
  status text not null default 'Online',
  created_at timestamp with time zone default now()
);

create table if not exists site_config (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value text not null,
  created_at timestamp with time zone default now()
);

-- Sample site_config rows
insert into site_config (key, value) values
  ('whatsapp_number', '6281234567890'),
  ('store_name', 'Pergam Store'),
  ('hero_title', 'Akun game premium, rental aman.'),
  ('hero_subtitle', 'Stock Free Fire, Mobile Legends, rental akun, dan layanan partner dalam satu pengalaman web yang cepat dari mobile.'),
  ('total_transactions', '5K+'),
  ('satisfaction_rate', '99%'),
  ('support_hours', '24/7')
on conflict (key) do nothing;

-- Enable Row Level Security (optional, read-only public access)
alter table products enable row level security;
alter table partners enable row level security;
alter table site_config enable row level security;

create policy "Public read products" on products for select using (true);
create policy "Public read partners" on partners for select using (true);
create policy "Public read site_config" on site_config for select using (true);
