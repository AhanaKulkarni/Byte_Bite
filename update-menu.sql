-- Byte & Bite Menu Setup Script (Full Actual Menu with Variants)
-- Run this in your Supabase SQL Editor

-- 1. Add variants column if it doesn't exist (safe to run multiple times)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'variants') THEN
    ALTER TABLE public.menu_items ADD COLUMN variants JSONB DEFAULT NULL;
  END IF;
END $$;

DO $$
DECLARE
  byte_bite_id UUID;
BEGIN
  -- Get or create Byte & Bite stall
  SELECT id INTO byte_bite_id FROM public.stalls WHERE name = 'Byte & Bite' LIMIT 1;
  
  IF byte_bite_id IS NULL THEN
    INSERT INTO public.stalls (name, description, image_url, is_open) 
    VALUES ('Byte & Bite', 'The main campus snack cafe', '/images/byte-bite.jpg', true)
    RETURNING id INTO byte_bite_id;
  END IF;

  -- Clear existing menu items for this stall so we start fresh
  DELETE FROM public.menu_items WHERE stall_id = byte_bite_id;

  -- 🥟 STEAM MOMOS (VEG)
  INSERT INTO public.menu_items (stall_id, name, price, variants, category, is_veg) VALUES
  (byte_bite_id, 'Veg Momo', 50, '[{"name": "Half", "price": 50}, {"name": "Full", "price": 100}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Cheese Momo', 80, '[{"name": "Half", "price": 80}, {"name": "Full", "price": 150}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Schezwan Momo', 80, '[{"name": "Half", "price": 80}, {"name": "Full", "price": 150}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Chilly Momo', 80, '[{"name": "Half", "price": 80}, {"name": "Full", "price": 150}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Tandoori Momo', 80, '[{"name": "Half", "price": 80}, {"name": "Full", "price": 150}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Makhani Momo', 80, '[{"name": "Half", "price": 80}, {"name": "Full", "price": 150}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Achari Momo', 80, '[{"name": "Half", "price": 80}, {"name": "Full", "price": 150}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Peri Peri Momo', 80, '[{"name": "Half", "price": 80}, {"name": "Full", "price": 150}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Peri Peri Cheese Momo (8 pcs)', 110, NULL, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Chilli Cheese Momo (8 pcs)', 110, NULL, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Schezwan Cheese Momo (8 pcs)', 110, NULL, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Makhani Cheese Momo (8 pcs)', 110, NULL, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Achari Cheese Momo (8 pcs)', 110, NULL, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Afgani Momo', 80, '[{"name": "Half", "price": 80}, {"name": "Full", "price": 150}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Afgani Cheese Momo', 110, NULL, '🥟 STEAM MOMOS', true);

  -- 🥟 STEAM MOMOS (PANEER)
  INSERT INTO public.menu_items (stall_id, name, price, variants, category, is_veg) VALUES
  (byte_bite_id, 'Paneer Momo', 60, '[{"name": "Half", "price": 60}, {"name": "Full", "price": 120}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Cheese Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 170}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Schezwan Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 170}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Chilly Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 170}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Tandoori Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 170}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Makhani Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 170}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Achari Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 170}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Peri Peri Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 170}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Peri Peri Cheese Momo (8 pcs)', 120, NULL, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Chilli Cheese Momo (8 pcs)', 120, NULL, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Schezwan Cheese Momo (8 pcs)', 120, NULL, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Makhani Cheese Momo (8 pcs)', 120, NULL, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Achari Cheese Momo (8 pcs)', 120, NULL, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Afgani Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 170}]', '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Afgani Cheese Momo', 120, NULL, '🥟 STEAM MOMOS', true);

  -- 🔥 FRIED MOMOS (VEG)
  INSERT INTO public.menu_items (stall_id, name, price, variants, category, is_veg) VALUES
  (byte_bite_id, 'Veg Fried Momo', 60, '[{"name": "Half", "price": 60}, {"name": "Full", "price": 110}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Cheese Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 170}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Schezwan Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 170}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Chilly Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 170}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Tandoori Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 170}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Makhani Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 150}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Achari Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 170}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Peri Peri Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 170}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Peri Peri Cheese Momo (8 pcs)', 120, NULL, '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Chilli Cheese Momo (8 pcs)', 120, NULL, '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Schezwan Cheese Momo (8 pcs)', 120, NULL, '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Makhani Cheese Momo (8 pcs)', 120, NULL, '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Achari Cheese Momo (8 pcs)', 120, NULL, '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Afgani Momo', 90, '[{"name": "Half", "price": 90}, {"name": "Full", "price": 170}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Afgani Cheese Momo', 120, NULL, '🔥 FRIED MOMOS', true);

  -- 🔥 FRIED MOMOS (PANEER)
  INSERT INTO public.menu_items (stall_id, name, price, variants, category, is_veg) VALUES
  (byte_bite_id, 'Paneer Fried Momo', 60, '[{"name": "Half", "price": 60}, {"name": "Full", "price": 120}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Cheese Momo', 100, '[{"name": "Half", "price": 100}, {"name": "Full", "price": 190}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Schezwan Momo', 100, '[{"name": "Half", "price": 100}, {"name": "Full", "price": 190}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Chilly Momo', 100, '[{"name": "Half", "price": 100}, {"name": "Full", "price": 190}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Tandoori Momo', 100, '[{"name": "Half", "price": 100}, {"name": "Full", "price": 190}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Makhani Momo', 100, '[{"name": "Half", "price": 100}, {"name": "Full", "price": 190}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Achari Momo', 100, '[{"name": "Half", "price": 100}, {"name": "Full", "price": 190}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Peri Peri Momo', 100, '[{"name": "Half", "price": 100}, {"name": "Full", "price": 190}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Peri Peri Cheese Momo (8 pcs)', 130, NULL, '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Chilli Cheese Momo (8 pcs)', 130, NULL, '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Schezwan Cheese Momo (8 pcs)', 130, NULL, '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Makhani Cheese Momo (8 pcs)', 130, NULL, '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Achari Cheese Momo (8 pcs)', 130, NULL, '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Afgani Momo', 100, '[{"name": "Half", "price": 100}, {"name": "Full", "price": 190}]', '🔥 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Afgani Cheese Momo', 130, NULL, '🔥 FRIED MOMOS', true);

  -- 🍔 BURGERS
  INSERT INTO public.menu_items (stall_id, name, price, category, is_veg) VALUES
  (byte_bite_id, 'Veg Burger', 60, '🍔 BURGERS', true),
  (byte_bite_id, 'Veg Cheese Burger', 80, '🍔 BURGERS', true),
  (byte_bite_id, 'Veg Mayo Cheese Burger', 90, '🍔 BURGERS', true),
  (byte_bite_id, 'Veg Tandoori Cheese Burger', 90, '🍔 BURGERS', true),
  (byte_bite_id, 'Veg Peri Peri Cheese Burger', 90, '🍔 BURGERS', true);

  -- 🍟 FRIES
  INSERT INTO public.menu_items (stall_id, name, price, category, is_veg) VALUES
  (byte_bite_id, 'Regular Fries', 60, '🍟 FRIES', true),
  (byte_bite_id, 'Cheese Fries', 70, '🍟 FRIES', true),
  (byte_bite_id, 'Peri Peri Fries', 80, '🍟 FRIES', true),
  (byte_bite_id, 'Cheese Peri Peri Fries', 90, '🍟 FRIES', true),
  (byte_bite_id, 'Chipotle Cheese Fries', 90, '🍟 FRIES', true),
  (byte_bite_id, 'Tandoori Cheese Fries', 90, '🍟 FRIES', true);

  -- 🧀 CHEESE BALLS & 🔺 TRIANGLES
  INSERT INTO public.menu_items (stall_id, name, price, variants, category, is_veg) VALUES
  (byte_bite_id, 'Cheese Balls', 70, '[{"name": "5 pcs", "price": 70}, {"name": "10 pcs", "price": 140}]', '🧀 SIDES', true),
  (byte_bite_id, 'Cheesy Triangle', 80, '[{"name": "6 pcs", "price": 80}, {"name": "12 pcs", "price": 150}]', '🧀 SIDES', true);

  -- 🥞 PANCAKES & 🧇 WAFFLES
  INSERT INTO public.menu_items (stall_id, name, price, variants, category, is_veg) VALUES
  (byte_bite_id, 'Dark Chocolate Pancakes', 50, '[{"name": "4 pcs", "price": 50}, {"name": "8 pcs", "price": 90}]', '🥞 DESSERTS', true),
  (byte_bite_id, 'Milk Chocolate Pancakes', 50, '[{"name": "4 pcs", "price": 50}, {"name": "8 pcs", "price": 90}]', '🥞 DESSERTS', true),
  (byte_bite_id, 'White Chocolate Pancakes', 50, '[{"name": "4 pcs", "price": 50}, {"name": "8 pcs", "price": 90}]', '🥞 DESSERTS', true),
  (byte_bite_id, 'Triple Chocolate Pancakes', 60, '[{"name": "4 pcs", "price": 60}, {"name": "8 pcs", "price": 110}]', '🥞 DESSERTS', true),
  
  (byte_bite_id, 'Dark Chocolate Waffle', 50, '[{"name": "Single", "price": 50}, {"name": "Double", "price": 90}]', '🥞 DESSERTS', true),
  (byte_bite_id, 'Milk Chocolate Waffle', 50, '[{"name": "Single", "price": 50}, {"name": "Double", "price": 90}]', '🥞 DESSERTS', true),
  (byte_bite_id, 'White Chocolate Waffle', 50, '[{"name": "Single", "price": 50}, {"name": "Double", "price": 90}]', '🥞 DESSERTS', true),
  (byte_bite_id, 'Triple Chocolate Waffle', 60, '[{"name": "Single", "price": 60}, {"name": "Double", "price": 110}]', '🥞 DESSERTS', true);

END $$;
