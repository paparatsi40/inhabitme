// Script para agregar rol de admin a un usuario
// Ejecutar con: npx tsx scripts/set-admin-role.ts

import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar .env.local ANTES de importar Clerk
config({ path: resolve(process.cwd(), '.env.local') });

const userEmail = 'alfaroc@live.com';

async function setAdminRole() {
  // Import dinámico para que dotenv ya esté cargado
  const { clerkClient } = await import('@clerk/nextjs/server');

  try {
    const client = await clerkClient();

    const response = await client.users.getUserList({
      emailAddress: [userEmail],
    });

    if (!response.data || response.data.length === 0) {
      console.error('❌ Usuario no encontrado:', userEmail);
      return;
    }

    const user = response.data[0];
    console.log(`✅ Usuario encontrado: ${user.firstName} ${user.lastName} (${user.id})`);

    await client.users.updateUserMetadata(user.id, {
      publicMetadata: { role: 'admin' },
    });

    console.log('🎉 ¡Rol de admin agregado exitosamente!');
    console.log('🔄 Cierra sesión y vuelve a iniciar para que se aplique el cambio.');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setAdminRole();
