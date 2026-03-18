import prisma from '$lib/prisma';

export async function cleanupExpiredSessions() {
    try {
        const deleted = await prisma.session.deleteMany({
            where: {
                expiresAt: { lt: new Date() }
            }
        });

        if (deleted.count > 0) {
            console.log(`Cleaned up ${deleted.count} expired sessions`);
        }
    } catch (error) {
        console.error('Failed to cleanup sessions:', error);
    }
}
