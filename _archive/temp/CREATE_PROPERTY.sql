-- Script para crear una propiedad de prueba en inhabitme
-- Ejecuta esto en Supabase SQL Editor

-- Primero, verifica tu user ID
SELECT id, email, "firstName", role FROM "User" WHERE email = 'alfaroc@live.com';

-- Copia el ID que aparece arriba y reemplázalo en la línea que dice 'TU_USER_ID_AQUI'

-- Crear propiedad de prueba
INSERT INTO "Property" (
  id,
  title,
  description,
  city,
  country,
  address,
  "zipCode",
  "monthlyPrice",
  "depositAmount",
  bedrooms,
  bathrooms,
  "squareMeters",
  floor,
  "hasElevator",
  "hasDesk",
  "hasErgonomicChair",
  "wifiSpeed",
  "wifiVerified",
  "hasSecondMonitor",
  "hasWifi",
  "hasAC",
  "hasHeating",
  "hasWashingMachine",
  "hasDishwasher",
  status,
  "isVerified",
  "minStayMonths",
  "maxStayMonths",
  "hostId",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'Apartamento Moderno en Chamberí - Madrid',
  'Precioso apartamento de 2 habitaciones en pleno corazón de Chamberí. Perfecto para nómadas digitales con workspace dedicado, wifi de 300mbps verificado, escritorio ergonómico y monitor incluido. A 5 minutos del metro Bilbao.',
  'Madrid',
  'España',
  'Calle Hartzenbusch 12',
  '28010',
  1400,
  1400,
  2,
  1,
  75,
  3,
  true,
  true,
  true,
  300,
  false,
  true,
  true,
  true,
  true,
  true,
  false,
  'ACTIVE',
  true,
  1,
  6,
  'TU_USER_ID_AQUI',  -- <-- REEMPLAZA ESTO con el ID de la primera query
  NOW(),
  NOW()
);

-- Verificar que se creó
SELECT id, title, city, status, "monthlyPrice" FROM "Property" WHERE city = 'Madrid';