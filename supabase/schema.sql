-- Create extension for UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  college TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ
);

-- STALLS TABLE
CREATE TABLE IF NOT EXISTS public.stalls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stall_id UUID NOT NULL REFERENCES public.stalls(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  prep_time_minutes INTEGER DEFAULT 5,
  is_veg BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stall_id UUID REFERENCES public.stalls(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  applicable_day_of_week INTEGER, -- 1(Mon) to 7(Sun)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- DAILY SEQUENCES
CREATE TABLE IF NOT EXISTS public.daily_sequences (
  order_date DATE PRIMARY KEY,
  last_sequence INTEGER DEFAULT 0
);

-- PICKUP SLOTS
CREATE TABLE IF NOT EXISTS public.pickup_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 20,
  is_active BOOLEAN DEFAULT true
);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_order_number INTEGER NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id),
  stall_id UUID NOT NULL REFERENCES public.stalls(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'payment_verified', 'accepted', 'preparing', 'ready', 'completed', 'declined', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  net_amount DECIMAL(10, 2) NOT NULL,
  pickup_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  decline_reason TEXT
);

-- ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id),
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  screenshot_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_by UUID REFERENCES public.users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- DAILY REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.daily_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_date DATE UNIQUE NOT NULL,
  total_orders INTEGER NOT NULL,
  completed_orders INTEGER NOT NULL,
  gross_sales DECIMAL(10, 2) NOT NULL,
  discounts DECIMAL(10, 2) NOT NULL,
  net_sales DECIMAL(10, 2) NOT NULL,
  byte_and_bite_sales DECIMAL(10, 2) NOT NULL,
  cafe_101_sales DECIMAL(10, 2) NOT NULL,
  report_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS POLICIES

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;

-- 1. Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- 2. Stalls, Categories, Menu Items, Pickup Slots, Offers are readable by all authenticated users
CREATE POLICY "Anyone can view stalls" ON public.stalls FOR SELECT USING (true);
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Anyone can view offers" ON public.offers FOR SELECT USING (true);
CREATE POLICY "Anyone can view pickup slots" ON public.pickup_slots FOR SELECT USING (true);

-- 3. Admins can insert/update/delete Stalls, Categories, Menu Items, Offers
CREATE POLICY "Admins can manage stalls" ON public.stalls USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage categories" ON public.categories USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage menu items" ON public.menu_items USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage offers" ON public.offers USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage pickup slots" ON public.pickup_slots USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 4. Orders and Order Items
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update all orders" ON public.orders FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid()));
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 5. Payments
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE id = payments.order_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert own payments" ON public.payments FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE id = payments.order_id AND user_id = auth.uid()));
CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update all payments" ON public.payments FOR UPDATE USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 6. Storage (Need to create bucket "payments" manually in Supabase UI)
-- Creating bucket via SQL (if pg_graphql/storage extension is enabled)
-- Insert into storage.buckets (id, name) VALUES ('payments', 'payments');

-- Function to handle order number sequence
CREATE OR REPLACE FUNCTION generate_daily_order_number()
RETURNS trigger AS $$
DECLARE
  seq_num INTEGER;
  today DATE := CURRENT_DATE;
BEGIN
  -- Lock the row to prevent race conditions
  INSERT INTO public.daily_sequences (order_date, last_sequence)
  VALUES (today, 1)
  ON CONFLICT (order_date) DO UPDATE
  SET last_sequence = daily_sequences.last_sequence + 1
  RETURNING last_sequence INTO seq_num;
  
  NEW.daily_order_number := seq_num;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_daily_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_daily_order_number();

-- Update timestamp on orders
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
