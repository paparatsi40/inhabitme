// Script para agregar rol de admin a un usuario
// Ejecutar con: npx tsx scripts/set-admin-role.ts

import { clerkClient } from '@clerk/nextjs/server';

async function setAdminRole() {
  const userEmail = 'TU_EMAIL_AQUI@example.com'; // CAMBIA ESTO por tu email
  
  try {
    // Obtener cliente de Clerk
    const client = await clerkClient();
    
    // Buscar usuario por email
    const response = await client.users.getUserList({
      emailAddress: [userEmail],
    });

    if (!response.data || response.data.length === 0) {
      console.error('❌ Usuario no encontrado con ese email');
      return;
    }

    const user = response.data[0];
    console.log(`✅ Usuario encontrado: ${user.firstName} ${user.lastName} (${user.id})`);

    // Actualizar metadata
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: 'admin',
      },
    });

    console.log('🎉 ¡Rol de admin agregado exitosamente!');
    console.log('🔄 Cierra sesión y vuelve a iniciar para que se aplique el cambio');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setAdminRole();
