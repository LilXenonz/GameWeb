import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { requireAuth } from '$lib/auth.js';
import prisma from '$lib/prisma.js';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const user = await requireAuth(cookies);
    const data = await request.formData();
    const name = data.get('name')?.toString();
    const description = data.get('description')?.toString();

    if (!name) {
      return fail(400, { message: 'Namn är obligatoriskt' });
    }

    try {
      await prisma.character.create({
        data: {
          name,
          description: description || null,
          userId: user.id
        }
      });

      return { success: true };
    } catch (error) {
      return fail(500, { message: 'Kunde inte skapa karaktär' });
    }
  }
};