-- ============================================================
-- SEED DATA — listings table
-- InhabitMe demo properties for development/testing
-- Replace owner_id with your actual Clerk user ID before running
-- ============================================================

-- Owner ID: Carlos (Clerk user ID)
-- Update this value if your Clerk ID changes
DO $$
DECLARE
  v_owner_id TEXT := 'user_37XxJQhGu4KbCylCP8ra8P8Nt0i';
BEGIN

  -- Madrid · Malasaña
  INSERT INTO listings (
    id, title, description,
    city_name, city_country, neighborhood,
    bedrooms, bathrooms,
    wifi_speed_mbps, has_desk, has_second_monitor, furnished,
    has_heating, has_ac, has_washing_machine, has_kitchen,
    available_from, min_months, max_months,
    monthly_price, currency,
    images,
    owner_id,
    status, featured,
    created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'Bright studio in Malasaña with fast WiFi',
    'Modern studio in the heart of Malasaña. Dedicated workspace with ergonomic chair and 27" monitor. Fiber internet 300 Mbps. Perfect for remote workers.',
    'Madrid', 'Spain', 'Malasaña',
    1, 1,
    300, true, true, true,
    true, true, true, true,
    CURRENT_DATE, 1, 6,
    1200, 'EUR',
    ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    v_owner_id,
    'active', true,
    NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- Madrid · Lavapiés
  INSERT INTO listings (
    id, title, description,
    city_name, city_country, neighborhood,
    bedrooms, bathrooms,
    wifi_speed_mbps, has_desk, has_second_monitor, furnished,
    has_heating, has_ac, has_washing_machine, has_kitchen, has_balcony,
    available_from, min_months, max_months,
    monthly_price, currency,
    images,
    owner_id,
    status, featured,
    created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'Cozy 1BR in Lavapiés — workspace ready',
    'Charming apartment in vibrant Lavapiés. Home office corner with standing desk. 200 Mbps fiber. 5 min walk to Atocha station.',
    'Madrid', 'Spain', 'Lavapiés',
    1, 1,
    200, true, false, true,
    true, false, true, true, true,
    CURRENT_DATE, 2, 6,
    950, 'EUR',
    ARRAY['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'],
    v_owner_id,
    'active', false,
    NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- Madrid · Retiro
  INSERT INTO listings (
    id, title, description,
    city_name, city_country, neighborhood,
    bedrooms, bathrooms,
    wifi_speed_mbps, has_desk, has_second_monitor, furnished,
    has_heating, has_ac, has_washing_machine, has_dishwasher, has_kitchen, has_elevator,
    available_from, min_months, max_months,
    monthly_price, currency,
    images,
    owner_id,
    status, featured,
    created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'Spacious 2BR near Retiro Park — premium',
    'Elegant apartment steps from Retiro Park. Full home office setup with dual monitors. Gigabit fiber. Concierge building with elevator.',
    'Madrid', 'Spain', 'Retiro',
    2, 2,
    1000, true, true, true,
    true, true, true, true, true, true,
    CURRENT_DATE, 2, 6,
    1800, 'EUR',
    ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=800'],
    v_owner_id,
    'active', true,
    NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- Barcelona · Eixample
  INSERT INTO listings (
    id, title, description,
    city_name, city_country, neighborhood,
    bedrooms, bathrooms,
    wifi_speed_mbps, has_desk, has_second_monitor, furnished,
    has_heating, has_ac, has_washing_machine, has_kitchen, has_elevator, has_balcony,
    available_from, min_months, max_months,
    monthly_price, currency,
    images,
    owner_id,
    status, featured,
    created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'Designer flat in Eixample — best WiFi',
    'Stunning modernist building in Eixample Esquerra. Dedicated office room with 500 Mbps fiber. Balcony with city views. Walking distance to coworking spaces.',
    'Barcelona', 'Spain', 'Eixample',
    2, 1,
    500, true, true, true,
    true, true, true, true, true, true,
    CURRENT_DATE, 1, 5,
    1600, 'EUR',
    ARRAY['https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=800', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    v_owner_id,
    'active', true,
    NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- Barcelona · Gràcia
  INSERT INTO listings (
    id, title, description,
    city_name, city_country, neighborhood,
    bedrooms, bathrooms,
    wifi_speed_mbps, has_desk, has_second_monitor, furnished,
    has_heating, has_ac, has_washing_machine, has_kitchen,
    available_from, min_months, max_months,
    monthly_price, currency,
    images,
    owner_id,
    status, featured,
    created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'Charming flat in Gràcia — remote work friendly',
    'Bohemian neighborhood, bohemian flat. Huge writing desk, ergonomic chair, 250 Mbps fiber. Surrounded by cafés and coworking spaces.',
    'Barcelona', 'Spain', 'Gràcia',
    1, 1,
    250, true, false, true,
    true, false, true, true,
    CURRENT_DATE, 1, 6,
    1100, 'EUR',
    ARRAY['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'],
    v_owner_id,
    'active', false,
    NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

  -- Valencia · Ruzafa
  INSERT INTO listings (
    id, title, description,
    city_name, city_country, neighborhood,
    bedrooms, bathrooms,
    wifi_speed_mbps, has_desk, has_second_monitor, furnished,
    has_heating, has_ac, has_washing_machine, has_kitchen, has_terrace,
    available_from, min_months, max_months,
    monthly_price, currency,
    images,
    owner_id,
    status, featured,
    created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    'Trendy studio in Ruzafa with private terrace',
    'Valencia''s hippest neighborhood. Private terrace for outdoor work. 300 Mbps fiber, ergonomic workspace. Mediterranean weather year-round.',
    'Valencia', 'Spain', 'Ruzafa',
    1, 1,
    300, true, false, true,
    false, true, true, true, true,
    CURRENT_DATE, 1, 4,
    850, 'EUR',
    ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800'],
    v_owner_id,
    'active', false,
    NOW(), NOW()
  ) ON CONFLICT DO NOTHING;

END $$;
