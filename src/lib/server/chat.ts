
export interface ActiveStream {
    controller: ReadableStreamDefaultController;
    userId: string;
}

export const activeStreams: ActiveStream[] = [];

export function addStream(controller: ReadableStreamDefaultController, userId: string) {
    activeStreams.push({ controller, userId });
}

export function removeStream(controller: ReadableStreamDefaultController) {
    const index = activeStreams.findIndex(s => s.controller === controller);
    if (index !== -1) {
        activeStreams.splice(index, 1);
    }
}

export function broadcastToAllClients(data: any) {
    const encoder = new TextEncoder();
    const formattedData = `data: ${JSON.stringify(data)}\n\n`;
    const encoded = encoder.encode(formattedData);

    for (let i = activeStreams.length - 1; i >= 0; i--) {
        const stream = activeStreams[i];
        try {
            stream.controller.enqueue(encoded);
        } catch (error) {
            removeStream(stream.controller);
        }
    }
}
