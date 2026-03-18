import { cleanupExpiredSessions } from '$lib/sessionCleanup';

// Run cleanup every 24 hours (use cron for serverless)
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000;

function startCleanupInterval() {
    // Run immediately on startup (optional, maybe wait to avoid slow startup)
    cleanupExpiredSessions();

    setInterval(() => {
        cleanupExpiredSessions();
    }, CLEANUP_INTERVAL);
}

startCleanupInterval();

export async function handle({ event, resolve }) {
    // Import getUser here to avoid circular dependencies
    const { getUser } = await import('$lib/auth');

    // Set user in locals for all requests
    const user = await getUser(event.cookies);
    event.locals.user = user;

    const response = await resolve(event);
    return response;
}
