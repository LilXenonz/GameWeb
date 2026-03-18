
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import prisma from '$lib/prisma';
import { broadcastToAllClients } from '$lib/server/chat';

// Load initial messages and user data
export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const messages = await prisma.message.findMany({
        take: 50,
        orderBy: { createdAt: 'asc' },
        include: {
            user: { select: { username: true } }
        }
    });

    return {
        user: locals.user,
        messages
    };
};

export const actions: Actions = {
    sendMessage: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const content = formData.get('message')?.toString().trim();

        if (!content) {
            return fail(400, { error: 'Message cannot be empty' });
        }

        try {
            // Save message to database
            const newMessage = await prisma.message.create({
                data: {
                    content,
                    userId: locals.user.id
                },
                include: {
                    user: { select: { username: true } }
                }
            });



            // Broadcast to all clients
            broadcastToAllClients({
                type: 'new_message',
                message: newMessage
            });

            return { success: true };
        } catch (error) {
            return fail(500, { error: error instanceof Error ? error.message : 'Failed to send message' });
        }
    },

    startTyping: async ({ locals }) => {
        if (!locals.user) return fail(401);

        broadcastToAllClients({
            type: 'user_typing',
            username: locals.user.username,
            isTyping: true
        });
        return { success: true };
    },

    stopTyping: async ({ locals }) => {
        if (!locals.user) return fail(401);

        broadcastToAllClients({
            type: 'user_typing',
            username: locals.user.username,
            isTyping: false
        });
        return { success: true };
    }
};
