-- Byte & Bite Menu Setup Script (Updated with real prices from menu cards)
-- Run this in your Supabase SQL Editor to populate the menu for Byte & Bite

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
  INSERT INTO public.menu_items (stall_id, name, description, price, category, is_veg) VALUES
  (byte_bite_id, 'Veg Steam Momo (Half - 6pcs)', 'Classic steamed momos filled with fresh vegetables.', 50, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Steam Momo (Full - 12pcs)', 'Classic steamed momos filled with fresh vegetables.', 100, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Cheese Steam Momo (Half - 6pcs)', 'Steamed momos bursting with cheese.', 70, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Cheese Steam Momo (Full - 12pcs)', 'Steamed momos bursting with cheese.', 130, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Schezwan Steam Momo (Half - 6pcs)', 'Spicy schezwan steamed momos.', 70, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Schezwan Steam Momo (Full - 12pcs)', 'Spicy schezwan steamed momos.', 130, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Chilly Steam Momo (Half - 6pcs)', 'Spicy chilly steamed momos.', 70, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Chilly Steam Momo (Full - 12pcs)', 'Spicy chilly steamed momos.', 130, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Tandoori Steam Momo (Half - 6pcs)', 'Steamed momos with tandoori spices.', 80, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Tandoori Steam Momo (Full - 12pcs)', 'Steamed momos with tandoori spices.', 150, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Peri-Peri Steam Momo (Half - 6pcs)', 'Spicy peri-peri steamed momos.', 70, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Peri-Peri Steam Momo (Full - 12pcs)', 'Spicy peri-peri steamed momos.', 130, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Peri-Peri Cheese Momo (8 Pcs)', 'Cheese momos dusted with peri-peri.', 100, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Chilli Cheese Momo (8 Pcs)', 'Spicy chilli and cheese steamed momos.', 100, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Veg Schezwan Cheese Momo (8 Pcs)', 'Schezwan and cheese steamed momos.', 100, '🥟 STEAM MOMOS', true);

  -- 🥟 STEAM MOMOS (PANEER)
  INSERT INTO public.menu_items (stall_id, name, description, price, category, is_veg) VALUES
  (byte_bite_id, 'Paneer Steam Momo (Half - 6pcs)', 'Soft steamed momos stuffed with paneer.', 60, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Steam Momo (Full - 12pcs)', 'Soft steamed momos stuffed with paneer.', 120, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Cheese Steam Momo (Half - 6pcs)', 'Paneer momos bursting with cheese.', 80, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Cheese Steam Momo (Full - 12pcs)', 'Paneer momos bursting with cheese.', 150, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Schezwan Steam Momo (Half - 6pcs)', 'Spicy schezwan paneer steamed momos.', 80, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Schezwan Steam Momo (Full - 12pcs)', 'Spicy schezwan paneer steamed momos.', 150, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Chilly Steam Momo (Half - 6pcs)', 'Spicy chilly paneer steamed momos.', 80, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Chilly Steam Momo (Full - 12pcs)', 'Spicy chilly paneer steamed momos.', 150, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Tandoori Steam Momo (Half - 6pcs)', 'Paneer steamed momos with tandoori spices.', 90, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Tandoori Steam Momo (Full - 12pcs)', 'Paneer steamed momos with tandoori spices.', 170, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Peri-Peri Steam Momo (Half - 6pcs)', 'Spicy peri-peri paneer steamed momos.', 80, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Peri-Peri Steam Momo (Full - 12pcs)', 'Spicy peri-peri paneer steamed momos.', 150, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Peri-Peri Cheese Momo (8 Pcs)', 'Cheese paneer momos dusted with peri-peri.', 110, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Chilli Cheese Momo (8 Pcs)', 'Spicy chilli and cheese paneer steamed momos.', 110, '🥟 STEAM MOMOS', true),
  (byte_bite_id, 'Paneer Schezwan Cheese Momo (8 Pcs)', 'Schezwan and cheese paneer steamed momos.', 110, '🥟 STEAM MOMOS', true);

  -- 🥟 FRIED MOMOS (VEG)
  INSERT INTO public.menu_items (stall_id, name, description, price, category, is_veg) VALUES
  (byte_bite_id, 'Veg Fried Momo (Half - 6pcs)', 'Crispy golden fried momos.', 60, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Momo (Full - 12pcs)', 'Crispy golden fried momos.', 110, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Cheese Momo (Half - 6pcs)', 'Crispy fried momos bursting with cheese.', 80, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Cheese Momo (Full - 12pcs)', 'Crispy fried momos bursting with cheese.', 150, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Schezwan Momo (Half - 6pcs)', 'Spicy schezwan fried momos.', 80, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Schezwan Momo (Full - 12pcs)', 'Spicy schezwan fried momos.', 150, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Chilly Momo (Half - 6pcs)', 'Spicy chilly fried momos.', 80, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Chilly Momo (Full - 12pcs)', 'Spicy chilly fried momos.', 150, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Peri-Peri Momo (Half - 6pcs)', 'Spicy peri-peri fried momos.', 80, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Peri-Peri Momo (Full - 12pcs)', 'Spicy peri-peri fried momos.', 150, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Tandoori Momo (Half - 6pcs)', 'Fried momos with tandoori spices.', 80, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Tandoori Momo (Full - 12pcs)', 'Fried momos with tandoori spices.', 150, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Pizza Momo (Full)', 'Pizza flavor fried momos.', 150, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Peri-Peri Cheese Momo (8 Pcs)', 'Cheese fried momos dusted with peri-peri.', 110, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Chilli Cheese Momo (8 Pcs)', 'Spicy chilli and cheese fried momos.', 110, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Veg Fried Schezwan Cheese Momo (8 Pcs)', 'Schezwan and cheese fried momos.', 110, '🥟 FRIED MOMOS', true);

  -- 🥟 FRIED MOMOS (PANEER)
  INSERT INTO public.menu_items (stall_id, name, description, price, category, is_veg) VALUES
  (byte_bite_id, 'Paneer Fried Momo (Half - 6pcs)', 'Crunchy fried momos packed with paneer.', 70, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Momo (Full - 12pcs)', 'Crunchy fried momos packed with paneer.', 130, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Cheese Momo (Half - 6pcs)', 'Crispy fried paneer momos bursting with cheese.', 90, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Cheese Momo (Full - 12pcs)', 'Crispy fried paneer momos bursting with cheese.', 170, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Schezwan Momo (Half - 6pcs)', 'Spicy schezwan fried paneer momos.', 90, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Schezwan Momo (Full - 12pcs)', 'Spicy schezwan fried paneer momos.', 170, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Chilly Momo (Half - 6pcs)', 'Spicy chilly fried paneer momos.', 90, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Chilly Momo (Full - 12pcs)', 'Spicy chilly fried paneer momos.', 170, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Peri-Peri Momo (Half - 6pcs)', 'Spicy peri-peri fried paneer momos.', 90, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Peri-Peri Momo (Full - 12pcs)', 'Spicy peri-peri fried paneer momos.', 170, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Tandoori Momo (Half - 6pcs)', 'Fried paneer momos with tandoori spices.', 90, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Tandoori Momo (Full - 12pcs)', 'Fried paneer momos with tandoori spices.', 170, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Pizza Momo (Full)', 'Pizza flavor fried paneer momos.', 160, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Peri-Peri Cheese Momo (8 Pcs)', 'Cheese fried paneer momos dusted with peri-peri.', 120, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Chilli Cheese Momo (8 Pcs)', 'Spicy chilli and cheese fried paneer momos.', 120, '🥟 FRIED MOMOS', true),
  (byte_bite_id, 'Paneer Fried Schezwan Cheese Momo (8 Pcs)', 'Schezwan and cheese fried paneer momos.', 120, '🥟 FRIED MOMOS', true);

  -- 🍟 FRIES
  INSERT INTO public.menu_items (stall_id, name, description, price, category, is_veg) VALUES
  (byte_bite_id, 'Regular Fries', 'Classic crispy golden french fries with salt.', 50, '🍟 FRIES', true),
  (byte_bite_id, 'Cheese Fries', 'Crispy fries loaded with creamy melted cheese sauce.', 60, '🍟 FRIES', true),
  (byte_bite_id, 'Peri Peri Fries', 'Spicy and tangy fries coated in Peri-Peri seasoning.', 80, '🍟 FRIES', true),
  (byte_bite_id, 'Cheese Peri Peri Fries', 'The ultimate combo of spicy Peri-Peri and creamy cheese.', 90, '🍟 FRIES', true),
  (byte_bite_id, 'Chipotle Cheese Fries', 'Fries topped with smoky chipotle and melted cheese.', 90, '🍟 FRIES', true),
  (byte_bite_id, 'Tandoori Cheese Fries', 'Fries drizzled with smoky tandoori mayo and cheese.', 90, '🍟 FRIES', true);

END $$;
