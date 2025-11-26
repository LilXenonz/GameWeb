import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import prisma from '$lib/prisma.js';

export const actions: Actions = {
  register: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username')?.toString();
    const password = data.get('password')?.toString();

    if (!username || !password) {
      return fail(400, { error: 'Användarnamn och lösenord krävs' });
    }

    if (username.length < 3) {
      return fail(400, { error: 'Användarnamn måste vara minst 3 tecken' });
    }

    if (password.length < 3) {
      return fail(400, { error: 'Lösenord måste vara minst 3 tecken' });
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUser) {
        return fail(400, { error: 'Användarnamn är upptaget' });
      }

      const newUser = await prisma.user.create({
        data: {
          username,
          password // VIKTIGT: Säkrare i nästa modul!
        }
      });

      cookies.set('userId', newUser.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 vecka
        secure: false,
        httpOnly: true
      });

      throw redirect(303, '/characters');
    } catch (error) {
      return fail(500, { error: 'Kunde inte skapa användare' });
    }
  },

  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username')?.toString();
    const password = data.get('password')?.toString();

    if (!username || !password) {
      return fail(400, { error: 'Användarnamn och lösenord krävs' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { username }
      });

      if (!user) {
        return fail(400, { error: 'Fel användarnamn eller lösenord' });
      }

      // VIKTIGT: Direkt jämförelse - osäkert!
      if (user.password !== password) {
        return fail(400, { error: 'Fel användarnamn eller lösenord' });
      }

      cookies.set('userId', user.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        secure: false,
        httpOnly: true
      });

      throw redirect(303, '/characters');
    } catch (error) {
      return fail(500, { error: 'Inloggning misslyckades' });
    }
  },

  logout: async ({ cookies }) => {
    cookies.delete('userId', { path: '/' });
    throw redirect(303, '/');
  }
};