-- Byte & Bite Menu Setup Script
-- Run this in your Supabase SQL Editor to populate the menu for Byte & Bite

-- First, let's make sure we have the Stall ID for "Byte & Bite"
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

  -- 🥟 MOMOS
  INSERT INTO public.menu_items (stall_id, name, description, price, category, is_veg) VALUES
  (byte_bite_id, 'Veg Steamed Momos', 'Classic steamed momos filled with finely chopped fresh vegetables.', 60, '🥟 MOMOS', true),
  (byte_bite_id, 'Paneer Steamed Momos', 'Soft steamed momos stuffed with spiced cottage cheese.', 80, '🥟 MOMOS', true),
  (byte_bite_id, 'Veg Fried Momos', 'Crispy golden fried momos with a savory vegetable filling.', 70, '🥟 MOMOS', true),
  (byte_bite_id, 'Paneer Fried Momos', 'Crunchy fried momos packed with delicious paneer.', 90, '🥟 MOMOS', true),
  (byte_bite_id, 'Cheese Fried Momos', 'Crispy momos bursting with melted cheese.', 100, '🥟 MOMOS', true),
  (byte_bite_id, 'Schezwan Momos', 'Spicy momos tossed in fiery Schezwan sauce.', 90, '🥟 MOMOS', true),
  (byte_bite_id, 'Peri-Peri Momos', 'Fried momos generously dusted with spicy Peri-Peri seasoning.', 90, '🥟 MOMOS', true),
  (byte_bite_id, 'Tandoori Momos', 'Momos marinated in tandoori spices and charred to perfection.', 110, '🥟 MOMOS', true),
  (byte_bite_id, 'Cheese Schezwan Momos', 'The perfect blend of spicy Schezwan and gooey cheese.', 120, '🥟 MOMOS', true);

  -- 🍟 FRIES
  INSERT INTO public.menu_items (stall_id, name, description, price, category, is_veg) VALUES
  (byte_bite_id, 'Salted Fries', 'Classic crispy golden french fries with salt.', 60, '🍟 FRIES', true),
  (byte_bite_id, 'Masala Fries', 'Crispy fries tossed in our secret Indian spice mix.', 70, '🍟 FRIES', true),
  (byte_bite_id, 'Peri-Peri Fries', 'Spicy and tangy fries coated in Peri-Peri seasoning.', 80, '🍟 FRIES', true),
  (byte_bite_id, 'Cheese Fries', 'Crispy fries loaded with creamy melted cheese sauce.', 100, '🍟 FRIES', true),
  (byte_bite_id, 'Cheese Peri-Peri Fries', 'The ultimate combo of spicy Peri-Peri and creamy cheese.', 110, '🍟 FRIES', true),
  (byte_bite_id, 'Schezwan Cheese Fries', 'Fries topped with spicy Schezwan and melted cheese.', 120, '🍟 FRIES', true),
  (byte_bite_id, 'Tandoori Fries', 'Fries drizzled with smoky tandoori mayo.', 90, '🍟 FRIES', true),
  (byte_bite_id, 'Cheesy Masala Fries', 'Desi masala fries overloaded with cheese.', 110, '🍟 FRIES', true);

  -- 🔥 SIGNATURE / LOADED
  INSERT INTO public.menu_items (stall_id, name, description, price, category, is_veg) VALUES
  (byte_bite_id, 'Momo Loaded Fries', 'Our signature dish: Crispy fries topped with chopped fried momos and sauces.', 150, '🔥 SIGNATURE', true),
  (byte_bite_id, 'Schezwan Cheese Loaded Fries', 'A mountain of fries loaded with Schezwan sauce, jalapeños, and liquid cheese.', 140, '🔥 SIGNATURE', true),
  (byte_bite_id, 'Peri-Peri Cheese Blast', 'Extra crispy fries and momos baked with a blast of mozzarella and Peri-Peri.', 160, '🔥 SIGNATURE', true),
  (byte_bite_id, 'Cheese Burst Fried Momos', 'Special oversized momos that literally burst with cheese on the first bite.', 140, '🔥 SIGNATURE', true),
  (byte_bite_id, 'Tandoori Paneer Momos', 'Premium paneer momos baked in a tandoor with rich smoky flavors.', 130, '🔥 SIGNATURE', true),
  (byte_bite_id, 'Schezwan Cheese Momos', 'Double-layered cheese and fiery schezwan coated momos.', 130, '🔥 SIGNATURE', true);

  -- 👑 COMBOS
  INSERT INTO public.menu_items (stall_id, name, description, price, category, is_veg) VALUES
  (byte_bite_id, 'Momo + Fries Combo', 'Any Veg Steamed Momo + Salted Fries.', 110, '👑 COMBOS', true),
  (byte_bite_id, 'Cheese Momo + Fries Combo', 'Cheese Fried Momos + Masala Fries.', 160, '👑 COMBOS', true),
  (byte_bite_id, 'Momo + Fries + Drink Combo', 'Veg Fried Momos + Peri-Peri Fries + Cold Coffee/Mojito.', 199, '👑 COMBOS', true),
  (byte_bite_id, 'Couple Combo', '2 Plates Momos + 1 Large Cheese Fries + 2 Drinks.', 349, '👑 COMBOS', true);

END $$;
