import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/auth.js';
import prisma from '$lib/prisma.js';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const user = await requireAuth(cookies);
  
  const character = await prisma.character.findFirst({
    where: { 
      id: params.id,
      userId: user.id 
    },
    include: {
      games: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!character) {
    throw error(404, 'Karaktär hittades inte');
  }

  return { character };
};