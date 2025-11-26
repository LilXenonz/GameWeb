import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/auth.js';
import prisma from '$lib/prisma.js';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
  const user = await requireAuth(cookies);
  
  const characters = await prisma.character.findMany({
    where: { userId: user.id },
    orderBy: { name: 'asc' }
  });

  return { characters };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const user = await requireAuth(cookies);
    const data = await request.formData();
    const characterId = data.get('characterId')?.toString();
    const won = data.get('won') === 'true';
    const opponent = data.get('opponent')?.toString();
    const note = data.get('note')?.toString();

    if (!characterId) {
      return fail(400, { message: 'Välj en karaktär' });
    }

    try {
      // Kolla att karaktären tillhör användaren
      const character = await prisma.character.findFirst({
        where: { 
          id: characterId,
          userId: user.id 
        }
      });

      if (!character) {
        return fail(400, { message: 'Karaktären hittades inte' });
      }

      // Skapa spelet
      await prisma.game.create({
        data: {
          won,
          opponent: opponent || null,
          note: note || null,
          characterId,
          userId: user.id
        }
      });

      // Uppdatera statistik
      await prisma.character.update({
        where: { id: characterId },
        data: {
          totalGames: { increment: 1 },
          wins: won ? { increment: 1 } : undefined,
          losses: !won ? { increment: 1 } : undefined
        }
      });

      return { success: true };
    } catch (error) {
      return fail(500, { message: 'Kunde inte logga match' });
    }
  }
};