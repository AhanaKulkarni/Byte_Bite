-- Run this in the Supabase SQL Editor to set up your Byte & Bite tables

-- 1. Create the Users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  college TEXT NOT NULL,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turn on Row Level Security for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- Allow users to insert their own profile during registration
CREATE POLICY "Users can insert own profile" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. Create Stalls table
CREATE TABLE public.stalls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_open BOOLEAN DEFAULT true
);

-- Allow anyone to read stalls
ALTER TABLE public.stalls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view stalls" ON public.stalls FOR SELECT USING (true);

-- Insert the two stalls
INSERT INTO public.stalls (name, description, image_url, is_open) VALUES
  ('Byte & Bite', 'The main campus snack cafe', '/images/byte-bite.jpg', true),
  ('Cafe 101', 'Premium beverages and bites', '/images/cafe-101.jpg', true);

-- 3. Create Menu Items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stall_id UUID REFERENCES public.stalls(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_veg BOOLEAN DEFAULT true
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view menu items" ON public.menu_items FOR SELECT USING (true);

-- 4. Create Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  stall_id UUID REFERENCES public.stalls(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, preparing, ready, completed, cancelled
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
  pickup_time TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Create Order Items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id),
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
);
