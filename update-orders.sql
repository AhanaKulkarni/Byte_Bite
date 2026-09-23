-- Run this in your Supabase SQL Editor

-- 1. Add UTR number for manual payment verification
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'utr_number') THEN
    ALTER TABLE public.orders ADD COLUMN utr_number TEXT;
  END IF;
END $$;

-- 2. Add variant_name to order_items so we know which size they ordered!
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'variant_name') THEN
    ALTER TABLE public.order_items ADD COLUMN variant_name TEXT;
  END IF;
END $$;

-- 3. We need to allow admins to view all orders and update them
-- First, drop the existing policy if we need to replace it
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

-- Recreate policies for Orders
CREATE POLICY "Anyone can view own orders" ON public.orders 
FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Anyone can insert own orders" ON public.orders 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders" ON public.orders 
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND role = 'admin')
);

-- Recreate policies for Order Items
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Anyone can view own order items" ON public.order_items 
FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;
CREATE POLICY "Anyone can insert own order items" ON public.order_items 
FOR INSERT WITH CHECK (
  order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
);
