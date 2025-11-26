import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/auth.js';
import prisma from '$lib/prisma.js';

export const load: PageServerLoad = async ({ cookies }) => {
  const user = await requireAuth(cookies);
  
  const characters = await prisma.character.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  return { characters };
};