
import { addStream, removeStream } from '$lib/server/chat';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
    if (!locals.user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const userId = locals.user.id;
    let streamController: ReadableStreamDefaultController;

    const stream = new ReadableStream({
        start(controller) {
            streamController = controller;
            addStream(controller, userId);

            // Send initial connection confirmation
            const encoder = new TextEncoder();
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));
        },

        cancel() {
            if (streamController) {
                removeStream(streamController);
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        }
    });
};
