import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { validateSession } from '$lib/auth';

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get('sessionToken');
    const session = await validateSession(token);

    if (!session) {
        throw redirect(303, '/login');
    }

    const sessions = await prisma.session.findMany({
        where: { userId: session.user.id },
        orderBy: { lastUsed: 'desc' }
    });

    return {
        sessions,
        currentSessionId: session.id
    };
};

export const actions: Actions = {
    revokeSession: async ({ request, cookies }) => {
        const data = await request.formData();
        const sessionId = data.get('sessionId')?.toString();
        const token = cookies.get('sessionToken');
        const currentSession = await validateSession(token);

        if (!currentSession) {
            throw redirect(303, '/login');
        }

        if (sessionId) {
            // Ensure we only delete our own sessions
            const sessionToDelete = await prisma.session.findUnique({
                where: { id: sessionId }
            });

            if (sessionToDelete && sessionToDelete.userId === currentSession.userId) {
                await prisma.session.delete({ where: { id: sessionId } });
            }
        }
    },

    revokeAllSessions: async ({ cookies }) => {
        const token = cookies.get('sessionToken');
        const currentSession = await validateSession(token);

        if (currentSession) {
            // Delete all sessions for this user EXCEPT the current one
            // The guide says "Log out all devices", usually means all EXCEPT current, or ALL? 
            // The guide code said: id: { not: currentSession.id }
            await prisma.session.deleteMany({
                where: {
                    userId: currentSession.userId,
                    id: { not: currentSession.id }
                }
            });
        }
    }
};
